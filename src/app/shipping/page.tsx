import Link from "next/link"
import LegalPageShell, {
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal-page-shell"

export const metadata = {
  title: "Shipping — MelAno",
  description:
    "Shipping rates, delivery times, free-shipping thresholds, tracking, and international destinations.",
}

const TOC = [
  { id: "domestic", label: "Australia rates & times" },
  { id: "free", label: "Free shipping" },
  { id: "international", label: "International" },
  { id: "tracking", label: "Tracking" },
  { id: "issues", label: "Lost or damaged" },
  { id: "addresses", label: "Address & PO boxes" },
  { id: "carbon", label: "Our carbon position" },
]

export default function ShippingPage() {
  return (
    <LegalPageShell
      eyebrow="Shipping"
      title="Getting Melano to your door."
      subtitle="Honest delivery estimates, no hidden surcharges, and a real human you can email if anything goes sideways."
      updated="2026-04-02"
      toc={TOC}
      helpHref="/track-order"
      helpLabel="Track an order"
    >
      <LegalSection id="domestic" title="Australia rates & times">
        <p>
          We dispatch from our Brunswick workshop within one business day of
          your order. From there, transit times depend on your destination
          and the service tier you choose.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm md:text-[15px]">
            <thead className="bg-white/[0.06] text-white/70 text-[11px] tracking-[0.18em] uppercase">
              <tr>
                <th className="text-left font-semibold py-3 px-4">Destination</th>
                <th className="text-left font-semibold py-3 px-4">Standard</th>
                <th className="text-left font-semibold py-3 px-4">Express</th>
              </tr>
            </thead>
            <tbody className="text-white/85 divide-y divide-white/10 bg-white/[0.02]">
              <tr>
                <td className="py-3 px-4">Melbourne metro</td>
                <td className="py-3 px-4">1–2 business days · A$6</td>
                <td className="py-3 px-4">Next business day · A$12</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Sydney, Adelaide, Brisbane metro</td>
                <td className="py-3 px-4">2–4 business days · A$8</td>
                <td className="py-3 px-4">1–2 business days · A$14</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Perth, Hobart, Darwin</td>
                <td className="py-3 px-4">4–7 business days · A$10</td>
                <td className="py-3 px-4">2–3 business days · A$18</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Regional & remote</td>
                <td className="py-3 px-4">5–10 business days · A$10</td>
                <td className="py-3 px-4">3–5 business days · A$20</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-sm text-white/65">
          All Australian orders ship via Australia Post, with the option to
          upgrade to StarTrack Express at checkout.
        </p>
      </LegalSection>

      <LegalSection id="free" title="Free shipping">
        <LegalList
          items={[
            "Standard shipping is free on Australian orders over A$60.",
            "Bloom-tier members: free standard shipping on orders over A$40.",
            "Bouquet-tier members: free standard shipping on every order, no minimum.",
            "Free Express upgrade for any order over A$120 to metro destinations.",
          ]}
        />
        <p>
          See the{" "}
          <Link
            href="/rewards"
            className="text-brand hover:underline underline-offset-4"
          >
            Rewards page
          </Link>{" "}
          for tier benefits.
        </p>
      </LegalSection>

      <LegalSection id="international" title="International">
        <p>
          We ship to New Zealand, the United States, the United Kingdom,
          Canada, and Singapore. Other destinations are available on request
          via our concierge — email{" "}
          <a
            href="mailto:hello@melano.au"
            className="text-brand hover:underline underline-offset-4"
          >
            hello@melano.au
          </a>
          .
        </p>
        <LegalList
          items={[
            "New Zealand: 5–8 business days · A$18 standard / A$32 express.",
            "United States & Canada: 7–14 business days · A$28 standard / A$48 express.",
            "United Kingdom & EU: 10–18 business days · A$32 standard.",
            "Singapore & Hong Kong: 6–10 business days · A$22 standard.",
          ]}
        />
        <LegalCallout tone="warning" title="Duties & taxes">
          International orders may attract import duties or local sales tax
          on arrival. These are charged by the destination country and are
          the recipient&rsquo;s responsibility. We mark every parcel with the
          true commercial value — we don&rsquo;t under-declare.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="tracking" title="Tracking">
        <p>
          A tracking link is emailed the moment your parcel is scanned by the
          carrier — usually the same evening you order. You can also track
          any order from the{" "}
          <Link
            href="/track-order"
            className="text-brand hover:underline underline-offset-4"
          >
            Track order page
          </Link>{" "}
          using your order number and email.
        </p>
      </LegalSection>

      <LegalSection id="issues" title="Lost or damaged">
        <p>
          If your parcel hasn&rsquo;t arrived 5 business days past its
          estimated delivery window, please email{" "}
          <a
            href="mailto:hello@melano.au"
            className="text-brand hover:underline underline-offset-4"
          >
            hello@melano.au
          </a>{" "}
          with your order number. We&rsquo;ll lodge an enquiry with the
          carrier and keep you updated daily.
        </p>
        <p>
          Damaged on arrival? Take a photo of the parcel and the contents,
          send it to us within 7 days, and we&rsquo;ll arrange a replacement
          or refund — no need to send the damaged item back.
        </p>
      </LegalSection>

      <LegalSection id="addresses" title="Address & PO boxes">
        <LegalList
          items={[
            "We ship to PO boxes and Parcel Lockers via Australia Post.",
            "Express services through StarTrack require a street address (no PO boxes).",
            "Please double-check your address at checkout — corrections after dispatch are subject to carrier surcharges.",
            "Authority to leave: by default we require a signature. You can opt to authorise leaving in a safe place during checkout.",
          ]}
        />
      </LegalSection>

      <LegalSection id="carbon" title="Our carbon position">
        <p>
          We don&rsquo;t buy offsets to slap a &ldquo;carbon-neutral
          delivery&rdquo; sticker on our parcels. Instead, we&rsquo;ve
          consolidated dispatch to two batched runs per day to halve
          collection emissions, and we use Australia Post&rsquo;s electric
          delivery fleet wherever it&rsquo;s available.
        </p>
        <p>
          Full numbers are in our{" "}
          <Link
            href="/sustainability"
            className="text-brand hover:underline underline-offset-4"
          >
            Sustainability report
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
