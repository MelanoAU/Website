import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Leaf, Sparkles, MapPin, ShieldCheck, Recycle, Droplets } from "lucide-react"

const brand = "HERBMEL x ANOLUXE"

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/5 p-4">
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-white/60">{label}</div>
    </div>
  )
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center border border-white/15 bg-black/20">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/70">{desc}</p>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-[100svh] flex flex-col bg-[#0b0b0b]">
      <Header />
      {/* 顶部占位（你前面统一用 h-10 的逻辑） */}
      <div className="h-10 shrink-0" />

      <main className="flex-1 text-white">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            {/* 你可以把图放在 public/images/about-hero.jpg */}
            <Image
              src="/images/about-hero.jpg"
              alt={`${brand} — Australian-made botanical luxury`}
              fill
              priority
              className="object-cover opacity-55"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-[#0b0b0b]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                Australian-made • Botanical • Elevated
              </p>
              <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-tight">
                {brand}
              </h1>
              <p className="mt-5 text-base md:text-lg text-white/75 leading-relaxed">
                We craft refined, plant-forward personal care in Australia—where botanical purity meets
                modern luxury. Thoughtful formulations, quiet confidence, and a sensorial ritual you’ll return to.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild className="rounded-none h-12 bg-[#A1C1A1] text-black hover:opacity-90">
                  <Link href="/shop">Shop the collection</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-none h-12 bg-transparent text-white border border-white/25 hover:border-[#A1C1A1] hover:text-[#A1C1A1]"
                >
                  <Link href="/contact">Talk to us</Link>
                </Button>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Made in Australia" value="100%" />
              <Stat label="Vegan-friendly" value="Yes" />
              <Stat label="Cruelty-free" value="Always" />
              <Stat label="Botanical focus" value="High" />
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold">Our story</h2>
              <p className="mt-4 text-white/75 leading-relaxed">
                {brand} began with a simple belief: daily care should feel like a small luxury—clean, honest,
                and beautifully made. We were drawn to the Australian landscape and its botanical heritage, where
                resilient plants thrive under sun, wind, and sea air.
              </p>
              <p className="mt-4 text-white/75 leading-relaxed">
                Our approach is precise. We select ingredients for performance and sensorial elegance—then refine each
                formula until it feels effortless: a smooth lather, a balanced finish, and a scent that lingers quietly,
                never loudly.
              </p>

              <div className="mt-6 border-l-2 border-[#A1C1A1] pl-4 text-white/80">
                <p className="text-sm leading-relaxed">
                  “Natural does not have to be basic. Luxury does not have to be excessive.”
                </p>
                <p className="mt-2 text-xs uppercase tracking-wider text-white/60">— {brand} philosophy</p>
              </div>
            </div>

            <div className="border border-white/10 bg-[#171717] p-7">
              <h3 className="text-lg font-semibold">What we mean by premium</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#A1C1A1]" />
                  Thoughtful ingredient selection and stability testing—because luxury should be dependable.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#A1C1A1]" />
                  Sensory design: lather, glide, rinse, and after-feel are treated as one complete experience.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#A1C1A1]" />
                  Minimal, elevated aesthetics—quiet confidence over loud claims.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#A1C1A1]" />
                  Crafted in Australia with consistent small-batch control.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Values / Features */}
        <section className="bg-[#171717]">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="text-3xl md:text-4xl font-semibold">Designed for modern rituals</h2>
            <p className="mt-4 max-w-3xl text-white/75 leading-relaxed">
              We build products that look refined on your shelf and feel exceptional on your skin—without compromising
              on ingredient integrity.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Feature
                icon={<MapPin className="h-5 w-5 text-[#A1C1A1]" />}
                title="Made in Australia"
                desc="Formulated and produced in Australia with quality controls that support reliable texture, stability, and performance."
              />
              <Feature
                icon={<Leaf className="h-5 w-5 text-[#A1C1A1]" />}
                title="Botanical-first"
                desc="Plant oils, extracts, and gentle cleansing systems—chosen for results and comfort, not trends."
              />
              <Feature
                icon={<Sparkles className="h-5 w-5 text-[#A1C1A1]" />}
                title="Quiet luxury"
                desc="Elegant, minimal design and a refined sensorial profile—premium by experience, not by noise."
              />
              <Feature
                icon={<ShieldCheck className="h-5 w-5 text-[#A1C1A1]" />}
                title="Vegan & cruelty-free"
                desc="No animal-derived ingredients. No animal testing. Ever. We verify suppliers wherever possible."
              />
              <Feature
                icon={<Droplets className="h-5 w-5 text-[#A1C1A1]" />}
                title="Skin-comfort focus"
                desc="Balanced cleansing and conditioned after-feel—crafted for daily use, including dry or sensitive-feeling skin."
              />
              <Feature
                icon={<Recycle className="h-5 w-5 text-[#A1C1A1]" />}
                title="Responsible packaging"
                desc="We prioritize recyclable materials and minimize unnecessary components while keeping presentation premium."
              />
            </div>
          </div>
        </section>

        {/* Craft / Ingredients */}
        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="border border-white/10 bg-white/5 p-7">
              <h2 className="text-3xl md:text-4xl font-semibold">The craft behind every formula</h2>
              <p className="mt-4 text-white/75 leading-relaxed">
                We treat formulation as both science and design. Every product is engineered to feel premium:
                controlled viscosity, consistent lather, and a finish that feels clean and comfortable.
              </p>
              <p className="mt-4 text-white/75 leading-relaxed">
                Our ingredient philosophy is selective rather than excessive—high-quality botanicals, stable
                emulsification, and a fragrance profile that complements rather than overwhelms.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold">Botanical oils</div>
                  <div className="mt-1 text-sm text-white/70">Chosen for feel, glide, and barrier comfort</div>
                </div>
                <div className="border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold">Gentle cleansing</div>
                  <div className="mt-1 text-sm text-white/70">Low-stripping systems for daily rituals</div>
                </div>
                <div className="border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold">Refined scent</div>
                  <div className="mt-1 text-sm text-white/70">Elevated, modern, and understated</div>
                </div>
                <div className="border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-semibold">Quality control</div>
                  <div className="mt-1 text-sm text-white/70">Small-batch consistency and stability checks</div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] border border-white/10 bg-black/20">
              {/* 你可以放一张“实验室/原料/工艺”风格图：public/images/about-craft.jpg */}
              <Image
                src="/images/about-craft.jpg"
                alt="Craft and ingredients"
                fill
                className="object-cover opacity-90"
                sizes="(min-width:1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#171717]">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="border border-white/10 bg-black/20 p-8 md:p-10">
              <h2 className="text-3xl md:text-4xl font-semibold">Ready to experience {brand}?</h2>
              <p className="mt-4 max-w-2xl text-white/75 leading-relaxed">
                Explore our current collection and find a ritual that suits your space—crafted in Australia, designed
                to feel refined, and grounded in nature.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Button asChild className="rounded-none h-12 bg-[#A1C1A1] text-black hover:opacity-90">
                  <Link href="/shop">Shop now</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-none h-12 bg-transparent text-white border border-white/25 hover:border-[#A1C1A1] hover:text-[#A1C1A1]"
                >
                  <Link href="/reviews">Read reviews</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
