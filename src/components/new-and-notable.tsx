"use client"

// The Edit —— 杂志跨页式产品介绍

import Link from "next/link"
import { motion } from "framer-motion"
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
      {/* 产品图 —— 7 列 */}
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
            bg-white/[0.04]
            border border-white/10
          "
        >
          <ImgFit src={p.image} alt={p.title} mode="contain" />
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
        <p className="font-display italic text-white/65 text-lg tracking-wide">
          № {String(index + 1).padStart(2, "0")}
        </p>

        <Hairline width={40} delay={0.2} className="mt-3" />

        <h3 className="mt-6 font-display font-light text-[40px] md:text-[52px] lg:text-[60px] leading-[1.05] tracking-tight text-white">
          {p.title}
        </h3>

        <p className="mt-4 font-display italic text-[18px] md:text-[20px] leading-snug text-brand max-w-md">
          {p.subtitle}
        </p>

        <div className="mt-10 flex items-baseline gap-8">
          <span className="font-display text-white text-[20px] md:text-[22px] tracking-wide">
            {p.price}
          </span>

          <Link
            href={`/product/${p.id}`}
            className="
              group inline-flex items-baseline gap-2
              font-display italic
              text-white hover:text-brand
              text-[16px] md:text-[17px]
              tracking-wide
              transition-colors duration-500
              border-b border-white/40 hover:border-brand
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
    <section className="relative px-6 py-32 md:py-48">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-4 text-white/70">
            <Hairline width={32} />
            <Eyebrow>The Edit · Hair</Eyebrow>
            <Hairline width={32} />
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
              text-white
            "
          >
            Three preparations.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, delay: 0.25, ease: easeCustom }}
            className="
              mt-6
              font-display
              text-white/75
              text-[18px] md:text-[20px]
              leading-relaxed
              max-w-xl mx-auto
            "
          >
            Each composed around a single native plant, formulated in
            Melbourne for daily use.
          </motion.p>
        </div>

        <div className="mt-24 md:mt-32 space-y-32 md:space-y-48">
          {products.map((p, i) => (
            <EditRow key={p.id} p={p} index={i} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
