"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import {
  easeCustom,
  fadeUp,
  staggerContainer,
  letter,
} from "@/lib/motion"

// 逐字符 stagger — 把字符串拆成 inline-block span，每个字符依次浮现
function StaggeredText({
  text,
  delay = 0,
  className = "",
  charDelay = 0.04,
}: {
  text: string
  delay?: number
  className?: string
  charDelay?: number
}) {
  return (
    <motion.span
      variants={staggerContainer(charDelay, delay)}
      initial="hidden"
      animate="visible"
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          variants={letter}
          aria-hidden
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default function Hero() {
  return (
    <section className="relative h-screen md:h-[100svh] flex items-center justify-center px-6 text-center">
      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Vol. 装饰标 — 编辑式标题，两侧细线居中 */}
        <motion.div
          {...fadeUp(0)}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <span aria-hidden className="h-px w-10 md:w-14 bg-white/40" />
          <span className="font-display italic text-sm md:text-base text-white/75 tracking-wide">
            Vol. 01 — The Glow Edition
          </span>
          <span aria-hidden className="h-px w-10 md:w-14 bg-white/40" />
        </motion.div>

        <motion.span
          {...fadeUp(0.1)}
          className="block text-[11px] md:text-xs tracking-[0.4em] uppercase text-white/65"
        >
          Premium Organic Cosmetics
        </motion.span>

        {/* H1 — 衬线 + 逐字符浮现。两行分别 stagger 以保持节奏 */}
        <h1 className="mt-6 font-display font-medium tracking-tight text-white leading-[1.02] text-[64px] md:text-[112px]">
          <StaggeredText
            text="Glow Naturally"
            delay={0.25}
            charDelay={0.045}
            className="italic"
          />
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>
          <StaggeredText
            text="with Melano"
            delay={0.9}
            charDelay={0.04}
          />
        </h1>

        <motion.p
          {...fadeUp(1.55)}
          className="mt-8 text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
        >
          Hand-crafted, plant-based formulas designed to nourish skin and hair —
          rooted in nature, made to last.
        </motion.p>

        <motion.div {...fadeUp(1.7)} className="mt-10">
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
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator — 保持原有的微弹 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.1, ease: easeCustom }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/70"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
