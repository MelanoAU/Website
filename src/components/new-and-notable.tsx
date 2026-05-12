"use client"

import Link from "next/link"
import { useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { NewProduct } from "@/lib/products"
import ImgFit from "@/components/ImgFit"
import { maskReveal, revealUp } from "@/lib/motion"
import { ChapterMark } from "@/components/ornaments"

// ====== 单卡片：图片有滚动驱动的横向 X 漂移（subtle parallax） ======
function ProductCard({
  p,
  i,
}: {
  p: NewProduct
  i: number
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  // 三张卡：左卡向右漂、中卡向左漂、右卡向右漂（交错节奏）
  // 强度故意保持很小（±16px），让动作高级不抢戏
  const xRange: [number, number] =
    i === 0 ? [-16, 16] : i === 2 ? [16, -16] : [12, -12]
  const x = useTransform(scrollYProgress, [0, 1], xRange)

  return (
    <article
      ref={ref}
      className="
        h-full flex flex-col rounded-2xl
        bg-white/[0.04] border border-white/10
        hover:bg-white/[0.07] hover:border-brand/30
        transition-colors duration-500
        p-6
      "
    >
      {/* 产品图：被一个 overflow-hidden 容器包裹，内部 motion.div 横向 parallax */}
      <Link
        href={`/product/${p.id}`}
        className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5"
      >
        <motion.div style={{ x }} className="absolute inset-0 will-change-transform">
          <ImgFit src={p.image} alt={p.title} mode="contain" />
        </motion.div>
      </Link>

      <Link href={`/product/${p.id}`} className="mt-6 min-h-[88px] block">
        <h3 className="font-display text-[22px] md:text-2xl font-medium leading-snug text-white">
          {p.title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-white/70">
          {p.subtitle}
        </p>
      </Link>

      <div className="mt-auto">
        <div className="mt-4 text-[15px] font-medium text-white tracking-wide">
          {p.price}
        </div>
        <div className="mt-4">
          <Button
            className="w-full h-12 rounded-full bg-brand text-white hover:bg-brand/90 transition-colors"
            asChild
          >
            <Link href={`/product/${p.id}`}>Add to cart</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

export default function NewAndNotable({ products }: { products: NewProduct[] }) {
  // Hooks 必须在条件 return 之前调用 — 满足 React rules-of-hooks。
  // Embla 提供原生触屏 / 鼠标拖拽。这里不需要外部 UI 控件，
  // 所以只保留 ref，跳过状态追踪（更轻量、更好维护）。
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  })

  const items = products
  if (!items.length) return null

  return (
    <section className="relative px-6 py-28">
      {/* 背景卡：更深更厚实 */}
      <div
        aria-hidden
        className="hidden md:block absolute inset-x-0 inset-y-10 mx-auto max-w-7xl rounded-3xl bg-black/65 backdrop-blur-md border border-white/10"
      />
      <div className="relative mx-auto max-w-6xl">
        {/* 章节编号 03 — 居中布局 */}
        <div className="text-center">
          <div className="inline-block">
            <ChapterMark number="03" label="The Range" align="center" />
          </div>
        </div>

        {/* 大标题 — clip 擦出，衬线斜体重点词 */}
        <div className="mt-10 overflow-hidden text-center">
          <motion.h2
            {...maskReveal(0.1, 1.1)}
            className="font-display font-medium tracking-tight text-white text-[40px] md:text-[72px] leading-[1.05]"
          >
            New <span className="italic text-brand/90">&amp;</span> notable.
          </motion.h2>
        </div>

        <motion.p
          {...revealUp(0.2, 0.8)}
          className="mt-6 max-w-2xl mx-auto text-center text-base md:text-lg text-white/75 leading-relaxed"
        >
          A collection of longstanding formulations and recent additions to the
          range — each likely to make for a memorable gift.
        </motion.p>

        {/* Mobile：单列堆叠 */}
        <ul className="md:hidden mt-12 space-y-6">
          {items.map((p, i) => (
            <motion.li
              key={p.id}
              {...revealUp(i * 0.08, 0.75)}
              className="overflow-hidden rounded-2xl bg-black/55 backdrop-blur-md border border-white/10"
            >
              <Link
                href={`/product/${p.id}`}
                className="relative block aspect-[4/3] bg-white/[0.03]"
              >
                <ImgFit src={p.image} alt={p.title} mode="contain" />
              </Link>

              <div className="px-6 pt-5 pb-6">
                <Link href={`/product/${p.id}`} className="block">
                  <h3 className="font-display text-2xl font-medium leading-snug text-white">
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

        {/* Desktop：三栏 Embla 横向轮播 + 每张卡片产品图自带 X parallax */}
        <motion.div
          {...revealUp(0.15, 0.85)}
          className="hidden md:block relative mt-14"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 items-stretch">
              {items.map((p, i) => (
                <div
                  key={p.id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <ProductCard p={p} i={i} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
