"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { motion, cubicBezier } from "framer-motion"
import {
  ShoppingBag,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCcw,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import ImgFit from "@/components/ImgFit"
import { getSupabase } from "@/lib/supabase/client"
import { useRequireAuth } from "@/lib/auth"
import { fetchActiveProducts } from "@/lib/products"
import type { NewProduct } from "@/lib/products"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

type CartRow = {
  id: string
  product_id: string
  size: string
  quantity: number
}

type FormState = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postcode: string
  country: string
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postcode: "",
  country: "Australia",
}

const COUNTRIES = [
  "Australia",
  "United States",
  "New Zealand",
  "United Kingdom",
  "Canada",
  "Other",
]

function parsePrice(s: string) {
  const n = Number(s.replace(/[^\d.]/g, ""))
  return Number.isNaN(n) ? 0 : n
}

function formatPrice(amount: number) {
  return `A$${amount.toFixed(2)}`
}

export default function CheckoutPage() {
  const auth = useRequireAuth("/checkout")
  const user = auth.status === "authenticated" ? auth.user : null
  const accessToken =
    auth.status === "authenticated" ? auth.session.access_token : null
  const authReady = auth.status === "authenticated"

  const [items, setItems] = useState<CartRow[]>([])
  const [products, setProducts] = useState<NewProduct[]>([])
  const [loadingCart, setLoadingCart] = useState(true)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill email from the signed-in user once we know them.
  useEffect(() => {
    if (!user) return
    setForm((f) => ({ ...f, email: f.email || user.email || "" }))
  }, [user?.id, user?.email])

  // Load cart_items + product catalogue in parallel once auth is ready.
  useEffect(() => {
    if (!authReady) return
    let active = true
    const supabase = getSupabase()
    Promise.all([
      supabase
        .from("cart_items")
        .select("id, product_id, size, quantity")
        .order("updated_at", { ascending: false }),
      fetchActiveProducts().catch(() => [] as NewProduct[]),
    ])
      .then(([cartResult, productsList]) => {
        if (!active) return
        if (cartResult.error) {
          setError(cartResult.error.message)
        } else {
          setItems((cartResult.data ?? []) as CartRow[])
        }
        setProducts(productsList)
        setLoadingCart(false)
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(
          err instanceof Error ? err.message : "Couldn't load your cart.",
        )
        setLoadingCart(false)
      })
    return () => {
      active = false
    }
  }, [authReady])

  const productMap = useMemo(() => {
    const m = new Map<string, NewProduct>()
    for (const p of products) m.set(p.id, p)
    return m
  }, [products])

  const resolved = useMemo(
    () =>
      items.map((it) => {
        const product = productMap.get(it.product_id) ?? null
        const unit = product ? parsePrice(product.price) : 0
        return {
          ...it,
          product,
          unitPrice: unit,
          lineTotal: unit * it.quantity,
        }
      }),
    [items, productMap]
  )

  const subtotal = resolved.reduce((s, it) => s + it.lineTotal, 0)
  const shipping = subtotal >= 60 ? 0 : subtotal > 0 ? 8.95 : 0
  const tax = +(subtotal * 0.1).toFixed(2)
  const total = +(subtotal + shipping + tax).toFixed(2)
  const totalUnits = resolved.reduce((s, it) => s + it.quantity, 0)

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function placeOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (placing || !user || !accessToken) return

    const required: Array<keyof FormState> = [
      "name",
      "email",
      "address",
      "city",
      "postcode",
      "country",
    ]
    const missing = required.find((k) => !form[k].trim())
    if (missing) {
      setError("Please fill in all required fields.")
      return
    }
    if (resolved.length === 0) {
      setError("Your bag is empty.")
      return
    }

    setError(null)
    setPlacing(true)

    // Server creates the pending order + the Stripe Checkout Session;
    // we only ship the shipping snapshot, never the prices/totals — the
    // server recomputes them from the products table so the buyer can't
    // tamper with what they're charged.
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          shipping: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || null,
            address: form.address.trim(),
            city: form.city.trim(),
            postcode: form.postcode.trim(),
            country: form.country.trim(),
          },
        }),
      })

      const data = (await res.json().catch(() => ({}))) as {
        url?: string
        error?: string
      }

      if (!res.ok || !data.url) {
        setPlacing(false)
        setError(data.error ?? "Could not start checkout. Please try again.")
        return
      }

      // Hand off to Stripe's hosted page. The webhook will mark the order
      // paid and clear the cart once Stripe confirms the charge.
      window.location.href = data.url
    } catch (err) {
      setPlacing(false)
      setError(
        err instanceof Error ? err.message : "Could not start checkout.",
      )
    }
  }

  // ============================================================
  // Render
  // ============================================================

  if (!authReady) {
    return (
      <Shell>
        <CenteredLoader label="Loading…" />
      </Shell>
    )
  }

  if (loadingCart) {
    return (
      <Shell>
        <CenteredLoader label="Loading your bag…" />
      </Shell>
    )
  }

  if (resolved.length === 0) {
    return (
      <Shell>
        <EmptyCheckout />
      </Shell>
    )
  }

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easeBezier }}
      >
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-white/65 hover:text-brand transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to bag
        </Link>
        <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
          Checkout.
        </h1>
        <p className="mt-3 text-sm md:text-base text-white/65">
          Almost there — just shipping details and we&apos;ll get this on the
          way.
        </p>
      </motion.div>

      {error && (
        <div className="mt-8 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <form
        onSubmit={placeOrder}
        className="mt-10 grid gap-10 md:grid-cols-12"
      >
        {/* ============= Shipping form ============= */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: easeBezier }}
          className="md:col-span-7"
        >
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Shipping
          </span>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Where should it land?
          </h2>

          <div className="mt-7 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-6 md:p-7 space-y-4">
            <Field label="Full name" required>
              <input
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Mara Kelvin"
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" required>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </Field>
              <Field label="Phone (optional)">
                <input
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+61 …"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Street address" required>
              <input
                type="text"
                required
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="14 Brunswick St"
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="City" required>
                <input
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  placeholder="Melbourne"
                  className={inputClass}
                />
              </Field>
              <Field label="Postcode" required>
                <input
                  type="text"
                  required
                  autoComplete="postal-code"
                  value={form.postcode}
                  onChange={(e) => setField("postcode", e.target.value)}
                  placeholder="3065"
                  className={inputClass}
                />
              </Field>
              <Field label="Country" required>
                <div className="relative">
                  <select
                    required
                    value={form.country}
                    onChange={(e) => setField("country", e.target.value)}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0b0b0b]">
                        {c}
                      </option>
                    ))}
                  </select>
                  <ArrowRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rotate-90 text-white/45" />
                </div>
              </Field>
            </div>
          </div>

          {/* Payment — handed off to Stripe's hosted page */}
          <div className="mt-8">
            <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
              Payment
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Pay securely.
            </h2>
            <div className="mt-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-6 space-y-3">
              <div className="flex items-center gap-3 text-white/85">
                <ShieldCheck className="h-5 w-5 text-brand shrink-0" />
                <p className="text-sm leading-relaxed">
                  You&apos;ll be taken to Stripe to complete payment.
                  Card, Apple&nbsp;Pay, Google&nbsp;Pay, Link, Afterpay
                  and Zip are all supported.
                </p>
              </div>
              <p className="text-[11px] text-white/55 leading-relaxed pl-8">
                We never see or store your card details.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ============= Order summary ============= */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: easeBezier }}
          className="md:col-span-5 md:sticky md:top-32 self-start space-y-5"
        >
          <div className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-6 md:p-7">
            <span className="block text-[11px] tracking-[0.32em] uppercase text-white/60">
              Order summary
            </span>
            <h2 className="mt-3 text-xl md:text-2xl font-semibold text-white">
              {totalUnits} item{totalUnits === 1 ? "" : "s"}
            </h2>

            <ul className="mt-5 space-y-4 max-h-72 overflow-y-auto pr-1">
              {resolved.map((it) => (
                <li key={it.id} className="flex items-start gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/[0.04] border border-white/10">
                    {it.product && (
                      <ImgFit
                        src={it.product.image}
                        alt={it.product.title}
                        mode="contain"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white truncate">
                      {it.product?.title ?? "Unavailable product"}
                    </div>
                    <div className="text-[11px] text-white/55">
                      {it.size || "One size"} · Qty {it.quantity}
                    </div>
                  </div>
                  <div className="text-sm text-white tabular-nums shrink-0">
                    {formatPrice(it.lineTotal)}
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row
                label="Shipping"
                value={shipping === 0 ? "Free" : formatPrice(shipping)}
              />
              <Row label="Tax (est.)" value={formatPrice(tax)} />
            </dl>

            <div className="mt-5 pt-5 border-t border-white/10 flex items-baseline justify-between">
              <span className="text-[11px] tracking-[0.28em] uppercase text-white/60">
                Total (est.)
              </span>
              <span className="text-2xl font-semibold text-white tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
            <p className="mt-2 text-[10px] text-white/45 leading-relaxed">
              Tax is calculated on the next page based on your shipping
              address. Final total may differ slightly.
            </p>

            <Button
              type="submit"
              disabled={placing}
              className="mt-6 w-full rounded-full h-12 bg-brand text-white hover:bg-brand/90 disabled:opacity-70 transition-colors"
            >
              {placing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting to Stripe…
                </>
              ) : (
                <>
                  Continue to payment
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <ul className="mt-5 grid gap-2 text-[11px] text-white/55">
              <li className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-brand/85" />
                Free shipping over A$60
              </li>
              <li className="flex items-center gap-2">
                <RefreshCcw className="h-3.5 w-3.5 text-brand/85" />
                30-day returns
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-brand/85" />
                Secure checkout
              </li>
            </ul>
          </div>
        </motion.aside>
      </form>
    </Shell>
  )
}

// ============================================================
// Sub-components
// ============================================================

const inputClass = `
  w-full h-12 px-4
  rounded-full bg-white/[0.06] border border-white/15
  text-sm text-white placeholder:text-white/40 outline-none
  focus:bg-white/10 focus:border-white/30 transition-colors
`

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative min-h-[100svh] flex flex-col px-6">
        <div className="h-24 md:h-28" />
        <div className="mx-auto max-w-6xl w-full pt-6 md:pt-10 pb-24 flex-1">
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-[0.28em] uppercase text-white/60">
        {label}
        {required ? "" : ""}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-white/65">{label}</dt>
      <dd className="text-white tabular-nums">{value}</dd>
    </div>
  )
}

function CenteredLoader({ label }: { label: string }) {
  return (
    <div className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 px-6 py-16 text-center max-w-md mx-auto">
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/70" />
      <p className="mt-4 text-sm text-white/70">{label}</p>
    </div>
  )
}

function EmptyCheckout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeBezier }}
      className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-10 text-center max-w-md mx-auto"
    >
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/15 text-white/85">
        <ShoppingBag className="h-6 w-6" strokeWidth={1.8} />
      </div>
      <span className="mt-6 block text-[11px] tracking-[0.32em] uppercase text-white/70">
        Nothing to check out
      </span>
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-white leading-[1.1]">
        Your bag is empty.
      </h2>
      <p className="mt-4 text-sm text-white/75 leading-relaxed">
        Add a few things first — we&apos;ll be ready when you are.
      </p>
      <div className="mt-8">
        <Button
          asChild
          className="rounded-full h-12 bg-brand text-white px-6 hover:bg-brand/90"
        >
          <Link href="/shop">
            Browse the shop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}
