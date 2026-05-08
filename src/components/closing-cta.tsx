"use client"

import { motion, cubicBezier } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

export default function ClosingCta() {
  return (
    <section className="relative min-h-[80svh] flex items-center px-6 py-28">
      <div className="mx-auto max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: easeBezier }}
          className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70"
        >
          Begin
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: easeBezier }}
          className="mt-5 text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05]"
        >
          Find your glow.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.15, ease: easeBezier }}
          className="mt-6 text-base md:text-lg text-white/80"
        >
          Explore the full Melano range — every formula, every ritual.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.25, ease: easeBezier }}
          className="mt-10"
        >
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
