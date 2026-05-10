"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, cubicBezier } from "framer-motion"
import {
  Sparkles,
  Gift,
  Crown,
  ShoppingBag,
  MessageSquare,
  Share2,
  Cake,
  Users,
  Truck,
  Package,
  ChevronDown,
  Leaf,
  Flower,
  BadgePercent,
  ArrowRight,
  Calendar,
  Award,
  Zap,
  Lock,
  Heart,
  Check,
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

/* ---------------------------------------------------------------- */
/*  Data                                                             */
/* ---------------------------------------------------------------- */

const HOW_IT_WORKS = [
  {
    icon: Sparkles,
    step: "01",
    title: "Sign up — free, forever",
    body:
      "Thirty seconds, an email, and you’re in. We’ll add a 100-point welcome gift on the house, no card required.",
  },
  {
    icon: ShoppingBag,
    step: "02",
    title: "Earn on every ritual",
    body:
      "1 point for every A$1 spent. Plus extra for reviews, referrals, birthdays, and the small things in between.",
  },
  {
    icon: Gift,
    step: "03",
    title: "Redeem when you’re ready",
    body:
      "Trade points for credit, free shipping, or a member-only botanical gift box — your call, your timing.",
  },
]

type Tier = {
  name: string
  range: string
  tagline: string
  icon: typeof Leaf
  perks: string[]
  featured?: boolean
}

const TIERS: Tier[] = [
  {
    name: "Petal",
    range: "0 — 499 pts",
    tagline: "Where every glow begins",
    icon: Leaf,
    perks: [
      "100-point welcome gift",
      "Birthday treat every year",
      "Early-access newsletter",
      "Free returns within 30 days",
    ],
  },
  {
    name: "Bloom",
    range: "500 — 1,999 pts",
    tagline: "Most loved by our members",
    icon: Flower,
    featured: true,
    perks: [
      "Everything in Petal",
      "5% off every order — always",
      "Free shipping on orders over A$40",
      "24-hour head start on new drops",
      "Annual full-size sample box",
    ],
  },
  {
    name: "Bouquet",
    range: "2,000+ pts",
    tagline: "The whole garden, yours",
    icon: Crown,
    perks: [
      "Everything in Bloom",
      "10% off every order — always",
      "Free shipping on every order",
      "Anniversary gift box, hand-curated",
      "Personal concierge — a direct line, not a chatbot",
      "Invites to private events & launches",
    ],
  },
]

const EARN_WAYS = [
  {
    icon: Sparkles,
    title: "Create your account",
    points: "+100",
    desc: "One-time welcome gift the moment you join.",
  },
  {
    icon: ShoppingBag,
    title: "Every dollar spent",
    points: "1 pt / A$1",
    desc: "On every order, every product, no exceptions.",
  },
  {
    icon: MessageSquare,
    title: "Write a review",
    points: "+50",
    desc: "Honest feedback on a product you bought — verified within 48 hours.",
  },
  {
    icon: Cake,
    title: "Birthday gift",
    points: "+200",
    desc: "A bonus drop in your account every year on the day.",
  },
  {
    icon: Users,
    title: "Refer a friend",
    points: "+500",
    desc: "When they place their first order, you both get rewarded.",
  },
  {
    icon: Share2,
    title: "Share on socials",
    points: "+25",
    desc: "Tag @melano on Instagram with your ritual — once per month.",
  },
]

const REDEEM = [
  {
    points: 100,
    reward: "A$5 credit",
    icon: BadgePercent,
    sub: "Stack with any order",
  },
  {
    points: 250,
    reward: "A$15 credit",
    icon: BadgePercent,
    sub: "Save it for the next drop",
  },
  {
    points: 500,
    reward: "Free shipping",
    icon: Truck,
    sub: "On any order, any size",
  },
  {
    points: 1000,
    reward: "A$50 voucher",
    icon: Gift,
    sub: "Treat yourself or someone else",
  },
  {
    points: 2000,
    reward: "Botanical gift box",
    icon: Package,
    sub: "Limited edition, members only",
  },
]

const PERKS = [
  {
    icon: Cake,
    title: "Birthday treat",
    body:
      "200 bonus points and a small surprise tucked into your next order during your birth month.",
  },
  {
    icon: Zap,
    title: "Early-access drops",
    body:
      "New formulas land in your inbox 24 hours before everyone else. Bloom & up.",
  },
  {
    icon: Calendar,
    title: "Anniversary box",
    body:
      "Every year you stay with us, a curated set lands at your door with a hand-written note.",
  },
  {
    icon: Award,
    title: "Member-only events",
    body:
      "Workshops, ingredient walks, and intimate launch dinners — by invitation.",
  },
  {
    icon: Heart,
    title: "Concierge support",
    body:
      "A direct line to our small team — not a chatbot, not a queue. Bouquet exclusive.",
  },
  {
    icon: Lock,
    title: "Limited drops",
    body:
      "Tiny-batch products that never go on the public shop. First dibs for members only.",
  },
]

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "How much does it cost to join?",
    a: "Nothing. Membership is free, forever — no card required, no monthly fee. We just need an email so we know where to send your points.",
  },
  {
    q: "Do my points expire?",
    a: "Only if your account stays inactive for 12 consecutive months. Any order, review, or login resets the clock — so a single ritual a year keeps everything alive.",
  },
  {
    q: "Can I claim points on past purchases?",
    a: "Yes. Orders placed within the last 30 days are credited automatically the moment you sign up. For older orders, drop us an email at hello@melano.au and we’ll sort it out by hand.",
  },
  {
    q: "How do I move up a tier?",
    a: "Tiers are based on your lifetime points. The instant you cross a threshold, the perks unlock — no waiting for the next billing cycle, no minimum stay.",
  },
  {
    q: "Can I use multiple rewards at once?",
    a: "You can stack one points reward with one promo code per order. Free-shipping rewards don’t count toward the stack — they’re a free upgrade on top.",
  },
  {
    q: "Is my membership tier shared with my partner or family?",
    a: "Each account is personal — but if you’d prefer a shared household account, we can merge two memberships once. Just reach out.",
  },
]

