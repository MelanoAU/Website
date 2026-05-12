"use client"

// The Atelier —— Wheel-driven discrete snap gallery
//
// 工作原理：
//   外层 <section> 高度 = N × 100vh —— 给 sticky 内层留出 (N-1)×100vh
//   的"pin 范围"。但跟之前不同：我们不再把 scroll 进度连续映射到 x，
//   而是拦截 wheel/touch/键盘事件，每次输入触发一次离散的面板切换，
//   用 cubic-bezier ease-in-out (渐快渐慢) 在 ~850ms 内动画到下一位置。
//
//   滚动中我们 preventDefault 锁住页面滚动；只有当用户在第一 / 最后
//   面板再向边界方向滚时，才会程序化地 window.scrollTo() 平滑跳出
//   整个 pin range —— 这样用户不需要被动滚 300vh 才能离开本节。
//
//   touch 和 ArrowKey/PageDown 同样支持以保持移动端 + 键盘可达性。

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useMotionValue, animate } from "framer-motion"
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

// 面板切换的 ease-in-out cubic-bezier —— 渐快渐慢
// 比 framer-motion 默认更"奢华一档"的曲线
const PANEL_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]
const PANEL_DURATION = 0.85
const EXIT_LOCK_MS = 900    // 程序化滚出 pin 时锁住 wheel 多久
const TOUCH_THRESHOLD = 50  // 触屏滑动 >50px 才算一次切换

