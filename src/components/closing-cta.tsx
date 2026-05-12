"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { maskReveal, revealUp } from "@/lib/motion"
import { Sprig, ChapterMark } from "@/components/ornaments"

export default function ClosingCta() {
  return (
    <section className="relative min-h-[85svh] flex items-center px-6 py-32">
      {/* 居中柔光晕 — 给收尾大字一点光感重量 */}
      <div
        aria-hidden
        className="absolute inset-0 mx-auto max-w-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(161,193,161,0.10) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* 章节编号 04 */}
        <div className="inline-block">
          <ChapterMark number="04" label="Begin" align="center" />
        </div>

        {/* 植物 SVG 装饰 — 中央位置，pathLength 画线动画 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex justify-center text-brand/85"
        >
          <Sprig size={64} delay={0.3} />
        </motion.div>

        {/* 大标题 — clip 擦出 + 衬线斜体 */}
        <div className="mt-8 overflow-hidden">
          <motion.h2
            {...maskReveal(0.1, 1.2)}
            className="font-display italic font-medium tracking-tight text-white leading-[1.02] text-[64px] md:text-[120px]"
          >
            Find your glow.
          </motion.h2>
        </div>

        <motion.p
          {...revealUp(0.2, 0.8)}
          className="mt-8 text-base md:text-lg text-white/80 leading-relaxed max-w-xl mx-auto"
        >
          Explore the full Melano range — every formula, every ritual.
        </motion.p>

        <motion.div {...revealUp(0.35, 0.8)} className="mt-12">
          <div className="inline-block border border-white/80 p-1 md:p-1.5">
            <Button
              asChild
              className="
                group rounded-full bg-brand text-white
                font-semibold text-base
                px-7 md:px-8 py-3 md:py-3.5
                transition-all
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-brand/70
                focus-visible:ring-offset-2 focus-visible:ring-offset-black
              "
            >
              <Link href="/shop">
                Shop the Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
