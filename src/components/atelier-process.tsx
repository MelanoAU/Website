"use client"

// The Atelier —— Wheel-driven discrete snap gallery（带惯性防双跳 + 入场 dwell）
//
// 关键状态机：
//   1. 进入 pin range 时：触发 ENTRY_DWELL_MS 的"入场冷却"，吸收任何
//      正在飞行的 wheel 惯性事件 —— 让用户先看清楚 Step 1。
//   2. 每个 wheel 事件累加到 deltaY accumulator；达到 NAV_THRESHOLD 才
//      触发一次面板切换。这一步过滤掉单次小 deltaY 的惯性 tail。
//   3. 切换触发后立即设 POST_NAV_LOCK_MS 冷却（~1.1s）。trackpad 一次
//      fling 通常 1-1.5s，这个冷却覆盖了大部分惯性 tail，防止双跳。
//   4. 冷却期间所有 wheel 都被吸收且 accumulator 清零。
//   5. 累加器在 150ms 静默后自动重置（识别新手势）。
//
// touch 和键盘走同一份 cooldown 但不需要 accumulator —— 它们本身是离散
// 事件。键盘按一下 = 一个 nav，cooldown 防止连按双跳。

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react"
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
    title: "Source",
    caption: "Eastern Victoria · Tasmania",
    body: "Our materia is drawn from the southeast — the Yarra catchment, the cool-climate forests of central Tasmania, the Otway ranges. Plants are chosen for documented use, traceable origin, and resistance to commodity substitution.",
    icon: LeafIcon,
  },
  {
    num: "II",
    title: "Study",
    caption: "Provenance · Documented use",
    body: "Each candidate plant is read against its written record — ethnobotanical history, contemporary research, supply-chain legibility. Most never reach formulation. The library is intentionally narrow.",
    icon: StoneIcon,
  },
  {
    num: "III",
    title: "Formulate",
    caption: "Restraint · Single-plant compositions",
    body: "Each preparation is composed around one botanical, supported by the short list of cleansing and conditioning agents that actually contribute. No sulfates, no silicones, no parabens, no synthetic fragrance.",
    icon: DropIcon,
  },
  {
    num: "IV",
    title: "Carry",
    caption: "Daily · Considered",
    body: "A preparation enters the daily routine as something to be used, not displayed. Each bar is designed to disappear into the rhythm of the morning — quietly, without ceremony, for the years it's meant to serve.",
    icon: SealIcon,
  },
]

const N = STEPS.length

// 动画
const PANEL_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]
const PANEL_DURATION = 0.85

// 输入节奏（毫秒）
const ENTRY_DWELL_MS = 700        // 进入 pin 后给 Step 1 的固定停留时间
const POST_NAV_LOCK_MS = 1100     // 每次切换后吸收 wheel/touch/key 输入（覆盖 trackpad 惯性）
const EXIT_LOCK_MS = 900          // 程序化滚出 pin 时锁住的时长

// Wheel accumulator
const WHEEL_NAV_THRESHOLD = 60    // |Σ deltaY| ≥ 此值才触发切换（过滤惯性 tail）
const WHEEL_RESET_QUIET_MS = 150  // wheel 静默此久后认为是新手势，重置 accumulator

// Touch
const TOUCH_THRESHOLD = 50

// 移动端 / 触屏检测 —— matchMedia 通过 useSyncExternalStore 订阅
// 触屏主导 (pointer:coarse) 或 小屏 → 走移动端逻辑（无 pin，横向 swipe）
const MOBILE_QUERY = "(max-width: 767px), (pointer: coarse)"
function subscribeMobile(callback: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}
function getMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches
}
function getMobileServerSnapshot() {
  return false // SSR 默认按桌面渲染，hydration 后矫正
}

