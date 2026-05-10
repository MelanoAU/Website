"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, cubicBezier } from "framer-motion"
import {
  Star,
  ShieldCheck,
  Leaf,
  MapPin,
  Sparkles,
  ThumbsUp,
  ImagePlus,
  ArrowRight,
  Quote,
  Filter,
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
/*  Mock review data — replace with Supabase fetch when ready       */
/* ---------------------------------------------------------------- */

type Category = "skin" | "hair" | "body"

type Review = {
  id: string
  name: string
  initials: string
  avatarTone: string
  location: string
  date: string
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  body: string
  product: string
  productHref: string
  category: Category
  verified: boolean
  withPhoto: boolean
  helpful: number
}

const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Amelia W.",
    initials: "AW",
    avatarTone: "from-emerald-500/30 to-emerald-300/10",
    location: "Sydney, AU",
    date: "2026-04-22",
    rating: 5,
    title: "My skin has never felt this calm",
    body:
      "Three weeks in and the redness around my cheeks is genuinely gone. The texture is silky — not greasy, not tight. It smells like a herb garden after rain. I've already repurchased and gifted one to my sister.",
    product: "Calendula Glow Serum",
    productHref: "/shop",
    category: "skin",
    verified: true,
    withPhoto: true,
    helpful: 142,
  },
  {
    id: "r2",
    name: "Daniel T.",
    initials: "DT",
    avatarTone: "from-amber-500/30 to-amber-300/10",
    location: "Melbourne, AU",
    date: "2026-04-15",
    rating: 5,
    title: "Worth every cent — finally something that actually works",
    body:
      "I've burned through every drugstore shampoo for years. Two bars in and my scalp stopped itching. Hair feels weightier and the bar lasts about three months of daily use. Absurd value.",
    product: "Rosemary Shampoo Bar",
    productHref: "/shop",
    category: "hair",
    verified: true,
    withPhoto: false,
    helpful: 98,
  },
  {
    id: "r3",
    name: "Priya S.",
    initials: "PS",
    avatarTone: "from-rose-500/30 to-rose-300/10",
    location: "Brisbane, AU",
    date: "2026-04-09",
    rating: 4,
    title: "Beautiful, gentle — the scent fades quickly though",
    body:
      "The cleanser leaves my skin genuinely soft and the formula feels luxurious. Only honest gripe is the lavender note disappears within an hour. Otherwise: a daily staple.",
    product: "Honey Oat Cleansing Bar",
    productHref: "/shop",
    category: "skin",
    verified: true,
    withPhoto: true,
    helpful: 64,
  },
  {
    id: "r4",
    name: "Marcus L.",
    initials: "ML",
    avatarTone: "from-sky-500/30 to-sky-300/10",
    location: "Perth, AU",
    date: "2026-03-28",
    rating: 5,
    title: "First body wash I've stuck with all year",
    body:
      "I have eczema on my arms — most washes flare it within days. This one didn't. Scent is grown-up and herbal, lather is rich without being squeaky. Will keep buying.",
    product: "Eucalyptus Body Wash",
    productHref: "/shop",
    category: "body",
    verified: true,
    withPhoto: false,
    helpful: 87,
  },
  {
    id: "r5",
    name: "Sofia R.",
    initials: "SR",
    avatarTone: "from-fuchsia-500/30 to-fuchsia-300/10",
    location: "Adelaide, AU",
    date: "2026-03-14",
    rating: 5,
    title: "The packaging alone is worth it — but the formula delivers",
    body:
      "Bought it as a gift, ended up keeping it. The ritual of warming the balm feels intentional. My partner stole it within a week and now we're on our second jar.",
    product: "Botanical Repair Balm",
    productHref: "/shop",
    category: "skin",
    verified: true,
    withPhoto: true,
    helpful: 121,
  },
  {
    id: "r6",
    name: "Ben K.",
    initials: "BK",
    avatarTone: "from-teal-500/30 to-teal-300/10",
    location: "Hobart, AU",
    date: "2026-03-02",
    rating: 4,
    title: "Solid — wish the bar was 20% larger",
    body:
      "Lathers brilliantly, no buildup, no fragrance fatigue. My only note is for a $14 bar I'd love a touch more weight. Otherwise nothing else in my shower compares.",
    product: "Rosemary Shampoo Bar",
    productHref: "/shop",
    category: "hair",
    verified: true,
    withPhoto: false,
    helpful: 41,
  },
  {
    id: "r7",
    name: "Yuki H.",
    initials: "YH",
    avatarTone: "from-indigo-500/30 to-indigo-300/10",
    location: "Auckland, NZ",
    date: "2026-02-19",
    rating: 5,
    title: "My dermatologist asked what I switched to",
    body:
      "I've been managing rosacea for years. Switched my evening routine to the serum + balm and within a month my appointments became less about flares and more about maintenance. Genuinely emotional about this.",
    product: "Calendula Glow Serum",
    productHref: "/shop",
    category: "skin",
    verified: true,
    withPhoto: true,
    helpful: 203,
  },
  {
    id: "r8",
    name: "Olivia P.",
    initials: "OP",
    avatarTone: "from-lime-500/30 to-lime-300/10",
    location: "Canberra, AU",
    date: "2026-02-05",
    rating: 5,
    title: "Soft skin, no plastic guilt",
    body:
      "The recyclable wrap and the fact that it actually composts could feel like a marketing line — but it really does. Skin feels conditioned in a way bottle washes never gave me.",
    product: "Eucalyptus Body Wash",
    productHref: "/shop",
    category: "body",
    verified: true,
    withPhoto: false,
    helpful: 58,
  },
  {
    id: "r9",
    name: "Henry C.",
    initials: "HC",
    avatarTone: "from-orange-500/30 to-orange-300/10",
    location: "Gold Coast, AU",
    date: "2026-01-21",
    rating: 3,
    title: "Lovely texture, scent isn't for me",
    body:
      "Performance is genuinely great — my hair has more body and the rinse is fast. The clove-forward fragrance lingers on my pillow more than I'd like. If you love deep herbal notes you'll adore this.",
    product: "Rosemary Shampoo Bar",
    productHref: "/shop",
    category: "hair",
    verified: true,
    withPhoto: false,
    helpful: 27,
  },
]

