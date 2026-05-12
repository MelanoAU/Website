"use client"

import { motion } from "framer-motion"
import { Leaf, Recycle, HeartHandshake } from "lucide-react"
import { maskReveal, revealLeft, revealRight, revealUp } from "@/lib/motion"
import { ChapterMark, Hairline } from "@/components/ornaments"

const PILLARS = [
  {
    number: "01",
    icon: Leaf,
    title: "Organic Ingredients",
    body: "Plant-based, ethically sourced botanicals — never synthetic fillers. Every batch traced from soil to skin.",
  },
  {
    number: "02",
    icon: Recycle,
    title: "Sustainable Craft",
    body: "Small-batch production and recyclable packaging at every step. Made in measured quantities, never in excess.",
  },
  {
    number: "03",
    icon: HeartHandshake,
    title: "Cruelty-Free",
    body: "Always tested on humans first. Never on animals — full stop. Certified by independent third parties.",
  },
]

export default function Pillars() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        {/* 章节编号 02 */}
        <ChapterMark number="02" label="Why Melano" />

        {/* 大标题 — clip 擦出 */}
        <div className="mt-10 overflow-hidden">
          <motion.h2
            {...maskReveal(0.1, 1.1)}
            className="font-display font-medium tracking-tight text-white leading-[1.05] text-[36px] md:text-[68px] max-w-3xl"
          >
            Three principles. <span className="italic text-brand/90">One uncompromising</span> standard.
          </motion.h2>
        </div>

        {/* 卡片网格 — 三张卡分别从左/下/右滑入，节奏更立体 */}
        <ul className="mt-16 grid gap-7 md:grid-cols-3">
          {PILLARS.map(({ number, icon: Icon, title, body }, i) => {
            // 左卡从左滑入，中卡从下浮起，右卡从右滑入 — 三种动画并行
            const anim =
              i === 0
                ? revealLeft(0.1, 0.9)
                : i === 2
                  ? revealRight(0.1, 0.9)
                  : revealUp(0.18, 0.8)

            return (
              <motion.li
                key={title}
                {...anim}
                whileHover={{ y: -6 }}
                transition={{ ...anim.transition }}
                className="
                  group relative rounded-2xl
                  panel-solid
                  p-8 md:p-10
                  flex flex-col
                "
              >
                {/* 顶部：大号衬线编号（白色，避免与背景套色） + 图标 */}
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display italic text-5xl md:text-6xl text-white leading-none">
                    {number}
                  </span>
                  <Icon
                    className="h-7 w-7 text-brand/70 group-hover:text-brand transition-colors"
                    strokeWidth={1.4}
                    aria-hidden
                  />
                </div>

                <div className="mt-8">
                  <Hairline
                    width={40}
                    delay={0.4 + i * 0.1}
                    color="rgba(161, 193, 161, 0.5)"
                  />
                </div>

                <h3 className="mt-5 font-display text-2xl md:text-3xl font-medium text-white leading-snug">
                  {title}
                </h3>
                <p className="mt-4 text-[15px] md:text-base text-white/70 leading-relaxed">
                  {body}
                </p>
              </motion.li>
            )
          })}
        </ul>
      </div>

    </section>
  )
}
