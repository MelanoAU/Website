import Link from "next/link"
import LegalPageShell, { LegalSection } from "@/components/legal-page-shell"

export const metadata = {
  title: "Sitemap — MelAno",
  description:
    "Every page on melano.au, organised by purpose. Easier than menu-hunting.",
}

type Group = {
  title: string
  links: Array<{ href: string; label: string; sub?: string }>
}

const GROUPS: Group[] = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products", sub: "The full Melano range" },
      { href: "/cart", label: "Your bag" },
      { href: "/checkout", label: "Checkout" },
    ],
  },
  {
    title: "Customer",
    links: [
      { href: "/account", label: "My account" },
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create an account" },
      { href: "/track-order", label: "Track your order" },
      { href: "/gift-card-balance", label: "Gift card balance" },
      { href: "/preferences", label: "Communication preferences" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/", label: "Home" },
      { href: "/reviews", label: "Reviews" },
      { href: "/rewards", label: "Rewards" },
      { href: "/professionals", label: "For professionals" },
    ],
  },
  {
    title: "Help & support",
    links: [
      { href: "/contact", label: "Contact us" },
      { href: "/faqs", label: "FAQs" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/recalls", label: "Product recalls" },
    ],
  },
  {
    title: "About Melano",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/foundation", label: "Foundation" },
      { href: "/careers", label: "Careers" },
      { href: "/sustainability", label: "Sustainability" },
    ],
  },
  {
    title: "Legal & policies",
    links: [
      { href: "/terms", label: "Terms of service" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/consumer-health-notice", label: "Consumer health notice" },
      { href: "/user-content", label: "User content policy" },
      { href: "/sitemap", label: "Sitemap" },
    ],
  },
]

export default function SitemapPage() {
  return (
    <LegalPageShell
      eyebrow="Site map"
      title="Every page, in one place."
      subtitle="If you'd rather skip the navigation and go straight to a destination, this is the index."
    >
      <div className="grid gap-10 sm:grid-cols-2">
        {GROUPS.map((g) => (
          <LegalSection key={g.title} title={g.title}>
            <ul className="space-y-3">
              {g.links.map((l) => (
                <li key={l.href} className="border-l-2 border-white/10 pl-4 hover:border-brand transition-colors">
                  <Link
                    href={l.href}
                    className="block text-base text-white hover:text-brand transition-colors"
                  >
                    {l.label}
                  </Link>
                  {l.sub && (
                    <p className="mt-0.5 text-xs text-white/55">{l.sub}</p>
                  )}
                </li>
              ))}
            </ul>
          </LegalSection>
        ))}
      </div>
    </LegalPageShell>
  )
}