/* ---------------------------------------------------------------- */
/*  Aggregate stats                                                  */
/* ---------------------------------------------------------------- */

const TOTAL_REVIEWS = 2184
const AVG_RATING = 4.9
const RECOMMEND_PCT = 96
const REPURCHASE_PCT = 89

const DISTRIBUTION = [
  { stars: 5, count: 1872, pct: 86 },
  { stars: 4, count: 218, pct: 10 },
  { stars: 3, count: 56, pct: 3 },
  { stars: 2, count: 22, pct: 1 },
  { stars: 1, count: 16, pct: 0.8 },
]

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: "Verified Purchases",
    body: "Every review is tied to a real Melano order — no anonymous boosts.",
  },
  {
    icon: Leaf,
    title: "Independently Tested",
    body: "Formulas dermatologically reviewed at TGA-listed Australian labs.",
  },
  {
    icon: MapPin,
    title: "Made in Australia",
    body: "Crafted in small batches in Melbourne, packaged plastic-free.",
  },
  {
    icon: Sparkles,
    title: "Cruelty-Free",
    body: "Tested on humans first. Never on animals — full stop.",
  },
]

const PRESS_QUOTES = [
  {
    publication: "Vogue Australia",
    body: "An understated cult favourite — proof that small-batch can outperform the big names.",
  },
  {
    publication: "Gritty Pretty",
    body: "Melano's serum is the rare formula that earns its hype, then quietly exceeds it.",
  },
  {
    publication: "Harper's Bazaar",
    body: "A masterclass in restraint. Every product on the shelf has earned its place there.",
  },
]

