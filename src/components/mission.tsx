"use client"

// Founder's Letter —— 品牌初心与缘起 · 编辑式长信，单列窄宽，衬线主导

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
  const signatureY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={ref}
      className="relative px-6 py-32 md:py-48"
    >
      <div className="mx-auto max-w-2xl">
        {/* Eyebrow + 细线 */}
        <div className="flex items-center gap-4 text-white/70">
          <Hairline width={32} />
          <Eyebrow>From the atelier · Melbourne</Eyebrow>
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
            text-white
          "
        >
          Some brands are born from market demand. Others, from a
          lifelong obsession — and Melano belongs firmly to the latter.
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
            text-white/85
            text-[19px] md:text-[21px]
            leading-[1.65]
            space-y-6
          "
        >
          <p>
            Melano was founded by an Australian-born Chinese woman
            raised in Melbourne — a brand written at the meeting of a
            laid-back Australian life and the long, careful tradition
            of Eastern herbal medicine.
          </p>
          <p>
            She grew up alongside the precious botanicals that anchor
            our work — Fo-Ti, Biota Leaf, Soapberry, Usman herb —
            plants that carry, in their oldest sense, the meaning of
            balance and gentle care.
          </p>
          <p>
            A long journey across Asia clarified what mild plant-based
            hair care could be. Nourishment over harsh cleansing.
            Balance over excessive treatment. Long-term wellness over
            instant effect. That insight became the spirit of Melano.
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
          <p
            className="font-display italic text-white text-[44px] md:text-[60px] leading-none tracking-tight"
            style={{ transform: "skewX(-6deg)" }}
          >
            Melano
          </p>
          <p className="mt-4 text-sm text-white/65 tracking-wide">
            Melbourne · mmxxvi
          </p>
        </motion.div>
      </div>
    </section>
  )
}
