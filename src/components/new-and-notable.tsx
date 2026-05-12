"use client"

// The Edit —— 杂志跨页式产品介绍
// 不再是均等的三列卡片网格。每件产品独占一行，左右交替，
// 大尺寸产品图 + 编号 + 衬线标题 + 极简购买链接（无大按钮）

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import type { NewProduct } from "@/lib/products"
import ImgFit from "@/components/ImgFit"
import { easeCustom, revealLeft, revealRight, revealUp } from "@/lib/motion"
import { Eyebrow, Hairline } from "@/components/ornaments"

function EditRow({
  p,
  index,
  flip,
}: {
  p: NewProduct
  index: number
  flip: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  // 产品图随滚动轻微纵向 parallax（图比文字慢）
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center"
    >
      {/* 产品图 —— 占 7 列，根据 flip 决定在左还是右 */}
      <motion.div
        {...(flip ? revealRight(0, 1.4) : revealLeft(0, 1.4))}
        className={`
          relative md:col-span-7
          ${flip ? "md:order-2" : "md:order-1"}
        `}
      >
        <Link
          href={`/product/${p.id}`}
          className="
            block relative
            aspect-[4/3] md:aspect-[5/4]
            overflow-hidden
            bg-cream
            border border-charcoal/8
          "
        >
          <motion.div
            style={{ y: imgY }}
            className="absolute inset-0 will-change-transform"
          >
            <ImgFit src={p.image} alt={p.title} mode="contain" />
          </motion.div>
        </Link>
      </motion.div>

      {/* 右侧文字栏 —— 5 列 */}
      <motion.div
        {...revealUp(0.1, 1.2)}
        className={`
          md:col-span-5
          ${flip ? "md:order-1 md:pr-10" : "md:order-2 md:pl-10"}
        `}
      >
        {/* 编号：编辑式大字 */}
        <p className="font-display italic text-warm-grey text-lg tracking-wide">
          № {String(index + 1).padStart(2, "0")}
        </p>

        <Hairline
          width={40}
          delay={0.2}
          color="rgba(91,79,61,0.4)"
          className="mt-3"
        />

        <h3 className="mt-6 font-display font-light text-[40px] md:text-[52px] lg:text-[60px] leading-[1.05] tracking-tight text-charcoal">
          {p.title}
        </h3>

        <p className="mt-4 font-display italic text-[18px] md:text-[20px] leading-snug text-deep-sage max-w-md">
          {p.subtitle}
        </p>

        <div className="mt-10 flex items-baseline gap-8">
          <span className="font-display text-charcoal text-[20px] md:text-[22px] tracking-wide">
            {p.price}
          </span>

          {/* 极简购买链接 —— 不是按钮 */}
          <Link
            href={`/product/${p.id}`}
            className="
              group inline-flex items-baseline gap-2
              font-display italic
              text-charcoal hover:text-deep-sage
              text-[16px] md:text-[17px]
              tracking-wide
              transition-colors duration-500
              border-b border-charcoal/40 hover:border-deep-sage
              pb-1
            "
          >
            Add to atelier
            <span
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function NewAndNotable({ products }: { products: NewProduct[] }) {
  if (!products.length) return null

  return (
    <section className="relative px-6 py-32 md:py-48 text-charcoal">
      <div className="mx-auto max-w-6xl">
        {/* 章节头 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 text-warm-grey">
            <Hairline width={32} color="rgba(91,79,61,0.45)" />
            <Eyebrow>The Edit · Spring</Eyebrow>
            <Hairline width={32} color="rgba(91,79,61,0.45)" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, delay: 0.1, ease: easeCustom }}
            className="
              mt-10
              font-display font-light italic
              text-[48px] md:text-[80px] lg:text-[96px]
              leading-[0.95]
              tracking-tight
              text-charcoal
            "
          >
            Three rituals.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, delay: 0.25, ease: easeCustom }}
            className="
              mt-6
              font-display
              text-charcoal/75
              text-[18px] md:text-[20px]
              leading-relaxed
              max-w-xl mx-auto
            "
          >
            A short edit of what we&apos;re pressing this season — formulations
            we&apos;d gift to our closest friends.
          </motion.p>
        </div>

        {/* 编辑式跨页：每件产品独占一行，左右交替 */}
        <div className="mt-24 md:mt-32 space-y-32 md:space-y-48">
          {products.map((p, i) => (
            <EditRow key={p.id} p={p} index={i} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
