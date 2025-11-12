// src/lib/motion.ts
import { cubicBezier, type Transition } from "framer-motion"

const easeCustom = cubicBezier(0.22, 1, 0.36, 1)

export const fadeUp = (delay = 0, duration = 0.6) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: easeCustom } as Transition
})
