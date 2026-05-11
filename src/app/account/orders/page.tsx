"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, cubicBezier } from "framer-motion"
import {
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Package,
  Truck,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
  CircleDot,
  CalendarClock,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRequireAuth } from "@/lib/auth"
import {
  fetchUserOrders,
  type OrderStatus,
  type OrderWithItems,
} from "@/lib/account"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Awaiting payment",
  paid: "Paid",
  packed: "Packed",
  shipped: "On its way",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
}

const STATUS_TONE: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 border-amber-500/30 text-amber-300",
  paid: "bg-sky-500/15 border-sky-500/30 text-sky-300",
  packed: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
  shipped: "bg-brand/20 border-brand/40 text-brand",
  delivered: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
  cancelled: "bg-white/[0.06] border-white/15 text-white/55",
  refunded: "bg-white/[0.06] border-white/15 text-white/55",
}

const STAGES: Array<{ icon: typeof CheckCircle2; key: OrderStatus; label: string }> = [
  { icon: CheckCircle2, key: "paid", label: "Paid" },
  { icon: Package, key: "packed", label: "Packed" },
  { icon: Truck, key: "shipped", label: "Shipped" },
  { icon: CircleDot, key: "delivered", label: "Delivered" },
]

const STAGE_INDEX: Record<OrderStatus, number> = {
  pending: -1,
  paid: 0,
  packed: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
  refunded: -1,
}

