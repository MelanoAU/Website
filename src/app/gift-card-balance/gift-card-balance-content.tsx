"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, cubicBezier } from "framer-motion"
import {
  Gift,
  Loader2,
  Search,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CalendarClock,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, delay, ease: easeBezier },
})

const inputClass =
  "w-full h-12 rounded-xl bg-white/[0.06] border border-white/15 px-4 text-sm text-white placeholder:text-white/45 outline-none focus:bg-white/10 focus:border-white/30 transition-colors tracking-wider tabular-nums"

type Result = {
  cardLast4: string
  balance: number
  original: number
  expiresOn: string
  history: Array<{ at: string; label: string; delta: number; balance: number }>
}

function fmt(amount: number) {
  return `A$${amount.toFixed(2)}`
}

export default function GiftCardBalanceContent() {
  const [card, setCard] = useState("")
  const [pin, setPin] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setResult(null)

    // Demo lookup — replace with real API once issued.
    window.setTimeout(() => {
      setLoading(false)
      const cleaned = card.replace(/\s+/g, "")
      if (cleaned.length < 12 || pin.length < 4) {
        setError(
          "Card numbers are 16 digits and PINs are 4. Double-check the back of the card and try again."
        )
        return
      }
      setResult({
        cardLast4: cleaned.slice(-4),
        balance: 64.5,
        original: 100,
        expiresOn: "2028-12-31",
        history: [
          {
            at: "2026-04-12",
            label: "Order MEL-23117",
            delta: -28.5,
            balance: 64.5,
          },
          {
            at: "2026-02-04",
            label: "Order MEL-21893",
            delta: -7,
            balance: 93,
          },
          {
            at: "2025-11-02",
            label: "Card issued",
            delta: 100,
            balance: 100,
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
            <Gift className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
            Gift cards
          </motion.span>
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-7 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
          >
            Check your balance.
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
          >
            Pop in your card details to see what&rsquo;s left and where the
            spend has gone. We never store the card number after the lookup.
          </motion.p>
        </div>
      </section>

      <section className="relative px-6 pb-12">
        <div className="mx-auto max-w-xl">
          <motion.form
            {...fadeUp(0)}
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-6 md:p-8"
          >
            <label className="block">
              <span className="block text-[11px] tracking-[0.28em] uppercase text-white/60 mb-2">
                Gift card number
              </span>
              <input
                required
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className={inputClass}
              />
            </label>
            <label className="mt-4 block">
              <span className="block text-[11px] tracking-[0.28em] uppercase text-white/60 mb-2">
                4-digit PIN
              </span>
              <input
                required
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className={inputClass}
              />
            </label>
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
                  Check balance
                </>
              )}
            </Button>
            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          </motion.form>
        </div>
      </section>

      <AnimatePresence>
        {result && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: easeBezier }}
            className="relative px-6 pb-20"
          >
            <div className="mx-auto max-w-2xl space-y-5">
              <div className="rounded-2xl bg-gradient-to-br from-brand/15 via-white/[0.06] to-white/[0.04] backdrop-blur-md border border-brand/30 p-7 md:p-9">
                <p className="text-[11px] tracking-[0.28em] uppercase text-white/65">
                  Card ending •••• {result.cardLast4}
                </p>
                <div className="mt-4 flex flex-wrap items-baseline gap-3">
                  <span className="text-5xl md:text-6xl font-semibold text-white tabular-nums tracking-tight">
                    {fmt(result.balance)}
                  </span>
                  <span className="text-sm text-white/65 tabular-nums">
                    of {fmt(result.original)} original value
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-white/65">
                  <CalendarClock className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
                  Expires {new Date(result.expiresOn).toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "numeric" })}
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-6">
                <h3 className="text-base font-semibold text-white">History</h3>
                <ul className="mt-4 divide-y divide-white/10">
                  {result.history.map((h, i) => (
                    <li
                      key={i}
                      className="py-3 flex items-baseline justify-between gap-4 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="text-white">{h.label}</p>
                        <p className="text-[11px] tracking-[0.18em] uppercase text-white/55 tabular-nums">
                          {h.at}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={
                            h.delta < 0
                              ? "text-white/75 tabular-nums"
                              : "text-brand tabular-nums"
                          }
                        >
                          {h.delta < 0 ? "−" : "+"}
                          {fmt(Math.abs(h.delta))}
                        </p>
                        <p className="text-[11px] text-white/45 tabular-nums">
                          Bal. {fmt(h.balance)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-6 flex items-start gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30 shrink-0">
                  <Wallet className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div className="text-sm text-white/75 leading-relaxed">
                  Your balance applies automatically at checkout. Add the gift
                  card to your account and it&rsquo;ll appear as a payment
                  option.
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Info */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              t: "Send a gift card",
              b: "Digital cards in any amount, delivered by email at the date and time you choose.",
              cta: { l: "Buy a gift card", h: "/shop" },
            },
            {
              icon: ShieldCheck,
              t: "Lost your card?",
              b: "We can re-issue digital cards with proof of original purchase. Email us with the order number.",
              cta: { l: "Email support", h: "/contact" },
            },
            {
              icon: ArrowRight,
              t: "Terms & conditions",
              b: "Gift cards are non-refundable, valid for 3 years from issue, and apply to any product on melano.au.",
              cta: { l: "Read full terms", h: "/terms" },
            },
          ].map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: easeBezier }}
              className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-6 hover:bg-white/[0.08] hover:border-white/15 transition-colors flex flex-col"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                <c.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{c.t}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed flex-1">
                {c.b}
              </p>
              <Link
                href={c.cta.h}
                className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand hover:underline underline-offset-4"
              >
                {c.cta.l}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
