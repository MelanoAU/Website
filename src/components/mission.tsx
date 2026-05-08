"use client"

import { motion, useScroll, useTransform, cubicBezier } from "framer-motion"
import { useRef } from "react"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

export default function Mission() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section
      ref={ref}
      className="relative min-h-[90svh] flex items-center px-6 py-28"
    >
      <div className="mx-auto max-w-4xl">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: easeBezier }}
          className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70"
        >
          Our Mission
        </motion.span>

        <motion.h2
          style={{ y }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: easeBezier }}
          className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]"
        >
          Beauty, rooted in nature.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.15, ease: easeBezier }}
          className="mt-8 max-w-2xl text-lg md:text-xl text-white/80 leading-relaxed"
        >
          At Melano we craft high-quality cosmetics that enhance natural beauty.
          We believe in empowering people to express themselves through
          innovative, sustainable products — made with care, made to last.
        </motion.p>
      </div>
    </section>
  )
}
