import LegalPageShell, {
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal-page-shell"

export const metadata = {
  title: "Product Recalls — MelAno",
  description:
    "Current and historical product recalls, our recall process, and how to register for safety alerts.",
}

const TOC = [
  { id: "current", label: "Current recalls" },
  { id: "history", label: "Recall history" },
  { id: "process", label: "How we handle a recall" },
  { id: "alerts", label: "Subscribe to safety alerts" },
  { id: "report", label: "Report a safety concern" },
]

type RecallEntry = {
  date: string
  product: string
  batch: string
  reason: string
  status: "Resolved" | "Active"
  action: string
}

const HISTORY: RecallEntry[] = [
  {
    date: "2024-08-12",
    product: "Honey Oat Cleansing Bar",
    batch: "HC-2024-07",
    reason:
      "Voluntary recall after we detected a fragrance preservative slightly above the IFRA recommended threshold. No reported reactions.",
    status: "Resolved",
    action:
      "Full refund or replacement issued to all 412 affected customers within 14 days.",
  },
  {
    date: "2022-03-04",
    product: "Eucalyptus Body Wash (250ml glass bottle)",
    batch: "EW-2022-02",
    reason:
      "Bottle supplier defect: thin neck wall in a small percentage of bottles risked cracking under shipping pressure.",
    status: "Resolved",
    action:
      "All affected stock recalled and replaced. Bottle supplier changed.",
  },
]

export default function RecallsPage() {
  return (
    <LegalPageShell
      eyebrow="Product safety"
      title="Product recalls"
      subtitle="If we ever ship something that doesn't meet our safety bar, you'll find it here within 24 hours of us discovering it. Transparency is the only honest position."
      updated="2026-04-08"
      toc={TOC}
    >
      <LegalSection id="current" title="Current recalls">
        <LegalCallout tone="brand" title="No active recalls">
          As of the &ldquo;Last updated&rdquo; date above, there are no active
          recalls on any Melano product. If a recall is issued, this page will
          update within 24 hours and an email will be sent to every customer
          who purchased the affected batch.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="history" title="Recall history">
        <p>
          For full transparency, every recall we&rsquo;ve issued since
          founding is listed below.
        </p>

        <ul className="mt-6 space-y-4">
          {HISTORY.map((r) => (
            <li
              key={r.batch}
              className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 md:p-6"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs tracking-[0.22em] uppercase text-white/55 tabular-nums">
                  {r.date}
                </span>
                <span
                  className={
                    r.status === "Resolved"
                      ? "rounded-full bg-brand/15 border border-brand/30 px-2.5 py-0.5 text-[10px] tracking-[0.22em] uppercase text-brand"
                      : "rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] tracking-[0.22em] uppercase text-amber-300"
                  }
                >
                  {r.status}
                </span>
                <span className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-0.5 text-[10px] tracking-[0.18em] uppercase text-white/65 tabular-nums">
                  Batch {r.batch}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white">{r.product}</h3>
              <p className="mt-2 text-sm md:text-[15px] text-white/80 leading-relaxed">
                <span className="text-white/55">Reason — </span>
                {r.reason}
              </p>
              <p className="mt-2 text-sm md:text-[15px] text-white/80 leading-relaxed">
                <span className="text-white/55">Action — </span>
                {r.action}
              </p>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection id="process" title="How we handle a recall">
        <ol className="mt-2 space-y-4 text-[15px] md:text-base text-white/85">
          {[
            {
              t: "Detection",
              b: "Issues are flagged through customer reports, supplier audits, internal QA, or routine batch testing.",
            },
            {
              t: "Assessment",
              b: "Our internal safety committee meets within 4 hours to assess severity and recall scope.",
            },
            {
              t: "Notification",
              b: "Affected customers are emailed individually using order records. This page and our social channels update within 24 hours.",
            },
            {
              t: "Regulator filing",
              b: "Where required, we report the recall to the TGA and AICIS within 48 hours.",
            },
            {
              t: "Resolution",
              b: "Refund or replacement issued automatically. Affected stock returned, destroyed, or remediated according to severity.",
            },
            {
              t: "Post-mortem",
              b: "A no-blame post-incident review within 30 days. Findings published in the next quarterly Sustainability report.",
            },
          ].map((step, i) => (
            <li
              key={step.t}
              className="flex gap-4 rounded-2xl bg-white/[0.04] border border-white/10 p-5"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30 text-sm font-semibold tabular-nums">
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold text-white">{step.t}</h3>
                <p className="mt-1 text-sm text-white/75 leading-relaxed">
                  {step.b}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </LegalSection>

      <LegalSection id="alerts" title="Subscribe to safety alerts">
        <p>
          Recall notifications are sent automatically to anyone who has
          purchased the affected batch — no opt-in required. To receive
          general safety alerts (including precautionary advice that
          doesn&rsquo;t rise to the level of a recall), opt in from your
          communication preferences.
        </p>
      </LegalSection>

      <LegalSection id="report" title="Report a safety concern">
        <p>
          If you believe you&rsquo;ve experienced a reaction or noticed
          something unusual about a product, please tell us immediately.
        </p>
        <LegalList
          items={[
            <>
              Email{" "}
              <a
                href="mailto:safety@melano.au"
                className="text-brand hover:underline underline-offset-4"
              >
                safety@melano.au
              </a>{" "}
              with the product, batch number (printed on the base), and a
              description of what happened.
            </>,
            "Acknowledged within 24 hours.",
            "Serious reactions are also reported to the TGA's Database of Adverse Event Notifications.",
          ]}
        />
      </LegalSection>
    </LegalPageShell>
  )
}
