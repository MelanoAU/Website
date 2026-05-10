"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { motion, cubicBezier } from "framer-motion"
import {
  Star,
  ShieldCheck,
  Leaf,
  MapPin,
  Sparkles,
  ThumbsUp,
  ArrowRight,
  Quote,
  Filter,
  Loader2,
  AlertCircle,
  LogIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getSupabase } from "@/lib/supabase/client"
import {
  computeStats,
  fetchUserHelpfulVotes,
  submitReview,
  toggleReviewHelpful,
  type Review,
  type ReviewCategory,
  type ReviewStats,
} from "@/lib/reviews"
import type { NewProduct } from "@/lib/products"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, delay, ease: easeBezier },
})

/* ---------------------------------------------------------------- */
/*  Static brand content (not user data)                             */
/* ---------------------------------------------------------------- */

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: "Verified Purchases",
    body: "Reviews are tied to a real Melano account — every entry comes from a signed-in customer.",
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

const FILTERS: Array<{ key: "all" | ReviewCategory | "photos"; label: string }> = [
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

function Avatar({ initials, tone }: { initials: string; tone: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full",
        "bg-gradient-to-br ring-1 ring-white/15 text-white text-sm font-semibold",
        tone,
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
/*  Section: Hero (uses live stats)                                  */
/* ---------------------------------------------------------------- */

function Hero({ stats }: { stats: ReviewStats }) {
  const empty = stats.total === 0
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
          {empty ? (
            <>
              Be the first to leave a review — every formula is hand-poured in
              Melbourne, every entry is read by a real person.
            </>
          ) : (
            <>
              {stats.total.toLocaleString()} verified rituals reviewed by the
              hands that hold them. No gifted PR, no paid placements.
            </>
          )}
        </motion.p>

        {!empty && (
          <motion.div
            {...fadeUp(0.3)}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 px-5 py-2.5"
          >
            <span className="text-3xl md:text-4xl font-semibold text-white tabular-nums leading-none">
              {stats.avg.toFixed(1)}
            </span>
            <StarRow value={stats.avg} size={16} />
            <span className="text-sm text-white/65">
              {stats.total.toLocaleString()} verified reviews
            </span>
          </motion.div>
        )}

        <motion.div
          {...fadeUp(0.4)}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-left"
        >
          <StatPill
            label="Avg rating"
            value={empty ? "—" : `${stats.avg}/5`}
          />
          <StatPill
            label="Would recommend"
            value={empty ? "—" : `${stats.recommendPct}%`}
          />
          <StatPill
            label="Verified purchase"
            value={empty ? "—" : `${stats.repurchasePct}%`}
          />
          <StatPill label="Real customers" value="100%" />
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Section: Distribution + trust badges                             */
/* ---------------------------------------------------------------- */

function DistributionAndTrust({ stats }: { stats: ReviewStats }) {
  const empty = stats.total === 0
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2 lg:items-start">
        <motion.div
          {...fadeUp(0)}
          className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-7 md:p-9"
        >
          <span className="block text-[11px] tracking-[0.32em] uppercase text-white/60">
            Rating breakdown
          </span>
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-white tracking-tight">
            {empty
              ? "No ratings yet — be the first."
              : `How ${stats.total.toLocaleString()} customer${stats.total === 1 ? "" : "s"} rated us`}
          </h2>

          <ul className="mt-7 space-y-3.5">
            {stats.distribution.map((d, i) => (
              <li key={d.stars} className="flex items-center gap-4">
                <span className="w-10 text-sm tabular-nums text-white/85 flex items-center gap-1">
                  {d.stars}
                  <Star
                    className="h-3.5 w-3.5 fill-brand text-brand"
                    strokeWidth={1.5}
                  />
                </span>
                <div className="relative flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: `${d.pct}%` }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.1 + i * 0.08,
                      ease: easeBezier,
                    }}
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
                <h3 className="mt-4 text-base font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Section: ReviewsList (live)                                      */
/* ---------------------------------------------------------------- */

function ReviewsList({
  reviews,
  helpfulVotes,
  user,
  onToggleHelpful,
}: {
  reviews: Review[]
  helpfulVotes: Set<string>
  user: User | null
  onToggleHelpful: (id: string) => void
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all")
  const [minStars, setMinStars] = useState<number>(0)
  const [sort, setSort] = useState<SortKey>("recent")
  const [visible, setVisible] = useState(6)

  const filtered = useMemo(() => {
    let list = [...reviews]
    if (filter === "photos") list = list.filter((r) => r.withPhoto)
    else if (filter !== "all") list = list.filter((r) => r.category === filter)
    if (minStars > 0) list = list.filter((r) => r.rating >= minStars)

    if (sort === "highest") list.sort((a, b) => b.rating - a.rating)
    else if (sort === "helpful")
      list.sort((a, b) => b.helpfulCount - a.helpfulCount)
    else list.sort((a, b) => +new Date(b.date) - +new Date(a.date))
    return list
  }, [reviews, filter, minStars, sort])

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
            <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Filter
                className="h-4 w-4 text-white/55 shrink-0"
                strokeWidth={1.8}
              />
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
                        ? "bg-brand/20 border-brand/50 text-brand"
                        : "bg-white/[0.04] text-white/80 border-white/10 hover:bg-white/[0.08] hover:border-white/20",
                    )}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>

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
                        : "bg-white/[0.04] text-white/70 border-white/10 hover:bg-white/[0.08]",
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
                    <option key={s.key} value={s.key}>
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
          <motion.div {...fadeUp(0.1)} className="mt-14 text-center">
            <p className="text-white/65">
              {reviews.length === 0
                ? "No reviews yet — yours could be the first."
                : "No reviews match those filters yet — try widening your search."}
            </p>
          </motion.div>
        ) : (
          <ul className="mt-10 grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((r, i) => {
              const voted = helpfulVotes.has(r.id)
              return (
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
                          {r.authorName}
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
                        {r.location ? `${r.location} · ` : ""}
                        {formatDate(r.date)}
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

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <Link
                      href={`/product/${r.productId}`}
                      className="text-xs text-white/65 hover:text-brand transition-colors truncate"
                    >
                      on{" "}
                      <span className="text-white/85">{r.productTitle}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => onToggleHelpful(r.id)}
                      disabled={!user}
                      title={user ? undefined : "Sign in to vote"}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-[11px] tracking-[0.14em] uppercase transition-colors border",
                        voted
                          ? "bg-brand/20 border-brand/50 text-brand"
                          : "bg-white/[0.05] hover:bg-white/[0.1] border-white/10 hover:border-white/20 text-white/75",
                        !user &&
                          "opacity-60 cursor-not-allowed hover:bg-white/[0.05] hover:border-white/10",
                      )}
                    >
                      <ThumbsUp className="h-3 w-3" strokeWidth={2} />
                      Helpful · {r.helpfulCount}
                    </button>
                  </div>
                </motion.li>
              )
            })}
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

