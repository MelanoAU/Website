"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, cubicBezier } from "framer-motion"
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Award,
  Sparkles,
  Boxes,
  HeartHandshake,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import { getSupabase } from "@/lib/supabase/client"
import { gallery as galleryImages } from "@/lib/data"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

// ----- 占位数据（公司文案到位时替换） -----

const STATS = [
  { value: "200+", label: "Partner salons" },
  { value: "8 yrs", label: "Trade program" },
  { value: "48 hr", label: "Reply window" },
]

const BENEFITS = [
  {
    icon: Sparkles,
    title: "Trade pricing",
    body: "Up to 50% off MSRP for in-salon service and retail. Volume tiers unlock with each quarter.",
  },
  {
    icon: GraduationCap,
    title: "Melano Academy",
    body: "Online and in-person training, certification levels, and yearly master-class events.",
  },
  {
    icon: Boxes,
    title: "Salon-exclusive sizes",
    body: "1L pumps, refill cartridges and back-bar formats not sold to retail customers.",
  },
  {
    icon: HeartHandshake,
    title: "Direct support",
    body: "A real person — not a ticket queue. Same-day on weekdays, never longer than 48 hours.",
  },
]

const FAQ = [
  {
    q: "How do I qualify for the trade program?",
    a: "If you operate a licensed salon, spa, barbershop, or related business, you qualify. We ask for an ABN (or equivalent), a recent trading certificate, and a short note about your space.",
  },
  {
    q: "Is there a minimum order?",
    a: "First order has a $200 minimum. After that, no minimum — order what you need, when you need it.",
  },
  {
    q: "What are the lead times?",
    a: "Standard orders ship from Melbourne within 2 business days. Custom blends and exclusive formats run on a 4-week cycle, announced quarterly.",
  },
  {
    q: "Do you offer education or certification?",
    a: "Yes — every active partner gets full Academy access. Three certification tiers, each ending with a hands-on intensive at our Fitzroy workshop.",
  },
  {
    q: "Can I sell Melano in my retail space?",
    a: "Yes. We provide POS displays, shade cards and education for your front-of-house team. We do ask for shelf placement appropriate to a premium line.",
  },
]

const BUSINESS_TYPES = [
  "Salon",
  "Spa",
  "Barbershop",
  "Retailer",
  "Distributor",
  "Other",
]

const BUSINESS_SIZES = [
  "1–3 chairs / stations",
  "4–10 chairs / stations",
  "11–25 chairs / stations",
  "25+ chairs / stations",
  "N/A",
]

type FormState = {
  business_name: string
  contact_name: string
  email: string
  phone: string
  business_type: string
  business_size: string
  abn: string
  website: string
  message: string
}

const INITIAL_FORM: FormState = {
  business_name: "",
  contact_name: "",
  email: "",
  phone: "",
  business_type: BUSINESS_TYPES[0],
  business_size: BUSINESS_SIZES[0],
  abn: "",
  website: "",
  message: "",
}

const inputClass = `
  w-full h-12 px-4
  rounded-full bg-white/[0.06] border border-white/15
  text-sm text-white placeholder:text-white/40 outline-none
  focus:bg-white/10 focus:border-white/30 transition-colors
`

// ============================================================
// Page
// ============================================================

