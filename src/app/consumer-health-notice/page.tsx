import LegalPageShell, {
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal-page-shell"

export const metadata = {
  title: "Consumer Health Notice — MelAno",
  description:
    "Important safety information about our cosmetic products: patch testing, allergens, pregnancy, storage, and reporting reactions.",
}

const TOC = [
  { id: "scope", label: "Cosmetic, not medical" },
  { id: "patch", label: "Patch test before first use" },
  { id: "allergens", label: "Allergens & ingredient sensitivities" },
  { id: "pregnancy", label: "Pregnancy & sensitive skin" },
  { id: "children", label: "Children & infants" },
  { id: "storage", label: "Storage & shelf life" },
  { id: "stop", label: "When to stop using a product" },
  { id: "report", label: "Reporting a reaction" },
]

export default function ConsumerHealthNoticePage() {
  return (
    <LegalPageShell
      eyebrow="Health & safety"
      title="Consumer health notice"
      subtitle="Important safety guidance for the people who use our products. Please read this before opening a new bottle, especially if you have sensitive skin or any known allergies."
      updated="2026-03-22"
      toc={TOC}
    >
      <LegalSection id="scope" title="Cosmetic, not medical">
        <p>
          Melano products are cosmetics, regulated under the Australian
          Industrial Chemicals Introduction Scheme (AICIS). They are designed
          to clean, condition, perfume, or improve the appearance of skin and
          hair.
        </p>
        <p>
          They are{" "}
          <span className="text-white font-semibold">
            not medicines, not therapeutic goods, and not substitutes for
            medical advice.
          </span>{" "}
          Please consult a healthcare professional for any medical concern,
          including persistent skin conditions.
        </p>
      </LegalSection>

      <LegalSection id="patch" title="Patch test before first use">
        <p>
          Even with the gentlest formulas, individual sensitivities vary. We
          recommend a patch test for any new product, particularly if you have
          a history of skin allergies.
        </p>
        <LegalList
          items={[
            "Apply a small amount of product to the inside of your forearm.",
            "Cover with a small bandage and leave undisturbed for 24 hours.",
            "Check for redness, itching, swelling, or any other reaction.",
            "If a reaction occurs, do not use the product. Wash the area with cool water and a mild cleanser.",
          ]}
        />
        <LegalCallout tone="brand">
          Reactions can develop with repeated use, even after a successful
          patch test. Stop using a product at any sign of irritation.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="allergens" title="Allergens & ingredient sensitivities">
        <p>
          Each product page includes a complete INCI (International
          Nomenclature of Cosmetic Ingredients) list. We highlight the 26 EU
          fragrance allergens by name where they exceed reporting thresholds.
        </p>
        <p>Common reactive ingredients in our range include:</p>
        <LegalList
          items={[
            "Essential oils — particularly eucalyptus, rosemary, and lavender.",
            "Cocoa butter (Theobroma cacao) — rare, but possible if you have a chocolate allergy.",
            "Oat-derived ingredients — caution if you have a confirmed coeliac diagnosis.",
            "Citrus oils — may increase photosensitivity.",
          ]}
        />
        <p>
          If you have a known allergy and want to verify a specific batch,
          email{" "}
          <a
            href="mailto:hello@melano.au"
            className="text-brand hover:underline underline-offset-4"
          >
            hello@melano.au
          </a>{" "}
          with the product name and batch number — printed on the bottom of
          every container.
        </p>
      </LegalSection>

      <LegalSection id="pregnancy" title="Pregnancy & sensitive skin">
        <p>
          Most of our range is suitable for use during pregnancy and lactation.
          However, some essential oils used in fragranced products are not
          recommended in the first trimester. The following formulas contain
          these oils:
        </p>
        <LegalList
          items={[
            "Rosemary Shampoo Bar — contains rosemary essential oil.",
            "Eucalyptus Body Wash — contains eucalyptus and clove essential oils.",
          ]}
        />
        <p>
          When in doubt, please consult your obstetrician or midwife. Our
          unscented Honey Oat Cleansing Bar and fragrance-free Calendula Glow
          Serum are pregnancy-safe formulations.
        </p>
      </LegalSection>

      <LegalSection id="children" title="Children & infants">
        <p>
          Our adult formulas are not designed for use on infants under 12
          months. For children aged 1–12, we recommend our Honey Oat Cleansing
          Bar (unscented) and avoid any product containing essential oils on
          children under 6.
        </p>
      </LegalSection>

      <LegalSection id="storage" title="Storage & shelf life">
        <LegalList
          items={[
            "Store products in a cool, dry place away from direct sunlight.",
            "Avoid temperatures above 30°C and below 5°C for extended periods.",
            "Keep lids tightly closed. Avoid contaminating the product with wet hands or fingers — use a clean spatula where provided.",
            "PAO (Period After Opening) is printed on every container as a small jar symbol with a number — e.g. 12M means 12 months after first opening.",
            "Unopened products are stable for 30 months from the manufacture date printed on the base.",
          ]}
        />
      </LegalSection>

      <LegalSection id="stop" title="When to stop using a product">
        <p>Stop using a product immediately if you notice:</p>
        <LegalList
          items={[
            "Redness, swelling, itching, or hives on the application site.",
            "Burning or stinging that persists after rinsing.",
            "Unexpected dryness, peeling, or breakouts that worsen with continued use.",
            "Any change in the product's appearance, smell, or texture.",
          ]}
        />
        <p>
          For severe reactions — difficulty breathing, swelling of the face or
          throat, dizziness — call <span className="text-white">000</span>{" "}
          immediately or go to your nearest emergency department.
        </p>
      </LegalSection>

      <LegalSection id="report" title="Reporting a reaction">
        <p>
          If you experience an adverse reaction to a Melano product, please
          let us know. Your report helps us monitor formula safety across the
          full customer base.
        </p>
        <LegalList
          items={[
            <>
              Email:{" "}
              <a
                href="mailto:safety@melano.au"
                className="text-brand hover:underline underline-offset-4"
              >
                safety@melano.au
              </a>{" "}
              with product name, batch number, and a description of what
              happened.
            </>,
            "We acknowledge every safety report within 24 hours.",
            "Serious adverse events are reported to the Therapeutic Goods Administration (TGA) and AICIS within 5 business days, in line with our regulatory obligations.",
          ]}
        />
      </LegalSection>
    </LegalPageShell>
  )
}
