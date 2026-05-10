import Link from "next/link"
import LegalPageShell, {
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal-page-shell"

export const metadata = {
  title: "User Content Policy — MelAno",
  description:
    "What you can post on melano.au, the licence you grant us, and how we moderate user-submitted content.",
}

const TOC = [
  { id: "scope", label: "What this covers" },
  { id: "license", label: "The licence you grant us" },
  { id: "rules", label: "Community rules" },
  { id: "moderation", label: "Moderation & removal" },
  { id: "report", label: "Reporting a problem" },
  { id: "remove", label: "Removing your own content" },
]

export default function UserContentPage() {
  return (
    <LegalPageShell
      eyebrow="Community"
      title="User content policy"
      subtitle="The reviews, photos, and stories you share help other people choose well. Here's the deal we ask in return."
      updated="2026-02-18"
      toc={TOC}
    >
      <LegalSection id="scope" title="What this covers">
        <p>
          &ldquo;User content&rdquo; means anything you submit to the site:
          product reviews, photos uploaded with reviews, comments, social tags
          using #melanoritual, and feedback you send via the contact form
          where you&rsquo;ve consented to its public reuse.
        </p>
        <p>
          It does not cover private communications: emails to support, phone
          calls, or order details. Those are governed by our{" "}
          <Link
            href="/privacy"
            className="text-brand hover:underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection id="license" title="The licence you grant us">
        <p>
          You retain ownership of everything you post. By submitting content
          to melano.au or tagging us in public social posts with the consent
          marker (#melanoritual or @melano), you grant us:
        </p>
        <LegalList
          items={[
            "A non-exclusive, royalty-free, worldwide licence to host, display, and resize your content for use on melano.au and our official social channels.",
            "Permission to share your content (with attribution) in marketing emails, press features, and printed lookbooks.",
            "The right to lightly edit for length, clarity, or to redact personal information you may have left in by mistake.",
          ]}
        />
        <p>
          The licence ends when you ask us to remove your content (see below).
        </p>
        <LegalCallout tone="brand" title="What we will never do">
          Sell your photo or review to a stock library. Use your content in
          paid advertising without your explicit, separate written consent.
          Edit a review&rsquo;s rating or change its meaning.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="rules" title="Community rules">
        <p>Please don&rsquo;t post content that:</p>
        <LegalList
          items={[
            "Contains personal attacks, harassment, hate speech, or discrimination.",
            "Includes another person's identifying details without their consent.",
            "Makes medical, therapeutic, or healing claims about our products.",
            "Promotes a competing product or links to an external store.",
            "Has been bought, traded, or otherwise incentivised outside our official Rewards program.",
            "Was generated wholly by an AI without you having actually used the product.",
            "Infringes someone else's copyright, trade mark, or other rights.",
          ]}
        />
        <p>
          We love a 3-star review with constructive criticism — that helps us
          and helps other shoppers. We&rsquo;re only here to remove content
          that breaks the rules above.
        </p>
      </LegalSection>

      <LegalSection id="moderation" title="Moderation & removal">
        <p>
          Reviews are read by a real person within 48 hours of submission. We
          publish almost everything; the small fraction we remove is flagged
          for one of the reasons above.
        </p>
        <LegalList
          items={[
            "If we decline a review, you'll receive an email explaining which rule it crossed and an invitation to rewrite and resubmit.",
            "We do not delete or hide negative reviews simply because they're negative. We're proud of our 4.9 rating because it's real.",
            "Repeat or severe violations may result in your account being suspended.",
          ]}
        />
      </LegalSection>

      <LegalSection id="report" title="Reporting a problem">
        <p>
          If you see something that breaches our rules — a fake review, a
          stolen photo, a personal attack — please report it. Use the
          &ldquo;Report&rdquo; link beneath the content (coming soon) or
          email{" "}
          <a
            href="mailto:community@melano.au"
            className="text-brand hover:underline underline-offset-4"
          >
            community@melano.au
          </a>
          . We respond within two business days.
        </p>
      </LegalSection>

      <LegalSection id="remove" title="Removing your own content">
        <p>
          You can remove a review you posted at any time from your account.
          For social posts you&rsquo;d like us to take down from our channels,
          email{" "}
          <a
            href="mailto:community@melano.au"
            className="text-brand hover:underline underline-offset-4"
          >
            community@melano.au
          </a>{" "}
          with a link to the original post. We&rsquo;ll remove our re-share
          within 7 days.
        </p>
        <p>
          Note: once your content has been included in an archived
          publication (e.g. a printed lookbook), we can&rsquo;t recall the
          archive — but we won&rsquo;t reuse the content in any new material.
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