function formatPrice(amount: number, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
  }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function OrdersPage() {
  const auth = useRequireAuth("/account/orders")
  const authReady = auth.status === "authenticated"
  const [orders, setOrders] = useState<OrderWithItems[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    if (!authReady) return
    let active = true
    fetchUserOrders()
      .then((list) => {
        if (!active) return
        setOrders(list)
        if (list.length > 0) setOpenId(list[0].id)
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load your orders right now.",
        )
      })
    return () => {
      active = false
    }
  }, [authReady])

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative min-h-[100svh] flex flex-col">
        <div className="h-24 md:h-28" />

        <div className="flex-1 px-6 pb-24">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeBezier }}
              className="pt-6 md:pt-12"
            >
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase text-white/65 hover:text-brand transition-colors mb-5"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                Back to account
              </Link>
              <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                Orders
              </span>
              <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
                Your orders.
              </h1>
            </motion.div>

            <div className="mt-10">
              {!authReady ? (
                <Centered>
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/70" />
                  <p className="mt-4 text-sm text-white/70">Loading…</p>
                </Centered>
              ) : error ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 flex items-start gap-3 text-red-200">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">
                      Couldn&rsquo;t load your orders
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{error}</p>
                  </div>
                </div>
              ) : orders === null ? (
                <Centered>
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/70" />
                  <p className="mt-4 text-sm text-white/70">
                    Fetching your orders…
                  </p>
                </Centered>
              ) : orders.length === 0 ? (
                <Centered>
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/15 text-white/85">
                    <ShoppingBag className="h-6 w-6" strokeWidth={1.8} />
                  </div>
                  <h2 className="mt-6 text-2xl md:text-3xl font-semibold tracking-tight text-white">
                    No orders yet.
                  </h2>
                  <p className="mt-3 text-sm md:text-base text-white/75 max-w-md mx-auto leading-relaxed">
                    The moment you place your first order it&rsquo;ll show up
                    here, with live status from the carrier.
                  </p>
                  <div className="mt-7 inline-block border border-white/80 p-1 md:p-1.5">
                    <Button
                      asChild
                      className="rounded-full bg-brand text-white px-7 py-3 hover:bg-brand/90 transition-colors"
                    >
                      <Link href="/shop">
                        Browse the shop
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Centered>
              ) : (
                <ul className="space-y-4">
                  {orders.map((o, i) => (
                    <OrderCard
                      key={o.id}
                      order={o}
                      open={openId === o.id}
                      onToggle={() =>
                        setOpenId(openId === o.id ? null : o.id)
                      }
                      delay={i * 0.05}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 px-6 py-16 text-center">
      {children}
    </div>
  )
}

function OrderCard({
  order,
  open,
  onToggle,
  delay,
}: {
  order: OrderWithItems
  open: boolean
  onToggle: () => void
  delay: number
}) {
  const stage = STAGE_INDEX[order.status]

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: easeBezier }}
      className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 overflow-hidden"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex flex-wrap items-center justify-between gap-4 px-5 md:px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] tracking-[0.22em] uppercase",
                STATUS_TONE[order.status],
              )}
            >
              {STATUS_LABEL[order.status]}
            </span>
            <span className="text-xs tracking-[0.18em] uppercase text-white/55 inline-flex items-center gap-1">
              <CalendarClock className="h-3 w-3" strokeWidth={2} />
              {formatDate(order.placed_at)}
            </span>
          </div>
          <h3 className="mt-2 text-lg md:text-xl font-semibold text-white">
            {order.order_number}
          </h3>
          <p className="mt-0.5 text-xs text-white/55 tabular-nums">
            {order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
            {formatPrice(order.total, order.currency)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] border border-white/15 text-white/85 transition-all",
              open && "bg-brand/15 border-brand/40 text-brand rotate-180",
            )}
          >
            <ChevronDown className="h-4 w-4" strokeWidth={2} />
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeBezier }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-6">
              {/* Stage rail */}
              {stage >= 0 && (
                <ol className="mt-2 mb-6 grid grid-cols-4 gap-2">
                  {STAGES.map((s, i) => {
                    const reached = i <= stage
                    const current = i === stage
                    return (
                      <li key={s.key} className="text-center">
                        <span
                          className={cn(
                            "mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                            reached
                              ? "bg-brand/20 border-brand/50 text-brand"
                              : "bg-white/[0.04] border-white/15 text-white/45",
                            current && "ring-2 ring-brand/40",
                          )}
                        >
                          <s.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                        </span>
                        <p
                          className={cn(
                            "mt-1.5 text-[10px] tracking-[0.22em] uppercase",
                            reached ? "text-white/85" : "text-white/45",
                          )}
                        >
                          {s.label}
                        </p>
                      </li>
                    )
                  })}
                </ol>
              )}

              {/* Items */}
              <h4 className="text-[11px] tracking-[0.28em] uppercase text-white/55 mb-3">
                Items
              </h4>
              <ul className="space-y-3">
                {order.items.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-start justify-between gap-4 rounded-xl bg-white/[0.04] border border-white/10 p-4"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/product/${it.product_id}`}
                        className="text-sm font-semibold text-white hover:text-brand transition-colors"
                      >
                        {it.product_title}
                      </Link>
                      <p className="mt-1 text-xs text-white/55">
                        {it.size && it.size.length > 0
                          ? `${it.size} · `
                          : ""}
                        Qty {it.quantity} ·{" "}
                        {formatPrice(it.unit_price, order.currency)} each
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-white tabular-nums shrink-0">
                      {formatPrice(it.line_total, order.currency)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <dl className="mt-6 grid gap-1.5 text-sm">
                <Row
                  label="Subtotal"
                  value={formatPrice(order.subtotal, order.currency)}
                />
                <Row
                  label="Shipping"
                  value={formatPrice(order.shipping, order.currency)}
                />
                <Row
                  label="Tax"
                  value={formatPrice(order.tax, order.currency)}
                />
                <Row
                  label="Total"
                  value={formatPrice(order.total, order.currency)}
                  bold
                />
              </dl>

              {order.tracking_number && (
                <div className="mt-6 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white/85 flex items-center justify-between gap-3 flex-wrap">
                  <span>
                    {order.carrier ?? "Carrier"} ·{" "}
                    <span className="font-mono text-xs">
                      {order.tracking_number}
                    </span>
                  </span>
                  <Link
                    href={`/track-order?order=${encodeURIComponent(order.order_number)}`}
                    className="text-xs text-brand hover:underline underline-offset-4 inline-flex items-center gap-1"
                  >
                    Open tracking
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={cn("text-white/65", bold && "text-white")}>{label}</dt>
      <dd
        className={cn(
          "tabular-nums",
          bold ? "text-base font-semibold text-white" : "text-white/85",
        )}
      >
        {value}
      </dd>
    </div>
  )
}
