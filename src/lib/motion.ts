// src/lib/motion.ts
//
// 全站动画原语。每个 helper 返回可直接 spread 到 motion 组件的 props。
//
// 分两大类：
//  - 入场（initial + animate）：fadeUp — 用于上方 fold 立即播放
//  - 滚动进入视野时触发（initial + whileInView + viewport）：revealXxx
//
import { cubicBezier, type Transition, type Variants } from "framer-motion"

export const easeCustom = cubicBezier(0.22, 1, 0.36, 1)

/** 入场用：fade + 上移（页面加载即播） */
export const fadeUp = (delay = 0, duration = 0.7) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: easeCustom } as Transition,
})

/** 滚动进入视野：fade + 上移 */
export const revealUp = (delay = 0, duration = 0.7) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration, delay, ease: easeCustom } as Transition,
})

/** 从左侧滑入 */
export const revealLeft = (delay = 0, duration = 0.8) => ({
  initial: { opacity: 0, x: -56 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration, delay, ease: easeCustom } as Transition,
})

/** 从右侧滑入 */
export const revealRight = (delay = 0, duration = 0.8) => ({
  initial: { opacity: 0, x: 56 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration, delay, ease: easeCustom } as Transition,
})

/** Clip-path 横向擦出 — 文字从左到右像揭开一张纸 */
export const maskReveal = (delay = 0, duration = 1.05) => ({
  initial: { clipPath: "inset(0 100% 0 0)" },
  whileInView: { clipPath: "inset(0 0% 0 0)" },
  viewport: { once: true, amount: 0.4 },
  transition: { duration, delay, ease: easeCustom } as Transition,
})

/** scaleX 横向画线 — 给装饰细线用（origin: left） */
export const drawLine = (delay = 0, duration = 1) => ({
  initial: { scaleX: 0 },
  whileInView: { scaleX: 1 },
  viewport: { once: true, amount: 0.5 },
  transition: { duration, delay, ease: easeCustom } as Transition,
})

/** 父容器：stagger 子元素的入场 */
export const staggerContainer = (
  staggerChildren = 0.06,
  delayChildren = 0
): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
})

/** 子项：用于逐字 / 逐词 stagger，y 用 em 单位与字号自适应 */
export const letter: Variants = {
  hidden: { opacity: 0, y: "0.55em" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeCustom },
  },
}
