"use client"

import Link from "next/link"
import { motion, useScroll, useTransform, cubicBezier } from "framer-motion"
import { useRef } from "react"
import {
  Leaf,
  Sparkles,
  Heart,
  ShieldCheck,
  Recycle,
  MapPin,
  ArrowRight,
  Beaker,
  Quote,
  Sprout,
  Droplets,
  FlaskConical,
  Package,
  Calendar,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"

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

const PHILOSOPHY = [
  {
    icon: Leaf,
    title: "Plant-first, always",
    body:
      "Every formula begins with botanicals — calendula, rosemary, eucalyptus, oat — chosen for what they do, not what they sound like on a label.",
  },
  {
    icon: Beaker,
    title: "Small-batch craft",
    body:
      "We make what we can hand-cure in our Melbourne workshop. Smaller batches mean tighter quality and fresher product on your shelf.",
  },
  {
    icon: Sparkles,
    title: "Quietly luxurious",
    body:
      "No loud claims, no neon packaging. Just refined formulas designed to feel like a small ritual, every single time.",
  },
]

const CRAFT_STEPS = [
  {
    icon: Sprout,
    step: "01",
    title: "Source",
    body:
      "We hand-pick growers across Victoria and Tasmania for cold-pressed oils, organically grown botanicals, and raw cocoa butter.",
  },
  {
    icon: Droplets,
    step: "02",
    title: "Cure",
    body:
      "Soaps cold-process for 6+ weeks. Oils macerate slowly with botanicals, never rushed by heat or shortcuts.",
  },
  {
    icon: FlaskConical,
    step: "03",
    title: "Blend",
    body:
      "Each formula is mixed in 50–200 unit batches, with viscosity, scent, and after-feel signed off by hand before bottling.",
  },
  {
    icon: Package,
    step: "04",
    title: "Bottle",
    body:
      "Glass, recyclable card, plant-based wraps. Every component picked so the packaging composts or comes back around.",
  },
]

const STATS = [
  { value: "100%", label: "Made in Australia" },
  { value: "6+", label: "Weeks cured per soap" },
  { value: "12k", label: "Rituals shipped" },
  { value: "0", label: "Animal tests, ever" },
]

const PROMISE = [
  {
    icon: ShieldCheck,
    title: "Independently lab-tested",
    body:
      "Stability, microbiological safety, and skin tolerance verified by TGA-listed Australian labs.",
  },
  {
    icon: Heart,
    title: "Vegan & cruelty-free",
    body:
      "No animal-derived ingredients. No animal testing — by us, by suppliers, by anyone in the chain.",
  },
  {
    icon: Recycle,
    title: "Plastic-free packaging",
    body:
      "Glass, aluminium, paper-pulp. We refuse single-use plastic in our supply chain wherever it's avoidable.",
  },
  {
    icon: MapPin,
    title: "Made in Melbourne",
    body:
      "Designed, formulated, and hand-poured in our workshop. Every batch is signed off in person.",
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
          Our story
        </motion.span>

        <motion.h1
          {...fadeUp(0.1)}
          className="mt-7 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
        >
          Beauty, rooted <br className="hidden md:block" />
          in nature.
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
        >
          Hand-crafted in Melbourne since 2019. Plant-first formulas, small-batch
          craftsmanship, never tested on animals — quietly luxurious by design.
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
              <Link href="/shop">
                Shop the range
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
          <Link
            href="/reviews"
            className="text-sm text-white/80 hover:text-brand transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-brand"
          >
            Read what people say
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function Origin() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section ref={ref} className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2 lg:items-start">
        <motion.div {...fadeUp(0)}>
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Origin
          </span>
          <motion.h2
            style={{ y }}
            className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]"
          >
            From a kitchen, <br className="hidden md:block" />
            to a craft.
          </motion.h2>
          <p className="mt-7 text-base md:text-lg text-white/80 leading-relaxed">
            Melano started on a single induction hob in 2019, in a rented kitchen
            in Brunswick. One small mixer, one steel pot, and a stubborn belief
            that cosmetics could be both genuinely natural and genuinely
            beautiful — without one apologising to the other.
          </p>
          <p className="mt-5 text-base md:text-lg text-white/80 leading-relaxed">
            Six years on, we still hand-pour every soap. Still cure for six
            weeks. Still write our own labels. The kitchen is bigger now, but
            the craft hasn&rsquo;t changed.
          </p>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.15, ease: easeBezier }}
          className="lg:sticky lg:top-32"
        >
          <div className="relative rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-7 md:p-9">
            <Quote className="h-7 w-7 text-brand" strokeWidth={1.5} />
            <p className="mt-5 text-lg md:text-xl text-white/90 leading-relaxed italic">
              &ldquo;Natural doesn&rsquo;t have to mean basic, and luxury doesn&rsquo;t
              have to mean excess. We&rsquo;re after the quiet, careful version of
              both.&rdquo;
            </p>
            <div className="mt-7 pt-6 border-t border-white/10 flex items-center gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-300/10 ring-1 ring-white/15 text-white text-sm font-semibold">
                MK
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Maya Kowalski
                </p>
                <p className="text-xs tracking-[0.18em] uppercase text-white/55">
                  Founder &middot; Melbourne
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}

