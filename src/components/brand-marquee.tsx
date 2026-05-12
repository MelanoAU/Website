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
      className="flex shrink-0 items-center gap-7 md:gap-10 px-4 md:px-6"
    >
      {KEYWORDS.map((kw) => (
        <span key={kw} className="inline-flex items-center gap-7 md:gap-10">
          {/* 字号砍掉约一半，更像 editorial ticker 而不是 hero 大字 */}
          <span className="font-display italic font-medium text-[22px] md:text-[34px] leading-none text-white/85">
            {kw}
          </span>
          <Leaf
            className="h-3.5 w-3.5 md:h-4 md:w-4 text-brand shrink-0"
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
        py-5 md:py-7
        panel-marquee
      "
    >
      {/* 左右羽化遮罩 — 实色背景下用纯 #050505 渐变，更干净 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 z-10"
        style={{
          background:
            "linear-gradient(to right, #050505 0%, rgba(5,5,5,0.85) 50%, rgba(5,5,5,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 z-10"
        style={{
          background:
            "linear-gradient(to left, #050505 0%, rgba(5,5,5,0.85) 50%, rgba(5,5,5,0) 100%)",
        }}
      />

      <div className="flex w-max animate-marquee">
        {/* 渲染两份完全相同的内容，循环时无缝衔接 */}
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  )
}
