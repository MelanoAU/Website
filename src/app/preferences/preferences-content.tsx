"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, cubicBezier } from "framer-motion"
import {
  Mail,
  Sparkles,
  Bell,
  Calendar,
  Heart,
  Check,
  ArrowRight,
  ShieldCheck,
  Slash,
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

type ChannelKey = "newsletter" | "drops" | "restocks" | "events" | "foundation"

type Channel = {
  key: ChannelKey
  icon: typeof Mail
  title: string
  body: string
  defaultOn: boolean
}

const CHANNELS: Channel[] = [
  {
    key: "newsletter",
    icon: Mail,
    title: "Monthly newsletter",
    body: "One short letter a month — what we made, what we learned, what's restocking.",
    defaultOn: true,
  },
  {
    key: "drops",
    icon: Sparkles,
    title: "New product drops",
    body: "An email when a new formula joins the range. ~6 a year.",
    defaultOn: true,
  },
  {
    key: "restocks",
    icon: Bell,
    title: "Restock alerts",
    body: "Notify-me alerts on items you've subscribed to. Only when those exact items return.",
    defaultOn: true,
  },
  {
    key: "events",
    icon: Calendar,
    title: "Member events & workshops",
    body: "Invitations to in-person workshops and ingredient walks. Bloom & up.",
    defaultOn: false,
  },
  {
    key: "foundation",
    icon: Heart,
    title: "Foundation updates",
    body: "Quarterly progress reports from the conservation, apprenticeship, and education programs.",
    defaultOn: false,
  },
]

type Frequency = "weekly" | "biweekly" | "monthly" | "asitis"

const FREQS: Array<{ key: Frequency; label: string; sub: string }> = [
  { key: "weekly", label: "Weekly", sub: "All eligible categories, batched" },
  { key: "biweekly", label: "Every two weeks", sub: "A bit more breathing room" },
  { key: "monthly", label: "Monthly digest", sub: "Just the highlights" },
  { key: "asitis", label: "As it happens", sub: "Real-time per category" },
]

const TOPICS = [
  "Skincare",
  "Haircare",
  "Body",
  "Gifts & sets",
  "Sustainability",
  "Behind-the-scenes",
]

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors border",
        on
          ? "bg-brand/30 border-brand/50"
          : "bg-white/[0.06] border-white/15 hover:bg-white/[0.1]"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full transition-transform",
          on ? "translate-x-6 bg-brand" : "translate-x-1 bg-white/65"
        )}
      />
    </button>
  )
}