function Philosophy() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-2xl">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Philosophy
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Three principles. <br className="hidden md:block" />
            One uncompromising standard.
          </h2>
        </motion.div>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {PHILOSOPHY.map(({ icon: Icon, title, body }, i) => (
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
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
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

function Craft() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            The craft
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            From paddock to pump.
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-sm md:text-base text-white/75 leading-relaxed">
            Four steps, none of them rushed. Every product passes through every
            stage by hand, in our Melbourne workshop.
          </p>
        </motion.div>

        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CRAFT_STEPS.map(({ icon: Icon, step, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: easeBezier }}
              className="
                relative rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10
                p-6 md:p-7
                hover:bg-white/[0.08] hover:border-white/15 transition-colors
              "
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className="text-[11px] tracking-[0.3em] uppercase text-white/45 tabular-nums">
                  {step}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Numbers() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            By the numbers
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Six years. A few good numbers.
          </h2>
        </motion.div>

        <ul className="mt-12 grid gap-4 md:gap-5 grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: easeBezier }}
              className="
                rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10
                px-6 py-7 text-center
                hover:bg-white/[0.09] hover:border-white/15 transition-colors
              "
            >
              <div className="text-4xl md:text-5xl font-semibold text-white tabular-nums tracking-tight">
                {s.value}
              </div>
              <div className="mt-3 text-[11px] tracking-[0.24em] uppercase text-white/60">
                {s.label}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Promise() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="max-w-2xl">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Our promise
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Four lines we won&rsquo;t cross.
          </h2>
          <p className="mt-5 text-base text-white/75 leading-relaxed">
            The non-negotiables. They&rsquo;re here in writing so they stay
            non-negotiable.
          </p>
        </motion.div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {PROMISE.map(({ icon: Icon, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: easeBezier }}
              className="
                flex gap-5 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10
                p-6 md:p-7
                hover:bg-white/[0.08] hover:border-white/15 transition-colors
              "
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">
                  {body}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.div
          {...fadeUp(0.2)}
          className="mt-10 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 px-6 py-6 md:px-8 md:py-7 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30 shrink-0">
            <Award className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div className="flex-1">
            <p className="text-sm md:text-base text-white/85 leading-relaxed">
              Independently certified by{" "}
              <span className="text-brand font-medium">Choose Cruelty Free</span>{" "}
              and listed with the{" "}
              <span className="text-brand font-medium">
                Therapeutic Goods Administration
              </span>{" "}
              (TGA).
            </p>
          </div>
          <Link
            href="/sustainability"
            className="text-sm text-brand hover:underline underline-offset-4 whitespace-nowrap inline-flex items-center gap-1"
          >
            Read sustainability report
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function Today() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Today
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            A small team, doing one thing well.
          </h2>
          <p className="mt-6 text-base md:text-lg text-white/80 leading-relaxed">
            Seven of us. One Melbourne workshop. Twelve formulas in active
            production. We&rsquo;re not trying to be everywhere — we&rsquo;re
            trying to be excellent in the places we are.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp(0.15)}
          className="mt-12 grid gap-5 sm:grid-cols-3"
        >
          {[
            { icon: Calendar, label: "Founded", value: "2019" },
            { icon: MapPin, label: "Workshop", value: "Brunswick, VIC" },
            { icon: Sprout, label: "Formulas in range", value: "12" },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: easeBezier }}
              className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <div className="mt-5 text-2xl font-semibold text-white tracking-tight">
                {value}
              </div>
              <div className="mt-1 text-[11px] tracking-[0.22em] uppercase text-white/55">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
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
          Your ritual <br className="hidden md:block" />
          is waiting.
        </motion.h2>
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-base md:text-lg text-white/80 max-w-xl mx-auto"
        >
          Twelve formulas, hand-poured in Melbourne. Pick one — start small.
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
              <Link href="/shop">
                Shop the collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
          <Button
            asChild
            className="rounded-full h-12 px-6 bg-white/[0.06] border border-white/20 text-white hover:bg-white/[0.1] hover:border-white/30 transition-colors"
          >
            <Link href="/rewards">
              Join Rewards
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

export default function AboutContent() {
  return (
    <>
      <Hero />
      <Origin />
      <Philosophy />
      <Craft />
      <Numbers />
      <Promise />
      <Today />
      <ClosingCta />
    </>
  )
}
