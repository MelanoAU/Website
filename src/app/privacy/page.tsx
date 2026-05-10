import Link from "next/link"
import LegalPageShell, {
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal-page-shell"

export const metadata = {
  title: "Privacy Policy — MelAno",
  description:
    "How Melano collects, uses, and protects your personal information. Plain language. No dark patterns.",
}

const TOC = [
  { id: "summary", label: "Summary" },
  { id: "what", label: "What we collect" },
  { id: "how", label: "How we use it" },
  { id: "cookies", label: "Cookies & tracking" },
  { id: "sharing", label: "Sharing & third parties" },
  { id: "rights", label: "Your rights" },
  { id: "retention", label: "Data retention" },
  { id: "security", label: "Security" },
  { id: "children", label: "Children" },
  { id: "international", label: "International transfers" },
  { id: "updates", label: "Updates" },
  { id: "contact", label: "Contact" },
]

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="What we collect, why we collect it, and the controls you have. We've written this the way we'd want a privacy policy explained to us — straight, with no euphemisms."
      updated="2026-04-01"
      toc={TOC}
    >
      <LegalSection id="summary" title="The short version">
        <LegalList
          items={[
            "We collect what we need to ship your order, run your account, and improve the site — nothing more.",
            "We never sell your personal information. We never have, we never will.",
            "We use a small handful of named processors (Stripe, Supabase, Vercel, Resend) to make the site work.",
            "You can request a copy, correction, or deletion of your data at any time by emailing privacy@melano.au.",
          ]}
        />
      </LegalSection>

      <LegalSection id="what" title="What we collect">
        <p>
          We collect information directly from you, automatically as you use
          the site, and occasionally from our service providers.
        </p>

        <p className="mt-5 font-semibold text-white">From you</p>
        <LegalList
          items={[
            "Account details: name, email address, password (hashed).",
            "Order details: shipping address, billing address, items purchased.",
            "Payment details: handled by Stripe — we never see or store your full card number.",
            "Communications: emails you send us, reviews you post, support tickets.",
          ]}
        />

        <p className="mt-5 font-semibold text-white">Automatically</p>
        <LegalList
          items={[
            "Device & browser type, screen size, operating system.",
            "IP address (truncated after 30 days), approximate region.",
            "Pages visited, products viewed, time on page (in aggregate).",
            "Referring URL — how you arrived at the site.",
          ]}
        />
      </LegalSection>

      <LegalSection id="how" title="How we use your information">
        <LegalList
          items={[
            "Fulfilling orders: address, payment, shipping notifications.",
            "Account management: login, password reset, order history.",
            "Customer support: replying to your messages, resolving issues.",
            "Service improvement: aggregate analytics on what's working and what isn't.",
            "Marketing — only when you've explicitly opted in: occasional newsletters and restock notes. You can unsubscribe with one click in any email.",
            "Legal compliance: invoicing, tax, fraud prevention, ACL obligations.",
          ]}
        />
      </LegalSection>

      <LegalSection id="cookies" title="Cookies & tracking">
        <p>
          We use a minimal set of cookies. None of them are used for
          cross-site advertising.
        </p>
        <LegalList
          items={[
            "Strictly necessary: cart contents, login session, CSRF tokens. Always on — the site can't function without them.",
            "Analytics (privacy-respecting): page-view counts via Plausible, hosted in the EU. No personal identifiers.",
            "Preferences: your communication preferences and tier. Set by you, removable by you.",
          ]}
        />
        <LegalCallout tone="brand" title="No third-party ad tracking">
          We don&rsquo;t use Facebook Pixel, Google Ads tags, or any of the
          consumer-tracking libraries you might expect from a beauty brand. If
          you&rsquo;ve installed an ad blocker, nothing on this site will
          break.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="sharing" title="Sharing & third parties">
        <p>
          We share your data only with the small set of service providers we
          need to run the business. Each one is contractually bound to keep
          your data confidential and use it only on our instructions.
        </p>
        <LegalList
          items={[
            "Stripe — payment processing (PCI-DSS Level 1 compliant).",
            "Supabase — database & authentication, hosted in AWS Sydney.",
            "Vercel — application hosting, served from Sydney edge.",
            "Resend — transactional email (order confirmations, password resets).",
            "Australia Post & DHL — shipping & tracking.",
            "Plausible — privacy-respecting analytics (no personal data).",
          ]}
        />
        <p>
          We may also disclose information when required by Australian law, a
          valid court order, or to protect the rights and safety of customers
          and our team.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="Your rights">
        <p>Under the Australian Privacy Act, you have the right to:</p>
        <LegalList
          items={[
            "Access the personal information we hold about you.",
            "Request correction of anything inaccurate.",
            "Request deletion (subject to our legal obligation to keep tax & order records for 7 years).",
            "Withdraw consent for marketing at any time.",
            "Lodge a complaint with the Office of the Australian Information Commissioner (OAIC).",
          ]}
        />
        <p>
          To exercise any of these, email{" "}
          <a
            href="mailto:privacy@melano.au"
            className="text-brand hover:underline underline-offset-4"
          >
            privacy@melano.au
          </a>
          . We&rsquo;ll respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="Data retention">
        <LegalList
          items={[
            "Order & invoice records: 7 years (Australian tax law).",
            "Account data: until you ask us to delete it.",
            "Marketing list: until you unsubscribe.",
            "Support tickets: 3 years from last contact.",
            "Analytics: aggregated and anonymised after 12 months.",
          ]}
        />
      </LegalSection>

      <LegalSection id="security" title="Security">
        <p>
          We protect your data with industry-standard measures: HTTPS
          everywhere, hashed passwords, principle-of-least-privilege access
          controls, encrypted backups, and quarterly penetration tests by an
          independent Australian firm.
        </p>
        <p>
          No system is perfectly secure, however. If we ever suffer a breach
          that is likely to result in serious harm to you, we&rsquo;ll notify
          you and the OAIC within 72 hours, in line with Notifiable Data
          Breaches scheme requirements.
        </p>
      </LegalSection>

      <LegalSection id="children" title="Children's privacy">
        <p>
          Our site and products are designed for adults. We do not knowingly
          collect data from anyone under 16. If you believe a child has
          provided us with personal information, please contact us and
          we&rsquo;ll delete it.
        </p>
      </LegalSection>

      <LegalSection id="international" title="International data transfers">
        <p>
          Your data is stored in Australia by default. If a service provider
          processes data outside Australia (for example, Stripe&rsquo;s global
          fraud-prevention systems), we ensure they have safeguards in place
          comparable to those required by the Australian Privacy Principles.
        </p>
      </LegalSection>

      <LegalSection id="updates" title="Updates to this policy">
        <p>
          We may update this policy as our practices evolve. The
          &ldquo;Last updated&rdquo; date at the top of this page reflects
          the most recent revision. Material changes will be emailed to
          account holders at least 14 days before they take effect.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <p>
          Questions or concerns about this policy? Reach out to our Privacy
          Officer:
        </p>
        <LegalList
          items={[
            <>
              Email:{" "}
              <a
                href="mailto:privacy@melano.au"
                className="text-brand hover:underline underline-offset-4"
              >
                privacy@melano.au
              </a>
            </>,
            "Post: Privacy Officer, Melano Pty Ltd, 248 Sydney Road, Brunswick VIC 3056, Australia",
          ]}
        />
        <p>
          You can also lodge a complaint with the OAIC at{" "}
          <Link
            href="https://www.oaic.gov.au"
            className="text-brand hover:underline underline-offset-4"
          >
            oaic.gov.au
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
