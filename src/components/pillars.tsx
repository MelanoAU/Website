"use client"

import { motion, cubicBezier } from "framer-motion"
import { Leaf, Recycle, HeartHandshake } from "lucide-react"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const PILLARS = [
  {
    icon: Leaf,
    title: "Organic Ingredients",
    body: "Plant-based, ethically sourced botanicals — never synthetic fillers.",
  },
  {
    icon: Recycle,
    title: "Sustainable Craft",
    body: "Small-batch production and recyclable packaging at every step.",
  },
  {
    icon: HeartHandshake,
    title: "Cruelty-Free",
    body: "Always tested on humans first. Never on animals — full stop.",
  },
]

export default function Pillars() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeBezier }}
          className="max-w-2xl"
        >
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            Why Melano
          </span>
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
            Three principles. One uncompromising standard.
          </h2>
        </motion.div>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: easeBezier }}
              className="
                relative rounded-2xl p-7 md:p-8
                bg-white/[0.06] backdrop-blur-md
                border border-white/10
                hover:bg-white/[0.09] hover:border-white/15
                transition-colors
              "
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed">
                {body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
