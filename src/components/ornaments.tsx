"use client"

// 编辑式装饰元素 — Hairline 横线 / Sprig 植物 / Glyph 字母编号
// 都使用 framer-motion 的 whileInView 触发，避免离屏滚动时浪费动画

import { motion } from "framer-motion"
import { easeCustom } from "@/lib/motion"

/**
 * Hairline — 细水平线，scaleX 从 0 画到 1
 * 用作章节副标题旁边的装饰，或大块之间的分隔
 */
export function Hairline({
  className = "",
  delay = 0,
  width = 80,
  thickness = 1,
  origin = "left",
  color = "rgba(255,255,255,0.55)",
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
      transition={{ duration: 1, delay, ease: easeCustom }}
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
 * Sprig — 极简植物枝条 SVG，pathLength 0 → 1 画线动画
 * 用作 ClosingCta 顶部的装饰花
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
      {/* 主茎 */}
      <motion.path
        d="M50 95 C 50 70, 50 45, 50 10"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.4, delay, ease: easeCustom }}
      />
      {/* 左叶 */}
      <motion.path
        d="M50 70 C 38 65, 28 60, 18 55 M50 55 C 38 52, 26 50, 14 42"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, delay: delay + 0.3, ease: easeCustom }}
      />
      {/* 右叶 */}
      <motion.path
        d="M50 62 C 62 58, 72 52, 82 46 M50 47 C 62 44, 74 42, 86 34"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, delay: delay + 0.45, ease: easeCustom }}
      />
      {/* 顶芽 */}
      <motion.circle
        cx="50"
        cy="10"
        r="2.2"
        fill="currentColor"
        stroke="none"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, delay: delay + 1.5, ease: easeCustom }}
      />
    </motion.svg>
  )
}

/**
 * ChapterMark — 大号衬线编号 + 副标题 + 细线
 * 给每个 section 顶部用，建立编辑式节奏感
 */
export function ChapterMark({
  number,
  label,
  delay = 0,
  align = "left",
}: {
  number: string
  label: string
  delay?: number
  align?: "left" | "center"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, delay, ease: easeCustom }}
      className={`flex items-baseline gap-4 md:gap-5 ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      {/* 章节编号 — 用纯白避免 sage 在深色背景上对比度不足 */}
      <span className="font-display italic text-4xl md:text-5xl text-white leading-none">
        {number}
      </span>
      <div className="flex flex-col gap-2">
        <span className="text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
          {label}
        </span>
        <Hairline width={48} delay={delay + 0.2} color="rgba(161, 193, 161, 0.6)" />
      </div>
    </motion.div>
  )
}