export default function PreferencesContent() {
  const [channels, setChannels] = useState<Record<ChannelKey, boolean>>(
    Object.fromEntries(CHANNELS.map((c) => [c.key, c.defaultOn])) as Record<
      ChannelKey,
      boolean
    >
  )
  const [frequency, setFrequency] = useState<Frequency>("monthly")
  const [topics, setTopics] = useState<string[]>(["Skincare", "Sustainability"])
  const [saved, setSaved] = useState(false)

  const enabledCount = Object.values(channels).filter(Boolean).length

  function toggleChannel(key: ChannelKey, next: boolean) {
    setChannels((prev) => ({ ...prev, [key]: next }))
    setSaved(false)
  }

  function toggleTopic(t: string) {
    setTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )
    setSaved(false)
  }

  function unsubscribeAll() {
    setChannels(
      Object.fromEntries(CHANNELS.map((c) => [c.key, false])) as Record<
        ChannelKey,
        boolean
      >
    )
    setSaved(false)
  }

  function save(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 3500)
  }

  return (
    <>
      <section className="relative px-6 pt-40 md:pt-48 pb-12 text-center">
        <div className="mx-auto max-w-3xl">
          <motion.span
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 px-4 py-1.5 text-[11px] md:text-xs tracking-[0.3em] uppercase text-white/85"
          >
            <Mail className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
            Email preferences
          </motion.span>
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-7 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
          >
            Just what you want.
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
          >
            Pick the categories you actually want to hear about, set the
            cadence, and we&rsquo;ll respect it. No re-opt-in tricks, no dark
            patterns.
          </motion.p>
        </div>
      </section>

      <form
        onSubmit={save}
        className="relative px-6 pb-20"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Channels */}
          <motion.div
            {...fadeUp(0)}
            className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-6 md:p-8"
          >
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                Categories
              </h2>
              <span className="text-xs tracking-[0.18em] uppercase text-white/55">
                {enabledCount} of {CHANNELS.length} on
              </span>
            </div>
            <ul className="divide-y divide-white/10">
              {CHANNELS.map((c) => (
                <li
                  key={c.key}
                  className="py-4 flex items-start justify-between gap-4"
                >
                  <div className="flex gap-4 min-w-0">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                      <c.icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-white">
                        {c.title}
                      </p>
                      <p className="mt-1 text-sm text-white/70 leading-relaxed">
                        {c.body}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    label={c.title}
                    on={channels[c.key]}
                    onChange={(next) => toggleChannel(c.key, next)}
                  />
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Frequency */}
          <motion.div
            {...fadeUp(0.05)}
            className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-6 md:p-8"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Frequency
            </h2>
            <p className="mt-1 text-sm text-white/65">
              How often we batch the categories above.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {FREQS.map((f) => {
                const active = frequency === f.key
                return (
                  <li key={f.key}>
                    <button
                      type="button"
                      onClick={() => {
                        setFrequency(f.key)
                        setSaved(false)
                      }}
                      className={cn(
                        "w-full text-left rounded-2xl border p-4 transition-colors",
                        active
                          ? "bg-brand/10 border-brand/40"
                          : "bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-white">
                          {f.label}
                        </span>
                        <span
                          className={cn(
                            "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                            active
                              ? "bg-brand text-white border-brand"
                              : "bg-transparent border-white/25"
                          )}
                        >
                          {active && <Check className="h-3 w-3" strokeWidth={3} />}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-white/65">{f.sub}</p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>

          {/* Topics */}
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-6 md:p-8"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Topics you care about
            </h2>
            <p className="mt-1 text-sm text-white/65">
              We&rsquo;ll prioritise content tagged with your picks.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {TOPICS.map((t) => {
                const on = topics.includes(t)
                return (
                  <li key={t}>
                    <button
                      type="button"
                      onClick={() => toggleTopic(t)}
                      className={cn(
                        "rounded-full px-4 h-10 text-xs tracking-[0.14em] uppercase border transition-colors",
                        on
                          ? "bg-brand/20 border-brand/50 text-brand"
                          : "bg-white/[0.04] border-white/10 text-white/80 hover:bg-white/[0.08] hover:border-white/20"
                      )}
                    >
                      {t}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>

          {/* Save band */}
          <motion.div
            {...fadeUp(0.15)}
            className="rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-5 md:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.p
                    key="saved"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: easeBezier }}
                    className="text-sm text-brand inline-flex items-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                    Preferences saved.
                  </motion.p>
                ) : (
                  <motion.p
                    key="info"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: easeBezier }}
                    className="text-sm text-white/70"
                  >
                    Changes apply to the email tied to your account. Sign in
                    to sync across devices.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={unsubscribeAll}
                className="rounded-full h-11 px-5 bg-white/[0.04] border border-white/15 text-white/85 hover:bg-white/[0.1] hover:border-white/30 transition-colors"
              >
                <Slash className="h-4 w-4" />
                Unsubscribe all
              </Button>
              <Button
                type="submit"
                className="rounded-full h-11 px-6 bg-brand text-white hover:bg-brand/90 transition-colors"
              >
                Save preferences
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <p className="text-center text-xs text-white/55 leading-relaxed pt-2">
            Read our{" "}
            <Link
              href="/privacy"
              className="text-brand hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>{" "}
            for what we do — and don&rsquo;t do — with your email.
          </p>
        </div>
      </form>
    </>
  )
}
