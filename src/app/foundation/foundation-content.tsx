"use client"

import Link from "next/link"
import { motion, cubicBezier } from "framer-motion"
import {
  Heart,
  Leaf,
  GraduationCap,
  HandHeart,
  ArrowRight,
  Quote,
  TreePine,
  Users,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, delay, ease: easeBezier },
})

const PROGRAMS = [
  {
    icon: TreePine,
    title: "Botanical conservation",
    body:
      "Funding native-plant restoration across Daylesford, the Otways, and the Tasmanian Highlands — the same ecosystems our ingredients come from.",
    impact: "12,400 native seedlings planted in 2025",
  },
  {
    icon: GraduationCap,
    title: "Women in trades",
    body:
      "Apprenticeship grants for women entering manufacturing, formulation, and distillation trades — a direct partnership with TAFE Victoria.",
    impact: "18 apprentices funded across 2024–25",
  },
  {
    icon: Sparkles,
    title: "Skin-positive education",
    body:
      "Free skincare workshops for high-school students focused on dermatology basics, ingredient literacy, and pushing back against marketing noise.",
    impact: "94 schools visited, 7,200 students reached",
  },
]

const STATS = [
  { v: "1%", l: "of revenue, every year" },
  { v: "A$184k", l: "Granted in 2025" },
  { v: "11", l: "Partner organisations" },
  { v: "0", l: "Admin overhead taken from grants" },
]

function Hero() {
  return (
    <section className="relative px-6 pt-40 md:pt-48 pb-16 text-center">
      <div className="mx-auto max-w-3xl">
        <motion.span
          {...fadeUp(0)}
          className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 px-4 py-1.5 text-[11px] md:text-xs tracking-[0.3em] uppercase text-white/85"
        >
          <Heart className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
          Melano Foundation
        </motion.span>
        <motion.h1
          {...fadeUp(0.1)}
          className="mt-7 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
        >
          Give back, <br className="hidden md:block" />
          where it counts.
        </motion.h1>
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
        >
          1% of every Melano sale funds programs that protect the botanicals we
          source, train the next generation of makers, and bring honest skin
          education into Australian schools.
        </motion.p>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="relative px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <ul className="grid gap-4 md:gap-5 grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.li
              key={s.l}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: easeBezier }}
              className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 px-5 py-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-semibold text-white tabular-nums tracking-tight">
                {s.v}
              </div>
              <div className="mt-2 text-[10px] tracking-[0.22em] uppercase text-white/55 leading-snug">
                {s.l}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Mission() {
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Our mission
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Beauty is borrowed <br className="hidden md:block" />
            from the land.
          </h2>
          <p className="mt-7 text-base md:text-lg text-white/85 leading-relaxed">
            We can&rsquo;t harvest from a place forever and give nothing back.
            The Foundation exists to make the loop close — restoring the
            ecosystems we draw from, training the people who&rsquo;ll do this
            work better than us, and demystifying what&rsquo;s actually in a
            jar.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp(0.15)}
          className="mt-12 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-8 md:p-10"
        >
          <Quote className="h-7 w-7 text-brand" strokeWidth={1.5} />
          <p className="mt-5 text-lg md:text-xl text-white/90 leading-relaxed italic">
            &ldquo;The land that grows our ingredients is older, smarter, and
            more generous than we are. The Foundation is our way of
            acknowledging that, in dollars and labour rather than just
            words.&rdquo;
          </p>
          <p className="mt-6 text-[11px] tracking-[0.28em] uppercase text-white/55">
            — Maya Kowalski, founder
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function Programs() {
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Programs
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Three focus areas, <br className="hidden md:block" />
            patiently funded.
          </h2>
        </motion.div>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {PROGRAMS.map(({ icon: Icon, title, body, impact }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: easeBezier }}
              className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 p-7 md:p-8 hover:bg-white/[0.09] hover:border-white/15 transition-colors flex flex-col"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-brand ring-1 ring-brand/30">
                <Icon className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                {title}
              </h3>
              <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed flex-1">
                {body}
              </p>
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-[11px] tracking-[0.22em] uppercase text-white/50">
                  Impact 2025
                </p>
                <p className="mt-1.5 text-sm font-semibold text-brand">
                  {impact}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Support() {
  const ways = [
    {
      icon: HandHeart,
      title: "Shop the Giving range",
      body: "100% of profit on selected products — including the Bouquet Gift Set — is granted directly to a Foundation program of your choice.",
      cta: { label: "Shop Giving range", href: "/shop" },
    },
    {
      icon: Leaf,
      title: "Round up at checkout",
      body: "Add a small donation in any amount during checkout. Goes straight to the conservation fund, dollar-for-dollar.",
      cta: { label: "Read more", href: "/about" },
    },
    {
      icon: Users,
      title: "Volunteer your skills",
      body: "Designers, formulators, accountants — we run skill-share sessions with our partner orgs each quarter. Email us if you've got a few hours to spare.",
      cta: { label: "Get in touch", href: "/contact" },
    },
  ]
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            How to support
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Three ways to chip in.
          </h2>
        </motion.div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {ways.map(({ icon: Icon, title, body, cta }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: easeBezier }}
              className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-7 hover:bg-white/[0.08] hover:border-white/15 transition-colors flex flex-col"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed flex-1">
                {body}
              </p>
              <Link
                href={cta.href}
                className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand hover:underline underline-offset-4"
              >
                {cta.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.li>
          ))}
        </ul>
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
          Annual report
        </motion.span>
        <motion.h2
          {...fadeUp(0.1)}
          className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]"
        >
          Numbers in full.
        </motion.h2>
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-base md:text-lg text-white/80 max-w-xl mx-auto"
        >
          Every dollar in, every dollar out, every program audited — published
          in our annual report each February.
        </motion.p>
        <motion.div
          {...fadeUp(0.3)}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            asChild
            className="rounded-full h-12 px-6 bg-white/[0.06] border border-white/20 text-white hover:bg-white/[0.1] hover:border-white/30 transition-colors"
          >
            <Link href="/sustainability">
              Sustainability report
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-full h-12 px-6 bg-white/[0.06] border border-white/20 text-white hover:bg-white/[0.1] hover:border-white/30 transition-colors"
          >
            <Link href="/contact">
              Become a partner
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default function FoundationContent() {
  return (
    <>
      <Hero />
      <Stats />
      <Mission />
      <Programs />
      <Support />
      <ClosingCta />
    </>
  )
}
