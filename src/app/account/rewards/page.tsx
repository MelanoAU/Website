"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, cubicBezier } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  Crown,
  Flower,
  Leaf,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getSupabase } from "@/lib/supabase/client"
import {
  fetchAccountSummary,
  fetchPointsLedger,
  prettyPointsReason,
  type AccountSummary,
  type AccountTier,
  type PointsLedgerRow,
} from "@/lib/account"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const TIERS: Array<{
  key: AccountTier
  label: string
  threshold: number
  Icon: typeof Leaf
}> = [
  { key: "petal", label: "Petal", threshold: 0, Icon: Leaf },
  { key: "bloom", label: "Bloom", threshold: 500, Icon: Flower },
  { key: "bouquet", label: "Bouquet", threshold: 2000, Icon: Crown },
]

function nextTierProgress(points: number) {
  const sorted = [...TIERS].sort((a, b) => a.threshold - b.threshold)
  let current = sorted[0]
  let next: typeof sorted[number] | null = null
  for (const t of sorted) {
    if (points >= t.threshold) current = t
  }
  next = sorted.find((t) => t.threshold > points) ?? null
  if (!next) {
    return { current, next: null, pct: 100, remaining: 0 }
  }
  const span = next.threshold - current.threshold
  const into = points - current.threshold
  const pct = Math.max(0, Math.min(100, (into / span) * 100))
  return { current, next, pct, remaining: next.threshold - points }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function AccountRewardsPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [summary, setSummary] = useState<AccountSummary | null>(null)
  const [ledger, setLedger] = useState<PointsLedgerRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabase()
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      if (!data.session?.user) {
        router.replace("/login?next=/account/rewards")
        return
      }
      setAuthChecked(true)
      try {
        const [s, l] = await Promise.all([
          fetchAccountSummary(),
          fetchPointsLedger(),
        ])
        if (!active) return
        setSummary(s)
        setLedger(l)
      } catch (err) {
        if (active)
          setError(
            err instanceof Error
              ? err.message
              : "Couldn't load your rewards right now.",
          )
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace("/login?next=/account/rewards")
      },
    )

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [router])

  const points = summary?.reward_points ?? 0
  const tierProgress = nextTierProgress(points)
  const TierIcon = tierProgress.current.Icon

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative min-h-[100svh] flex flex-col">
        <div className="h-24 md:h-28" />

        <div className="flex-1 px-6 pb-24">
          <div className="mx-auto max-w-5xl">
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
                Rewards
              </span>
              <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
                Your points.
              </h1>
            </motion.div>

            {!authChecked || (summary === null && !error) ? (
              <div className="mt-10 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 px-6 py-16 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/70" />
                <p className="mt-4 text-sm text-white/70">Loading…</p>
              </div>
            ) : error ? (
              <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 flex items-start gap-3 text-red-200">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Couldn&rsquo;t load rewards</p>
                  <p className="mt-1 text-sm leading-relaxed">{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Balance + tier hero */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.05, ease: easeBezier }}
                  className="mt-10 rounded-2xl bg-gradient-to-br from-brand/15 via-white/[0.06] to-white/[0.04] backdrop-blur-md border border-brand/30 p-8 md:p-10"
                >
                  <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                      <span className="block text-[11px] tracking-[0.32em] uppercase text-white/65">
                        Current balance
                      </span>
                      <div className="mt-2 flex items-baseline gap-3">
                        <span className="text-6xl md:text-7xl font-semibold text-white tabular-nums tracking-tight">
                          {points.toLocaleString()}
                        </span>
                        <span className="text-sm text-white/65 tracking-[0.22em] uppercase">
                          points
                        </span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-2xl bg-white/[0.06] border border-white/15 px-4 py-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                        <TierIcon className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="text-[10px] tracking-[0.22em] uppercase text-white/55">
                          Tier
                        </p>
                        <p className="text-base font-semibold text-white capitalize">
                          {tierProgress.current.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress to next tier */}
                  {tierProgress.next ? (
                    <div className="mt-7">
                      <div className="flex items-baseline justify-between text-xs text-white/65">
                        <span>
                          {tierProgress.remaining.toLocaleString()} to{" "}
                          <span className="text-white capitalize">
                            {tierProgress.next.label}
                          </span>
                        </span>
                        <span className="tabular-nums">
                          {tierProgress.next.threshold.toLocaleString()} pts
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${tierProgress.pct}%` }}
                          transition={{
                            duration: 0.9,
                            delay: 0.2,
                            ease: easeBezier,
                          }}
                          className="h-full rounded-full bg-brand"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="mt-7 text-sm text-brand">
                      You&rsquo;re at the top tier — every benefit unlocked.
                    </p>
                  )}

                  <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <p className="text-sm text-white/75">
                      Earn more by shopping, reviewing, and referring friends.
                    </p>
                    <Button
                      asChild
                      className="rounded-full h-11 px-5 bg-white/[0.06] border border-white/15 text-white hover:bg-white/10 hover:border-white/30 transition-colors shrink-0"
                    >
                      <Link href="/rewards">
                        How rewards work
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>

                {/* Ledger */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: easeBezier }}
                  className="mt-8"
                >
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Activity
                  </h2>
                  <div className="mt-5 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 overflow-hidden">
                    {ledger === null ? (
                      <div className="px-6 py-10 text-center">
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-white/65" />
                      </div>
                    ) : ledger.length === 0 ? (
                      <div className="px-6 py-12 text-center text-sm text-white/65">
                        No activity yet — your welcome bonus will land here.
                      </div>
                    ) : (
                      <ul className="divide-y divide-white/10">
                        {ledger.map((row) => {
                          const positive = row.delta >= 0
                          return (
                            <li
                              key={row.id}
                              className="flex items-center justify-between gap-4 px-5 md:px-6 py-4"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span
                                  className={cn(
                                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                                    positive
                                      ? "bg-brand/15 border-brand/30 text-brand"
                                      : "bg-white/[0.04] border-white/15 text-white/65",
                                  )}
                                >
                                  {positive ? (
                                    <Plus className="h-4 w-4" strokeWidth={2.4} />
                                  ) : (
                                    <Minus className="h-4 w-4" strokeWidth={2.4} />
                                  )}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-white truncate">
                                    {prettyPointsReason(row.reason)}
                                  </p>
                                  <p className="text-[11px] tracking-[0.18em] uppercase text-white/55 tabular-nums">
                                    {formatDate(row.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p
                                  className={cn(
                                    "tabular-nums font-semibold",
                                    positive ? "text-brand" : "text-white/85",
                                  )}
                                >
                                  {positive ? "+" : ""}
                                  {row.delta.toLocaleString()} pts
                                </p>
                                <p className="text-[11px] text-white/45 tabular-nums">
                                  Bal. {row.balance_after.toLocaleString()}
                                </p>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: easeBezier }}
                  className="mt-10 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-7 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                    <Sparkles className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-white">
                      Earn faster
                    </h3>
                    <p className="mt-1 text-sm text-white/75 leading-relaxed">
                      +50 points for every review you publish, +500 for every
                      friend you refer who places their first order.
                    </p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <Button
                      asChild
                      className="rounded-full h-11 px-5 bg-white/[0.06] border border-white/15 text-white hover:bg-white/10 transition-colors"
                    >
                      <Link href="/reviews">
                        Write a review
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
