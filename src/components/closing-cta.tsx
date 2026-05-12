"use client"

// Sincerely —— 极简收尾签名
// 一个想法、一行链接、然后大量的留白把读者送到 footer

import { motion } from "framer-motion"
import Link from "next/link"
import { easeCustom } from "@/lib/motion"
import { Sprig, Eyebrow, Hairline } from "@/components/ornaments"

export default function ClosingCta() {
  return (
    <section className="relative px-6 py-32 md:py-56 text-charcoal text-center">
      {/* 顶部 Sprig 装饰 —— 单一植物枝条画线动画 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: easeCustom }}
        className="flex justify-center text-deep-sage/85"
      >
        <Sprig size={80} delay={0.2} />
      </motion.div>

      <div className="mt-10 flex items-center justify-center gap-4 text-warm-grey">
        <Hairline width={32} color="rgba(91,79,61,0.45)" />
        <Eyebrow>Sincerely</Eyebrow>
        <Hairline width={32} color="rgba(91,79,61,0.45)" />
      </div>

      {/* 收尾大字 —— 衬线斜体 */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, delay: 0.1, ease: easeCustom }}
        className="
          mt-10 md:mt-12
          font-display italic font-light
          text-[56px] md:text-[96px] lg:text-[120px]
          leading-[0.95]
          tracking-tight
          text-charcoal
          max-w-4xl mx-auto
        "
      >
        Made by hand.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.4, delay: 0.3, ease: easeCustom }}
        className="
          mt-8
          font-display
          text-charcoal/75
          text-[18px] md:text-[20px]
          leading-relaxed
          max-w-md mx-auto
        "
      >
        From a small atelier in Sydney, with patience and place.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.4, delay: 0.5, ease: easeCustom }}
        className="mt-14 md:mt-16"
      >
        <Link
          href="/shop"
          className="
            group inline-flex items-baseline gap-3
            font-display italic
            text-charcoal hover:text-deep-sage
            text-lg md:text-xl
            tracking-wide
            transition-colors duration-500
            border-b border-charcoal/40 hover:border-deep-sage
            pb-1
          "
        >
          Shop the collection
          <span
            aria-hidden
            className="transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </motion.div>
    </section>
  )
}