export default function AtelierProcess() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  const activeRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const isExitingRef = useRef(false)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 共用的输入冷却：entry dwell 和 post-nav lock 都用它
  const cooldownUntilRef = useRef(0)
  const wasInPinRef = useRef(false)

  // wheel 专属：累加 deltaY，过滤小幅惯性
  const wheelAccumRef = useRef(0)
  const lastWheelTimeRef = useRef(0)

  // 移动端 / 触屏检测 —— useSyncExternalStore 是 React 给"订阅外部状态"
  // 准备的官方 API，比 useState + useEffect 更干净，也避免 effect 里 setState 的 lint 警告
  const isMobileLayout = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    getMobileServerSnapshot
  )

  const x = useMotionValue("0%")

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

  const exitSection = useCallback((direction: "down" | "up") => {
    const section = sectionRef.current
    if (!section) return

    isExitingRef.current = true
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current)

    const vh = window.innerHeight
    const sectionTop = section.offsetTop
    const targetY =
      direction === "down"
        ? sectionTop + section.offsetHeight - vh + 4
        : sectionTop - 4

    window.scrollTo({ top: targetY, behavior: "smooth" })

    exitTimerRef.current = setTimeout(() => {
      isExitingRef.current = false
    }, EXIT_LOCK_MS)
  }, [])

  const isInPin = useCallback((): boolean => {
    const section = sectionRef.current
    if (!section) return false
    const rect = section.getBoundingClientRect()
    return rect.top <= 0 && rect.bottom >= window.innerHeight
  }, [])

  // 任何输入触发切换的统一入口
  const navigate = useCallback(
    (goingDown: boolean) => {
      const cur = activeRef.current
      if (cur === N - 1 && goingDown) {
        exitSection("down")
        return
      }
      if (cur === 0 && !goingDown) {
        exitSection("up")
        return
      }
      goToPanel(cur + (goingDown ? 1 : -1))
    },
    [exitSection, goToPanel]
  )

  // ====== Scroll listener: 检测 pin 进入，设 entry dwell ======
  // 移动端不挂载 —— 移动端 section 是 100dvh，没有 pin 概念
  useEffect(() => {
    if (isMobileLayout) return
    function check() {
      const inPin = isInPin()
      if (inPin && !wasInPinRef.current) {
        // 刚进入 pin —— 锁住一段时间让用户看清 Step 1
        cooldownUntilRef.current = Math.max(
          cooldownUntilRef.current,
          performance.now() + ENTRY_DWELL_MS
        )
        wheelAccumRef.current = 0
      } else if (!inPin && wasInPinRef.current) {
        // 离开 pin —— 清掉残留 accumulator
        wheelAccumRef.current = 0
      }
      wasInPinRef.current = inPin
    }
    check()
    window.addEventListener("scroll", check, { passive: true })
    return () => window.removeEventListener("scroll", check)
  }, [isMobileLayout, isInPin])

  // ====== Wheel（accumulator + cooldown）======
  // 移动端不挂载 —— 浏览器原生竖向滚动
  useEffect(() => {
    if (isMobileLayout) return
    function handleWheel(e: WheelEvent) {
      if (!isInPin()) {
        wheelAccumRef.current = 0
        return
      }

      e.preventDefault()

      if (isExitingRef.current) return

      const now = performance.now()

      // 处于冷却期（入场 dwell 或上次切换后的锁）：吸收，不触发
      if (now < cooldownUntilRef.current) {
        wheelAccumRef.current = 0
        lastWheelTimeRef.current = now
        return
      }

      // 防御性：动画进行中也不接受新切换
      if (isAnimatingRef.current) return

      // 手势静默够久 → 新手势开始，重置 accumulator
      if (now - lastWheelTimeRef.current > WHEEL_RESET_QUIET_MS) {
        wheelAccumRef.current = 0
      }

      wheelAccumRef.current += e.deltaY
      lastWheelTimeRef.current = now

      // 累加未到阈值 —— 继续等
      if (Math.abs(wheelAccumRef.current) < WHEEL_NAV_THRESHOLD) return

      const goingDown = wheelAccumRef.current > 0
      wheelAccumRef.current = 0
      cooldownUntilRef.current = now + POST_NAV_LOCK_MS

      navigate(goingDown)
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [isMobileLayout, navigate, isInPin])

  // ====== 桌面端 Touch（竖向 pin 导航 —— 给触屏桌面用）======
  // 移动端不挂载，避免和下面的横向 swipe 冲突
  useEffect(() => {
    if (isMobileLayout) return
    const section = sectionRef.current
    if (!section) return

    let startedInPin = false
    let startY = 0
    let startTime = 0

    function onStart(e: TouchEvent) {
      startY = e.touches[0].clientY
      startTime = Date.now()
      startedInPin = isInPin()
    }

    function onMove(e: TouchEvent) {
      if (!isInPin()) return
      e.preventDefault()
    }

    function onEnd(e: TouchEvent) {
      const wasNavGesture = startedInPin
      startedInPin = false
      if (!wasNavGesture) return
      if (!isInPin()) return

      const now = performance.now()
      if (now < cooldownUntilRef.current) return
      if (isAnimatingRef.current || isExitingRef.current) return

      const endY = e.changedTouches[0].clientY
      const dy = startY - endY
      const dt = Date.now() - startTime

      const isFlick = Math.abs(dy) > 15 && dt < 250
      if (Math.abs(dy) < TOUCH_THRESHOLD && !isFlick) return

      cooldownUntilRef.current = now + POST_NAV_LOCK_MS
      navigate(dy > 0)
    }

    function onCancel() {
      startedInPin = false
    }

    section.addEventListener("touchstart", onStart, { passive: true })
    section.addEventListener("touchmove", onMove, { passive: false })
    section.addEventListener("touchend", onEnd, { passive: true })
    section.addEventListener("touchcancel", onCancel, { passive: true })

    return () => {
      section.removeEventListener("touchstart", onStart)
      section.removeEventListener("touchmove", onMove)
      section.removeEventListener("touchend", onEnd)
      section.removeEventListener("touchcancel", onCancel)
    }
  }, [isMobileLayout, navigate, isInPin])

  // ====== 移动端 Touch（横向 swipe 切换面板，不锁竖向滚动）======
  // 工作流：
  //   - touchstart 记录起点
  //   - touchmove 累计 10px 后决定方向：|dx| vs |dy|
  //     · 'v'：放手让浏览器原生竖向滚动页面
  //     · 'h'：preventDefault 兜底 + 标记，touchend 时按 dx 切换面板
  //   - touch-action: pan-y 已经在 CSS 里阻断了横向原生拖动，所以即便
  //     preventDefault 失败也不会有 visual 滚动 bug
  //   - 切换用 goToPanel —— 同一个动画 + 同一个 ease，保留"渐快渐慢和居中"
  useEffect(() => {
    if (!isMobileLayout) return
    const section = sectionRef.current
    if (!section) return

    const SWIPE_THRESHOLD = 50     // 横向 swipe 触发面板切换的最小 dx (px)
    const FLICK_MAX_TIME = 300     // <此时长 + 足够 dx 算 flick
    const FLICK_MIN_DX = 20
    const DIRECTION_LOCK_PX = 10   // 累计移动这么多像素后决定方向

    let startX = 0
    let startY = 0
    let startTime = 0
    let direction: "h" | "v" | null = null

    function onStart(e: TouchEvent) {
      if (isAnimatingRef.current) return
      const t = e.touches[0]
      startX = t.clientX
      startY = t.clientY
      startTime = Date.now()
      direction = null
    }

    function onMove(e: TouchEvent) {
      if (isAnimatingRef.current) return

      // 已锁定为竖向 → 不干预，浏览器原生滚动
      if (direction === "v") return

      const t = e.touches[0]
      const dx = t.clientX - startX
      const dy = t.clientY - startY
      const absX = Math.abs(dx)
      const absY = Math.abs(dy)

      // 还没决定方向 —— 等累计够 10px 再判断
      if (direction === null) {
        if (absX < DIRECTION_LOCK_PX && absY < DIRECTION_LOCK_PX) return

        if (absX > absY * 1.2) {
          direction = "h"
        } else if (absY > absX * 1.2) {
          direction = "v"
          return
        } else if (Math.max(absX, absY) > 30) {
          // 较大幅度但方向接近 45°，强制决定
          direction = absX > absY ? "h" : "v"
          if (direction === "v") return
        } else {
          return // 还不够明确，继续等
        }
      }

      // direction === 'h' —— 拦截原生拖动作为兜底
      // (touch-action: pan-y 应该已经处理了横向，这里是双重保险)
      e.preventDefault()
    }

    function onEnd(e: TouchEvent) {
      const wasHorizontal = direction === "h"
      direction = null
      if (!wasHorizontal) return
      if (isAnimatingRef.current) return

      const endX = e.changedTouches[0].clientX
      const dx = startX - endX // 正值 = 手指向左滑 = 下一面板
      const dt = Date.now() - startTime

      const isFlick = Math.abs(dx) > FLICK_MIN_DX && dt < FLICK_MAX_TIME
      if (Math.abs(dx) < SWIPE_THRESHOLD && !isFlick) return

      const cur = activeRef.current
      const goingNext = dx > 0

      if (goingNext && cur < N - 1) {
        goToPanel(cur + 1)
      } else if (!goingNext && cur > 0) {
        goToPanel(cur - 1)
      }
      // 边界（第一面板右滑 / 最后面板左滑）—— 不做任何事，让用户感觉到边界
    }

    function onCancel() {
      direction = null
    }

    section.addEventListener("touchstart", onStart, { passive: true })
    section.addEventListener("touchmove", onMove, { passive: false })
    section.addEventListener("touchend", onEnd, { passive: true })
    section.addEventListener("touchcancel", onCancel, { passive: true })

    return () => {
      section.removeEventListener("touchstart", onStart)
      section.removeEventListener("touchmove", onMove)
      section.removeEventListener("touchend", onEnd)
      section.removeEventListener("touchcancel", onCancel)
    }
  }, [isMobileLayout, goToPanel])

  // ====== Keyboard ======
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isInPin()) return

      const now = performance.now()
      if (now < cooldownUntilRef.current) return
      if (isAnimatingRef.current || isExitingRef.current) return

      const isDown =
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " " ||
        e.key === "ArrowRight"
      const isUp =
        e.key === "ArrowUp" || e.key === "PageUp" || e.key === "ArrowLeft"

      if (isDown || isUp) {
        e.preventDefault()
        cooldownUntilRef.current = now + POST_NAV_LOCK_MS
        navigate(isDown)
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [navigate, isInPin])

  // prev/next 按钮 + 圆点
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
      className="relative atelier-section"
      style={{ height: `${N * 100}vh` }}
    >
      <div className="atelier-inner sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* ============ Header 段 ============ */}
        <div className="shrink-0 relative z-10 px-6 md:px-12 pt-28 md:pt-32 pb-4 md:pb-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-4 text-white/70">
              <Hairline width={32} />
              <Eyebrow>The Atelier · Method</Eyebrow>
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
                From <span className="italic">plant</span> to preparation.
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

        {/* ============ 横向 Track 段 ============ */}
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

                <div className="flex justify-center md:justify-end">
                  <div className="text-brand/85 w-[150px] md:w-[240px] lg:w-[300px] aspect-square">
                    <Icon />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </motion.div>

        {/* ============ 圆点分页段 ============ */}
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
