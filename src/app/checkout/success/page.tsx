"use client"

// /checkout/success
//
// Stripe redirects here after the buyer completes payment, with the
// Checkout Session id in the URL: /checkout/success?session_id=cs_test_…
//
// The webhook (POST /api/webhooks/stripe) is what authoritatively marks
// the order paid + clears the cart, but it's async — Stripe's redirect
// can land before the webhook fires (usually <1s but not guaranteed).
//
// So this page reads the order row by checkout_session_id and:
//   - shows the celebratory "Order placed" card if payment_status='paid'
//   - shows a "syncing your order" state otherwise, with a short poll
//     (every 1.5s for ~20s) until the webhook catches up.
// Worst case the user just sees the syncing state and can refresh later
// from /account.

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion, cubicBezier } from "framer-motion"
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import { getSupabase } from "@/lib/supabase/client"
import { useRequireAuth } from "@/lib/auth"
import { emitCartChanged } from "@/lib/cart"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

type OrderRow = {
  id: string
  payment_status: string
  total: number
  currency: string
  shipping_email: string | null
}

const POLL_MS = 1500
const POLL_TIMEOUT_MS = 20_000

export default function CheckoutSuccessPage() {
  // useSearchParams() forces a CSR bailout, which Next 16 requires
  // be enclosed in a Suspense boundary or the static export errors out.
  return (
    <Suspense
      fallback={
        <Shell>
          <CenteredLoader label="Loading…" />
        </Shell>
      }
    >
      <SuccessInner />
    </Suspense>
  )
}

function SuccessInner() {
  const auth = useRequireAuth("/account")
  const authReady = auth.status === "authenticated"
  const params = useSearchParams()
  const sessionId = params.get("session_id")

  const [order, setOrder] = useState<OrderRow | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [polling, setPolling] = useState(true)

  useEffect(() => {
    if (!authReady || !sessionId) return
    let cancelled = false
    const supabase = getSupabase()
    const startedAt = Date.now()

    async function tick() {
      const { data, error: err } = await supabase
        .from("orders")
        .select("id, payment_status, total, currency, shipping_email")
        .eq("checkout_session_id", sessionId)
        .maybeSingle()

      if (cancelled) return

      if (err) {
        setError(err.message)
        setPolling(false)
        return
      }

      if (data) {
        setOrder(data as OrderRow)
        if ((data as OrderRow).payment_status === "paid") {
          // The webhook has cleared the cart server-side; nudge the
          // header badge to refresh.
          emitCartChanged()
          setPolling(false)
          return
        }
      }

      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        setPolling(false)
        return
      }
      window.setTimeout(tick, POLL_MS)
    }

    tick()
    return () => {
      cancelled = true
    }
  }, [authReady, sessionId])

  if (!authReady) {
    return (
      <Shell>
        <CenteredLoader label="Loading…" />
      </Shell>
    )
  }

  if (!sessionId) {
    return (
      <Shell>
        <ErrorCard
          title="Missing session"
          message="We couldn't find a Stripe session in the URL. If you just paid, your order is safe — check it on your account page."
        />
      </Shell>
    )
  }

  if (error) {
    return (
      <Shell>
        <ErrorCard title="Couldn't load your order" message={error} />
      </Shell>
    )
  }

  if (!order && polling) {
    return (
      <Shell>
        <CenteredLoader label="Confirming your payment…" />
      </Shell>
    )
  }

  if (order?.payment_status === "paid") {
    return (
      <Shell>
        <SuccessCard order={order} />
      </Shell>
    )
  }

  // Order exists but payment_status is still 'unpaid' after the poll
  // window — webhook is just slow, the order is in Supabase, refunds/
  // failure will arrive via webhook later.
  return (
    <Shell>
      <PendingCard order={order} />
    </Shell>
  )
}

// ============================================================
// Sub-components
// ============================================================

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

function CenteredLoader({ label }: { label: string }) {
  return (
    <div className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 px-6 py-16 text-center max-w-md mx-auto">
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/70" />
      <p className="mt-4 text-sm text-white/70">{label}</p>
    </div>
  )
}

function SuccessCard({ order }: { order: OrderRow }) {
  const shortId = order.id.slice(0, 8).toUpperCase()
  const totalFmt = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: order.currency || "AUD",
  }).format(order.total)
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeBezier }}
      className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-10 md:p-12 text-center max-w-xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: easeBezier }}
        className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand/15 ring-1 ring-brand/30 text-brand"
      >
        <CheckCircle2 className="h-7 w-7" strokeWidth={1.8} />
      </motion.div>

      <span className="mt-7 block text-[11px] tracking-[0.32em] uppercase text-brand">
        Payment received
      </span>
      <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.05]">
        Thank you.
      </h1>
      <p className="mt-5 text-sm md:text-base text-white/75 leading-relaxed">
        Order <span className="text-white font-mono">#{shortId}</span> for{" "}
        <span className="text-white">{totalFmt}</span>
        {order.shipping_email ? (
          <>
            {" "}— a confirmation has been sent to{" "}
            <span className="text-white">{order.shipping_email}</span>.
          </>
        ) : (
          "."
        )}
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          className="rounded-full h-12 bg-brand text-white px-6 hover:bg-brand/90"
        >
          <Link href="/account">
            View your orders
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full h-12 bg-transparent border-white/30 text-white px-6 hover:bg-white/10 hover:text-white"
        >
          <Link href="/shop">Keep shopping</Link>
        </Button>
      </div>
    </motion.div>
  )
}

function PendingCard({ order }: { order: OrderRow | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeBezier }}
      className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-10 text-center max-w-xl mx-auto"
    >
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand" />
      <span className="mt-7 block text-[11px] tracking-[0.32em] uppercase text-brand">
        Almost done
      </span>
      <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.1]">
        Syncing your order…
      </h1>
      <p className="mt-4 text-sm text-white/75 leading-relaxed">
        Stripe is confirming your payment. This usually takes a few
        seconds. You can safely leave this page — your order will appear
        in your account once it&apos;s confirmed.
      </p>
      {order && (
        <p className="mt-3 text-xs text-white/50 font-mono">
          Reference #{order.id.slice(0, 8).toUpperCase()}
        </p>
      )}
      <div className="mt-8">
        <Button
          asChild
          className="rounded-full h-12 bg-brand text-white px-6 hover:bg-brand/90"
        >
          <Link href="/account">Go to your account</Link>
        </Button>
      </div>
    </motion.div>
  )
}

function ErrorCard({ title, message }: { title: string; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeBezier }}
      className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-10 text-center max-w-xl mx-auto"
    >
      <AlertCircle className="mx-auto h-7 w-7 text-red-300" />
      <h1 className="mt-5 text-2xl md:text-3xl font-semibold tracking-tight text-white">
        {title}
      </h1>
      <p className="mt-4 text-sm text-white/75 leading-relaxed">{message}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="rounded-full h-12 bg-brand text-white px-6 hover:bg-brand/90"
        >
          <Link href="/account">Go to your account</Link>
        </Button>
      </div>
    </motion.div>
  )
}
