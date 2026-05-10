"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  Instagram,
  Facebook,
  ArrowUp,
  ArrowRight,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { asset } from "@/lib/asset"

const ordersLinks = [
  { href: "/contact", label: "Contact us" },
  { href: "/faqs", label: "FAQs" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/track-order", label: "Track your order" },
  { href: "/gift-card-balance", label: "Gift card balance" },
  { href: "/recalls", label: "Product recalls" },
]

const aboutLinks = [
  { href: "/about", label: "Our story" },
  { href: "/foundation", label: "Foundation" },
  { href: "/careers", label: "Careers" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/consumer-health-notice", label: "Consumer health notice" },
]

const supportLinks = [
  { href: "/professionals", label: "For professionals" },
  { href: "/rewards", label: "Rewards" },
  { href: "/reviews", label: "Reviews" },
  { href: "/preferences", label: "Communication prefs" },
]

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/sitemap", label: "Sitemap" },
  { href: "/user-content", label: "User content" },
]

/* ---------- Brand-mark icons not in lucide (TikTok, X, Xiaohongshu) ---------- */

type SocialIconProps = { className?: string; strokeWidth?: number }

function TikTokIcon({ className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.896 2.896 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
    </svg>
  )
}

function XIcon({ className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/**
 * Xiaohongshu (小红书) — no lucide equivalent and the official mark is too
 * detailed for a 16px badge. Render a rounded square outline with a centered
 * 小 glyph in currentColor — instantly recognisable to the audience while
 * staying visually consistent with lucide's stroke-style icons.
 */
function XiaohongshuIcon({ className, strokeWidth = 1.8 }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight={700}
        fill="currentColor"
        stroke="none"
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      >
        小
      </text>
    </svg>
  )
}

const socials: Array<{
  href: string
  label: string
  Icon: React.ComponentType<SocialIconProps>
}> = [
  { href: "https://instagram.com/melano", label: "Instagram", Icon: Instagram },
  { href: "https://facebook.com/melano", label: "Facebook", Icon: Facebook },
  { href: "https://tiktok.com/@melano", label: "TikTok", Icon: TikTokIcon },
  { href: "https://x.com/melano", label: "X", Icon: XIcon },
  { href: "https://xiaohongshu.com/user/profile/melano", label: "小红书 (Xiaohongshu)", Icon: XiaohongshuIcon },
]

export default function Footer() {
  const [email, setEmail] = useState("")

  const submitSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 接订阅 API
    alert(`Subscribed: ${email}`)
    setEmail("")
  }

  return (
    <footer className="relative bg-black/70 backdrop-blur-md border-t border-white/10 text-white">
      {/* ============================= */}
      {/* 1. Newsletter band            */}
      {/* ============================= */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
              Stay in touch
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.05]">
              Quiet emails. <br className="hidden md:block" />
              Real product, real news.
            </h2>
            <p className="mt-4 max-w-md text-sm md:text-base text-white/70 leading-relaxed">
              A short note when something we&apos;ve made is ready, restocked,
              or retired. No discount spam, no daily blasts.
            </p>
          </div>

          <form
            onSubmit={submitSubscribe}
            className="md:col-span-5 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-5 md:p-6"
          >
            <label
              htmlFor="footer-email"
              className="block text-[11px] tracking-[0.28em] uppercase text-white/60"
            >
              Email
            </label>
            <div className="mt-2 relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="
                  w-full h-12 pl-11 pr-4
                  rounded-full bg-white/[0.06] border border-white/15
                  text-sm text-white placeholder:text-white/40 outline-none
                  focus:bg-white/10 focus:border-white/30 transition-colors
                "
              />
            </div>
            <Button
              type="submit"
              className="mt-3 w-full rounded-full h-12 bg-brand text-white hover:bg-brand/90 transition-colors"
            >
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="mt-3 text-[11px] text-white/45 leading-relaxed">
              By subscribing you agree to our{" "}
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
          </form>
        </div>
      </section>

      {/* ============================= */}
      {/* 2. Brand + link columns       */}
      {/* ============================= */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" aria-label="Melano home" className="inline-flex">
              <Image
                src={asset("images/logo@256x228.png")}
                alt="Melano"
                width={160}
                height={40}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm text-white/65 leading-relaxed">
              Hand-crafted shampoo soaps from Melbourne. Vegan, slow-cured,
              packaged plastic-free.
            </p>

            <div className="mt-7 flex items-center gap-2">
              {socials.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  aria-label={label}
                  href={href}
                  className="h-10 w-10 grid place-items-center rounded-full bg-white/[0.06] border border-white/10 text-white/85 hover:text-brand hover:bg-white/[0.1] hover:border-white/20 transition-colors"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-8 grid gap-10 grid-cols-2 sm:grid-cols-3">
            <FooterColumn title="Orders & support" links={ordersLinks} />
            <FooterColumn title="About" links={aboutLinks} />
            <FooterColumn title="Discover" links={supportLinks} />
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* 3. Bottom strip               */}
      {/* ============================= */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} Melano. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/55">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-brand transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ============================= */}
      {/* 4. Back to top                */}
      {/* ============================= */}
      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="
          fixed bottom-6 right-6 z-40
          h-11 w-11 grid place-items-center
          rounded-full bg-black/55 backdrop-blur-md border border-white/15
          text-white/85 hover:text-brand hover:border-white/30 hover:bg-black/70
          transition-colors
        "
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <nav aria-label={title} className="space-y-4">
      <h3 className="text-[11px] tracking-[0.32em] uppercase text-white/60">
        {title}
      </h3>
      <ul className="space-y-2.5 text-sm text-white/80">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="hover:text-brand transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
