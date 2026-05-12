"use client"

// The Atelier —— Scroll-jacked horizontal pinned gallery
//
// 工作原理：
//   外层 <section> 高度设为 (N × 100vh)，N = 面板数。
//   内层 sticky 子容器贴在视口顶部，被"卡住" (N-1)*100vh 的滚动距离。
//   在这段被卡住的垂直滚动里，里面的横向 track 用 translateX 从 0% 滚到
//   -((N-1)/N * 100)%，正好露出最后一个面板。这样视觉上：用户滚轮向下
//   滚 → 页面不动 → 四个面板从左向右依次进场 → 第四个完成后页面恢复
//   垂直滚动继续往下走。反向滚动同理。
//
// useSpring 给 x 加一点弹性惯性，鼠标滚轮触发时不会突兀。
// prev/next 按钮和圆点改成程序滚动 window.scrollTo 到对应 progress。

import { useRef, useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion"
import { easeCustom } from "@/lib/motion"
import { Eyebrow, Hairline } from "@/components/ornaments"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Step = {
  num: string
  title: string
  caption: string
  body: string
  icon: () => React.ReactElement
}

// ====== 每一步的 SVG 简笔图 ======

function LeafIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round">
      <motion.path
        d="M 60 110 C 60 80, 60 50, 60 20 M 60 90 C 45 85, 32 78, 22 65 M 60 75 C 45 72, 30 65, 18 50 M 60 60 C 45 56, 28 48, 16 32 M 60 90 C 75 85, 88 78, 98 65 M 60 75 C 75 72, 90 65, 102 50 M 60 60 C 75 56, 92 48, 104 32"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 2.4, ease: easeCustom }}
      />
    </svg>
  )
}

function StoneIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <motion.path
        d="M 20 78 C 18 60, 28 42, 48 32 C 70 22, 92 28, 102 48 C 108 64, 104 82, 88 92 C 70 102, 42 100, 28 90 C 22 86, 19 82, 20 78 Z"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 2, ease: easeCustom }}
      />
      <motion.path
        d="M 40 60 C 50 55, 60 56, 70 62 M 45 75 C 58 72, 70 73, 80 78"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.6, delay: 0.6, ease: easeCustom }}
      />
    </svg>
  )
}

function DropIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <motion.path
        d="M 60 18 C 60 18, 38 50, 38 75 C 38 92, 50 104, 60 104 C 70 104, 82 92, 82 75 C 82 50, 60 18, 60 18 Z"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 2, ease: easeCustom }}
      />
      <motion.path
        d="M 52 80 C 56 86, 64 86, 68 80"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.4, delay: 0.7, ease: easeCustom }}
      />
    </svg>
  )
}

function SealIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <motion.circle
        cx={60}
        cy={60}
        r={36}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.6, ease: easeCustom }}
      />
      <motion.circle
        cx={60}
        cy={60}
        r={26}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.4, delay: 0.4, ease: easeCustom }}
      />
      <motion.path
        d="M 50 56 L 60 70 L 76 50"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, delay: 1, ease: easeCustom }}
      />
    </svg>
  )
}

const STEPS: Step[] = [
  {
    num: "I",
    title: "Harvest",
    caption: "Northern Rivers · Sunrise",
    body: "Leaves are hand-cut between first light and the morning's first heat — when the essential oils still rest in the surface cells.",
    icon: LeafIcon,
  },
  {
    num: "II",
    title: "Press",
    caption: "Atelier · Surry Hills",
    body: "Cold-pressed within twelve hours of harvest. No solvents, no heat — only weight, time, and the slow patience of stone.",
    icon: StoneIcon,
  },
  {
    num: "III",
    title: "Pour",
    caption: "By hand · In small batches",
    body: "Each bottle is filled, weighed, and labelled by a single pair of hands. We never produce more than the season allows.",
    icon: DropIcon,
  },
  {
    num: "IV",
    title: "Seal",
    caption: "Wax · Ribbon · Card",
    body: "Sealed with beeswax and tied with a hand-written note. The final step is the one we take the most care over.",
    icon: SealIcon,
  },
]

const N = STEPS.length
// 最后位置：track 移动 (N-1)/N 的自身宽度，正好露出最后一个面板
const END_PERCENT = -((N - 1) / N) * 100

