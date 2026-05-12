"use client"

// Founder's Letter —— 编辑式长信，单列窄宽，衬线主导
// 没有花哨动画：只有非常慢的 fade-up，模仿翻开一封信的节奏

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { easeCustom } from "@/lib/motion"
import { Eyebrow, Hairline } from "@/components/ornaments"

export default function Mission() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  // 极轻 parallax：签名随滚动略向上漂
  const signatureY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={ref}
      className="relative px-6 py-32 md:py-48 text-charcoal"
    >
      <div className="mx-auto max-w-2xl">
        {/* Eyebrow + 细线 */}
        <div className="flex items-center gap-4 text-warm-grey">
          <Hairline width={32} color="rgba(91,79,61,0.45)" />
          <Eyebrow>A letter from the atelier</Eyebrow>
        </div>

        {/* 第一句：作为大标题，衬线斜体大字 */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.6, delay: 0.1, ease: easeCustom }}
          className="
            mt-10 md:mt-14
            font-display italic font-light
            text-[36px] md:text-[52px]
            leading-[1.15]
            tracking-tight
            text-charcoal
          "
        >
          When my grandmother taught me to crush eucalyptus between two stones,
          she didn&apos;t call it skincare.
        </motion.p>

        {/* 正文段落 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.6, delay: 0.3, ease: easeCustom }}
          className="
            mt-10 md:mt-12
            font-display
            text-charcoal/85
            text-[19px] md:text-[21px]
            leading-[1.65]
            space-y-6
          "
        >
          <p>
            She called it Sunday. A small ritual of patience and place — a
            granddaughter, two stones, and a sun still low in the gum trees.
          </p>
          <p>
            Melano was born from that hour. Every bottle that leaves our
            atelier is made in small batches, with botanicals grown within a
            day&apos;s drive of where we sit now. We work slowly, because skin
            is slow.
          </p>
          <p>
            If you find a moment of stillness in our formulas — we&apos;ll have
            done our job.
          </p>
        </motion.div>

        {/* 签名 —— 极轻 parallax 上飘 */}
        <motion.div
          style={{ y: signatureY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, delay: 0.5, ease: easeCustom }}
          className="mt-14 md:mt-20"
        >
          {/* 手写感签名（用 italic Fraunces + 大字 + 倾斜近似） */}
          <p
            className="font-display italic text-charcoal text-[44px] md:text-[60px] leading-none tracking-tight"
            style={{ transform: "skewX(-6deg)" }}
          >
            Anna
          </p>
          <p className="mt-4 text-sm text-warm-grey tracking-wide">
            Anna Mörel · Founder
          </p>
        </motion.div>
      </div>
    </section>
  )
}