export default function ProfessionalsPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const required: Array<keyof FormState> = [
      "business_name",
      "contact_name",
      "email",
      "business_type",
      "message",
    ]
    const missing = required.find((k) => !form[k].trim())
    if (missing) {
      setError("Please fill in all required fields.")
      return
    }

    setSubmitting(true)
    const supabase = getSupabase()
    const { error: insertError } = await supabase
      .from("professional_applications")
      .insert({
        business_name: form.business_name.trim(),
        contact_name: form.contact_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        business_type: form.business_type || null,
        business_size: form.business_size || null,
        abn: form.abn.trim() || null,
        website: form.website.trim() || null,
        message: form.message.trim(),
      })

    setSubmitting(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setDone(true)
  }

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        {/* ============================= */}
        {/* 1. Hero                       */}
        {/* ============================= */}
        <section className="relative min-h-[80svh] flex items-center px-6 pt-32 pb-20">
          <div className="mx-auto max-w-5xl w-full">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeBezier }}
              className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70"
            >
              For professionals
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: easeBezier }}
              className="mt-5 text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05]"
            >
              Built for the salon. <br className="hidden md:block" />
              Earned by the chair.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: easeBezier }}
              className="mt-6 max-w-2xl text-base md:text-lg text-white/80 leading-relaxed"
            >
              The Melano trade program is for salons, spas and stylists who
              want a smaller, slower formula list — and the education to use
              every drop. No hard sell, no monthly quotas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: easeBezier }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Button
                asChild
                className="rounded-full h-12 bg-brand text-white px-7 hover:bg-brand/90"
              >
                <Link href="#apply">
                  Apply for trade access
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full h-12 bg-transparent border-white/30 text-white px-7 hover:bg-white/10 hover:text-white"
              >
                <Link href="mailto:trade@melano.example">
                  Talk to our trade team
                </Link>
              </Button>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: easeBezier }}
              className="mt-14 grid gap-3 sm:grid-cols-3"
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 px-6 py-5"
                >
                  <div className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] tracking-[0.28em] uppercase text-white/55">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================= */}
        {/* 2. Inside the program         */}
        {/* ============================= */}
        <section className="relative px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: easeBezier }}
              className="max-w-2xl"
            >
              <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                Inside the program
              </span>
              <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
                Four pillars. <br className="hidden md:block" />
                One promise: nothing wasted.
              </h2>
              <p className="mt-4 text-base md:text-lg text-white/75 leading-relaxed">
                We&apos;d rather sell less to people who use it well. The
                program reflects that.
              </p>
            </motion.div>

            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map(({ icon: Icon, title, body }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: easeBezier,
                  }}
                  className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 p-7 hover:bg-white/[0.09] hover:border-white/15 transition-colors"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm md:text-[15px] text-white/75 leading-relaxed">
                    {body}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================= */}
        {/* 3. Editorial story            */}
        {/* ============================= */}
        <section className="relative px-6 py-24">
          <div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-12 md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: easeBezier }}
              className="md:col-span-5 order-1"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10">
                {galleryImages[5] && (
                  <Image
                    src={galleryImages[5].src}
                    alt={galleryImages[5].alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 40vw, 100vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-black/55 backdrop-blur-md border border-white/15 px-4 h-9 text-xs text-white/85">
                  <Award className="h-3.5 w-3.5 text-brand" />
                  Academy
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1, ease: easeBezier }}
              className="md:col-span-7 order-2"
            >
              <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                Education that pays back
              </span>
              <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
                Learn the formulas. <br className="hidden md:block" />
                Teach your clients.
              </h2>
              <div className="mt-6 space-y-5 text-base md:text-lg text-white/80 leading-relaxed">
                <p>
                  Every Melano partner gets full Academy access from day one.
                  Three certification tiers move from product fundamentals to
                  ingredient blending — built around the way real chairs run,
                  not classroom theory.
                </p>
                <p>
                  Modules are short, on-demand and translate to higher
                  service tickets without changing your menu. The yearly
                  master-class brings every certified stylist together for
                  three days in Fitzroy.
                </p>
              </div>

              <ul className="mt-8 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
                {[
                  "Online + in-person modules",
                  "Three certification tiers",
                  "Annual three-day intensive",
                  "Co-marketing with certified stylists",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ============================= */}
        {/* 4. Application form           */}
        {/* ============================= */}
        <section id="apply" className="relative px-6 py-24 scroll-mt-24">
          <div className="mx-auto max-w-4xl">
            {done ? (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeBezier }}
                className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-10 md:p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.55, ease: easeBezier }}
                  className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand/15 ring-1 ring-brand/30 text-brand"
                >
                  <CheckCircle2 className="h-7 w-7" strokeWidth={1.8} />
                </motion.div>
                <span className="mt-7 block text-[11px] tracking-[0.32em] uppercase text-brand">
                  Application received
                </span>
                <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.05]">
                  Thanks — we&apos;ll be in touch.
                </h2>
                <p className="mt-5 text-sm md:text-base text-white/75 leading-relaxed max-w-lg mx-auto">
                  Our trade team replies within 48 business hours. While you
                  wait, feel free to keep browsing the range.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    asChild
                    className="rounded-full h-12 bg-brand text-white px-6 hover:bg-brand/90"
                  >
                    <Link href="/shop">
                      Browse the shop
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    onClick={() => {
                      setForm(INITIAL_FORM)
                      setDone(false)
                    }}
                    variant="outline"
                    className="rounded-full h-12 bg-transparent border-white/30 text-white px-6 hover:bg-white/10 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Submit another
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, ease: easeBezier }}
                  className="text-center max-w-2xl mx-auto"
                >
                  <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                    Apply
                  </span>
                  <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
                    Tell us about your business.
                  </h2>
                  <p className="mt-4 text-base md:text-lg text-white/75 leading-relaxed">
                    A short form. We come back within 48 business hours with
                    next steps and a price book.
                  </p>
                </motion.div>

                <motion.form
                  onSubmit={onSubmit}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: easeBezier }}
                  className="mt-12 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-6 md:p-8"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Business name" required>
                      <input
                        type="text"
                        required
                        value={form.business_name}
                        onChange={(e) =>
                          setField("business_name", e.target.value)
                        }
                        placeholder="Fitzroy Hair Co."
                        className={inputClass}
                      />
                    </Field>
                    <Field label="ABN / Tax ID">
                      <input
                        type="text"
                        value={form.abn}
                        onChange={(e) => setField("abn", e.target.value)}
                        placeholder="12 345 678 901"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Contact name" required>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        value={form.contact_name}
                        onChange={(e) =>
                          setField("contact_name", e.target.value)
                        }
                        placeholder="Mara Kelvin"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="you@business.com"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Phone (optional)">
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        placeholder="+61 …"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Website / Instagram">
                      <input
                        type="text"
                        value={form.website}
                        onChange={(e) => setField("website", e.target.value)}
                        placeholder="@yoursalon or yoursalon.com"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Business type" required>
                      <SelectInput
                        value={form.business_type}
                        onChange={(v) => setField("business_type", v)}
                        options={BUSINESS_TYPES}
                      />
                    </Field>
                    <Field label="Number of stations">
                      <SelectInput
                        value={form.business_size}
                        onChange={(v) => setField("business_size", v)}
                        options={BUSINESS_SIZES}
                      />
                    </Field>
                  </div>

                  <Field label="Tell us about your business" required className="mt-4">
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setField("message", e.target.value)}
                      placeholder="What kind of clients do you serve? Why Melano? Anything we should know?"
                      className="
                        w-full px-5 py-3
                        rounded-2xl bg-white/[0.06] border border-white/15
                        text-sm text-white placeholder:text-white/40 outline-none
                        focus:bg-white/10 focus:border-white/30 transition-colors
                        resize-y
                      "
                    />
                  </Field>

                  {error && (
                    <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="mt-7 w-full rounded-full h-12 bg-brand text-white hover:bg-brand/90 disabled:opacity-70 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit application
                      </>
                    )}
                  </Button>

                  <p className="mt-4 text-[11px] text-white/45 leading-relaxed text-center">
                    By submitting you agree to be contacted about Melano trade
                    services. We don&apos;t share applications with third
                    parties.
                  </p>
                </motion.form>
              </>
            )}
          </div>
        </section>

        {/* ============================= */}
        {/* 5. FAQ                        */}
        {/* ============================= */}
        <section className="relative px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: easeBezier }}
              className="text-center max-w-2xl mx-auto"
            >
              <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                Trade FAQ
              </span>
              <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
                The fine print, plainly.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: easeBezier }}
              className="mt-12 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 divide-y divide-white/10"
            >
              {FAQ.map(({ q, a }) => (
                <details
                  key={q}
                  className="group [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="cursor-pointer list-none px-5 py-5 flex items-center justify-between gap-6 text-white">
                    <span className="text-[15px] md:text-base font-medium">
                      {q}
                    </span>
                    <ChevronDown className="h-4 w-4 text-white/55 shrink-0 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 -mt-1 text-sm md:text-[15px] text-white/75 leading-relaxed">
                    {a}
                  </div>
                </details>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================= */}
        {/* 6. Closing trade contact      */}
        {/* ============================= */}
        <section className="relative min-h-[60svh] flex items-center px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: easeBezier }}
              className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70"
            >
              Talk to us
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: easeBezier }}
              className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]"
            >
              Prefer a quick call?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.15, ease: easeBezier }}
              className="mt-6 text-base md:text-lg text-white/80"
            >
              Our trade team is in Melbourne, Mon–Fri, 9 to 5 AEST.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.25, ease: easeBezier }}
              className="mt-10 grid gap-4 sm:grid-cols-2 max-w-xl mx-auto"
            >
              <a
                href="mailto:trade@melano.example"
                className="group flex items-center justify-center gap-3 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 px-5 py-5 text-white hover:bg-white/[0.1] hover:border-white/20 transition-colors"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
                  <Mail className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div className="text-left">
                  <div className="text-[11px] tracking-[0.28em] uppercase text-white/55">
                    Email
                  </div>
                  <div className="text-sm font-medium text-white">
                    trade@melano.example
                  </div>
                </div>
              </a>
              <a
                href="tel:+61300000000"
                className="group flex items-center justify-center gap-3 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 px-5 py-5 text-white hover:bg-white/[0.1] hover:border-white/20 transition-colors"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
                  <Phone className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div className="text-left">
                  <div className="text-[11px] tracking-[0.28em] uppercase text-white/55">
                    Phone
                  </div>
                  <div className="text-sm font-medium text-white">
                    +61 1300 000 000
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

// ============================================================
// Sub-components
// ============================================================

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[11px] tracking-[0.28em] uppercase text-white/60">
        {label}
        {required && <span className="ml-1 text-brand">*</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: readonly string[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-10`}
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0b0b0b]">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
    </div>
  )
}
