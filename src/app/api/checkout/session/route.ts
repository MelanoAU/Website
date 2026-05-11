// POST /api/checkout/session
//
// Creates a Stripe Checkout Session for the signed-in user's current
// cart and returns the hosted-page URL the browser should redirect to.
//
// Flow:
//   1. Verify the caller's Supabase access token → user
//   2. Read cart_items + products fresh from the DB (server-authoritative;
//      never trust prices the client tries to send)
//   3. Insert a `pending` order row with the shipping snapshot
//   4. Create a Stripe Customer with the shipping address (so Stripe Tax
//      can compute jurisdiction without re-collecting the address)
//   5. Create a Checkout Session with line_items + flat shipping_options
//      + automatic_tax + Apple/Google Pay/Link/Afterpay/Zip enabled
//      automatically based on Dashboard settings
//   6. Patch the order row with checkout_session_id + stripe_customer_id
//      so the webhook can find it later
//   7. Return { url } — the client navigates to it
//
// Security model:
//   - Caller authenticates with Supabase JWT in the Authorization header.
//   - We use a per-request supabase client scoped to that JWT, so RLS
//     applies as the user (not service-role).
//   - All money math happens here, in cents, derived from the products
//     table — the client cannot influence pricing.

import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { createClient } from "@supabase/supabase-js"
import type Stripe from "stripe"
import { getStripe, isoForCountry } from "@/lib/stripe"

// Stripe SDK 22 doesn't re-export the Checkout sub-namespace under the
// global `Stripe.*` namespace, so we recover the create-call param shape
// by inspecting the method signature. This stays accurate as the SDK
// updates without us hand-typing the giant params interface.
type CheckoutCreateParams = NonNullable<
  Parameters<Stripe["checkout"]["sessions"]["create"]>[0]
>
type CheckoutLineItem = NonNullable<CheckoutCreateParams["line_items"]>[number]
type CheckoutShippingOption = NonNullable<
  CheckoutCreateParams["shipping_options"]
>[number]

export const runtime = "nodejs"

const FREE_SHIPPING_THRESHOLD_CENTS = 60_00 // A$60
const FLAT_SHIPPING_CENTS = 8_95 // A$8.95
const CURRENCY = "aud" // lower-case per Stripe convention

type ShippingForm = {
  name: string
  email: string
  phone?: string | null
  address: string
  city: string
  postcode: string
  country: string
}

type CartItemRow = {
  id: string
  product_id: string
  size: string
  quantity: number
}

type ProductRow = {
  id: string
  title: string
  subtitle: string | null
  price: number | string
  image: string | null
  active: boolean
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : ""
}

function validateShipping(input: unknown): ShippingForm | null {
  if (!input || typeof input !== "object") return null
  const r = input as Record<string, unknown>
  const out: ShippingForm = {
    name: asString(r.name),
    email: asString(r.email),
    phone: asString(r.phone) || null,
    address: asString(r.address),
    city: asString(r.city),
    postcode: asString(r.postcode),
    country: asString(r.country),
  }
  if (
    !out.name ||
    !out.email ||
    !out.address ||
    !out.city ||
    !out.postcode ||
    !out.country
  ) {
    return null
  }
  return out
}

function priceToCents(price: number | string): number {
  const n = typeof price === "number" ? price : Number(price)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.round(n * 100)
}

