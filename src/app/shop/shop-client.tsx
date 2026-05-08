"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, cubicBezier } from "framer-motion"
import {
  Search,
  ChevronDown,
  ArrowRight,
  Leaf,
  FlaskConical,
  Recycle,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import ImgFit from "@/components/ImgFit"
import { gallery } from "@/lib/data"
import type { NewProduct } from "@/lib/products"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

type SortKey = "relevance" | "price-asc" | "price-desc" | "title-asc"

const CRAFT_STEPS = [
  {
    icon: Leaf,
    title: "Sourced",
    body: "Botanicals from small-hold farms — traceable, seasonal, certified.",
  },
  {
    icon: FlaskConical,
    title: "Formulated",
    body: "Slow-blended in small batches, balanced for sensitive skin and scalps.",
  },
  {
    icon: Recycle,
    title: "Packaged",
    body: "Refillable, recyclable, designed to outlast the bar inside it.",
  },
]

function parsePrice(p: string) {
  const n = Number(p.replace(/[^\d.]/g, ""))
  return isNaN(n) ? 0 : n
}

export default function ShopClient({ products }: { products: NewProduct[] }) {
  const [q, setQ] = useState("")
  const [sort, setSort] = useState<SortKey>("relevance")

  const base = products

  const items = useMemo(() => {
    const ql = q.trim().toLowerCase()
    let arr = base.filter((p) => {
      if (!ql) return true
      return (
        p.title.toLowerCase().includes(ql) ||
        p.subtitle.toLowerCase().includes(ql)
      )
    })

    switch (sort) {
      case "price-asc":
        arr = [...arr].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
        break
      case "price-desc":
        arr = [...arr].sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
        break
      case "title-asc":
        arr = [...arr].sort((a, b) => a.title.localeCompare(b.title))
        break
    }
    return arr
  }, [q, sort, base])

  const featured = base[0]

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        {/* ============================= */}
        {/* 1. Intro                      */}
        {/* ============================= */}
        <section className="relative min-h-[78svh] flex items-center px-6 pt-32 pb-16">
          <div className="mx-auto max-w-4xl w-full">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeBezier }}
              className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70"
            >
              The Shop
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: easeBezier }}
              className="mt-5 text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05]"
            >
              Find your <br className="hidden md:block" /> daily ritual.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: easeBezier }}
              className="mt-6 max-w-xl text-base md:text-lg text-white/80 leading-relaxed"
            >
              Hand-crafted shampoo soaps, made in small batches with botanicals
              you can trace back to the farm. Every bar, slow-cured for the
              kind of clean that lasts.
            </motion.p>
          </div>
        </section>

        {/* ============================= */}
        {/* 2. Toolbar (search + sort)    */}
        {/* ============================= */}
        <section className="relative px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: easeBezier }}
            className="
              mx-auto max-w-6xl
              rounded-2xl bg-black/55 backdrop-blur-md border border-white/10
              px-4 md:px-6 py-4
              flex flex-col gap-3 md:flex-row md:items-center md:justify-between
            "
          >
            <div className="text-sm text-white/65">
              <span className="text-white">{items.length}</span> result
              {items.length !== 1 ? "s" : ""}
            </div>

            <div className="flex items-center gap-3">
              {/* 搜索 */}
              <div className="relative flex-1 md:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products…"
                  className="
                    h-11 w-full md:w-64 pl-10 pr-3
                    rounded-full bg-white/[0.06] border border-white/15
                    text-sm text-white placeholder:text-white/50 outline-none
                    focus:bg-white/10 focus:border-white/30 transition-colors
                  "
                />
              </div>

              {/* 排序 */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="
                    h-11 w-44 rounded-full
                    bg-white/[0.06] border border-white/15 text-sm text-white
                    pl-4 pr-10 appearance-none outline-none
                    focus:bg-white/10 focus:border-white/30 transition-colors
                  "
                >
                  <option className="bg-[#0b0b0b]" value="relevance">
                    Sort: Featured
                  </option>
                  <option className="bg-[#0b0b0b]" value="price-asc">
                    Price: Low → High
                  </option>
                  <option className="bg-[#0b0b0b]" value="price-desc">
                    Price: High → Low
                  </option>
                  <option className="bg-[#0b0b0b]" value="title-asc">
                    A → Z
                  </option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ============================= */}
        {/* 3. Product grid               */}
        {/* ============================= */}
        <section className="relative px-6 py-16 md:py-20">
          <div
            aria-hidden
            className="hidden md:block absolute inset-x-0 inset-y-6 mx-auto max-w-7xl rounded-3xl bg-black/45 backdrop-blur-md border border-white/10"
          />

          <div className="relative mx-auto max-w-6xl">
            {items.length === 0 ? (
              <div className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 px-6 py-16 text-center">
                <p className="text-lg text-white/85">No products found.</p>
                <p className="mt-2 text-sm text-white/60">
                  Try a different search term.
                </p>
                <button
                  onClick={() => setQ("")}
                  className="mt-6 h-11 px-5 rounded-full bg-brand text-black text-sm font-medium hover:bg-brand/90 transition-colors"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <>
                <ul className="md:hidden space-y-6">
                  {items.map((p, i) => (
                    <motion.li
                      key={p.id}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{
                        duration: 0.7,
                        delay: i * 0.06,
                        ease: easeBezier,
                      }}
                      className="overflow-hidden rounded-2xl bg-black/55 backdrop-blur-md border border-white/10"
                    >
                      <Link
                        href={`/product/${p.id}`}
                        className="relative block aspect-[4/3] bg-white/[0.03]"
                      >
                        <ImgFit src={p.image} alt={p.title} mode="contain" />
                      </Link>

                      <div className="px-5 pt-5 pb-6">
                        <Link href={`/product/${p.id}`} className="block">
                          <h3 className="text-xl font-semibold leading-snug text-white">
                            {p.title}
                          </h3>
                          <p className="mt-2 text-sm text-white/70 leading-relaxed">
                            {p.subtitle}
                          </p>
                        </Link>

                        <div className="mt-5 flex items-center justify-between gap-4">
                          <span className="text-[15px] font-medium text-white">
                            {p.price}
                          </span>
                          <Button
                            asChild
                            className="rounded-full bg-brand text-white px-5 h-11 hover:bg-brand/90 transition-colors"
                          >
                            <Link href={`/product/${p.id}`}>Add to cart</Link>
                          </Button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                <ul className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((p, i) => (
                    <motion.li
                      key={p.id}
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.7,
                        delay: (i % 3) * 0.08,
                        ease: easeBezier,
                      }}
                      className="group flex flex-col rounded-2xl bg-white/[0.04] border border-white/10 p-5 hover:bg-white/[0.07] hover:border-white/15 transition-colors"
                    >
                      <Link
                        href={`/product/${p.id}`}
                        className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5"
                      >
                        <ImgFit src={p.image} alt={p.title} mode="contain" />
                      </Link>

                      <Link
                        href={`/product/${p.id}`}
                        className="mt-5 min-h-[88px] block"
                      >
                        <h3 className="text-[18px] font-semibold leading-snug text-white group-hover:text-brand transition-colors">
                          {p.title}
                        </h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                          {p.subtitle}
                        </p>
                      </Link>

                      <div className="mt-auto pt-4">
                        <div className="text-[15px] font-medium text-white">
                          {p.price}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <Button
                            asChild
                            variant="outline"
                            className="rounded-full h-11 bg-transparent border-white/25 text-white hover:bg-white/10 hover:text-white"
                          >
                            <Link href={`/product/${p.id}`}>View</Link>
                          </Button>
                          <Button
                            asChild
                            className="rounded-full h-11 bg-brand text-white hover:bg-brand/90"
                          >
                            <Link href={`/product/${p.id}`}>Add</Link>
                          </Button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>

        {/* ============================= */}
        {/* 4. Featured spotlight         */}
        {/* ============================= */}
        {featured && (
          <section className="relative px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: easeBezier }}
                className="grid gap-10 md:grid-cols-12 md:items-center rounded-3xl bg-black/55 backdrop-blur-md border border-white/10 p-6 md:p-12"
              >
                <Link
                  href={`/product/${featured.id}`}
                  className="md:col-span-6 relative block aspect-[4/3] rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10"
                >
                  <ImgFit
                    src={featured.image}
                    alt={featured.title}
                    mode="contain"
                  />
                </Link>

                <div className="md:col-span-6">
                  <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-brand">
                    Featured this season
                  </span>
                  <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-base md:text-lg text-white/80 leading-relaxed">
                    {featured.subtitle}. Built around a lightweight,
                    cold-pressed base, this season&apos;s feature pairs
                    crystalline botanicals with a slow-cure finish — a daily
                    object you&apos;ll reach for without thinking.
                  </p>
                  <ul className="mt-6 grid gap-2 text-sm text-white/75">
                    <li>· Clarifies without stripping</li>
                    <li>· pH balanced for sensitive scalps</li>
                    <li>· 100% recyclable packaging</li>
                  </ul>
                  <div className="mt-8 flex items-center gap-4">
                    <span className="text-lg font-medium text-white">
                      {featured.price}
                    </span>
                    <Button
                      asChild
                      className="rounded-full bg-brand text-white px-6 h-12 hover:bg-brand/90"
                    >
                      <Link href={`/product/${featured.id}`}>
                        Shop the feature
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ============================= */}
        {/* 5. Craft strip                */}
        {/* ============================= */}
        <section className="relative px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: easeBezier }}
              className="max-w-2xl"
            >
              <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                The Craft
              </span>
              <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
                From farm to finish — three steps, no shortcuts.
              </h2>
              <p className="mt-4 text-base md:text-lg text-white/75 leading-relaxed">
                Every Melano product passes through the same small workshop in
                three deliberate stages. We believe the way something is made
                is part of how well it works.
              </p>
            </motion.div>

            <ul className="mt-14 grid gap-6 md:grid-cols-3">
              {CRAFT_STEPS.map(({ icon: Icon, title, body }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.1,
                    ease: easeBezier,
                  }}
                  className="overflow-hidden rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 hover:bg-white/[0.09] hover:border-white/15 transition-colors"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {gallery[i] && (
                      <Image
                        src={gallery[i].src}
                        alt={gallery[i].alt}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 33vw, 100vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    <div className="absolute top-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30 backdrop-blur-md">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="block text-[10px] tracking-[0.3em] uppercase text-white/70">
                        Step {i + 1}
                      </span>
                      <h3 className="mt-1 text-xl font-semibold text-white">
                        {title}
                      </h3>
                    </div>
                  </div>
                  <p className="px-6 py-5 text-sm md:text-[15px] text-white/75 leading-relaxed">
                    {body}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================= */}
        {/* 6. Closing CTA                */}
        {/* ============================= */}
        <section className="relative min-h-[60svh] flex items-center px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: easeBezier }}
              className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70"
            >
              Need help choosing?
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: easeBezier }}
              className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]"
            >
              We&apos;ll match you to your ritual.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.15, ease: easeBezier }}
              className="mt-6 text-base md:text-lg text-white/80"
            >
              Tell us about your hair, skin or routine and we&apos;ll
              recommend the shortest list to start with — no upsell, no fluff.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.25, ease: easeBezier }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              <Button
                asChild
                className="rounded-full bg-brand text-white px-7 h-12 hover:bg-brand/90"
              >
                <Link href="/about">
                  Take the quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full bg-transparent border-white/30 text-white px-7 h-12 hover:bg-white/10 hover:text-white"
              >
                <Link href="/about">Talk to us</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
