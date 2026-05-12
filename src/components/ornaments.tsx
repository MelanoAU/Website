"use client"

// 编辑式装饰组件 —— 颜色全部参数化，避免被 cream / dark 主题绑死

import { motion } from "framer-motion"
import { easeCustom } from "@/lib/motion"

/**
 * Hairline — 细水平线，scaleX 从 0 画到 1
 */
export function Hairline({
  className = "",
  delay = 0,
  width = 80,
  thickness = 1,
  origin = "left",
  color = "rgba(31, 26, 18, 0.45)", // 默认暖炭色（cream 主题）
}: {
  className?: string
  delay?: number
  width?: number | string
  thickness?: number
  origin?: "left" | "center" | "right"
  color?: string
}) {
  const originClass =
    origin === "center"
      ? "origin-center"
      : origin === "right"
        ? "origin-right"
        : "origin-left"

  return (
    <motion.span
      aria-hidden
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.4, delay, ease: easeCustom }}
      className={`inline-block ${originClass} ${className}`}
      style={{
        width,
        height: thickness,
        background: color,
      }}
    />
  )
}

/**
 * Sprig — 极简植物枝条 SVG，pathLength 画线动画
 */
export function Sprig({
  className = "",
  delay = 0,
  size = 56,
}: {
  className?: string
  delay?: number
  size?: number
}) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
    >
      <motion.path
        d="M50 95 C 50 70, 50 45, 50 10"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.8, delay, ease: easeCustom }}
      />
      <motion.path
        d="M50 70 C 38 65, 28 60, 18 55 M50 55 C 38 52, 26 50, 14 42"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 2, delay: delay + 0.4, ease: easeCustom }}
      />
      <motion.path
        d="M50 62 C 62 58, 72 52, 82 46 M50 47 C 62 44, 74 42, 86 34"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 2, delay: delay + 0.6, ease: easeCustom }}
      />
      <motion.circle
        cx="50"
        cy="10"
        r="2.2"
        fill="currentColor"
        stroke="none"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: delay + 1.9, ease: easeCustom }}
      />
    </motion.svg>
  )
}

/**
 * EucalyptusBranch — 大尺寸尤加利枝条 SVG，用于 Botanical Spotlight
 * 比 Sprig 更精细，叶片更立体
 */
export function EucalyptusBranch({
  className = "",
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 400 600"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 主茎 —— 从右下到左上有弧度 */}
      <motion.path
        d="M 320 580 C 310 480, 285 380, 255 290 C 230 215, 200 145, 165 80 C 145 50, 130 25, 120 10"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2.4, delay, ease: easeCustom }}
      />

      {/* 左侧叶片对 */}
      {[
        { stem: "M 305 510 C 280 510, 250 505, 215 495", leaf: "M 215 495 c -25 -8, -45 -22, -55 -42 c 18 -5, 38 0, 60 12 z" },
        { stem: "M 290 440 C 260 442, 225 438, 185 425", leaf: "M 185 425 c -28 -10, -50 -25, -62 -48 c 22 -3, 44 4, 67 18 z" },
        { stem: "M 270 360 C 240 365, 205 360, 165 345", leaf: "M 165 345 c -30 -12, -52 -28, -65 -52 c 24 -2, 47 6, 72 22 z" },
        { stem: "M 245 280 C 215 285, 180 280, 140 265", leaf: "M 140 265 c -32 -14, -54 -30, -65 -55 c 25 -2, 50 7, 74 23 z" },
        { stem: "M 220 200 C 190 205, 155 200, 115 185", leaf: "M 115 185 c -32 -16, -52 -32, -60 -55 c 24 -2, 48 8, 70 22 z" },
        { stem: "M 195 130 C 170 132, 140 128, 105 115", leaf: "M 105 115 c -28 -15, -45 -28, -50 -48 c 22 -1, 42 6, 60 18 z" },
        { stem: "M 165 70 C 145 70, 120 65, 90 55", leaf: "M 90 55 c -22 -10, -36 -22, -38 -38 c 18 0, 33 5, 48 14 z" },
      ].map((leaf, i) => (
        <g key={`L${i}`}>
          <motion.path
            d={leaf.stem}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 1.2,
              delay: delay + 0.6 + i * 0.15,
              ease: easeCustom,
            }}
          />
          <motion.path
            d={leaf.leaf}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 1.4,
              delay: delay + 0.75 + i * 0.15,
              ease: easeCustom,
            }}
          />
        </g>
      ))}

      {/* 右侧叶片对（少一些，造成不对称的自然感） */}
      {[
        { stem: "M 300 470 C 320 470, 345 465, 370 455", leaf: "M 370 455 c 22 -8, 36 -22, 38 -42 c -18 -2, -36 5, -52 18 z" },
        { stem: "M 275 380 C 295 380, 320 375, 345 365", leaf: "M 345 365 c 22 -10, 35 -25, 36 -45 c -20 0, -38 8, -54 22 z" },
        { stem: "M 250 290 C 270 290, 295 285, 320 273", leaf: "M 320 273 c 22 -12, 32 -28, 30 -50 c -20 2, -38 12, -52 28 z" },
        { stem: "M 225 200 C 245 200, 268 195, 290 183", leaf: "M 290 183 c 20 -12, 28 -28, 24 -50 c -18 3, -34 13, -46 28 z" },
        { stem: "M 200 115 C 218 113, 240 108, 258 95", leaf: "M 258 95 c 16 -12, 22 -26, 18 -42 c -16 4, -28 14, -38 26 z" },
      ].map((leaf, i) => (
        <g key={`R${i}`}>
          <motion.path
            d={leaf.stem}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 1.2,
              delay: delay + 0.9 + i * 0.18,
              ease: easeCustom,
            }}
          />
          <motion.path
            d={leaf.leaf}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 1.4,
              delay: delay + 1.05 + i * 0.18,
              ease: easeCustom,
            }}
          />
        </g>
      ))}
    </motion.svg>
  )
}

/**
 * Eyebrow —— 全大写小字标签，编辑式
 */
export function Eyebrow({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, delay, ease: easeCustom }}
      className={`inline-block text-[10px] md:text-[11px] tracking-[0.36em] uppercase ${className}`}
    >
      {children}
    </motion.span>
  )
}
