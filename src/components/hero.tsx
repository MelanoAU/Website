"use client"

import { motion, cubicBezier } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: easeBezier },
})

export default function Hero() {
  return (
    <section className="relative h-screen md:h-[100svh] flex items-center justify-center px-6 text-center">
      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.span
          {...fadeUp(0)}
          className="inline-block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70"
        >
          Premium Organic Cosmetics
        </motion.span>

        <motion.h1
          {...fadeUp(0.1)}
          className="mt-5 text-5xl md:text-7xl font-extrabold tracking-tight text-white"
        >
          Glow Naturally <br className="hidden md:block" /> with Melano
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-5 text-base md:text-lg text-white/85 max-w-xl mx-auto"
        >
          Hand-crafted, plant-based formulas designed to nourish skin and hair —
          rooted in nature, made to last.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="mt-9">
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

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: easeBezier }}
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
