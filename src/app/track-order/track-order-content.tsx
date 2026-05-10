"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, cubicBezier } from "framer-motion"
import {
  Truck,
  Package,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Search,
  Clock,
  MapPin,
  CircleDot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, delay, ease: easeBezier },
})

const inputClass =
  "w-full h-12 rounded-xl bg-white/[0.06] border border-white/15 px-4 text-sm text-white placeholder:text-white/45 outline-none focus:bg-white/10 focus:border-white/30 transition-colors"

type Status = {
  carrier: string
  tracking: string
  eta: string
  city: string
  current: number // 0..3 — placed / packed / shipped / delivered
  events: Array<{ at: string; label: string; sub?: string }>
}

const STAGES = [
  { icon: CheckCircle2, label: "Placed" },
  { icon: Package, label: "Packed" },
  { icon: Truck, label: "Shipped" },
  { icon: MapPin, label: "Delivered" },
]

export default function TrackOrderContent() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<Status | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setStatus(null)

    // Demo lookup — replace with real API integration when ready.
    window.setTimeout(() => {
      setLoading(false)
      const trimmed = orderNumber.trim().toUpperCase()
      if (!trimmed.startsWith("MEL-")) {
        setError(
          "We couldn't find that order. Check the format (looks like MEL-12345) and the email matches the one used at checkout."
        )
        return
      }
      setStatus({
        carrier: "Australia Post",
        tracking: "AP" + trimmed.slice(4) + "AU",
        eta: "Tomorrow, 11am – 2pm",
        city: "Sydney NSW 2000",
        current: 2,
        events: [
          {
            at: "Today · 14:32",
            label: "In transit · Sydney parcel facility",
            sub: "Out for delivery tomorrow.",
          },
          {
            at: "Today · 06:11",
            label: "Departed Melbourne hub",
            sub: "On board overnight road service.",
          },
          {
            at: "Yesterday · 21:48",
            label: "Picked up by Australia Post",
            sub: "Brunswick VIC 3056 dispatch centre.",
          },
          {
            at: "Yesterday · 16:02",
            label: "Packed & ready to ship",
            sub: "From our Brunswick workshop.",
          },
          {
            at: "Yesterday · 09:14",
            label: "Order placed",
            sub: "Payment confirmed.",
          },
        ],
      })
    }, 900)
  }

  return (
    <>
      <section className="relative px-6 pt-40 md:pt-48 pb-12 text-center">
        <div className="mx-auto max-w-3xl">
          <motion.span
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 px-4 py-1.5 text-[11px] md:text-xs tracking-[0.3em] uppercase text-white/85"
          >
            <Truck className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
            Order tracking
          </motion.span>
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-7 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
          >
            Where&rsquo;s my parcel?
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
          >
            Pop in your order number and email — we&rsquo;ll pull a live status
            from the carrier and an honest ETA.
          </motion.p>
        </div>
      </section>

      <section className="relative px-6 pb-12">
        <div className="mx-auto max-w-2xl">
          <motion.form
            {...fadeUp(0)}
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-6 md:p-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="block text-[11px] tracking-[0.28em] uppercase text-white/60 mb-2">
                  Order number
                </span>
                <input
                  required
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="MEL-12345"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="block text-[11px] tracking-[0.28em] uppercase text-white/60 mb-2">
                  Email used at checkout
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full h-12 bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Looking up…
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Track order
                </>
              )}
            </Button>

            {error && (
              <p className="mt-4 text-sm text-red-300">{error}</p>
            )}

            <p className="mt-5 text-xs text-white/55 leading-relaxed text-center">
              Don&rsquo;t have an order number?{" "}
              <Link
                href="/contact"
                className="text-brand hover:underline underline-offset-4"
              >
                Email us
              </Link>{" "}
              and we&rsquo;ll find your order for you.
            </p>
          </motion.form>
        </div>
      </section>

      <AnimatePresence>
        {status && (
          <motion.section
            key="status"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: easeBezier }}
            className="relative px-6 pb-20"
          >
            <div className="mx-auto max-w-3xl space-y-6">
              {/* Headline card */}
              <div className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-brand/15 border border-brand/30 px-3 py-1 text-[11px] tracking-[0.22em] uppercase text-brand">
                      <CircleDot className="h-3 w-3" strokeWidth={2.4} />
                      In transit
                    </span>
                    <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-white">
                      Arriving {status.eta.toLowerCase()}
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                      Headed to {status.city} via {status.carrier} ·{" "}
                      <span className="text-white/85">{status.tracking}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] tracking-[0.22em] uppercase text-white/55">
                      Updated
                    </p>
                    <p className="mt-1 text-sm text-white/85 inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                      Just now
                    </p>
                  </div>
                </div>

                {/* Stage rail */}
                <ol className="mt-8 grid grid-cols-4 gap-2">
                  {STAGES.map((s, i) => {
                    const reached = i <= status.current
                    const current = i === status.current
                    return (
                      <li key={s.label} className="text-center">
                        <span
                          className={cn(
                            "mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
                            reached
                              ? "bg-brand/20 border-brand/50 text-brand"
                              : "bg-white/[0.04] border-white/15 text-white/45",
                            current && "ring-2 ring-brand/40"
                          )}
                        >
                          <s.icon className="h-4 w-4" strokeWidth={1.8} />
                        </span>
                        <p
                          className={cn(
                            "mt-2 text-[10px] tracking-[0.22em] uppercase",
                            reached ? "text-white/85" : "text-white/45"
                          )}
                        >
                          {s.label}
                        </p>
                      </li>
                    )
                  })}
                </ol>
              </div>

              {/* Event list */}
              <div className="rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-6 md:p-7">
                <h3 className="text-base font-semibold text-white">
                  Carrier events
                </h3>
                <ul className="mt-5 space-y-4">
                  {status.events.map((e, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="flex flex-col items-center pt-1">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            i === 0 ? "bg-brand" : "bg-white/35"
                          )}
                        />
                        {i < status.events.length - 1 && (
                          <span className="flex-1 w-px bg-white/10 my-1.5" />
                        )}
                      </div>
                      <div className="pb-2 min-w-0">
                        <p className="text-[11px] tracking-[0.22em] uppercase text-white/55 tabular-nums">
                          {e.at}
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">
                          {e.label}
                        </p>
                        {e.sub && (
                          <p className="mt-0.5 text-xs text-white/65">
                            {e.sub}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Help */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-7 md:p-9 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            Still not sure?
          </h2>
          <p className="mt-3 text-sm md:text-base text-white/75">
            Stuck in transit, address typo, or thinking about cancelling — we
            can sort all of it.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="rounded-full h-12 px-6 bg-white/[0.06] border border-white/20 text-white hover:bg-white/[0.1] hover:border-white/30 transition-colors"
            >
              <Link href="/shipping">
                Read shipping info
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-full h-12 px-6 bg-white/[0.06] border border-white/20 text-white hover:bg-white/[0.1] hover:border-white/30 transition-colors"
            >
              <Link href="/contact">
                Email support
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
