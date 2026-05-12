"use client"

// Founder's Letter —— 编辑式长信，单列窄宽，衬线主导

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
          The botany of Australia&apos;s southeast is older than the cities
          above it — and far better catalogued than the cosmetic industry
          has been quick to notice.
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
            From the Yarra catchment to the mountain ash forests of the
            Dandenongs, Victoria sits at the meeting of two botanical
            kingdoms — dry-country mallee to the west, wet forests to the
            east. Melano is a study of the plants that grow at their meeting,
            written for hair, scalp, and the routines that surround them.
          </p>
          <p>
            Our preparations are formulated around native materia and
            structured around restraint. The library is short on purpose:
            each bar leads with a single botanical, supported by the few
            cleansing and conditioning agents that actually contribute to
            the formulation. No sulfates, no silicones, no
            parabens, no synthetic fragrance.
          </p>
          <p>
            If our preparations find a place in your morning — and your
            routine feels a little more rooted in where you live — we&apos;ll
            consider the work done.
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
