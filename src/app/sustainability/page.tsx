import LegalPageShell, {
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal-page-shell"

export const metadata = {
  title: "Sustainability — MelAno",
  description:
    "Our annual sustainability report — sourcing, packaging, carbon, waste, and the goals we're holding ourselves to.",
}

const TOC = [
  { id: "headline", label: "Headline numbers" },
  { id: "principles", label: "Our principles" },
  { id: "sourcing", label: "Sourcing" },
  { id: "packaging", label: "Packaging" },
  { id: "carbon", label: "Carbon footprint" },
  { id: "waste", label: "Waste & circularity" },
  { id: "labour", label: "People & labour" },
  { id: "goals", label: "Goals 2026 → 2028" },
  { id: "method", label: "How we measure" },
]

export default function SustainabilityPage() {
  return (
    <LegalPageShell
      eyebrow="Sustainability report"
      title="The full picture, with the bad bits left in."
      subtitle="Every year we publish what we did well, what we didn't, and what we're aiming at next. This is the 2026 edition."
      updated="2026-01-15"
      toc={TOC}
    >
      <LegalSection id="headline" title="Headline numbers">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { v: "94%", l: "Plastic-free packaging" },
            { v: "100%", l: "Renewable workshop power" },
            { v: "1.2t", l: "CO₂e per A$100k revenue" },
            { v: "0", l: "Animal-tested ingredients" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl bg-white/[0.05] border border-white/10 px-5 py-5"
            >
              <div className="text-2xl md:text-3xl font-semibold text-white tabular-nums">
                {s.v}
              </div>
              <div className="mt-1 text-[10px] tracking-[0.22em] uppercase text-white/55 leading-snug">
                {s.l}
              </div>
            </div>
          ))}
        </div>
        <p>
          We&rsquo;re proud of these numbers and we&rsquo;re honest about the
          gap to where we want to be. The 6% of packaging still containing
          plastic is the seal liner on our soap-bar wraps — replacement is on
          our 2027 roadmap, pending a supplier trial.
        </p>
      </LegalSection>

      <LegalSection id="principles" title="Our principles">
        <LegalList
          items={[
            "Measure first. Anything we can't measure, we don't claim.",
            "Honesty over greenwash. If a step makes the product less sustainable, we say so.",
            "Local before global. We choose Australian suppliers when the carbon trade-off favours it.",
            "Permanence over fashion. Better packaging stays in a product's life cycle for years, not seasons.",
          ]}
        />
      </LegalSection>

      <LegalSection id="sourcing" title="Sourcing">
        <p>
          Our botanicals come from a small group of growers we&rsquo;ve worked
          with since 2020. We sign multi-year contracts and pay a 12% premium
          over market rate, in exchange for traceability and harvest priority.
        </p>
        <LegalList
          items={[
            "Calendula & rosemary: Daylesford, VIC — organically grown, hand-harvested.",
            "Eucalyptus oil: Tasmanian Highlands cooperative, steam-distilled on-site.",
            "Cocoa butter: Fairtrade-certified, sourced from a Cote d'Ivoire cooperative through our Sydney importer.",
            "Glycerin: vegetable-derived, Australian-refined, GMO-free verified.",
          ]}
        />
      </LegalSection>

      <LegalSection id="packaging" title="Packaging">
        <LegalList
          items={[
            "Glass primary containers: 100% recyclable, average 38% post-consumer recycled content.",
            "Aluminium pump components: 100% recyclable, 50% PCR.",
            "Outer cartons: FSC-certified, plant-based inks, no laminates.",
            "Shipping mailers: home-compostable plant starch (TUV OK Compost HOME certified).",
            "Void fill: shredded paper recovered from local Brunswick offices.",
            "The 6% gap: thin plastic seal liner on soap-bar wraps. Active alternative trial scheduled Q3 2026.",
          ]}
        />
      </LegalSection>

      <LegalSection id="carbon" title="Carbon footprint">
        <p>
          We measured our 2025 emissions with the help of Climate Active and
          third-party verifier Pangolin Associates. Total emissions:{" "}
          <span className="text-white font-semibold">17.3 tCO₂e</span> across
          Scope 1, 2, and 3 (excluding consumer use & end-of-life).
        </p>
        <p className="mt-3">Breakdown by source:</p>
        <LegalList
          items={[
            "Inbound freight & raw materials: 41%",
            "Packaging production: 24%",
            "Outbound shipping (Aus Post & DHL): 18%",
            "Workshop operations & utilities: 11%",
            "Office, travel, professional services: 6%",
          ]}
        />
        <LegalCallout tone="brand" title="Offsets vs. reductions">
          We don&rsquo;t buy offsets to claim &ldquo;carbon neutral&rdquo;. We
          invest the equivalent budget in reductions instead — switching
          ingredients, lighter packaging, freight consolidation. Slower
          progress, but real progress.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="waste" title="Waste & circularity">
        <p>
          The Brunswick workshop produced 142kg of operational waste in 2025,
          of which 91% was diverted from landfill via recycling, composting,
          and material reuse.
        </p>
        <p>
          We launched our <span className="text-white">Empty Returns</span>{" "}
          program in March 2026: send any 5 empty Melano containers back
          using our pre-paid label and receive a A$10 credit. Collected
          containers are washed, refilled where possible, or sent to our
          glass-recycling partner in Dandenong.
        </p>
      </LegalSection>

      <LegalSection id="labour" title="People & labour">
        <LegalList
          items={[
            "All staff paid at or above the Manufacturing & Associated Industries Award, with a workshop minimum of A$32/hr.",
            "Four-day work week (32 hours, full pay) since January 2024.",
            "Annual independent salary review against industry benchmarks.",
            "All overseas suppliers screened against Modern Slavery Act 2018 requirements; full statement filed annually.",
          ]}
        />
      </LegalSection>

      <LegalSection id="goals" title="Goals 2026 → 2028">
        <LegalList
          items={[
            "100% plastic-free packaging by Q4 2027 (currently 94%).",
            "30% reduction in inbound freight emissions by 2028 — consolidate Tasmania route, shift cocoa butter to local refiner.",
            "Empty Returns program: 25% of bottles returned by 2028 (currently 8%).",
            "Publish supplier list with full ingredient origin map by Q1 2027.",
            "B Corp certification target: submission Q2 2027, achieved by 2028.",
          ]}
        />
      </LegalSection>

      <LegalSection id="method" title="How we measure">
        <p>
          Emissions calculated using the Greenhouse Gas Protocol Corporate
          Standard. Verified annually by Pangolin Associates, an independent
          Australian carbon-accounting firm. Methodology and underlying data
          are available on request to{" "}
          <a
            href="mailto:sustainability@melano.au"
            className="text-brand hover:underline underline-offset-4"
          >
            sustainability@melano.au
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
