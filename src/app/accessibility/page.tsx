import LegalPageShell, {
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal-page-shell"

export const metadata = {
  title: "Accessibility — MelAno",
  description:
    "Melano's commitment to accessible design, our conformance status, and how to report a barrier.",
}

const TOC = [
  { id: "commitment", label: "Our commitment" },
  { id: "status", label: "Conformance status" },
  { id: "features", label: "What we've built in" },
  { id: "compatibility", label: "Compatible technologies" },
  { id: "limitations", label: "Known limitations" },
  { id: "feedback", label: "Send us feedback" },
]

export default function AccessibilityPage() {
  return (
    <LegalPageShell
      eyebrow="Accessibility"
      title="Accessibility statement"
      subtitle="Beautiful design that excludes people isn't beautiful design. We've worked to make melano.au usable by as many people as possible, and we're not done."
      updated="2026-03-12"
      toc={TOC}
    >
      <LegalSection id="commitment" title="Our commitment">
        <p>
          Melano is committed to providing a website that is accessible to
          people of all abilities. We treat accessibility as a baseline
          requirement, not a feature — and we work toward continual
          improvement rather than one-off audits.
        </p>
        <p>
          Our design system, copy, and engineering decisions are reviewed
          quarterly against the latest Web Content Accessibility Guidelines
          (WCAG).
        </p>
      </LegalSection>

      <LegalSection id="status" title="Conformance status">
        <p>
          melano.au targets{" "}
          <span className="text-white font-semibold">WCAG 2.2 Level AA</span>{" "}
          conformance. We&rsquo;re partially conformant today and tracking the
          remaining gaps in a public backlog.
        </p>
        <LegalList
          items={[
            "Full keyboard navigation across all primary user flows: shop, cart, checkout, account.",
            "Visible focus indicators that meet 3:1 contrast against any background.",
            "Semantic HTML — pages structured with proper headings, landmarks, and ARIA where native HTML isn't enough.",
            "Text resizable to 200% without horizontal scrolling on common viewports.",
            "Reduced-motion support: animations are disabled when prefers-reduced-motion is set.",
          ]}
        />
      </LegalSection>

      <LegalSection id="features" title="What we've built in">
        <p>The site supports the following accessibility features today:</p>
        <LegalList
          items={[
            "Skip-to-content link revealed on first tab.",
            "Sufficient colour contrast for all body and interactive text (4.5:1 minimum).",
            "All non-decorative imagery includes meaningful alt text.",
            "Form fields are labelled, with errors announced to screen readers.",
            "Modals and sheets trap focus while open and restore focus on close.",
            "Video backgrounds pause when the user prefers reduced motion.",
            "PDF documents are tagged for screen reader navigation.",
          ]}
        />
      </LegalSection>

      <LegalSection id="compatibility" title="Compatible technologies">
        <p>
          melano.au is designed to be compatible with the following assistive
          technologies:
        </p>
        <LegalList
          items={[
            "Screen readers: VoiceOver (macOS, iOS), NVDA, JAWS, TalkBack.",
            "Browser zoom up to 400%.",
            "Operating system contrast settings on macOS, Windows, iOS, and Android.",
            "Speech recognition tools including Voice Control and Dragon NaturallySpeaking.",
            "Keyboard-only navigation — every interactive element is reachable and operable without a pointing device.",
          ]}
        />
        <p>
          The site is tested against the latest two major versions of Chrome,
          Safari, Firefox, and Edge.
        </p>
      </LegalSection>

      <LegalSection id="limitations" title="Known limitations">
        <p>
          We&rsquo;re honest about gaps. The following items are on our
          roadmap and being actively addressed:
        </p>
        <LegalList
          items={[
            "Some product hover-zoom interactions on the shop page rely on cursor input. Keyboard alternatives are queued for the next sprint.",
            "Older PDF gift-card receipts may not be fully tagged. New receipts since Feb 2026 are.",
            "Embedded Instagram content on the marketing pages depends on Instagram's player, which has known accessibility limitations outside our control.",
          ]}
        />
        <LegalCallout title="If a barrier is blocking you right now">
          Please email{" "}
          <a
            href="mailto:access@melano.au"
            className="text-brand hover:underline underline-offset-4"
          >
            access@melano.au
          </a>{" "}
          and we&rsquo;ll help you complete your task another way — by phone,
          email, or whichever channel suits you. You should never have to go
          without because of a bug on our end.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="feedback" title="Send us feedback">
        <p>
          If you encounter an accessibility barrier on melano.au, we want to
          know. Please include:
        </p>
        <LegalList
          items={[
            "The URL of the page where you ran into trouble.",
            "A short description of what you were trying to do.",
            "The assistive technology you were using (if any), and your operating system.",
          ]}
        />
        <p>
          Email{" "}
          <a
            href="mailto:access@melano.au"
            className="text-brand hover:underline underline-offset-4"
          >
            access@melano.au
          </a>
          . We aim to respond within two business days and resolve confirmed
          issues within 30 days. If you&rsquo;d prefer to talk, leave a
          callback request and we&rsquo;ll ring you back.
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