export default function AtelierProcess() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  // 给事件处理用的 ref 镜像（避免闭包过期）
  const activeRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const isExitingRef = useRef(false)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 横向位移 motion value —— 单位是"自身宽度的百分比"
  // 面板 idx 时 x = -(idx/N) × 100%
  // idx=0: 0% | idx=1: -25% | idx=2: -50% | idx=3: -75%
  const x = useMotionValue("0%")

  // 动画到目标面板
  const goToPanel = useCallback(
    (idx: number) => {
      const target = Math.max(0, Math.min(N - 1, idx))
      if (target === activeRef.current) return

      activeRef.current = target
      setActive(target)
      isAnimatingRef.current = true

      const targetPercent = -(target / N) * 100
      animate(x, `${targetPercent}%`, {
        duration: PANEL_DURATION,
        ease: PANEL_EASE,
      }).then(() => {
        isAnimatingRef.current = false
      })
    },
    [x]
  )

  // 程序化滚出 pin range（边界处用）
  const exitSection = useCallback((direction: "down" | "up") => {
    const section = sectionRef.current
    if (!section) return

    isExitingRef.current = true
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current)

    const vh = window.innerHeight
    const sectionTop = section.offsetTop
    const targetY =
      direction === "down"
        ? sectionTop + section.offsetHeight - vh + 4 // 刚好滚出 pin
        : sectionTop - 4 // 刚好滚回 pin 之前

    window.scrollTo({ top: targetY, behavior: "smooth" })

    exitTimerRef.current = setTimeout(() => {
      isExitingRef.current = false
    }, EXIT_LOCK_MS)
  }, [])

  // 判断当前是否在 pin range 内（section 完整覆盖视口）
  const isInPin = useCallback((): boolean => {
    const section = sectionRef.current
    if (!section) return false
    const rect = section.getBoundingClientRect()
    return rect.top <= 0 && rect.bottom >= window.innerHeight
  }, [])

  // ====== Wheel ======
  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      if (!isInPin()) return

      if (isExitingRef.current || isAnimatingRef.current) {
        e.preventDefault()
        return
      }

      const cur = activeRef.current
      const goingDown = e.deltaY > 0

      // 边界：最后面板 + 向下 → 滚出
      if (cur === N - 1 && goingDown) {
        e.preventDefault()
        exitSection("down")
        return
      }
      // 边界：第一面板 + 向上 → 滚回
      if (cur === 0 && !goingDown) {
        e.preventDefault()
        exitSection("up")
        return
      }

      // 正常：拦截 wheel，切到下一/上一面板
      e.preventDefault()
      goToPanel(cur + (goingDown ? 1 : -1))
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [goToPanel, exitSection, isInPin])

  // ====== Touch（移动端等价 wheel）======
  useEffect(() => {
    let startY = 0
    let startTime = 0

    function onStart(e: TouchEvent) {
      if (!isInPin()) return
      startY = e.touches[0].clientY
      startTime = Date.now()
    }

    function onMove(e: TouchEvent) {
      if (!isInPin()) return
      // 在 pin 中拦截原生竖向滚动
      e.preventDefault()
    }

    function onEnd(e: TouchEvent) {
      if (!isInPin()) return
      if (isAnimatingRef.current || isExitingRef.current) return

      const endY = e.changedTouches[0].clientY
      const dy = startY - endY
      const dt = Date.now() - startTime

      // 距离够 || 是快速 flick
      const isFlick = Math.abs(dy) > 15 && dt < 250
      if (Math.abs(dy) < TOUCH_THRESHOLD && !isFlick) return

      const cur = activeRef.current
      const goingDown = dy > 0

      if (cur === N - 1 && goingDown) {
        exitSection("down")
        return
      }
      if (cur === 0 && !goingDown) {
        exitSection("up")
        return
      }

      goToPanel(cur + (goingDown ? 1 : -1))
    }

    window.addEventListener("touchstart", onStart, { passive: true })
    window.addEventListener("touchmove", onMove, { passive: false })
    window.addEventListener("touchend", onEnd, { passive: true })

    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchmove", onMove)
      window.removeEventListener("touchend", onEnd)
    }
  }, [goToPanel, exitSection, isInPin])

  // ====== 键盘（Arrow / PageDown / Space）======
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isInPin()) return
      if (isAnimatingRef.current || isExitingRef.current) return

      const cur = activeRef.current
      const isDown =
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " " ||
        e.key === "ArrowRight"
      const isUp =
        e.key === "ArrowUp" || e.key === "PageUp" || e.key === "ArrowLeft"

      if (isDown) {
        e.preventDefault()
        if (cur === N - 1) {
          exitSection("down")
        } else {
          goToPanel(cur + 1)
        }
      } else if (isUp) {
        e.preventDefault()
        if (cur === 0) {
          exitSection("up")
        } else {
          goToPanel(cur - 1)
        }
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goToPanel, exitSection, isInPin])

  // ====== prev / next 按钮 + 圆点 通用导航 ======
  // 如果用户在 pin 之外点击（例如从 outline 跳过来），先把页面滚到 pin
  // 起点再切面板。
  const navigateTo = useCallback(
    (idx: number) => {
      const section = sectionRef.current
      if (!section) return
      if (isInPin()) {
        goToPanel(idx)
      } else {
        window.scrollTo({ top: section.offsetTop, behavior: "smooth" })
        setTimeout(() => goToPanel(idx), 600)
      }
    },
    [goToPanel, isInPin]
  )

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${N * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* ============ Header 段 ============ */}
        <div className="shrink-0 relative z-10 px-6 md:px-12 pt-28 md:pt-32 pb-4 md:pb-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-4 text-white/70">
              <Hairline width={32} />
              <Eyebrow>The Atelier · Four Hands</Eyebrow>
            </div>

            <div className="mt-4 md:mt-5 flex items-end justify-between gap-6">
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.4, ease: easeCustom }}
                className="
                  font-display font-light
                  text-[32px] md:text-[52px] lg:text-[64px]
                  leading-[0.95]
                  tracking-tight
                  text-white
                  max-w-xl
                "
              >
                <span className="italic">How</span> a bottle is made.
              </motion.h2>

              <div className="hidden md:flex items-center gap-3 pb-2">
                <button
                  type="button"
                  onClick={() => navigateTo(active - 1)}
                  disabled={active === 0}
                  aria-label="Previous step"
                  className="
                    h-11 w-11 grid place-items-center rounded-full
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
                  onClick={() => navigateTo(active + 1)}
                  disabled={active === N - 1}
                  aria-label="Next step"
                  className="
                    h-11 w-11 grid place-items-center rounded-full
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

        {/* ============ 横向 Track 段 ============
            width: ${N*100}vw 是必须的 —— translateX(%) 是相对元素自身宽度算的，
            没有显式 width 时 flex 容器默认填父宽 = 100vw，-75% 只走 75vw。
        */}
        <motion.div
          style={{ x, width: `${N * 100}vw` }}
          className="flex flex-1 min-h-0 will-change-transform"
        >
          {STEPS.map(({ num, title, caption, body, icon: Icon }, i) => (
            <article
              key={num}
              className="
                shrink-0 w-screen h-full
                flex items-center
                px-6 md:px-12
                overflow-hidden
              "
            >
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
                {/* 文字栏 */}
                <div>
                  <span className="block font-display italic font-light text-brand text-[88px] md:text-[150px] lg:text-[200px] leading-[0.85]">
                    {num}
                  </span>
                  <span className="block mt-2 text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/65">
                    Step {i + 1} of {N}
                  </span>

                  <Hairline width={48} delay={0.2} className="mt-5" />

                  <h3 className="mt-6 font-display italic font-light text-[42px] md:text-[64px] lg:text-[84px] leading-[0.95] tracking-tight text-white">
                    {title}
                  </h3>
                  <p className="mt-2 font-display italic text-[13px] md:text-[15px] text-white/65 tracking-wide">
                    {caption}
                  </p>
                  <p className="mt-5 font-display text-white/80 text-[15px] md:text-[18px] leading-[1.6] max-w-md">
                    {body}
                  </p>
                </div>

                {/* SVG 栏 */}
                <div className="flex justify-center md:justify-end">
                  <div className="text-brand/85 w-[150px] md:w-[240px] lg:w-[300px] aspect-square">
                    <Icon />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </motion.div>

        {/* ============ 底部圆点分页 段 ============ */}
        <div className="shrink-0 relative z-10 pb-8 md:pb-12 pt-2 flex items-center justify-center gap-3">
          {STEPS.map((s, i) => (
            <button
              key={s.num}
              type="button"
              onClick={() => navigateTo(i)}
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
