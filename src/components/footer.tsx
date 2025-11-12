"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Lock,
  Gift,
  Instagram,
  Facebook,
  Youtube,
  ArrowUp
} from "lucide-react"

const ordersLinks = [
  { href: "/contact", label: "Contact us" },
  { href: "/faqs", label: "FAQs" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/track-order", label: "Track your order" },
  { href: "/gift-card-balance", label: "Check gift card balance" },
  { href: "/terms", label: "Terms of use" },
  { href: "/recalls", label: "Product recalls" },
]

const aboutLinks = [
  { href: "/about", label: "Our story" },
  { href: "/foundation", label: "Foundation" },
  { href: "/careers", label: "Careers" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/accessibility", label: "Accessibility Statement" },
  { href: "/preferences", label: "Online Preferences" },
  { href: "/consumer-health-notice", label: "Consumer Health Data Notice" },
]

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/sitemap", label: "Site Map" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/user-content", label: "User Content Permissions" },
  { href: "/accessibility", label: "Accessibility Statement" },
  { href: "/preferences", label: "Online Preferences" },
]

export default function Footer() {
  const [email, setEmail] = useState("")

  const submitSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 在此对接你的订阅 API（如 /api/subscribe）
    alert(`Subscribed: ${email}`)
    setEmail("")
  }

  return (
    <footer className="relative bg-[#171717] text-white">

      {/* 主体四列 */}
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 lg:grid-cols-4">
        {/* Orders & support */}
        <nav aria-label="Orders and support" className="space-y-4">
          <h3 className="text-lg font-semibold">Orders and support</h3>
          <ul className="space-y-3 text-sm text-white/80">
            {ordersLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[#A1C1A1] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* About */}
        <nav aria-label="About" className="space-y-4">
          <h3 className="text-lg font-semibold">About</h3>
          <ul className="space-y-3 text-sm text-white/80">
            {aboutLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[#A1C1A1] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sustainability（示例文案，可按品牌调整） */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sustainability</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            All Melano products are vegan, and we do not test our formulations or ingredients on animals. Packaging is
            recyclable or reusable. We’re working hard to lower our footprint and support communities.
          </p>
          <Link href="/sustainability" className="text-sm underline underline-offset-4 hover:text-[#A1C1A1]">
            Learn more
          </Link>
        </div>

        {/* 订阅 */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold">Subscribe to Melano communications</h3>
          <form onSubmit={submitSubscribe} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address*"
              className="w-full h-11 rounded-none bg-white text-black px-3 text-sm placeholder:text-black/60 outline-none"
            />
            <p className="text-xs text-white/60 leading-relaxed">
              By submitting this form, I agree to Melano’s{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-[#A1C1A1]">Terms of Use</Link> and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-[#A1C1A1]">Privacy Policy</Link>.
            </p>
            <Button type="submit" className="rounded-none bg-white text-black hover:bg-[#A1C1A1]">
              Submit
            </Button>
          </form>

          {/* 社媒 */}
          <div className="mt-6 flex items-center gap-4">
            <Link aria-label="Instagram" href="https://instagram.com" className="text-white/80 hover:text-[#A1C1A1]">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link aria-label="Facebook" href="https://facebook.com" className="text-white/80 hover:text-[#A1C1A1]">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link aria-label="YouTube" href="https://youtube.com" className="text-white/80 hover:text-[#A1C1A1]">
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 版权与法律条款 */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} Melano. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
            {legalLinks.map((l) => (
              <li key={l.href} className="flex items-center gap-2">
                <Link href={l.href} className="hover:text-[#A1C1A1] transition-colors">{l.label}</Link>
                <span className="hidden md:inline-block text-white/30">•</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 回到顶部按钮 */}
      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 h-10 w-10 rounded-full border border-white/20 bg-white/10 backdrop-blur
                   flex items-center justify-center text-white/90 hover:text-black hover:bg-[#A1C1A1] transition-colors"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  )
}
