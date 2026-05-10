import Link from "next/link"
import LegalPageShell, {
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal-page-shell"

export const metadata = {
  title: "Returns — MelAno",
  description:
    "Our 30-day returns window, how to start a return, refund timing, exchanges, damaged-on-arrival policy, and statutory rights.",
}

const TOC = [
  { id: "summary", label: "The promise" },
  { id: "window", label: "Return window" },
  { id: "process", label: "How to return" },
  { id: "refunds", label: "Refunds" },
  { id: "exchanges", label: "Exchanges" },
  { id: "damaged", label: "Damaged or wrong item" },
  { id: "exclusions", label: "What can't be returned" },
  { id: "rights", label: "Your statutory rights" },
]

export default function ReturnsPage() {
  return (
    <LegalPageShell
      eyebrow="Returns"
      title="Returns the way they should be."
      subtitle="If you don't love it, we want it back. No restocking fees, no waiting on a phone tree, no fine print."
      updated="2026-03-30"
      toc={TOC}
    >
      <LegalSection id="summary" title="The promise">
        <p>
          You have 30 days from delivery to return any unopened product for a
          full refund — including original shipping. Opened items can be
          returned within 14 days if you&rsquo;re unhappy with the quality or
          there&rsquo;s a defect.
        </p>
        <LegalCallout tone="brand">
          Tried it, didn&rsquo;t love it, but used a third of the bottle? We
          still want to hear from you. Email us — we&rsquo;ll usually offer a
          credit toward something better suited.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="window" title="Return window">
        <LegalList
          items={[
            "Unopened, in original packaging: 30 days from delivery.",
            "Opened, with quality issue or defect: 14 days from delivery.",
            "Damaged on arrival: 7 days from delivery (see below).",
            "Gifts: 60 days from the original delivery date — bring the gift receipt.",
          ]}
        />
      </LegalSection>

      <LegalSection id="process" title="How to return">
        <ol className="space-y-4 text-[15px] md:text-base text-white/85">
          {[
            {
              n: "1",
              t: "Start the return online",
              b: "Go to your account → Orders → Start return. Pick the items, choose a reason, and we'll generate a pre-paid return label within minutes.",
            },
            {
              n: "2",
              t: "Pack & post",
              b: "Use the original carton if you can. Affix the label, drop it at any Australia Post outlet — no need to queue.",
            },
            {
              n: "3",
              t: "We inspect & refund",
              b: "Most returns reach us within 5 business days. Refunds are issued within 2 business days of receipt to your original payment method.",
            },
          ].map((s) => (
            <li
              key={s.n}
              className="flex gap-4 rounded-2xl bg-white/[0.04] border border-white/10 p-5"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30 text-sm font-semibold tabular-nums">
                {s.n}
              </span>
              <div>
                <h3 className="text-base font-semibold text-white">{s.t}</h3>
                <p className="mt-1.5 text-sm text-white/75 leading-relaxed">
                  {s.b}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm text-white/65">
          Don&rsquo;t have an account? Email{" "}
          <a
            href="mailto:hello@melano.au"
            className="text-brand hover:underline underline-offset-4"
          >
            hello@melano.au
          </a>{" "}
          with your order number and we&rsquo;ll send you a return label by
          reply.
        </p>
      </LegalSection>

      <LegalSection id="refunds" title="Refunds">
        <LegalList
          items={[
            "Refunded to the original payment method within 2 business days of receipt.",
            "Card refunds typically appear in your account 3–5 business days later, depending on your bank.",
            "PayPal refunds appear immediately.",
            "Original shipping is refunded for unopened-product returns within 30 days. For change-of-mind returns of opened items, original shipping is non-refundable.",
            "Return shipping is free for Australian orders. International return shipping is at your cost unless the item was damaged or incorrect.",
          ]}
        />
      </LegalSection>

      <LegalSection id="exchanges" title="Exchanges">
        <p>
          We don&rsquo;t do direct exchanges — they&rsquo;re slower and
          messier. Instead, place a fresh order for the item you actually
          want, and return the original for a refund. Both happen in
          parallel, so you get your replacement faster.
        </p>
        <p>
          If shipping the new order before the refund clears is a problem,
          email us — we&rsquo;ll send you store credit on the spot for the
          full original amount, valid for 12 months.
        </p>
      </LegalSection>

      <LegalSection id="damaged" title="Damaged or wrong item">
        <p>
          We&rsquo;re sorry — that&rsquo;s on us, and we&rsquo;ll fix it
          quickly. Within 7 days of delivery:
        </p>
        <LegalList
          items={[
            "Take a clear photo of the parcel exterior and the damaged contents.",
            <>
              Email{" "}
              <a
                href="mailto:hello@melano.au"
                className="text-brand hover:underline underline-offset-4"
              >
                hello@melano.au
              </a>{" "}
              with your order number and the photos.
            </>,
            "We'll dispatch a replacement within one business day. You don't need to send the damaged item back.",
          ]}
        />
      </LegalSection>

      <LegalSection id="exclusions" title="What can't be returned">
        <LegalList
          items={[
            "Gift cards (under Australian Consumer Law).",
            "Items marked Final Sale at the time of purchase.",
            "Sample-size sachets included free with an order.",
            "Items returned more than 30 days after delivery, or with broken seals beyond the 14-day opened window.",
          ]}
        />
      </LegalSection>

      <LegalSection id="rights" title="Your statutory rights">
        <p>
          Nothing on this page limits your rights under the Australian
          Consumer Law. Our products come with guarantees that cannot be
          excluded. You&rsquo;re entitled to a replacement or refund for a
          major failure, and to compensation for any other reasonably
          foreseeable loss or damage.
        </p>
        <p>
          You&rsquo;re also entitled to have the products repaired or
          replaced if they fail to be of acceptable quality and the failure
          does not amount to a major failure. See our{" "}
          <Link
            href="/terms"
            className="text-brand hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          for the formal language.
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
