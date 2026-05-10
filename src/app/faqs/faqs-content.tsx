"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, cubicBezier } from "framer-motion"
import {
  ChevronDown,
  Search,
  ShoppingBag,
  Truck,
  RotateCcw,
  UserRound,
  Sparkles,
  Award,
  ArrowRight,
  HelpCircle,
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

type Category = {
  key: string
  label: string
  icon: typeof ShoppingBag
  qas: Array<{ q: string; a: string }>
}

const CATEGORIES: Category[] = [
  {
    key: "orders",
    label: "Orders",
    icon: ShoppingBag,
    qas: [
      {
        q: "Can I change or cancel my order after it's placed?",
        a: "We can usually amend or cancel within 60 minutes of order placement — drop us a line at hello@melano.au with your order number. Once it's packed, we can't intercept it, but you can return any unopened items within 30 days.",
      },
      {
        q: "I haven't received an order confirmation email — what should I do?",
        a: "First check your spam folder. If it's still missing 15 minutes after checkout, email us — we'll resend it manually.",
      },
      {
        q: "Do you offer gift wrapping?",
        a: "Every order ships in our recyclable Melano box, which is gift-ready by default. At checkout you can add a hand-written note free of charge.",
      },
      {
        q: "Can I order over the phone?",
        a: "Yes — call +61 3 9000 1248 during business hours and we'll process the order with you on the line. Useful if you're sending a gift to someone else and don't want to log into anything.",
      },
    ],
  },
  {
    key: "shipping",
    label: "Shipping",
    icon: Truck,
    qas: [
      {
        q: "How long will my order take to arrive?",
        a: "1–2 business days within Melbourne metro, 2–7 days elsewhere in Australia, depending on service. Full table is on our Shipping page.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes — to NZ, US, UK, Canada, and Singapore by default. Other destinations on request.",
      },
      {
        q: "When does free shipping kick in?",
        a: "Free standard shipping on Australian orders over A$60. Bloom-tier members get free shipping over A$40, Bouquet members get it on every order.",
      },
      {
        q: "I selected Express but my order is taking longer than promised.",
        a: "Express usually means next business day to metros. Email hello@melano.au with your order number — we'll trace it with the carrier and refund the express upgrade if it missed the window.",
      },
    ],
  },
  {
    key: "returns",
    label: "Returns",
    icon: RotateCcw,
    qas: [
      {
        q: "What's your returns policy?",
        a: "30 days from delivery for unopened items. 14 days for opened items if you're unhappy with quality or there's a defect. Full process on the Returns page.",
      },
      {
        q: "Do I have to pay for return shipping?",
        a: "Not for Australian orders — we email you a pre-paid label. International returns are at the customer's cost unless the item was damaged or incorrect.",
      },
      {
        q: "How long until I see the refund?",
        a: "We refund within 2 business days of receiving your return. Card refunds take another 3–5 business days to appear in your account, depending on your bank.",
      },
      {
        q: "Can I exchange instead of returning?",
        a: "Easier to place a new order for the item you want and return the original — both happen in parallel and you get the new product faster. If that's a cash-flow problem, email us and we'll send store credit on the spot.",
      },
    ],
  },
  {
    key: "products",
    label: "Products",
    icon: Sparkles,
    qas: [
      {
        q: "Are your products suitable for sensitive skin?",
        a: "Most are — we formulate for skin comfort, not theatrics. The Honey Oat Cleansing Bar and Calendula Glow Serum are explicitly designed for reactive skin. Always patch test before first use; full guidance on the Consumer Health Notice.",
      },
      {
        q: "Are your products vegan and cruelty-free?",
        a: "Yes — every formula in our range. No animal-derived ingredients, no animal testing by us or our suppliers. Independently certified by Choose Cruelty Free.",
      },
      {
        q: "How long does a soap bar last?",
        a: "About 3 months with daily use, if you let it dry between uses. Stand it upright on a draining soap dish — sitting in a puddle halves the life.",
      },
      {
        q: "Do you have testers or sample sizes?",
        a: "We include a different sample sachet in every order over A$40, on rotation. Pick a specific sample at checkout if there's something you'd like to try.",
      },
      {
        q: "What's the shelf life once opened?",
        a: "Look for the small jar symbol with a number on the base — that's the Period After Opening (PAO) in months. Most of our range is 12M; serums are 6M.",
      },
    ],
  },
  {
    key: "account",
    label: "Account",
    icon: UserRound,
    qas: [
      {
        q: "Do I need an account to order?",
        a: "No — guest checkout is fine. But an account makes returns, reorders, and rewards easier, and we never spam our account holders.",
      },
      {
        q: "How do I reset my password?",
        a: "Go to Sign in → Forgot password. We'll email a reset link. The link expires after 30 minutes for security.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes, any time — email privacy@melano.au with the request. We'll confirm deletion within 7 days, with one note: tax law requires us to keep order records for 7 years, so those are anonymised rather than deleted.",
      },
      {
        q: "I'm getting too many emails — how do I unsubscribe?",
        a: "Use the one-click unsubscribe at the bottom of any email, or fine-tune categories on the Communication preferences page.",
      },
    ],
  },
  {
    key: "rewards",
    label: "Rewards",
    icon: Award,
    qas: [
      {
        q: "How does the Rewards program work?",
        a: "Free to join, 1 point per A$1 spent, plus extra for reviews, referrals and birthdays. Points convert to credit, free shipping, or member-only gift boxes. Full breakdown on the Rewards page.",
      },
      {
        q: "Do my points expire?",
        a: "Only if your account stays inactive for 12 consecutive months. Any order, review, or login resets the clock.",
      },
      {
        q: "Can I claim points on past purchases?",
        a: "Orders within the last 30 days are credited automatically when you sign up. For older orders, drop us a line at hello@melano.au.",
      },
      {
        q: "Can I stack a reward with a discount code?",
        a: "Yes — one points reward plus one promo code per order. Free-shipping rewards stack on top of either.",
      },
    ],
  },
]

function FaqItem({
  i,
  q,
  a,
  open,
  onToggle,
}: {
  i: number
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, delay: i * 0.04, ease: easeBezier }}
      className="rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 overflow-hidden"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-5 text-left hover:bg-white/[0.04] transition-colors"
      >
        <span className="text-base md:text-lg font-semibold text-white pr-2">
          {q}
        </span>
        <span
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] border border-white/15 text-white/85 transition-all",
            open && "bg-brand/15 border-brand/40 text-brand rotate-180"
          )}
        >
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: easeBezier }}
            className="overflow-hidden"
          >
            <p className="px-5 md:px-6 pb-5 text-sm md:text-base text-white/75 leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export default function FaqsContent() {
  const [activeCat, setActiveCat] = useState<string>("orders")
  const [query, setQuery] = useState("")
  const [openKey, setOpenKey] = useState<string | null>("orders-0")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CATEGORIES
    return CATEGORIES.map((c) => ({
      ...c,
      qas: c.qas.filter(
        (qa) =>
          qa.q.toLowerCase().includes(q) || qa.a.toLowerCase().includes(q)
      ),
    })).filter((c) => c.qas.length > 0)
  }, [query])

  const showCat = query.trim()
    ? filtered
    : filtered.filter((c) => c.key === activeCat)

  return (
    <>
      <section className="relative px-6 pt-40 md:pt-48 pb-12 text-center">
        <div className="mx-auto max-w-3xl">
          <motion.span
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 px-4 py-1.5 text-[11px] md:text-xs tracking-[0.3em] uppercase text-white/85"
          >
            <HelpCircle className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
            FAQs
          </motion.span>
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-7 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
          >
            Quick answers.
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
          >
            Browse by topic or search the entire bank. If your question
            isn&rsquo;t here, the contact form is one click away.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-9">
            <label className="relative block max-w-xl mx-auto">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search every question…"
                className="w-full h-12 pl-11 pr-4 rounded-full bg-white/[0.06] border border-white/15 text-sm text-white placeholder:text-white/45 outline-none focus:bg-white/10 focus:border-white/30 transition-colors"
              />
            </label>
          </motion.div>
        </div>
      </section>

      {/* Category tabs */}
      {!query.trim() && (
        <section className="relative px-6 pb-6">
          <div className="mx-auto max-w-5xl">
            <motion.ul
              {...fadeUp(0)}
              className="flex flex-wrap justify-center gap-2"
            >
              {CATEGORIES.map((c) => {
                const active = activeCat === c.key
                return (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={() => setActiveCat(c.key)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full h-10 px-4 text-xs tracking-[0.14em] uppercase border transition-colors",
                        active
                          ? "bg-brand/20 border-brand/50 text-brand"
                          : "bg-white/[0.04] border-white/10 text-white/80 hover:bg-white/[0.08] hover:border-white/20"
                      )}
                    >
                      <c.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                      {c.label}
                    </button>
                  </li>
                )
              })}
            </motion.ul>
          </div>
        </section>
      )}

      {/* Question list */}
      <section className="relative px-6 py-12">
        <div className="mx-auto max-w-3xl">
          {showCat.length === 0 ? (
            <motion.p
              {...fadeUp(0)}
              className="text-center text-white/65 py-10"
            >
              No matches for &ldquo;{query}&rdquo; — try a different keyword,
              or send us a message direct.
            </motion.p>
          ) : (
            showCat.map((cat) => (
              <div key={cat.key} className="mb-10 last:mb-0">
                {query.trim() && (
                  <h2 className="mb-4 text-[11px] tracking-[0.32em] uppercase text-white/55">
                    {cat.label}
                  </h2>
                )}
                <ul className="space-y-3">
                  {cat.qas.map((qa, i) => {
                    const key = `${cat.key}-${i}`
                    return (
                      <FaqItem
                        key={key}
                        i={i}
                        q={qa.q}
                        a={qa.a}
                        open={openKey === key}
                        onToggle={() =>
                          setOpenKey(openKey === key ? null : key)
                        }
                      />
                    )
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            Couldn&rsquo;t find what you needed?
          </h2>
          <p className="mt-3 text-sm md:text-base text-white/75">
            Drop us an email — most replies land within the same day.
          </p>
          <div className="mt-7">
            <div className="inline-block border border-white/80 p-1 md:p-1.5">
              <Button
                asChild
                className="
                  group rounded-full bg-brand text-white
                  font-semibold text-base
                  px-7 md:px-8 py-3 md:py-3.5
                  hover:bg-brand/90 transition-all
                "
              >
                <Link href="/contact">
                  Get in touch
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
