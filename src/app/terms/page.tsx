import Link from "next/link"
import LegalPageShell, {
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal-page-shell"

export const metadata = {
  title: "Terms of Service — MelAno",
  description:
    "The terms governing your use of melano.au, our products, and our services. Plain language, no surprises.",
}

const TOC = [
  { id: "acceptance", label: "1. Acceptance" },
  { id: "eligibility", label: "2. Eligibility & accounts" },
  { id: "orders", label: "3. Orders & pricing" },
  { id: "returns", label: "4. Returns & refunds" },
  { id: "ip", label: "5. Intellectual property" },
  { id: "use", label: "6. Acceptable use" },
  { id: "disclaimer", label: "7. Disclaimers" },
  { id: "liability", label: "8. Limitation of liability" },
  { id: "termination", label: "9. Termination" },
  { id: "law", label: "10. Governing law" },
  { id: "changes", label: "11. Changes" },
]

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Terms of Service"
      subtitle="The rules of the road for shopping with Melano. We've kept the language plain — if anything still reads like a wall of legalese, write to us and we'll explain it back in normal English."
      updated="2026-04-01"
      toc={TOC}
    >
      <LegalSection id="acceptance" title="1. Acceptance of these terms">
        <p>
          These Terms of Service (the &ldquo;Terms&rdquo;) form a binding
          agreement between you and Melano Pty Ltd (ACN 638 421 097), trading
          as Melano (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
          They apply when you visit melano.au, place an order, or interact with
          us in any way through the site.
        </p>
        <p>
          By using the site or buying from us, you confirm you have read,
          understood, and agree to be bound by these Terms. If you don&rsquo;t
          agree, please stop using the site.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="2. Eligibility & accounts">
        <p>
          You must be at least 16 years old to make a purchase, and at least 18
          to create an account. By placing an order you confirm that the
          information you give us is accurate and that you have authority to
          use the payment method.
        </p>
        <LegalSubsectionList
          items={[
            "Keep your password private. You're responsible for activity under your account.",
            "Tell us right away at hello@melano.au if you suspect unauthorised access.",
            "We may suspend an account that breaches these Terms or our Acceptable Use rules.",
          ]}
        />
      </LegalSection>

      <LegalSection id="orders" title="3. Orders & pricing">
        <p>
          All prices are in Australian dollars (AUD) and include GST where
          applicable. We make every effort to display prices accurately, but
          errors do happen.
        </p>
        <LegalSubsectionList
          items={[
            "An order isn't accepted until we send you a confirmation email. Until then, we may decline or amend any order at our discretion.",
            "If we discover a pricing error after you've paid, we'll contact you with the choice to confirm at the corrected price or receive a full refund.",
            "Promotional codes can't be combined unless we say otherwise on the promotion's terms.",
            "Stock is finite and small-batch. We can't guarantee re-stock dates for sold-out items.",
          ]}
        />
      </LegalSection>

      <LegalSection id="returns" title="4. Returns & refunds">
        <p>
          You can return any unopened product in its original packaging within
          30 days of delivery for a full refund. Opened items can be returned
          within 14 days if you&rsquo;re unhappy with the quality or there&rsquo;s
          a defect.
        </p>
        <p>
          Full process, exchanges, and damaged-shipment instructions live in
          our{" "}
          <Link
            href="/returns"
            className="text-brand hover:underline underline-offset-4"
          >
            Returns policy
          </Link>
          .
        </p>
        <LegalCallout tone="brand" title="Your statutory rights">
          Nothing in these Terms limits your rights under the Australian
          Consumer Law (Schedule 2 to the Competition and Consumer Act 2010).
          Our products come with guarantees that cannot be excluded.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="ip" title="5. Intellectual property">
        <p>
          All content on melano.au — including the Melano name, logo, product
          imagery, copy, and code — is owned by Melano Pty Ltd or licensed to
          us, and is protected by Australian and international copyright and
          trade-mark law.
        </p>
        <LegalSubsectionList
          items={[
            "You may view and share content for personal, non-commercial use.",
            "You may not copy, scrape, mirror, or republish substantial portions of the site without written permission.",
            "Reviews and other user-submitted content are governed by our User Content policy.",
          ]}
        />
      </LegalSection>

      <LegalSection id="use" title="6. Acceptable use">
        <p>When using the site, you agree not to:</p>
        <LegalList
          items={[
            "Use automated tools to scrape, mirror, or harvest data from the site.",
            "Attempt to bypass security, rate limits, or authentication measures.",
            "Submit false orders or use payment methods you don't have authority to use.",
            "Post content that's defamatory, harassing, hateful, or unlawful.",
            "Interfere with other customers' use of the site or services.",
          ]}
        />
      </LegalSection>

      <LegalSection id="disclaimer" title="7. Disclaimers">
        <p>
          We take a lot of care with our formulas and our copy, but the site
          and its contents are provided on an &ldquo;as is&rdquo; basis. Our
          products are cosmetics — they&rsquo;re designed to clean, condition,
          and refresh, not to diagnose, treat, or prevent any medical
          condition.
        </p>
        <p>
          Please read our{" "}
          <Link
            href="/consumer-health-notice"
            className="text-brand hover:underline underline-offset-4"
          >
            Consumer health notice
          </Link>{" "}
          before using a product for the first time.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="8. Limitation of liability">
        <p>
          To the maximum extent permitted by Australian law, our total
          liability to you for any claim arising out of or relating to your
          use of the site or our products is limited to the price you paid us
          for the relevant product in the 12 months preceding the claim.
        </p>
        <p>
          Nothing in these Terms excludes our liability for death or personal
          injury caused by our negligence, for fraud, or for any other
          liability that cannot be excluded under Australian law.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="9. Termination">
        <p>
          You can stop using the site at any time. We may suspend or terminate
          your access if we reasonably believe you&rsquo;ve breached these
          Terms, used the site for fraud, or behaved abusively toward our
          team. Where it&rsquo;s reasonable to do so, we&rsquo;ll give you
          notice first.
        </p>
      </LegalSection>

      <LegalSection id="law" title="10. Governing law">
        <p>
          These Terms are governed by the laws of Victoria, Australia. You and
          we agree to submit to the exclusive jurisdiction of the courts of
          Victoria for any dispute arising under these Terms.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="11. Changes to these terms">
        <p>
          We may update these Terms from time to time. When we do, we&rsquo;ll
          revise the &ldquo;Last updated&rdquo; date at the top of this page.
          Material changes will be notified by email if you have an account
          with us, at least 14 days before they take effect.
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}

/* small helper to keep call-sites tidy */
function LegalSubsectionList({ items }: { items: React.ReactNode[] }) {
  return <LegalList items={items} />
}
