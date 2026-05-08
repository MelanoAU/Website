"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, cubicBezier } from "framer-motion"
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Quote,
  Sparkles,
  Leaf,
  Droplets,
  Wind,
} from "lucide-react"

import Gallery from "@/components/product/gallery"
import BuyBox from "@/components/product/buy-box"
import ImgFit from "@/components/ImgFit"
import { Button } from "@/components/ui/button"
import { asset } from "@/lib/asset"
import { gallery as galleryImages } from "@/lib/data"
import type { NewProduct } from "@/lib/data"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

// ----- 占位数据（公司文案到位后替换） -----

const STORY_PARAGRAPHS = [
  "Twelve months of formulating, four years of small-scale milling, one quiet workshop. This bar is the slowest thing we make — and the one we use the most.",
  "We start with cold-pressed olive oil and build outward: a balanced lather that doesn't strip, a scent that fades cleanly through the day, a bar shape that earns its place on the shelf.",
  "Nothing here is engineered for the photograph. It's engineered for the third year of use, when the texture of your hair starts to remember.",
]

const INGREDIENTS = [
  {
    name: "Eucalyptus essence",
    role: "Cooling • Clarifying",
    note: "Steam-distilled from blue gum eucalyptus, sourced from Tasmanian highlands.",
    image: galleryImages[0]?.src,
    icon: Leaf,
  },
  {
    name: "Cold-pressed olive oil",
    role: "Nourishing base",
    note: "Single-grove Koroneiki oil, pressed within 24 hours of harvest.",
    image: galleryImages[1]?.src,
    icon: Droplets,
  },
  {
    name: "Coconut milk",
    role: "Lather • Softness",
    note: "Cold-extracted, freeze-protected, and folded in at low temperature.",
    image: galleryImages[2]?.src,
    icon: Sparkles,
  },
  {
    name: "Cedar + citrus oils",
    role: "Scent profile",
    note: "Top notes of bergamot fade to dry cedar — never floral, never sweet.",
    image: galleryImages[3]?.src,
    icon: Wind,
  },
]

const RITUAL = [
  {
    step: "01",
    title: "Wet",
    body: "Saturate hair with warm — not hot — water, working from the scalp down.",
  },
  {
    step: "02",
    title: "Lather",
    body: "Glide the bar across the scalp two or three passes. The lather builds quickly.",
  },
  {
    step: "03",
    title: "Massage",
    body: "Use fingertips, not nails. Work the lather through; let it sit for thirty seconds.",
  },
  {
    step: "04",
    title: "Rinse",
    body: "Rinse cool. Pat (don't twist) the lengths. Air-dry whenever the day allows.",
  },
]

const REVIEWS = [
  {
    name: "Mara K.",
    role: "Daily user, three months in",
    quote:
      "It tames the texture I usually fight. My scalp finally feels calm — and the bar still looks new.",
  },
  {
    name: "Theo R.",
    role: "Curly hair",
    quote:
      "Took one wash to stop missing my old bottle. The lather is unreal for a solid bar.",
  },
  {
    name: "Imogen S.",
    role: "Sensitive scalp",
    quote:
      "I needed something low-key. This is it. Subtle scent, no irritation, lasts forever.",
  },
]

const SPECS = [
  { label: "Format", value: "Solid bar" },
  { label: "Net weight", value: "100 g" },
  { label: "Scent profile", value: "Eucalyptus · Cedar · Citrus zest" },
  { label: "Hair type", value: "All — especially fine to medium" },
  { label: "Made in", value: "Small batches, Melbourne AU" },
  { label: "Lifespan", value: "60–80 washes" },
  { label: "pH", value: "5.5 — scalp-balanced" },
  { label: "Packaging", value: "Recycled card sleeve, plastic-free" },
]

const FAQ = [
  {
    q: "How long does one bar last?",
    a: "Around 60–80 washes, depending on hair length and frequency. Treat it like a long-distance shampoo — keep it dry between uses and it will outlast a typical bottle by two to three times.",
  },
  {
    q: "Is it safe for color-treated hair?",
    a: "Yes. Our shampoo soaps are sulfate-free and pH-balanced for color longevity. We recommend a weekly diluted apple cider vinegar rinse to keep tone bright.",
  },
  {
    q: "Vegan and cruelty-free?",
    a: "Always. Every Melano product is vegan, and never tested on animals. Suppliers are certified to the same standards.",
  },
  {
    q: "How should I store it?",
    a: "Anywhere it can drain and dry between uses. We recommend a brass stand or wooden dish — anything that lifts the bar off a wet surface.",
  },
  {
    q: "Will it work in hard water?",
    a: "It will, though you may notice a faint film at first. A monthly clarifying rinse with diluted apple cider vinegar resets shine.",
  },
]

