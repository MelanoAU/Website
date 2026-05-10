"use client"

import Link from "next/link"
import { motion, cubicBezier } from "framer-motion"
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Sun,
  CalendarHeart,
  Wallet,
  Home,
  GraduationCap,
  Users,
  Quote,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, delay, ease: easeBezier },
})

const ROLES = [
  {
    title: "Senior Cosmetic Formulator",
    type: "Full-time · 4-day week",
    location: "Brunswick, Melbourne",
    salary: "A$110k – 135k + super",
    body: "Lead the development of new formulas across skincare and haircare. You'll set the technical bar for the next two years of the range.",
    tags: ["Formulation", "R&D", "5+ years"],
  },
  {
    title: "Workshop Production Lead",
    type: "Full-time · 4-day week",
    location: "Brunswick, Melbourne",
    salary: "A$78k – 92k + super",
    body: "Run the daily production schedule across our small workshop team — batching, curing, quality checks, dispatch coordination.",
    tags: ["Operations", "Leadership", "3+ years"],
  },
  {
    title: "Customer Care Specialist",
    type: "Full-time · 4-day week",
    location: "Hybrid · Melbourne",
    salary: "A$68k – 78k + super",
    body: "Be the human voice on the other side of every email. We don't use chatbots and we don't outsource. You'd be answering with care, not scripts.",
    tags: ["Support", "Comms", "1+ years"],
  },
  {
    title: "Brand & Editorial Designer",
    type: "Contract · 6 months",
    location: "Remote (AU)",
    salary: "A$650 – 800 / day",
    body: "Help us level up the visual story across the site, packaging, and seasonal lookbooks. Strong typographic instinct essential.",
    tags: ["Design", "Editorial", "Senior"],
  },
]

const PERKS = [
  {
    icon: Sun,
    title: "4-day work week",
    body: "32 hours, full pay. Fridays are yours — we&rsquo;ve been on this since 2024.",
  },
  {
    icon: Wallet,
    title: "Transparent pay bands",
    body: "Salary ranges are published, reviewed annually against industry data, and never negotiated based on your last salary.",
  },
  {
    icon: CalendarHeart,
    title: "Generous parental leave",
    body: "20 weeks paid for primary carers, 12 weeks for secondary. Everyone, day one.",
  },
  {
    icon: Home,
    title: "Hybrid where it makes sense",
    body: "Workshop roles are on-site; office and design roles are 2 days in, 3 days remote.",
  },
  {
    icon: GraduationCap,
    title: "A$2k learning budget",
    body: "Books, courses, conferences, mentors — choose what stretches you.",
  },
  {
    icon: Users,
    title: "All staff own the brand",
    body: "Every employee receives equity from year one. We&rsquo;re building this together.",
  },
]

function Hero() {
  return (
    <section className="relative px-6 pt-40 md:pt-48 pb-16 text-center">
      <div className="mx-auto max-w-3xl">
        <motion.span
          {...fadeUp(0)}
          className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 px-4 py-1.5 text-[11px] md:text-xs tracking-[0.3em] uppercase text-white/85"
        >
          <Briefcase className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
          Careers
        </motion.span>
        <motion.h1
          {...fadeUp(0.1)}
          className="mt-7 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
        >
          Make small things <br className="hidden md:block" />
          beautifully.
        </motion.h1>
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
        >
          Seven of us today, in a workshop on Sydney Road that smells like
          rosemary by 9am. We hire slowly, pay transparently, and treat the
          craft as the point.
        </motion.p>
      </div>
    </section>
  )
}

function Quote1() {
  return (
    <section className="relative px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <motion.div
          {...fadeUp(0)}
          className="relative rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-8 md:p-10"
        >
          <Quote className="h-8 w-8 text-brand" strokeWidth={1.5} />
          <p className="mt-5 text-xl md:text-2xl text-white/90 leading-relaxed italic">
            &ldquo;We&rsquo;re trying to be a place where the work is genuinely
            good and the conditions to do it are genuinely sane. The two
            shouldn&rsquo;t be in tension.&rdquo;
          </p>
          <p className="mt-6 text-[11px] tracking-[0.28em] uppercase text-white/55">
            — Maya Kowalski, founder
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function Roles() {
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Open roles
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            We&rsquo;re hiring four roles.
          </h2>
          <p className="mt-4 text-sm md:text-base text-white/75">
            Click through for the full description and to apply directly.
          </p>
        </motion.div>

        <ul className="mt-12 space-y-4">
          {ROLES.map((r, i) => (
            <motion.li
              key={r.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: easeBezier }}
              className="
                group rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10
                p-6 md:p-7
                hover:bg-white/[0.09] hover:border-white/20 transition-colors
              "
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl md:text-2xl font-semibold text-white group-hover:text-brand transition-colors">
                    {r.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs tracking-[0.18em] uppercase text-white/55">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3" strokeWidth={2} />
                      {r.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" strokeWidth={2} />
                      {r.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-brand">
                      <Wallet className="h-3 w-3" strokeWidth={2} />
                      {r.salary}
                    </span>
                  </div>
                </div>
                <Button
                  asChild
                  className="rounded-full h-10 px-5 bg-white/[0.06] border border-white/15 text-white hover:bg-brand/15 hover:border-brand/40 hover:text-brand transition-colors shrink-0"
                >
                  <Link href="/contact">
                    Apply
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-sm md:text-[15px] text-white/75 leading-relaxed">
                {r.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-1 text-[11px] tracking-wide text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Perks() {
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-2xl">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Why work here
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            The conditions, written down.
          </h2>
        </motion.div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PERKS.map(({ icon: Icon, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: easeBezier }}
              className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-7 hover:bg-white/[0.08] hover:border-white/15 transition-colors"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                {body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Process() {
  const steps = [
    {
      n: "01",
      t: "Apply with what you've made",
      b: "We don't need a polished CV — show us a project, a portfolio, a case study, anything that demonstrates the work.",
    },
    {
      n: "02",
      t: "30-min intro call",
      b: "Mutual fit check. We'll tell you about the role honestly; you tell us what you're looking for.",
    },
    {
      n: "03",
      t: "Paid trial task",
      b: "A small, scoped piece of real work — paid at our standard rate. No homework olympics.",
    },
    {
      n: "04",
      t: "Workshop visit + offer",
      b: "Meet the team in person, see the workshop, ask everything. Decisions made within a week.",
    },
  ]
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            How we hire
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Four steps. About three weeks.
          </h2>
        </motion.div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: easeBezier }}
              className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-6"
            >
              <span className="text-[11px] tracking-[0.28em] uppercase text-brand tabular-nums">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                {s.b}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="relative min-h-[60svh] flex items-center px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          {...fadeUp(0)}
          className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70"
        >
          Don&rsquo;t see your role?
        </motion.span>
        <motion.h2
          {...fadeUp(0.1)}
          className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]"
        >
          Send a CV anyway.
        </motion.h2>
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-base md:text-lg text-white/80 max-w-xl mx-auto"
        >
          We keep speculative applications on file for 12 months. If something
          opens up that fits, we&rsquo;ll be in touch.
        </motion.p>
        <motion.div {...fadeUp(0.3)} className="mt-9">
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
                Send us your work
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function CareersContent() {
  return (
    <>
      <Hero />
      <Quote1 />
      <Roles />
      <Perks />
      <Process />
      <ClosingCta />
    </>
  )
}
