"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { revealUp, maskReveal } from "@/lib/motion"
import { ChapterMark, Hairline } from "@/components/ornaments"

export default function Mission() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  // 轻微纵向 parallax 给副标题文字
  const y = useTransform(scrollYProgress, [0, 1], [80, -80])

  return (
    <section
      ref={ref}
      className="relative min-h-[90svh] flex items-center px-6 py-32"
    >
      <div className="mx-auto max-w-5xl w-full">
        {/* 章节编号 01 */}
        <ChapterMark number="01" label="Our Mission" />

        {/* 大标题 — clip-path 横向擦出，衬线斜体 */}
        <div className="mt-12 overflow-hidden">
          <motion.h2
            {...maskReveal(0.1, 1.2)}
            className="font-display italic font-medium tracking-tight text-white leading-[1.02] text-[44px] md:text-[88px]"
          >
            Beauty, rooted in nature.
          </motion.h2>
        </div>

        {/* 装饰横线 + 主文案，主文案有轻微 parallax */}
        <div className="mt-12 flex flex-col md:flex-row gap-10 md:gap-16">
          <div className="md:w-32 pt-2 shrink-0">
            <Hairline
              width="100%"
              delay={0.3}
              color="rgba(255,255,255,0.3)"
            />
          </div>
          <motion.p
            style={{ y }}
            {...revealUp(0.15, 0.85)}
            className="max-w-2xl text-lg md:text-xl text-white/80 leading-relaxed"
          >
            At Melano we craft high-quality cosmetics that enhance natural beauty.
            We believe in empowering people to express themselves through
            innovative, sustainable products — made with care, made to last.
          </motion.p>
        </div>
      </div>

    </section>
  )
}
