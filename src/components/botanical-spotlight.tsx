"use client"

// Botanical Spotlight —— 单一招牌植物的编辑式分栏
// 左：文字介绍 + 数据点
// 右：大尺寸 SVG 手绘尤加利枝条，滚动进入时逐叶画线动画

import { motion } from "framer-motion"
import { easeCustom, revealUp } from "@/lib/motion"
import { Eyebrow, EucalyptusBranch, Hairline } from "@/components/ornaments"

const FACTS = [
  { label: "Native to", value: "New South Wales wetlands" },
  { label: "Harvested at", value: "First light, by hand" },
  { label: "Pressed within", value: "12 hours of harvest" },
  { label: "Bottled in", value: "Surry Hills, Sydney" },
]

export default function BotanicalSpotlight() {
  return (
    <section className="relative px-6 py-32 md:py-48 text-charcoal overflow-hidden">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-20 items-start">
        {/* ============= LEFT: 文字 ============= */}
        <div className="md:pt-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 text-warm-grey">
            <Hairline width={32} color="rgba(91,79,61,0.45)" />
            <Eyebrow>Featured Botanical</Eyebrow>
          </div>

          {/* 大标题 */}
          <motion.h2
            {...revealUp(0.1, 1.4)}
            className="
              mt-8 md:mt-10
              font-display font-light
              text-[56px] md:text-[88px] lg:text-[104px]
              leading-[0.95]
              tracking-tight
              text-charcoal
            "
          >
            Tea Tree.
          </motion.h2>

          <motion.p
            {...revealUp(0.25, 1.4)}
            className="
              mt-4 md:mt-6
              font-display italic
              text-[22px] md:text-[28px]
              leading-snug
              text-deep-sage
            "
          >
            A long history in a small leaf.
          </motion.p>

          <motion.p
            {...revealUp(0.4, 1.4)}
            className="
              mt-10 md:mt-12
              font-display
              text-charcoal/80
              text-[18px] md:text-[19px]
              leading-[1.7]
              max-w-md
            "
          >
            Native to the wetlands of New South Wales, the tea tree&apos;s
            leaves carry over three hundred recorded benefits — most of which
            we still don&apos;t fully understand. We cold-press at dawn, when
            the oils are still wet with night dew.
          </motion.p>

          {/* 编辑式数据点 —— 类似杂志侧栏 */}
          <motion.ul
            {...revealUp(0.55, 1.4)}
            className="mt-14 md:mt-16 space-y-5 max-w-md"
          >
            {FACTS.map((f, i) => (
              <li
                key={f.label}
                className="grid grid-cols-[120px_1fr] gap-4 items-baseline border-b border-charcoal/12 pb-4"
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-warm-grey">
                  {f.label}
                </span>
                <span className="font-display italic text-charcoal text-[18px] md:text-[19px] leading-snug">
                  {f.value}
                </span>
                {/* 编号小字（左上角小数字，编辑感） */}
                <span className="sr-only">{i + 1}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ============= RIGHT: 大尺寸 SVG 枝条 ============= */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: easeCustom }}
          className="
            relative
            justify-self-center md:justify-self-end
            text-deep-sage
            -order-1 md:order-none
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
      </div>
    </section>
  )
}
