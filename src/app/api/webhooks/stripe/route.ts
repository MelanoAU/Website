// POST /api/webhooks/stripe
//
// Receives async events from Stripe and reconciles them into Supabase.
// Stripe is the source of truth for payment_status — this endpoint is
// the only place we mark an order paid/failed/refunded.
//
// Events we handle:
//   - checkout.session.completed              → mark paid (instant methods)
//   - checkout.session.async_payment_succeeded → mark paid (Afterpay/etc.)
//   - checkout.session.async_payment_failed    → mark failed
//   - charge.refunded                          → mark refunded
//
// Security:
//   - Verify the Stripe-Signature header against STRIPE_WEBHOOK_SECRET.
//     Without verification an attacker could POST fake "paid" events.
//   - Use the service-role Supabase client because this request carries
//     no user JWT — Stripe is calling us, not the buyer.
//
// Idempotency:
//   - Stripe will retry events for up to 3 days if we don't 2xx.
//   - Marking paid only happens when the row is currently 'unpaid', so
//     re-delivery is a no-op (no double-fulfilment, no double-clear).

import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

export const runtime = "nodejs"
// Webhook bodies must be read raw for signature verification — Next's
// default body parsing would mangle the bytes. Route handlers expose
// req.text() which gives us exactly that.

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return bad("STRIPE_WEBHOOK_SECRET not configured.", 500)
  }
  const sig = req.headers.get("stripe-signature")
  if (!sig) return bad("Missing stripe-signature header.", 400)

  const raw = await req.text()
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret)
  } catch (e) {
    const msg = e instanceof Error ? e.message : "signature verification failed"
    return bad(`Webhook signature failed: ${msg}`, 400)
  }

  const admin = getSupabaseAdmin()

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.order_id
        if (!orderId) break

        // For async methods, completed fires before the funds clear; only
        // mark paid when payment_status is actually 'paid'. The async-
        // succeeded event fires later with the same condition true.
        if (session.payment_status !== "paid") break

        const totalCents = session.amount_total ?? 0
        const taxCents = session.total_details?.amount_tax ?? 0
        const shippingCents = session.total_details?.amount_shipping ?? 0
        const subtotalCents = Math.max(0, totalCents - taxCents - shippingCents)

        const { data: updated, error: updErr } = await admin
          .from("orders")
          .update({
            payment_status: "paid",
            status: "paid",
            paid_at: new Date().toISOString(),
            payment_intent_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            subtotal: subtotalCents / 100,
            tax: taxCents / 100,
            shipping: shippingCents / 100,
            total: totalCents / 100,
            currency: (session.currency ?? "aud").toUpperCase(),
          })
          .eq("id", orderId)
          .eq("payment_status", "unpaid") // idempotency guard
          .select("id, user_id")
          .maybeSingle()

        if (updErr) {
          console.error("[stripe-webhook] order update failed", updErr)
          return bad(updErr.message, 500)
        }

        // First time we marked it paid → clear the user's cart.
        // (If updated is null, we already processed this event before.)
        if (updated?.user_id) {
          const { error: clrErr } = await admin
            .from("cart_items")
            .delete()
            .eq("user_id", updated.user_id)
          if (clrErr) {
            // Non-fatal: log but still ack the webhook so Stripe doesn't
            // retry forever. The order is paid; cart leftovers are minor.
            console.error("[stripe-webhook] cart clear failed", clrErr)
          }
        }
        break
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.order_id
        if (!orderId) break
        await admin
          .from("orders")
          .update({ payment_status: "failed", status: "cancelled" })
          .eq("id", orderId)
          .eq("payment_status", "unpaid")
        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        const piId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : null
        if (!piId) break
        await admin
          .from("orders")
          .update({ payment_status: "refunded", status: "refunded" })
          .eq("payment_intent_id", piId)
        break
      }

      default:
        // Ignore other event types — we just don't subscribe to them.
        break
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "webhook handler failed"
    console.error("[stripe-webhook]", event.type, msg)
    // Return 500 so Stripe retries — don't swallow real errors.
    return bad(msg, 500)
  }

  return NextResponse.json({ received: true })
}