/* ---------------------------------------------------------------- */
/*  Sections                                                         */
/* ---------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative px-6 pt-40 md:pt-48 pb-24 text-center">
      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.span
          {...fadeUp(0)}
          className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 px-4 py-1.5 text-[11px] md:text-xs tracking-[0.3em] uppercase text-white/85"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
          Melano Rewards
        </motion.span>

        <motion.h1
          {...fadeUp(0.1)}
          className="mt-7 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
        >
          Glow more. <br className="hidden md:block" />
          Get more.
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
        >
          Earn a point with every dollar — unlock botanical credits, free
          shipping, member-only drops, and the occasional ritual on the house.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
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
              <Link href="/signup">
                Join free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
          <Link
            href="/login"
            className="text-sm text-white/80 hover:text-brand transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-brand"
          >
            Already a member? Sign in
          </Link>
        </motion.div>

        <motion.ul
          {...fadeUp(0.4)}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[12px] tracking-[0.18em] uppercase text-white/65"
        >
          {[
            "Free to join",
            "No fees, ever",
            "Points on day one",
            "Cancel anytime",
          ].map((t) => (
            <li key={t} className="inline-flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-brand" strokeWidth={2.4} />
              {t}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-2xl">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            How it works
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Three steps. <br className="hidden md:block" />
            That’s the whole thing.
          </h2>
        </motion.div>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map(({ icon: Icon, step, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: easeBezier }}
              className="
                relative rounded-2xl p-7 md:p-8
                bg-white/[0.06] backdrop-blur-md
                border border-white/10
                hover:bg-white/[0.09] hover:border-white/15
                transition-colors
              "
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <span className="text-[11px] tracking-[0.3em] uppercase text-white/45 tabular-nums">
                  {step}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed">
                {body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Tiers() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Membership tiers
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            From a single petal <br className="hidden md:block" />
            to the whole bouquet.
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-sm md:text-base text-white/75 leading-relaxed">
            Three tiers, each unlocking automatically the moment you cross the
            line. No waiting, no paperwork, no clauses.
          </p>
        </motion.div>

        <ul className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {TIERS.map((t, i) => (
            <motion.li
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: easeBezier }}
              className={cn(
                "relative h-full flex flex-col rounded-2xl backdrop-blur-md transition-colors",
                t.featured
                  ? "bg-white/[0.09] border-2 border-brand/40 ring-1 ring-brand/20 lg:-translate-y-3"
                  : "bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:border-white/15"
              )}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-brand/20 border border-brand/50 px-3 py-1 text-[10px] tracking-[0.28em] uppercase text-brand backdrop-blur-md">
                  <Sparkles className="h-3 w-3" strokeWidth={2.2} />
                  Most loved
                </span>
              )}

              <div className="p-7 md:p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1",
                      t.featured
                        ? "bg-brand/20 text-brand ring-brand/40"
                        : "bg-white/[0.08] text-white ring-white/15"
                    )}
                  >
                    <t.icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="text-[11px] tracking-[0.24em] uppercase text-white/55 tabular-nums">
                    {t.range}
                  </span>
                </div>

                <h3 className="mt-6 text-3xl font-semibold tracking-tight text-white">
                  {t.name}
                </h3>
                <p className="mt-2 text-sm text-white/65 italic leading-relaxed">
                  {t.tagline}
                </p>

                <ul className="mt-7 space-y-3">
                  {t.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3 text-sm text-white/85 leading-relaxed">
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          t.featured ? "bg-brand/25 text-brand" : "bg-white/10 text-white/85"
                        )}
                      >
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Earn() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-2xl">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Earn points
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Six easy ways. <br className="hidden md:block" />
            None of them feel like work.
          </h2>
        </motion.div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {EARN_WAYS.map(({ icon: Icon, title, points, desc }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: easeBezier }}
              className="
                rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10
                p-6 md:p-7
                hover:bg-white/[0.08] hover:border-white/15 transition-colors
              "
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className="rounded-full bg-brand/15 border border-brand/30 px-3 py-1 text-xs font-semibold tracking-wide text-brand whitespace-nowrap">
                  {points}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{desc}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Redeem() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Redeem
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Pick a reward, redeem in one tap.
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-sm md:text-base text-white/75">
            No minimums, no blackout dates. Save up for the big one or stack
            small ones — every reward is yours to keep.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className="mt-12 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 overflow-hidden"
        >
          <ul className="divide-y divide-white/10">
            {REDEEM.map(({ points, reward, sub, icon: Icon }, i) => (
              <motion.li
                key={reward}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: easeBezier }}
                className="
                  group flex items-center gap-4 md:gap-6
                  px-5 md:px-7 py-5 md:py-6
                  hover:bg-white/[0.04] transition-colors
                "
              >
                <span className="hidden sm:inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl md:text-3xl font-semibold text-white tabular-nums">
                      {points.toLocaleString()}
                    </span>
                    <span className="text-[11px] tracking-[0.24em] uppercase text-white/55">
                      points
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/55">{sub}</p>
                </div>

                <div className="hidden md:block w-16 text-center text-white/30">
                  <ArrowRight className="h-4 w-4 mx-auto" strokeWidth={1.8} />
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base md:text-lg font-semibold text-brand">
                    {reward}
                  </div>
                  <div className="md:hidden mt-1 text-[10px] tracking-[0.2em] uppercase text-white/45">
                    Redeem
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-center text-xs text-white/50"
        >
          Member tier discounts (Bloom & Bouquet) apply automatically and stack
          with any redeemed reward.
        </motion.p>
      </div>
    </section>
  )
}

function Perks() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-2xl">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Member perks
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Quietly generous, <br className="hidden md:block" />
            year after year.
          </h2>
        </motion.div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PERKS.map(({ icon: Icon, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: easeBezier }}
              className="
                rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10
                p-7
                hover:bg-white/[0.08] hover:border-white/15 transition-colors
              "
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function FaqItem({
  index,
  q,
  a,
  open,
  onToggle,
}: {
  index: number
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: easeBezier }}
      className="rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 overflow-hidden"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="
          group w-full flex items-center justify-between gap-4
          px-5 md:px-7 py-5
          text-left
          hover:bg-white/[0.04] transition-colors
        "
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
            transition={{ duration: 0.35, ease: easeBezier }}
            className="overflow-hidden"
          >
            <p className="px-5 md:px-7 pb-5 md:pb-6 text-sm md:text-base text-white/75 leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            FAQ
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            The short answers.
          </h2>
        </motion.div>

        <ul className="mt-12 space-y-3">
          {FAQS.map((f, i) => (
            <FaqItem
              key={f.q}
              index={i}
              q={f.q}
              a={f.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </ul>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-10 text-center text-sm text-white/65"
        >
          Still have a question?{" "}
          <Link
            href="/contact"
            className="text-brand hover:underline underline-offset-4"
          >
            Talk to us
          </Link>{" "}
          — we read every email.
        </motion.p>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="relative min-h-[70svh] flex items-center px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.span
          {...fadeUp(0)}
          className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70"
        >
          Begin
        </motion.span>
        <motion.h2
          {...fadeUp(0.1)}
          className="mt-5 text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05]"
        >
          Your bloom <br className="hidden md:block" />
          starts today.
        </motion.h2>
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-base md:text-lg text-white/80 max-w-xl mx-auto"
        >
          A hundred points are waiting in your account. Sign up takes about as
          long as boiling a kettle.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
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
              <Link href="/signup">
                Join free — 100 points
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
          <Button
            asChild
            className="rounded-full h-12 px-6 bg-white/[0.06] border border-white/20 text-white hover:bg-white/[0.1] hover:border-white/30 transition-colors"
          >
            <Link href="/shop">
              Shop the range
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Page composition                                                 */
/* ---------------------------------------------------------------- */

export default function RewardsContent() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Tiers />
      <Earn />
      <Redeem />
      <Perks />
      <Faq />
      <ClosingCta />
    </>
  )
}