const FILTERS: Array<{ key: "all" | Category | "photos"; label: string }> = [
  { key: "all", label: "All reviews" },
  { key: "skin", label: "Skin" },
  { key: "hair", label: "Hair" },
  { key: "body", label: "Body" },
  { key: "photos", label: "With photos" },
]

const SORTS = [
  { key: "recent", label: "Most recent" },
  { key: "highest", label: "Highest rated" },
  { key: "helpful", label: "Most helpful" },
] as const

type SortKey = (typeof SORTS)[number]["key"]

/* ---------------------------------------------------------------- */
/*  Building blocks                                                  */
/* ---------------------------------------------------------------- */

function StarRow({
  value,
  size = 14,
  className,
}: {
  value: number
  size?: number
  className?: string
}) {
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={
            i < Math.round(value)
              ? "text-brand fill-brand"
              : "text-white/40 fill-transparent"
          }
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 px-5 py-4">
      <div className="text-2xl md:text-3xl font-semibold text-white tabular-nums">
        {value}
      </div>
      <div className="mt-1 text-[11px] tracking-[0.22em] uppercase text-white/60">
        {label}
      </div>
    </div>
  )
}

function Avatar({
  initials,
  tone,
}: {
  initials: string
  tone: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full",
        "bg-gradient-to-br ring-1 ring-white/15 text-white text-sm font-semibold",
        tone
      )}
    >
      {initials}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/* ---------------------------------------------------------------- */
