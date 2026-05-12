"use client"

// 横向无限滚动品牌关键词带 — 奢华美妆品牌（Aesop / Glossier / Le Labo）
// 常用的招牌"横向动画"。CSS keyframes 实现，零 JS 成本。
//
// 关键实现：内容渲染两份，translateX(-50%) 正好滚过一份的宽度，
// 然后无缝循环。父容器 w-max + flex 让宽度自适应内容。

import { Leaf } from "lucide-react"

const KEYWORDS = [
  "Cold-Pressed",
  "Small Batch",
  "Plant-Based",
  "Naturally Rooted",
  "Cruelty-Free",
  "Hand-Crafted",
  "Slow Beauty",
  "Sustainably Sourced",
]

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-10 md:gap-14 px-5 md:px-7"
    >
      {KEYWORDS.map((kw) => (
        <span key={kw} className="inline-flex items-center gap-10 md:gap-14">
          <span className="font-display italic font-medium text-[34px] md:text-[56px] leading-none text-white/85">
            {kw}
          </span>
          <Leaf
            className="h-4 w-4 md:h-5 md:w-5 text-brand shrink-0"
            strokeWidth={1.6}
            aria-hidden
          />
        </span>
      ))}
    </div>
  )
}

export default function BrandMarquee() {
  return (
    <section
      aria-label="Brand values"
      className="
        relative overflow-hidden
        py-10 md:py-14
        border-y border-white/10
        bg-black/55 backdrop-blur-md
      "
    >
      {/* 左右羽化遮罩 — 让滚动消失在边缘，更高级 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 z-10 bg-gradient-to-r from-black/90 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 z-10 bg-gradient-to-l from-black/90 to-transparent"
      />

      <div className="flex w-max animate-marquee">
        {/* 渲染两份完全相同的内容，循环时无缝衔接 */}
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  )
}
