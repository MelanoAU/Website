"use client"

// Atelier Hero —— 编辑式 wordmark + 一行注脚 + 极小 scroll 指示
// 无视频、无按钮、无章节号。让品牌名字本身承担全部重量。

import { motion } from "framer-motion"
import { easeCustom } from "@/lib/motion"
import { Hairline } from "@/components/ornaments"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-charcoal overflow-hidden">
      {/* 顶部暖炭→纸色渐变：给 fixed 深色 header 一个可以呼吸的暗带，
          header 的白字不至于在 cream 上洗成隐形 */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-48 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #0D0D0D 0%, rgba(31,26,18,0.55) 40%, rgba(239,231,214,0) 100%)",
        }}
      />

      {/* 中心 vignette —— 让边缘略暗，纸的光晕感 */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(239,231,214,0) 40%, rgba(95,80,55,0.18) 100%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* 顶部小字 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease: easeCustom }}
          className="flex items-center justify-center gap-4 text-warm-grey"
        >
          <Hairline width={40} delay={0.6} color="rgba(91,79,61,0.5)" />
          <span className="text-[10px] md:text-[11px] tracking-[0.36em] uppercase">
            Sydney · est. mmxxv
          </span>
          <Hairline width={40} delay={0.6} color="rgba(91,79,61,0.5)" />
        </motion.div>

        {/* 巨型 wordmark —— 衬线斜体，承担整个 hero 的视觉重量 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.7, ease: easeCustom }}
          className="
            mt-10 md:mt-12
            font-display italic font-light
            text-charcoal
            leading-[0.95] tracking-[-0.02em]
            text-[88px] sm:text-[140px] md:text-[200px] lg:text-[260px]
          "
        >
          Melano
        </motion.h1>

        {/* 一行 tagline —— 衬线非斜体，克制 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 1.4, ease: easeCustom }}
          className="
            mt-8 md:mt-10
            font-display
            text-charcoal/85
            text-xl md:text-2xl lg:text-[28px]
            leading-snug
            tracking-tight
            max-w-2xl mx-auto
          "
        >
          An apothecary of small-batch botanicals,
          <br className="hidden md:block" /> made by hand.
        </motion.p>

        {/* 底部小字标 —— 单一 italic 链接，奢华品牌的克制 CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.1, ease: easeCustom }}
          className="mt-14 md:mt-16"
        >
          <a
            href="/shop"
            className="
              inline-block
              font-display italic
              text-charcoal/80 hover:text-deep-sage
              text-base md:text-lg
              tracking-wide
              transition-colors duration-500
              border-b border-charcoal/40 hover:border-deep-sage
              pb-1
            "
          >
            Discover the collection
          </a>
        </motion.div>
      </div>

      {/* Scroll 指示 —— 极小 italic */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2.4, ease: easeCustom }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-warm-grey"
      >
        <span className="font-display italic text-xs tracking-wide">scroll</span>
        <motion.span
          aria-hidden
          animate={{ scaleY: [0, 1, 0] }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="block w-px h-10 bg-warm-grey/50"
        />
      </motion.div>
    </section>
  )
}
