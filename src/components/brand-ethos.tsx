"use client"

// Brand Ethos —— 品牌格调与养护价值 · 左叶（镜像枝条）+ 右文，作为 Botanical Spotlight 的视觉对位

import { motion } from "framer-motion"
import { easeCustom, revealUp } from "@/lib/motion"
import { Eyebrow, EucalyptusBranch, Hairline } from "@/components/ornaments"

const PRINCIPLES = [
  { label: "East × West", value: "Eastern herb, Australian native" },
  { label: "Native pair", value: "Tea tree · Eucalyptus" },
  { label: "Focus", value: "Long-term scalp health" },
  { label: "Free of", value: "Silicones & harsh surfactants" },
]

export default function BrandEthos() {
  return (
    <section className="relative px-6 py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-[auto_1fr] gap-12 md:gap-20 items-start">
        {/* ============= LEFT: 大尺寸 SVG 枝条（镜像，叶子方向指向右侧文字） ============= */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: easeCustom }}
          className="
            relative
            justify-self-center md:justify-self-start
            text-brand
            -scale-x-100
          "
        >
          <EucalyptusBranch
            delay={0.4}
            className="
              w-[260px] sm:w-[320px] md:w-[400px] lg:w-[480px]
              h-auto
            "
          />
        </motion.div>

        {/* ============= RIGHT: 文字 ============= */}
        <div className="md:pt-16">
          <div className="flex items-center gap-4 text-white/70">
            <Hairline width={32} />
            <Eyebrow>On the daily ritual</Eyebrow>
          </div>

          <motion.h2
            {...revealUp(0.1, 1.4)}
            className="
              mt-8 md:mt-10
              font-display font-light
              text-[56px] md:text-[88px] lg:text-[104px]
              leading-[0.95]
              tracking-tight
              text-white
            "
          >
            Simplicity.
          </motion.h2>

          <motion.p
            {...revealUp(0.25, 1.4)}
            className="
              mt-4 md:mt-6
              font-display italic
              text-[22px] md:text-[28px]
              leading-snug
              text-brand
            "
          >
            A daily ritual where Eastern herb meets Australian native.
          </motion.p>

          <motion.p
            {...revealUp(0.4, 1.4)}
            className="
              mt-10 md:mt-12
              font-display
              text-white/80
              text-[18px] md:text-[19px]
              leading-[1.7]
              max-w-md
            "
          >
            Melano stands for simplicity without compromise — Eastern
            herbal essence joined to the Australian natives we grew up
            on, tea tree and eucalyptus among them. Infused with Fo-Ti,
            Biota Leaf, Soapberry and Usman herb, our shampoo bars hold
            scalp balance gently, free of silicone and harsh surfactants.
            Hair care, in the end, is also a small ritual — a quiet
            return of vitality to the scalp and the hair, in keeping
            with the way nature and modern life can comfortably coexist.
          </motion.p>

          <motion.ul
            {...revealUp(0.55, 1.4)}
            className="mt-14 md:mt-16 space-y-5 max-w-md"
          >
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.label}
                className="grid grid-cols-[120px_1fr] gap-4 items-baseline border-b border-white/12 pb-4"
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/65">
                  {p.label}
                </span>
                <span className="font-display italic text-white text-[18px] md:text-[19px] leading-snug">
                  {p.value}
                </span>
                <span className="sr-only">{i + 1}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