/*  Sections                                                         */
/* ---------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative px-6 pt-40 md:pt-48 pb-20 text-center">
      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.span
          {...fadeUp(0)}
          className="inline-block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70"
        >
          Customer voices
        </motion.span>

        <motion.h1
          {...fadeUp(0.1)}
          className="mt-5 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
        >
          Loved by skin, <br className="hidden md:block" />
          hair &amp; honest reviewers.
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-base md:text-lg text-white/80 max-w-xl mx-auto leading-relaxed"
        >
          Trusted by {TOTAL_REVIEWS.toLocaleString()} verified rituals — every
          formula reviewed by the hands that hold it. No gifted PR, no paid
          placements.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 px-5 py-2.5"
        >
          <span className="text-3xl md:text-4xl font-semibold text-white tabular-nums leading-none">
            {AVG_RATING.toFixed(1)}
          </span>
          <StarRow value={AVG_RATING} size={16} />
          <span className="text-sm text-white/65">
            {TOTAL_REVIEWS.toLocaleString()} verified reviews
          </span>
        </motion.div>

        <motion.div
          {...fadeUp(0.4)}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-left"
        >
          <StatPill label="Avg rating" value={`${AVG_RATING}/5`} />
          <StatPill label="Would recommend" value={`${RECOMMEND_PCT}%`} />
          <StatPill label="Repurchase rate" value={`${REPURCHASE_PCT}%`} />
          <StatPill label="Verified" value="100%" />
        </motion.div>
      </div>
    </section>
  )
}

function DistributionAndTrust() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* Distribution */}
        <motion.div
          {...fadeUp(0)}
          className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-7 md:p-9"
        >
          <span className="block text-[11px] tracking-[0.32em] uppercase text-white/60">
            Rating breakdown
          </span>
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-white tracking-tight">
            How {TOTAL_REVIEWS.toLocaleString()} customers rated us
          </h2>

          <ul className="mt-7 space-y-3.5">
            {DISTRIBUTION.map((d, i) => (
              <li key={d.stars} className="flex items-center gap-4">
                <span className="w-10 text-sm tabular-nums text-white/85 flex items-center gap-1">
                  {d.stars}
                  <Star className="h-3.5 w-3.5 fill-brand text-brand" strokeWidth={1.5} />
                </span>
                <div className="relative flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: `${d.pct}%` }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: easeBezier }}
                    className="absolute inset-y-0 left-0 rounded-full bg-brand"
                  />
                </div>
                <span className="w-14 text-right text-xs tabular-nums text-white/60">
                  {d.count.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Trust badges */}
        <motion.div {...fadeUp(0.1)}>
          <span className="block text-[11px] tracking-[0.32em] uppercase text-white/60">
            Why these reviews matter
          </span>
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Real ratings from real rituals.
          </h2>

          <ul className="mt-7 grid sm:grid-cols-2 gap-4">
            {TRUST_BADGES.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-5 hover:bg-white/[0.07] hover:border-white/15 transition-colors"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{body}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

function ReviewsList() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all")
  const [minStars, setMinStars] = useState<number>(0)
  const [sort, setSort] = useState<SortKey>("recent")
  const [visible, setVisible] = useState(6)

  const filtered = useMemo(() => {
    let list = [...REVIEWS]
    if (filter === "photos") list = list.filter((r) => r.withPhoto)
    else if (filter !== "all") list = list.filter((r) => r.category === filter)
    if (minStars > 0) list = list.filter((r) => r.rating >= minStars)

    if (sort === "highest") list.sort((a, b) => b.rating - a.rating)
    else if (sort === "helpful") list.sort((a, b) => b.helpful - a.helpful)
    else list.sort((a, b) => +new Date(b.date) - +new Date(a.date))
    return list
  }, [filter, minStars, sort])

  const shown = filtered.slice(0, visible)
  const canLoadMore = visible < filtered.length

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            What people say
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white">
            Read every word.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-white/75">
            Filter by category, sort however you like — we publish the
            three-stars too.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          {...fadeUp(0.1)}
          className="mt-10 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-4 md:p-5"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Filter className="h-4 w-4 text-white/55 shrink-0" strokeWidth={1.8} />
              {FILTERS.map((f) => {
                const active = filter === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => {
                      setFilter(f.key)
                      setVisible(6)
                    }}
                    className={cn(
                      "shrink-0 rounded-full px-4 h-9 text-xs tracking-[0.12em] uppercase transition-colors border",
                      active
                        ? "bg-brand text-black border-brand"
                        : "bg-white/[0.04] text-white/80 border-white/10 hover:bg-white/[0.08] hover:border-white/20"
                    )}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>

            {/* Sort + star filter */}
            <div className="flex items-center gap-3 md:ml-4 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5">
                {[0, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setMinStars(s)
                      setVisible(6)
                    }}
                    aria-pressed={minStars === s}
                    className={cn(
                      "rounded-full px-3 h-9 text-xs tabular-nums transition-colors border inline-flex items-center gap-1",
                      minStars === s
                        ? "bg-white/15 text-white border-white/30"
                        : "bg-white/[0.04] text-white/70 border-white/10 hover:bg-white/[0.08]"
                    )}
                  >
                    {s === 0 ? "All ★" : `${s}★+`}
                  </button>
                ))}
              </div>
              <label className="relative">
                <span className="sr-only">Sort reviews</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="
                    appearance-none rounded-full h-9 pl-4 pr-9 text-xs tracking-[0.12em] uppercase
                    bg-white/[0.06] border border-white/15 text-white/85
                    hover:bg-white/[0.1] hover:border-white/25 focus:outline-none focus:border-brand transition-colors
                  "
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key} className="bg-[#0B0B0B]">
                      {s.label}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/55"
                >
                  ▾
                </span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        {shown.length === 0 ? (
          <motion.p
            {...fadeUp(0.1)}
            className="mt-14 text-center text-white/65"
          >
            No reviews match those filters yet — try widening your search.
          </motion.p>
        ) : (
          <ul className="mt-10 grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((r, i) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: (i % 6) * 0.06,
                  ease: easeBezier,
                }}
                className="
                  flex flex-col rounded-2xl
                  bg-white/[0.05] backdrop-blur-md border border-white/10
                  p-6
                  hover:bg-white/[0.08] hover:border-white/15
                  transition-colors
                "
              >
                <div className="flex items-center gap-3">
                  <Avatar initials={r.initials} tone={r.avatarTone} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white">
                        {r.name}
                      </p>
                      {r.verified && (
                        <span
                          title="Verified purchase"
                          className="inline-flex items-center gap-1 rounded-full bg-brand/15 text-brand ring-1 ring-brand/30 px-2 py-0.5 text-[10px] tracking-[0.14em] uppercase"
                        >
                          <ShieldCheck className="h-3 w-3" strokeWidth={2} />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/55">
                      {r.location} · {formatDate(r.date)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <StarRow value={r.rating} />
                  <span className="text-[11px] tracking-[0.18em] uppercase text-white/55">
                    {r.category}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-white leading-snug">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">
                  {r.body}
                </p>

                {r.withPhoto && (
                  <div
                    aria-hidden
                    className="mt-4 grid grid-cols-3 gap-2"
                  >
                    {[0, 1, 2].map((k) => (
                      <span
                        key={k}
                        className={cn(
                          "aspect-square rounded-lg ring-1 ring-white/10 bg-gradient-to-br",
                          r.avatarTone
                        )}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <Link
                    href={r.productHref}
                    className="text-xs text-white/65 hover:text-brand transition-colors truncate"
                  >
                    on <span className="text-white/85">{r.product}</span>
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 px-3 h-8 text-[11px] tracking-[0.14em] uppercase text-white/75 transition-colors"
                  >
                    <ThumbsUp className="h-3 w-3" strokeWidth={2} />
                    Helpful · {r.helpful}
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}

        {canLoadMore && (
          <div className="mt-12 text-center">
            <Button
              type="button"
              onClick={() => setVisible((v) => v + 6)}
              className="rounded-full h-12 px-7 bg-white/[0.06] border border-white/15 text-white hover:bg-white/[0.1] hover:border-white/25 transition-colors"
            >
              Load more reviews
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

function PressStrip() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-2xl">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Featured in
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            The press has noticed too.
          </h2>
        </motion.div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {PRESS_QUOTES.map((q, i) => (
            <motion.li
              key={q.publication}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: easeBezier }}
              className="
                relative rounded-2xl p-7 md:p-8
                bg-white/[0.05] backdrop-blur-md border border-white/10
              "
            >
              <Quote className="h-6 w-6 text-brand" strokeWidth={1.5} />
              <p className="mt-4 text-base md:text-lg text-white/85 leading-relaxed">
                &ldquo;{q.body}&rdquo;
              </p>
              <p className="mt-6 text-[11px] tracking-[0.28em] uppercase text-white/55">
                — {q.publication}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function WriteReview() {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const display = hoverRating || rating

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Share your ritual
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Write a review.
          </h2>
          <p className="mt-4 text-sm md:text-base text-white/75">
            Honest feedback helps other people choose well — and helps us make
            better products.
          </p>
        </motion.div>

        <motion.form
          {...fadeUp(0.1)}
          onSubmit={handleSubmit}
          className="
            mt-10 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10
            p-6 md:p-8
          "
        >
          {submitted ? (
            <div className="text-center py-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
                <Sparkles className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">
                Thank you — your review is in the queue.
              </h3>
              <p className="mt-3 text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                We hand-verify every submission within 48 hours. You&rsquo;ll get
                an email the moment it&rsquo;s live.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Your name">
                  <input
                    required
                    type="text"
                    placeholder="e.g. Amelia W."
                    className={inputClass}
                  />
                </Field>
                <Field label="Email (kept private)">
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Product reviewed" className="md:col-span-2">
                  <select required defaultValue="" className={inputClass}>
                    <option value="" disabled className="bg-[#0B0B0B]">
                      Choose a product…
                    </option>
                    <option className="bg-[#0B0B0B]">Calendula Glow Serum</option>
                    <option className="bg-[#0B0B0B]">Rosemary Shampoo Bar</option>
                    <option className="bg-[#0B0B0B]">Honey Oat Cleansing Bar</option>
                    <option className="bg-[#0B0B0B]">Eucalyptus Body Wash</option>
                    <option className="bg-[#0B0B0B]">Botanical Repair Balm</option>
                  </select>
                </Field>

                <Field label="Your rating" className="md:col-span-2">
                  <div
                    className="flex items-center gap-1"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onMouseEnter={() => setHoverRating(n)}
                        onClick={() => setRating(n)}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        className="p-1 -m-1"
                      >
                        <Star
                          className={cn(
                            "h-7 w-7 transition-colors",
                            n <= display
                              ? "text-brand fill-brand"
                              : "text-white/40 fill-transparent hover:text-white/70"
                          )}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm text-white/65 tabular-nums">
                      {display}/5
                    </span>
                  </div>
                </Field>

                <Field label="Headline" className="md:col-span-2">
                  <input
                    required
                    type="text"
                    placeholder="A short, honest summary"
                    className={inputClass}
                  />
                </Field>

                <Field label="Your review" className="md:col-span-2">
                  <textarea
                    required
                    rows={5}
                    placeholder="What did you love? What would you change? How did it feel after a week?"
                    className={cn(inputClass, "resize-y min-h-[140px] py-3 leading-relaxed")}
                  />
                </Field>

                <Field label="Add photos (optional)" className="md:col-span-2">
                  <label
                    className="
                      flex items-center justify-center gap-2 rounded-xl
                      bg-white/[0.04] border border-dashed border-white/15
                      hover:bg-white/[0.08] hover:border-white/25
                      transition-colors cursor-pointer h-24
                      text-sm text-white/65
                    "
                  >
                    <ImagePlus className="h-4 w-4" strokeWidth={1.8} />
                    Drag & drop or click to upload — up to 4 photos
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                    />
                  </label>
                </Field>
              </div>

              <div className="mt-7 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-[11px] text-white/45 leading-relaxed sm:max-w-sm">
                  By submitting you agree to our{" "}
                  <Link href="/terms" className="underline underline-offset-2 hover:text-white/70">
                    Terms
                  </Link>{" "}
                  &{" "}
                  <Link href="/privacy" className="underline underline-offset-2 hover:text-white/70">
                    Privacy Policy
                  </Link>
                  .
                </p>
                <div className="inline-block border border-white/80 p-1 md:p-1.5 self-start sm:self-auto">
                  <Button
                    type="submit"
                    className="
                      group rounded-full bg-brand text-white
                      font-semibold text-sm md:text-base
                      px-7 md:px-8 py-3 md:py-3.5
                      hover:bg-brand/90 transition-all
                    "
                  >
                    Submit review
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </motion.form>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="relative min-h-[60svh] flex items-center px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.span {...fadeUp(0)} className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
          Begin
        </motion.span>
        <motion.h2
          {...fadeUp(0.1)}
          className="mt-5 text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05]"
        >
          Your story belongs here.
        </motion.h2>
        <motion.p {...fadeUp(0.2)} className="mt-6 text-base md:text-lg text-white/80">
          Try the formula they&rsquo;re writing about — start your own ritual today.
        </motion.p>
        <motion.div {...fadeUp(0.3)} className="mt-10">
          <div className="inline-block border border-white/80 p-1 md:p-1.5">
            <Button
              asChild
              className="
                group rounded-full bg-brand text-white
                font-semibold text-base
                px-7 md:px-8 py-3 md:py-3.5
                transition-all
              "
            >
              <Link href="/shop">
                Shop the collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Form helpers                                                     */
/* ---------------------------------------------------------------- */

const inputClass =
  "w-full h-12 rounded-xl bg-white/[0.06] border border-white/15 px-4 text-sm text-white placeholder:text-white/45 outline-none focus:bg-white/10 focus:border-white/30 transition-colors appearance-none"

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-[11px] tracking-[0.28em] uppercase text-white/60 mb-2">
        {label}
      </span>
      {children}
    </label>
  )
}

/* ---------------------------------------------------------------- */
/*  Page composition                                                 */
/* ---------------------------------------------------------------- */

export default function ReviewsContent() {
  return (
    <>
      <Hero />
      <DistributionAndTrust />
      <ReviewsList />
      <PressStrip />
      <WriteReview />
      <ClosingCta />
    </>
  )
}