/* ---------------------------------------------------------------- */
/*  Section: PressStrip (static)                                     */
/* ---------------------------------------------------------------- */

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

/* ---------------------------------------------------------------- */
/*  Section: WriteReview (live submit)                               */
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

function defaultNameFromUser(u: User | null): string {
  if (!u?.email) return ""
  return u.email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (m: string) => m.toUpperCase())
}

function WriteReview({
  user,
  userChecked,
  products,
  onPublished,
}: {
  user: User | null
  userChecked: boolean
  products: NewProduct[]
  onPublished: (review: Review) => void
}) {
  const [productId, setProductId] = useState("")
  const [category, setCategory] = useState<ReviewCategory>("skin")
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [authorName, setAuthorName] = useState("")
  const [location, setLocation] = useState("")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const display = hoverRating || rating

  // Pre-fill name from email when user signs in
  useEffect(() => {
    if (user && !authorName) setAuthorName(defaultNameFromUser(user))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    setError(null)
    try {
      const { id } = await submitReview({
        productId,
        category,
        rating,
        title: title.trim(),
        body: body.trim(),
        authorName: authorName.trim() || defaultNameFromUser(user),
        location: location.trim() || null,
      })
      // Optimistic add — the new review will also show up server-side
      // on the next ISR revalidation.
      const productTitle =
        products.find((p) => p.id === productId)?.title ?? "Melano product"
      onPublished({
        id,
        authorName: authorName.trim() || defaultNameFromUser(user),
        initials: (authorName.trim() || defaultNameFromUser(user))
          .split(/\s+/)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase() ?? "")
          .join("") || "?",
        avatarTone: "from-emerald-500/30 to-emerald-300/10",
        location: location.trim() || null,
        date: new Date().toISOString(),
        rating,
        title: title.trim(),
        body: body.trim(),
        productId,
        productTitle,
        category,
        verified: false, // server may upgrade this on next refresh
        withPhoto: false,
        helpfulCount: 0,
      })
      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't submit your review. Please try again.",
      )
    } finally {
      setSubmitting(false)
    }
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

        {/* Auth gate */}
        {userChecked && !user ? (
          <motion.div
            {...fadeUp(0.1)}
            className="mt-10 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-8 md:p-10 text-center"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
              <LogIn className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <h3 className="mt-5 text-xl md:text-2xl font-semibold text-white">
              Sign in to write a review
            </h3>
            <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed max-w-md mx-auto">
              Reviews are tied to a real Melano account so other shoppers can
              trust what they&rsquo;re reading. Free to create, takes about a
              minute.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="inline-block border border-white/80 p-1 md:p-1.5">
                <Button
                  asChild
                  className="
                    group rounded-full bg-brand text-white
                    font-semibold text-sm md:text-base
                    px-7 md:px-8 py-3 md:py-3.5
                    hover:bg-brand/90 transition-all
                  "
                >
                  <Link href="/login?next=/reviews">
                    Sign in
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
              <Link
                href="/signup?next=/reviews"
                className="text-sm text-white/80 hover:text-brand transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-brand"
              >
                Create an account
              </Link>
            </div>
          </motion.div>
        ) : (
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
                  Thank you — your review is live.
                </h3>
                <p className="mt-3 text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                  It&rsquo;s already showing in the list above. Honest feedback
                  helps us make better products.
                </p>
              </div>
            ) : (
              <>
                {!userChecked && (
                  <div className="mb-5 flex items-center gap-2 text-sm text-white/65">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking your sign-in…
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Display name">
                    <input
                      required
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Amelia W."
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Location (optional)">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Sydney, AU"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Product reviewed" className="md:col-span-2">
                    <select
                      required
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      className={inputClass}
                    >
                      <option value="" disabled>
                        Choose a product…
                      </option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Category" className="md:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {(["skin", "hair", "body"] as ReviewCategory[]).map(
                        (c) => {
                          const active = category === c
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setCategory(c)}
                              className={cn(
                                "rounded-full px-4 h-10 text-xs tracking-[0.14em] uppercase border transition-colors",
                                active
                                  ? "bg-brand/20 border-brand/50 text-brand"
                                  : "bg-white/[0.04] border-white/10 text-white/80 hover:bg-white/[0.08] hover:border-white/20",
                              )}
                            >
                              {c}
                            </button>
                          )
                        },
                      )}
                    </div>
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
                          onClick={() => setRating(n as 1 | 2 | 3 | 4 | 5)}
                          aria-label={`${n} star${n > 1 ? "s" : ""}`}
                          className="p-1 -m-1"
                        >
                          <Star
                            className={cn(
                              "h-7 w-7 transition-colors",
                              n <= display
                                ? "text-brand fill-brand"
                                : "text-white/40 fill-transparent hover:text-white/70",
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
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={120}
                      placeholder="A short, honest summary"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Your review" className="md:col-span-2">
                    <textarea
                      required
                      rows={5}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      maxLength={4000}
                      placeholder="What did you love? What would you change? How did it feel after a week?"
                      className={cn(
                        inputClass,
                        "resize-y min-h-[140px] py-3 leading-relaxed",
                      )}
                    />
                  </Field>
                </div>

                {error && (
                  <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <div className="mt-7 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-[11px] text-white/45 leading-relaxed sm:max-w-sm">
                    By submitting you agree to our{" "}
                    <Link
                      href="/terms"
                      className="underline underline-offset-2 hover:text-white/70"
                    >
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link
                      href="/privacy"
                      className="underline underline-offset-2 hover:text-white/70"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                  <div className="inline-block border border-white/80 p-1 md:p-1.5 self-start sm:self-auto">
                    <Button
                      type="submit"
                      disabled={submitting || !productId}
                      className="
                        group rounded-full bg-brand text-white
                        font-semibold text-sm md:text-base
                        px-7 md:px-8 py-3 md:py-3.5
                        hover:bg-brand/90 transition-all
                        disabled:opacity-70
                      "
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          Submit review
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.form>
        )}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/*  Section: ClosingCta (static)                                     */
/* ---------------------------------------------------------------- */

function ClosingCta() {
  return (
    <section className="relative min-h-[60svh] flex items-center px-6 py-24">
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
          Your story belongs here.
        </motion.h2>
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-base md:text-lg text-white/80"
        >
          Try the formula they&rsquo;re writing about — start your own ritual
          today.
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
/*  Page composition (state lives here)                              */
/* ---------------------------------------------------------------- */

type Props = {
  initialReviews: Review[]
  initialStats: ReviewStats
  products: NewProduct[]
}

export default function ReviewsContent({
  initialReviews,
  initialStats,
  products,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [stats, setStats] = useState<ReviewStats>(initialStats)
  const [user, setUser] = useState<User | null>(null)
  const [userChecked, setUserChecked] = useState(false)
  const [helpfulVotes, setHelpfulVotes] = useState<Set<string>>(new Set())

  // Keep stats in sync when the reviews list changes (e.g. new submission)
  useEffect(() => {
    setStats(computeStats(reviews))
  }, [reviews])

  // Detect signed-in user (via getSession — won't hang) + load helpful votes
  useEffect(() => {
    const supabase = getSupabase()
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      const u = data.session?.user ?? null
      setUser(u)
      setUserChecked(true)
      if (u) {
        const votes = await fetchUserHelpfulVotes(u.id).catch(
          () => new Set<string>(),
        )
        if (active) setHelpfulVotes(votes)
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const votes = await fetchUserHelpfulVotes(u.id).catch(
          () => new Set<string>(),
        )
        setHelpfulVotes(votes)
      } else {
        setHelpfulVotes(new Set())
      }
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  /** Optimistic toggle of a helpful vote. Reverts on RPC failure. */
  const handleToggleHelpful = async (reviewId: string) => {
    if (!user) return
    const wasVoted = helpfulVotes.has(reviewId)

    setHelpfulVotes((prev) => {
      const next = new Set(prev)
      if (wasVoted) next.delete(reviewId)
      else next.add(reviewId)
      return next
    })
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              helpfulCount: Math.max(
                0,
                r.helpfulCount + (wasVoted ? -1 : 1),
              ),
            }
          : r,
      ),
    )

    try {
      await toggleReviewHelpful(reviewId)
    } catch {
      // revert
      setHelpfulVotes((prev) => {
        const next = new Set(prev)
        if (wasVoted) next.add(reviewId)
        else next.delete(reviewId)
        return next
      })
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                helpfulCount: Math.max(
                  0,
                  r.helpfulCount + (wasVoted ? 1 : -1),
                ),
              }
            : r,
        ),
      )
    }
  }

  /** Prepend a freshly-published review to the top of the list. */
  const handlePublished = (review: Review) => {
    setReviews((prev) => [review, ...prev])
  }

  return (
    <>
      <Hero stats={stats} />
      <DistributionAndTrust stats={stats} />
      <ReviewsList
        reviews={reviews}
        helpfulVotes={helpfulVotes}
        user={user}
        onToggleHelpful={handleToggleHelpful}
      />
      <PressStrip />
      <WriteReview
        user={user}
        userChecked={userChecked}
        products={products}
        onPublished={handlePublished}
      />
      <ClosingCta />
    </>
  )
}