// ----- 小型动画包装 -----

const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, delay, ease: easeBezier }}
    className={className}
  >
    {children}
  </motion.div>
)

// ----- 主组件 -----

export default function ProductDetail({
  product,
  related,
}: {
  product: NewProduct
  related: NewProduct[]
}) {
  // 兼容未来产品多图字段
  const productImages: string[] =
    (product as { images?: string[] }).images ?? [product.image]

  return (
    <>
      {/* fixed header 占位 */}
      <div className="h-24 md:h-28" />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-6xl px-6 text-xs tracking-wider"
      >
        <ol className="flex items-center gap-1.5 text-white/60">
          <li>
            <Link href="/" className="hover:text-brand transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden className="flex items-center">
            <ChevronRight className="h-3 w-3 text-white/30" />
          </li>
          <li>
            <Link href="/shop" className="hover:text-brand transition-colors">
              Shop
            </Link>
          </li>
          <li aria-hidden className="flex items-center">
            <ChevronRight className="h-3 w-3 text-white/30" />
          </li>
          <li
            aria-current="page"
            className="text-white/85 truncate max-w-[60vw]"
          >
            {product.title}
          </li>
        </ol>
      </nav>

      {/* ============================= */}
      {/* 1. Buy hero                   */}
      {/* ============================= */}
      <section className="relative px-6 pt-8 pb-20">
        <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-12 md:items-start">
          <FadeUp className="md:col-span-7">
            <Gallery images={productImages} title={product.title} />
          </FadeUp>

          <FadeUp delay={0.1} className="md:col-span-5 md:sticky md:top-32">
            <div className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-6 md:p-7">
              <BuyBox
                id={product.id}
                title={product.title}
                subtitle={product.subtitle}
                price={product.price}
                sizes={product.sizes}
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============================= */}
      {/* 2. Story                      */}
      {/* ============================= */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-12 md:items-center">
          <FadeUp className="md:col-span-7 order-2 md:order-1">
            <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
              The Story
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
              A daily object, redrawn.
            </h2>
            <div className="mt-6 space-y-5 text-base md:text-lg text-white/80 leading-relaxed">
              {STORY_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.1} className="md:col-span-5 order-1 md:order-2">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10">
              {galleryImages[4] && (
                <Image
                  src={galleryImages[4].src}
                  alt={galleryImages[4].alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============================= */}
      {/* 3. Ingredients                */}
      {/* ============================= */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="max-w-2xl">
            <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
              Inside the bar
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
              Twelve ingredients. Zero compromises.
            </h2>
            <p className="mt-4 text-base md:text-lg text-white/75 leading-relaxed">
              Each component is sourced for a single, named reason — no
              bulking agents, no surfactants chosen by spreadsheet. These four
              do most of the work.
            </p>
          </FadeUp>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INGREDIENTS.map(({ name, role, note, image, icon: Icon }, i) => (
              <motion.li
                key={name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: easeBezier }}
                className="overflow-hidden rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 hover:bg-white/[0.09] hover:border-white/15 transition-colors"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {image && (
                    <Image
                      src={image}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-brand ring-1 ring-brand/30 backdrop-blur-md">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                </div>
                <div className="p-5">
                  <span className="block text-[10px] tracking-[0.3em] uppercase text-brand">
                    {role}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {name}
                  </h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">
                    {note}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================= */}
      {/* 4. The Ritual                 */}
      {/* ============================= */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="max-w-2xl">
            <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
              The Ritual
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
              Four steps. Two minutes.
            </h2>
            <p className="mt-4 text-base md:text-lg text-white/75 leading-relaxed">
              The simplest formula on your shelf, made simpler. There is no
              priming, no mixing, no waiting.
            </p>
          </FadeUp>

          <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {RITUAL.map(({ step, title, body }, i) => (
              <motion.li
                key={step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: easeBezier }}
                className="relative rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-7 hover:border-white/20 transition-colors"
              >
                <span className="block text-5xl md:text-6xl font-semibold text-brand/90 leading-none tracking-tight">
                  {step}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm md:text-[15px] text-white/75 leading-relaxed">
                  {body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================= */}
      {/* 5. In motion (video)          */}
      {/* ============================= */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7 relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={asset("/videos/hero.mp4")}
                autoPlay
                muted
                playsInline
                loop
                preload="metadata"
                aria-label="Product in use"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/20" />
              <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-black/55 backdrop-blur-md border border-white/15 px-4 h-9 text-xs text-white/85">
                <span className="block h-1.5 w-1.5 rounded-full bg-brand" />
                In motion
              </div>
            </div>

            <div className="md:col-span-5">
              <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                Texture & feel
              </span>
              <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.1]">
                Built like a stone, behaves like a cream.
              </h2>
              <p className="mt-4 text-base text-white/80 leading-relaxed">
                The bar is dense in the hand, weighted just enough to glide
                without slip. Within seconds it dissolves into a low-volume
                lather — a softer alternative to the foam-first liquids you
                may be used to.
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-white/75">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  Lathers in 8–10 seconds
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  Rinses cleanly without weight
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                  Scent fades by the third hour
                </li>
              </ul>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============================= */}
      {/* 6. Customer voices            */}
      {/* ============================= */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center max-w-2xl mx-auto">
            <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
              Customer voices
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
              From the community.
            </h2>
          </FadeUp>

          <ul className="mt-14 grid gap-5 md:grid-cols-3">
            {REVIEWS.map(({ name, role, quote }, i) => (
              <motion.li
                key={name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: easeBezier }}
                className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-7 hover:border-white/20 transition-colors"
              >
                <Quote className="h-5 w-5 text-brand/80" strokeWidth={2} />
                <p className="mt-5 text-base text-white/85 leading-relaxed">
                  {quote}
                </p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-white/10">
                  <div className="h-9 w-9 rounded-full bg-brand/20 ring-1 ring-brand/30 grid place-items-center text-sm font-medium text-white">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {name}
                    </div>
                    <div className="text-xs text-white/55">{role}</div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================= */}
      {/* 7. Specs + FAQ                */}
      {/* ============================= */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-12">
          {/* Specs */}
          <FadeUp className="md:col-span-5">
            <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
              At a glance
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.1]">
              Specifications.
            </h2>
            <dl className="mt-8 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 divide-y divide-white/10">
              {SPECS.map(({ label, value }) => (
                <div
                  key={label}
                  className="grid grid-cols-3 gap-4 px-5 py-4 text-sm"
                >
                  <dt className="col-span-1 text-white/55">{label}</dt>
                  <dd className="col-span-2 text-white/90">{value}</dd>
                </div>
              ))}
            </dl>
          </FadeUp>

          {/* FAQ */}
          <FadeUp delay={0.1} className="md:col-span-7">
            <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
              FAQ
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.1]">
              Common questions.
            </h2>
            <div className="mt-8 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 divide-y divide-white/10">
              {FAQ.map(({ q, a }) => (
                <details
                  key={q}
                  className="group [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="cursor-pointer list-none px-5 py-5 flex items-center justify-between gap-6 text-white">
                    <span className="text-[15px] md:text-base font-medium">
                      {q}
                    </span>
                    <ChevronDown className="h-4 w-4 text-white/55 shrink-0 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 -mt-1 text-sm md:text-[15px] text-white/75 leading-relaxed">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============================= */}
      {/* 8. You may also like          */}
      {/* ============================= */}
      {related.length > 0 && (
        <section className="relative px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <FadeUp className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                  Pair it with
                </span>
                <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
                  You may also like.
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-sm text-white/85 hover:text-brand inline-flex items-center gap-1.5 transition-colors"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </FadeUp>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <motion.li
                  key={p.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: easeBezier,
                  }}
                  className="group flex flex-col rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-5 hover:bg-white/[0.07] hover:border-white/15 transition-colors"
                >
                  <Link
                    href={`/product/${p.id}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5"
                  >
                    <ImgFit src={p.image} alt={p.title} mode="contain" />
                  </Link>
                  <Link
                    href={`/product/${p.id}`}
                    className="mt-5 block min-h-[80px]"
                  >
                    <h3 className="text-[18px] font-semibold leading-snug text-white group-hover:text-brand transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/70">{p.subtitle}</p>
                  </Link>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-[15px] font-medium text-white">
                      {p.price}
                    </span>
                    <Button
                      asChild
                      className="rounded-full bg-brand text-white px-5 h-10 hover:bg-brand/90"
                    >
                      <Link href={`/product/${p.id}`}>View</Link>
                    </Button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ============================= */}
      {/* 9. Closing CTA                */}
      {/* ============================= */}
      <section className="relative min-h-[60svh] flex items-center px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
              Make it yours
            </span>
            <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
              One bar. Your daily ritual.
            </h2>
            <p className="mt-6 text-base md:text-lg text-white/80">
              Add it once. Reach for it every morning. Reorder when the
              wrapper goes empty.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="rounded-full bg-brand text-white px-7 h-12 hover:bg-brand/90"
              >
                <Link href="/checkout">
                  Buy now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full bg-transparent border-white/30 text-white px-7 h-12 hover:bg-white/10 hover:text-white"
              >
                <Link href="/shop">Back to shop</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