export async function POST(req: Request) {
  // ---------- 1. Auth ----------
  const auth = req.headers.get("authorization") ?? ""
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : ""
  if (!token) return bad("Not signed in.", 401)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) {
    return bad("Server misconfigured: missing Supabase env vars.", 500)
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData.user) return bad("Invalid session.", 401)
  const user = userData.user

  // ---------- 2. Parse + validate body ----------
  let body: { shipping?: unknown } = {}
  try {
    body = (await req.json()) as { shipping?: unknown }
  } catch {
    return bad("Invalid JSON body.")
  }
  const shipping = validateShipping(body.shipping)
  if (!shipping) return bad("Missing shipping fields.")

  const countryIso = isoForCountry(shipping.country)
  if (!countryIso) {
    return bad(
      `We can't ship to "${shipping.country}" yet — please contact support.`,
    )
  }

  // ---------- 3. Read cart + products (RLS-scoped) ----------
  const { data: cartRows, error: cartErr } = await supabase
    .from("cart_items")
    .select("id, product_id, size, quantity")

  if (cartErr) return bad(`Could not read cart: ${cartErr.message}`, 500)
  const cart = (cartRows ?? []) as CartItemRow[]
  if (cart.length === 0) return bad("Your bag is empty.")

  const productIds = Array.from(new Set(cart.map((c) => c.product_id)))
  const { data: productRows, error: prodErr } = await supabase
    .from("products")
    .select("id, title, subtitle, price, image, active")
    .in("id", productIds)

  if (prodErr) return bad(`Could not read products: ${prodErr.message}`, 500)
  const products = new Map<string, ProductRow>()
  for (const p of (productRows ?? []) as ProductRow[]) {
    if (p.active) products.set(p.id, p)
  }

  // Build resolved line items, dropping any that point at a product
  // that's been deactivated or deleted since it landed in the cart.
  const resolved = cart
    .map((it) => {
      const p = products.get(it.product_id)
      if (!p) return null
      const unitCents = priceToCents(p.price)
      if (unitCents <= 0) return null
      return {
        cartId: it.id,
        productId: p.id,
        title: p.title,
        image: p.image ?? "",
        size: it.size,
        quantity: it.quantity,
        unitCents,
        lineCents: unitCents * it.quantity,
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  if (resolved.length === 0) {
    return bad("None of the items in your bag are available right now.")
  }

  const subtotalCents = resolved.reduce((s, it) => s + it.lineCents, 0)
  const shippingCents =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS

  // ---------- 4. Insert pending order ----------
  // Tax is intentionally 0 here — Stripe Tax computes the real number
  // at checkout and the webhook overwrites tax/total when payment lands.
  const orderItemsSnapshot = resolved.map((it) => ({
    product_id: it.productId,
    product_title: it.title,
    product_image: it.image,
    size: it.size,
    quantity: it.quantity,
    unit_price: it.unitCents / 100,
    line_total: it.lineCents / 100,
  }))

  // Schema notes:
  //   - shipping_address is a single jsonb column (not 7 flat columns)
  //   - the shipping fee column is named `shipping`, not `shipping_cost`
  //   - order_number is NOT NULL with no default; we mint one here so
  //     the row is human-referencable (used on /account & success page)
  const orderNumber = `MEL-${randomUUID()
    .replace(/-/g, "")
    .slice(0, 8)
    .toUpperCase()}`

  const shippingAddressJson = {
    name: shipping.name,
    email: shipping.email,
    phone: shipping.phone,
    line1: shipping.address,
    city: shipping.city,
    postcode: shipping.postcode,
    country: shipping.country,
    country_code: countryIso,
  }

  const { data: orderRow, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      order_number: orderNumber,
      status: "pending",
      payment_provider: "stripe",
      payment_status: "unpaid",
      currency: CURRENCY.toUpperCase(),
      shipping_address: shippingAddressJson,
      subtotal: subtotalCents / 100,
      shipping: shippingCents / 100,
      tax: 0,
      total: (subtotalCents + shippingCents) / 100,
      items: orderItemsSnapshot,
    })
    .select("id")
    .single()

  if (orderErr || !orderRow) {
    return bad(
      `Could not create order: ${orderErr?.message ?? "unknown"}`,
      500,
    )
  }
  const orderId = orderRow.id as string

  // ---------- 5. Stripe Customer + Checkout Session ----------
  const stripe = getStripe()
  const origin = req.headers.get("origin") ?? new URL(req.url).origin

  let customerId: string
  try {
    const customer = await stripe.customers.create({
      email: shipping.email,
      name: shipping.name,
      phone: shipping.phone ?? undefined,
      address: {
        line1: shipping.address,
        city: shipping.city,
        postal_code: shipping.postcode,
        country: countryIso,
      },
      shipping: {
        name: shipping.name,
        phone: shipping.phone ?? undefined,
        address: {
          line1: shipping.address,
          city: shipping.city,
          postal_code: shipping.postcode,
          country: countryIso,
        },
      },
      metadata: { supabase_user_id: user.id, order_id: orderId },
    })
    customerId = customer.id
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Stripe customer create failed"
    return bad(msg, 500)
  }

  const lineItems: CheckoutLineItem[] = resolved.map((it) => ({
      quantity: it.quantity,
      price_data: {
        currency: CURRENCY,
        unit_amount: it.unitCents,
        product_data: {
          name: it.title,
          images: it.image ? [it.image] : undefined,
          // size is a free-form descriptor (e.g. '50ml', '' for one-size)
          metadata: it.size ? { size: it.size } : undefined,
        },
        // Prices in our DB are tax-exclusive; Stripe Tax adds the right
        // GST/VAT/sales tax on top per shipping address.
        tax_behavior: "exclusive",
      },
    }))

  const shippingOption: CheckoutShippingOption =
    shippingCents === 0
      ? {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: "Free shipping",
            fixed_amount: { amount: 0, currency: CURRENCY },
            tax_behavior: "exclusive",
          },
        }
      : {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: "Standard shipping",
            fixed_amount: { amount: shippingCents, currency: CURRENCY },
            tax_behavior: "exclusive",
          },
        }

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: lineItems,
      shipping_options: [shippingOption],
      automatic_tax: { enabled: true },
      customer_update: { address: "auto", shipping: "auto", name: "auto" },
      // Locale 'auto' lets Stripe pick from the buyer's browser.
      locale: "auto",
      // Phone optional; we already collected it but Stripe verifies format.
      phone_number_collection: { enabled: false },
      // Don't re-ask for shipping — we already have it on the Customer.
      billing_address_collection: "auto",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
      // Connect this Stripe session back to the Supabase order row.
      // The webhook reads metadata.order_id to find what to mark paid.
      metadata: { order_id: orderId, supabase_user_id: user.id },
      payment_intent_data: {
        metadata: { order_id: orderId, supabase_user_id: user.id },
      },
      // Idempotency-ish: if the user double-submits we'd rather create
      // two sessions than two orders, so the order row already exists
      // before we get here. No idempotency_key needed for this call.
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Stripe session create failed"
    return bad(msg, 500)
  }

  if (!session.url) {
    return bad("Stripe did not return a redirect URL.", 500)
  }

  // ---------- 6. Patch order with Stripe IDs ----------
  await supabase
    .from("orders")
    .update({
      checkout_session_id: session.id,
      stripe_customer_id: customerId,
    })
    .eq("id", orderId)

  // ---------- 7. Done ----------
  return NextResponse.json({ url: session.url, orderId })
}
