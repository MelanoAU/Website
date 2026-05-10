"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, cubicBezier } from "framer-motion"
import {
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Send,
  Phone,
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

const TOPICS = [
  { value: "order", label: "Order or delivery" },
  { value: "product", label: "Product question" },
  { value: "rewards", label: "Rewards & account" },
  { value: "wholesale", label: "Wholesale enquiry" },
  { value: "press", label: "Press & partnerships" },
  { value: "other", label: "Something else" },
]

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@melano.au",
    href: "mailto:hello@melano.au",
    sub: "Two business days, usually faster",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+61 3 9000 1248",
    href: "tel:+61390001248",
    sub: "Mon–Fri, 9am–5pm AEST",
  },
  {
    icon: MapPin,
    label: "Workshop",
    value: "248 Sydney Rd, Brunswick VIC",
    href: "https://maps.google.com/?q=248+Sydney+Road+Brunswick+VIC+3056",
    sub: "Visits by appointment only",
  },
]

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

function Hero() {
  return (
    <section className="relative px-6 pt-40 md:pt-48 pb-12 md:pb-20 text-center">
      <div className="mx-auto max-w-3xl">
        <motion.span
          {...fadeUp(0)}
          className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 px-4 py-1.5 text-[11px] md:text-xs tracking-[0.3em] uppercase text-white/85"
        >
          <MessageCircle className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
          We read every email
        </motion.span>
        <motion.h1
          {...fadeUp(0.1)}
          className="mt-7 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
        >
          Talk to the team.
        </motion.h1>
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
        >
          Real humans, Australian hours, no chatbots in the loop. Pick the
          channel that suits you — or fill in the form and we&rsquo;ll come
          back within two business days.
        </motion.p>
      </div>
    </section>
  )
}

function Channels() {
  return (
    <section className="relative px-6 pb-12">
      <div className="mx-auto max-w-6xl grid gap-5 md:grid-cols-3">
        {CHANNELS.map(({ icon: Icon, label, value, href, sub }, i) => (
          <motion.a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: easeBezier }}
            className="
              group rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10
              p-6 md:p-7
              hover:bg-white/[0.09] hover:border-white/20 transition-colors
            "
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <p className="mt-5 text-[11px] tracking-[0.28em] uppercase text-white/55">
              {label}
            </p>
            <p className="mt-2 text-base md:text-lg font-semibold text-white group-hover:text-brand transition-colors break-words">
              {value}
            </p>
            <p className="mt-1.5 text-xs text-white/55">{sub}</p>
          </motion.a>
        ))}
      </div>
    </section>
  )
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Send a message
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Or write to us here.
          </h2>
        </motion.div>

        <motion.form
          {...fadeUp(0.1)}
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
          className="mt-10 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-6 md:p-8"
        >
          {submitted ? (
            <div className="text-center py-10">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
                <Sparkles className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">
                Message sent — thank you.
              </h3>
              <p className="mt-3 text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                We&rsquo;ve received your note and will reply within two
                business days. Check your inbox (and the spam folder, just in
                case).
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
                <Field label="Email">
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Topic" className="md:col-span-2">
                  <select required defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      Choose a topic…
                    </option>
                    {TOPICS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Order number (optional)" className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="MEL-12345"
                    className={inputClass}
                  />
                </Field>
                <Field label="Your message" className="md:col-span-2">
                  <textarea
                    required
                    rows={6}
                    placeholder="As much detail as feels useful — we'd rather over-read than miss the point."
                    className={cn(
                      inputClass,
                      "resize-y min-h-[160px] py-3 leading-relaxed"
                    )}
                  />
                </Field>
              </div>

              <div className="mt-7 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-[11px] text-white/45 leading-relaxed sm:max-w-sm">
                  We&rsquo;ll only use your email to reply to this message.
                  See our{" "}
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
                    className="
                      group rounded-full bg-brand text-white
                      font-semibold text-sm md:text-base
                      px-7 md:px-8 py-3 md:py-3.5
                      hover:bg-brand/90 transition-all
                    "
                  >
                    Send message
                    <Send className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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

function Hours() {
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-7 md:p-9">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
              <Clock className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-white">Hours</h3>
            <p className="mt-2 text-sm text-white/75 leading-relaxed">
              Mon–Fri · 9am–5pm AEST
              <br />
              Closed weekends &amp; AU public holidays
            </p>
          </div>
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-white">Response</h3>
            <p className="mt-2 text-sm text-white/75 leading-relaxed">
              Two business days, max.
              <br />
              Most enquiries answered the same day.
            </p>
          </div>
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
              <Sparkles className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-white">Quick fix?</h3>
            <p className="mt-2 text-sm text-white/75 leading-relaxed">
              Many answers live in our{" "}
              <Link
                href="/faqs"
                className="text-brand hover:underline underline-offset-4"
              >
                FAQs
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="relative min-h-[50svh] flex items-center px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          {...fadeUp(0)}
          className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]"
        >
          See you in the inbox.
        </motion.h2>
        <motion.div
          {...fadeUp(0.15)}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            asChild
            className="rounded-full h-12 px-6 bg-white/[0.06] border border-white/20 text-white hover:bg-white/[0.1] hover:border-white/30 transition-colors"
          >
            <Link href="/faqs">
              Read FAQs first
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-full h-12 px-6 bg-white/[0.06] border border-white/20 text-white hover:bg-white/[0.1] hover:border-white/30 transition-colors"
          >
            <Link href="/track-order">
              Track an order
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default function ContactContent() {
  return (
    <>
      <Hero />
      <Channels />
      <ContactForm />
      <Hours />
      <ClosingCta />
    </>
  )
}
