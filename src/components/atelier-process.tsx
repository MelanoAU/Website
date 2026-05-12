"use client"

// The Atelier —— 横向 scroll-snap 画廊
// 四个工艺步骤：harvest → press → pour → seal

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
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

export default function AtelierProcess() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => {
      const w = el.clientWidth
      const idx = Math.round(el.scrollLeft / w)
      setActive(idx)
      setCanPrev(el.scrollLeft > 8)
      setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
    }
    onScroll()
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  function scrollByPanel(dir: -1 | 1) {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" })
  }

  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      {/* 章节头 */}
      <div className="px-6 mx-auto max-w-6xl">
        <div className="flex items-center gap-4 text-white/70">
          <Hairline width={32} />
          <Eyebrow>The Atelier · Four Hands</Eyebrow>
        </div>

        <div className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: easeCustom }}
            className="
              font-display font-light
              text-[48px] md:text-[80px] lg:text-[96px]
              leading-[0.95]
              tracking-tight
              text-white
              max-w-xl
            "
          >
            <span className="italic">How</span> a bottle is made.
          </motion.h2>

          {/* 桌面端 prev/next 控件 —— hover 时反转为白底深字 */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByPanel(-1)}
              disabled={!canPrev}
              aria-label="Previous step"
              className="
                h-12 w-12 grid place-items-center rounded-full
                border border-white/30
                text-white
                hover:bg-white hover:text-black
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white
                transition-colors duration-500
              "
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
            </button>
            <button
              type="button"
              onClick={() => scrollByPanel(1)}
              disabled={!canNext}
              aria-label="Next step"
              className="
                h-12 w-12 grid place-items-center rounded-full
                border border-white/30
                text-white
                hover:bg-white hover:text-black
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white
                transition-colors duration-500
              "
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </div>

      {/* 横向滚动画廊 */}
      <div className="mt-16 md:mt-20">
        <div
          ref={scrollerRef}
          className="atelier-scroll overflow-x-auto"
        >
          <ul className="flex">
            {STEPS.map(({ num, title, caption, body, icon: Icon }, i) => (
              <li
                key={num}
                className="
                  atelier-snap shrink-0
                  w-screen md:w-[min(80vw,900px)]
                  px-6 md:px-12
                "
              >
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 1.4, ease: easeCustom }}
                  className="
                    relative
                    bg-black/50
                    border border-white/10
                    aspect-[5/6] md:aspect-[7/5]
                    p-8 md:p-14
                    flex flex-col
                  "
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="font-display italic font-light text-brand text-6xl md:text-8xl leading-none">
                      {num}
                    </span>
                    <span className="text-right text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/65 mt-3 md:mt-5">
                      Step {i + 1} of {STEPS.length}
                    </span>
                  </div>

                  <div className="
                    absolute right-6 md:right-14 top-1/2 -translate-y-1/2
                    text-brand/85
                    w-[150px] md:w-[220px] h-[150px] md:h-[220px]
                  ">
                    <Icon />
                  </div>

                  <div className="mt-auto max-w-sm">
                    <Hairline width={36} />
                    <h3 className="mt-5 font-display italic font-light text-[44px] md:text-[64px] leading-[1] tracking-tight text-white">
                      {title}
                    </h3>
                    <p className="mt-3 font-display italic text-[14px] md:text-[15px] text-white/65 tracking-wide">
                      {caption}
                    </p>
                    <p className="mt-6 font-display text-white/80 text-[16px] md:text-[17px] leading-[1.65]">
                      {body}
                    </p>
                  </div>
                </motion.article>
              </li>
            ))}
          </ul>
        </div>

        {/* Pagination 圆点 */}
        <div className="mt-10 flex items-center justify-center gap-3">
          {STEPS.map((s, i) => (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                const el = scrollerRef.current
                if (!el) return
                el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" })
              }}
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
