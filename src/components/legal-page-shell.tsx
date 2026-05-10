"use client"

import Link from "next/link"
import type React from "react"
import { motion, cubicBezier } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { cn } from "@/lib/utils"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

export type LegalToc = Array<{ id: string; label: string }>

type Props = {
  eyebrow?: string
  title: string
  subtitle?: string
  updated?: string
  toc?: LegalToc
  children: React.ReactNode
  /** Override the default "Get in touch" footer block */
  helpHref?: string
  helpLabel?: string
}

/**
 * LegalPageShell
 *
 * Plain-background layout for declaration / policy pages where long-form
 * readability matters more than mood. Same Header + Footer chrome as the
 * marketing pages, but no FixedVideoBackground — a flat #0B0B0B body with a
 * subtle top tint keeps text crisp at any zoom level.
 */
export default function LegalPageShell({
  eyebrow,
  title,
  subtitle,
  updated,
  toc,
  children,
  helpHref = "/contact",
  helpLabel = "Get in touch",
}: Props) {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />

      <main className="relative">
        {/* subtle top-of-page tint so the header doesn't sit on a hard edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/[0.04] via-white/[0.015] to-transparent"
        />

        <div className="relative px-6 pt-36 md:pt-44 pb-16 md:pb-24">
          <div className={cn("mx-auto", toc ? "max-w-6xl" : "max-w-3xl")}>
            {/* Header band */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeBezier }}
              className={cn(toc ? "max-w-3xl" : "")}
            >
              {eyebrow && (
                <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                  {eyebrow}
                </span>
              )}
              <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-5 text-base md:text-lg text-white/80 leading-relaxed">
                  {subtitle}
                </p>
              )}
              {updated && (
                <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/10 px-3 py-1 text-[11px] tracking-[0.22em] uppercase text-white/65">
                  Last updated · {updated}
                </p>
              )}
            </motion.div>

            {/* Body — optional sticky ToC on the right at lg+ */}
            <div
              className={cn(
                "mt-12 md:mt-16",
                toc && "lg:grid lg:grid-cols-[1fr_220px] lg:gap-12"
              )}
            >
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: easeBezier }}
                className={cn("max-w-3xl", toc && "lg:max-w-none")}
              >
                {children}

                <div className="mt-16 pt-8 border-t border-white/10 text-sm text-white/65 leading-relaxed">
                  Need help with anything on this page?{" "}
                  <Link
                    href={helpHref}
                    className="text-brand hover:underline underline-offset-4"
                  >
                    {helpLabel}
                  </Link>
                  {" — we read every email."}
                </div>
              </motion.article>

              {toc && (
                <aside className="hidden lg:block">
                  <nav
                    aria-label="On this page"
                    className="sticky top-32 rounded-2xl bg-white/[0.04] border border-white/10 p-5"
                  >
                    <span className="block text-[10px] tracking-[0.3em] uppercase text-white/55">
                      On this page
                    </span>
                    <ul className="mt-4 space-y-2.5 text-sm">
                      {toc.map((t) => (
                        <li key={t.id}>
                          <a
                            href={`#${t.id}`}
                            className="block text-white/75 hover:text-brand transition-colors leading-snug"
                          >
                            {t.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </aside>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Reusable section primitives                                      */
/* ---------------------------------------------------------------- */

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mb-12 md:mb-14 last:mb-0 scroll-mt-32">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-5">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] md:text-base text-white/80 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export function LegalSubsection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-7">
      <h3 className="text-lg md:text-xl font-semibold text-white mb-3">
        {title}
      </h3>
      <div className="space-y-3 text-[15px] md:text-base text-white/80 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5 text-[15px] md:text-base text-white/80 leading-relaxed">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
          <div>{item}</div>
        </li>
      ))}
    </ul>
  )
}

export function LegalCallout({
  title,
  children,
  tone = "neutral",
}: {
  title?: string
  children: React.ReactNode
  tone?: "neutral" | "brand" | "warning"
}) {
  const toneStyles =
    tone === "brand"
      ? "bg-brand/10 border-brand/30"
      : tone === "warning"
        ? "bg-amber-500/10 border-amber-500/30"
        : "bg-white/[0.04] border-white/15"
  return (
    <div className={cn("mt-6 rounded-2xl border p-5 md:p-6", toneStyles)}>
      {title && (
        <p className="text-sm font-semibold text-white mb-2">{title}</p>
      )}
      <div className="text-sm md:text-[15px] text-white/80 leading-relaxed">
        {children}
      </div>
    </div>
  )
}