export default function AtelierProcess() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  // 整个外层 section 进入到离开视口的进度
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // 原始横向位移
  const rawX = useTransform(scrollYProgress, [0, 1], ["0%", `${END_PERCENT}%`])

  // 弹簧平滑：滚轮滚动时面板移动有一点惯性，更高级
  const x = useSpring(rawX, {
    stiffness: 80,
    damping: 28,
    mass: 0.4,
  })

  // 跟随 scroll 进度更新 active index（控制圆点和按钮 disabled 状态）
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.round(v * (N - 1))))
    setActive(idx)
  })

  // 程序滚动到指定面板 —— prev/next 和圆点都用这个
  function scrollToPanel(i: number) {
    const el = sectionRef.current
    if (!el) return
    const clamped = Math.min(N - 1, Math.max(0, i))
    const sectionTop = el.getBoundingClientRect().top + window.scrollY
    const scrollable = el.offsetHeight - window.innerHeight
    const progress = clamped / (N - 1)
    window.scrollTo({
      top: sectionTop + progress * scrollable,
      behavior: "smooth",
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative"
      // N × 100vh：留出 (N-1) × 100vh 给 sticky pin 期间消耗的垂直滚动
      style={{ height: `${N * 100}vh` }}
    >
      {/* Sticky 内层：在 section 范围内卡住 (N-1)×100vh 的距离 */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ============ 顶部固定头部条 ============ */}
        <div className="absolute top-0 inset-x-0 z-20 px-6 md:px-12 pt-32 md:pt-36">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-4 text-white/70">
              <Hairline width={32} />
              <Eyebrow>The Atelier · Four Hands</Eyebrow>
            </div>

            <div className="mt-5 flex items-end justify-between gap-6">
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.4, ease: easeCustom }}
                className="
                  font-display font-light
                  text-[36px] md:text-[60px] lg:text-[72px]
                  leading-[0.95]
                  tracking-tight
                  text-white
                  max-w-xl
                "
              >
                <span className="italic">How</span> a bottle is made.
              </motion.h2>

              {/* 桌面 prev/next —— 触发程序滚动 */}
              <div className="hidden md:flex items-center gap-3 pb-2">
                <button
                  type="button"
                  onClick={() => scrollToPanel(active - 1)}
                  disabled={active === 0}
                  aria-label="Previous step"
                  className="
                    h-12 w-12 grid place-items-center rounded-full
                    border border-white/30
                    text-white
                    hover:bg-white hover:text-black
                    disabled:opacity-30 disabled:cursor-not-allowed
                    disabled:hover:bg-transparent disabled:hover:text-white
                    transition-colors duration-500
                  "
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToPanel(active + 1)}
                  disabled={active === N - 1}
                  aria-label="Next step"
                  className="
                    h-12 w-12 grid place-items-center rounded-full
                    border border-white/30
                    text-white
                    hover:bg-white hover:text-black
                    disabled:opacity-30 disabled:cursor-not-allowed
                    disabled:hover:bg-transparent disabled:hover:text-white
                    transition-colors duration-500
                  "
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============ 横向 track —— 4 个全屏面板 ============ */}
        <motion.div
          style={{ x }}
          className="flex h-full will-change-transform"
        >
          {STEPS.map(({ num, title, caption, body, icon: Icon }, i) => (
            <article
              key={num}
              className="
                shrink-0 w-screen h-full
                flex items-center
                px-6 md:px-12
                pt-44 md:pt-56
                pb-24 md:pb-28
              "
            >
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                {/* 文字栏 */}
                <div>
                  <span className="block font-display italic font-light text-brand text-[140px] md:text-[200px] leading-[0.85]">
                    {num}
                  </span>
                  <span className="block mt-2 text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/65">
                    Step {i + 1} of {N}
                  </span>

                  <Hairline width={48} delay={0.2} className="mt-6" />

                  <h3 className="mt-8 font-display italic font-light text-[60px] md:text-[80px] lg:text-[96px] leading-[0.95] tracking-tight text-white">
                    {title}
                  </h3>
                  <p className="mt-3 font-display italic text-[14px] md:text-[16px] text-white/65 tracking-wide">
                    {caption}
                  </p>
                  <p className="mt-8 font-display text-white/80 text-[17px] md:text-[19px] leading-[1.65] max-w-md">
                    {body}
                  </p>
                </div>

                {/* SVG 栏 —— 大号简笔图 */}
                <div className="flex justify-center md:justify-end">
                  <div className="text-brand/85 w-[180px] md:w-[280px] lg:w-[360px] aspect-square">
                    <Icon />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </motion.div>

        {/* ============ 底部圆点分页 ============ */}
        <div className="absolute bottom-10 md:bottom-14 inset-x-0 z-20 flex items-center justify-center gap-3">
          {STEPS.map((s, i) => (
            <button
              key={s.num}
              type="button"
              onClick={() => scrollToPanel(i)}
              aria-label={`Go to step ${i + 1}`}
              className={`
                h-1.5 rounded-full transition-all duration-500
                ${active === i ? "w-10 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60"}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
