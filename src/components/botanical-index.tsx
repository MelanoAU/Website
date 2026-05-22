"use client"

// Botanical Index —— 五种核心植萃介绍。
//
// 主页未用过的设计组合：
//  - 左侧 sticky 垂直索引（01–05）随滚动 highlight 当前章节
//  - 右侧五张 chapter cards 垂直堆叠，每张有独立的简笔植物 SVG（非 EucalyptusBranch 复用）
//  - 入场动画：clip-path maskReveal（横向擦出）+ letter stagger（字符级 stagger）—— 这两种 helper 在 motion.ts 中已存在但主页其他 section 未使用

import { motion, type Variants } from "framer-motion"
import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import {
  easeCustom,
  letter,
  revealUp,
  staggerContainer,
} from "@/lib/motion"
import { Eyebrow, Hairline } from "@/components/ornaments"

// 本组件特有的「模糊上浮」入场 —— 主页其他 section 未使用
const blurReveal: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: easeCustom },
  },
}

// 单词级 stagger 的子变体
const wordVariant: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeCustom },
  },
}

// ===================== 五个简笔植物 SVG =====================
// 统一风格：currentColor stroke，pathLength 画线动画，96×96 viewBox

type IconProps = { className?: string; delay?: number }

function pathProps(delay = 0, duration = 1.6) {
  return {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration, delay, ease: easeCustom },
  }
}

function FoTiIcon({ className = "", delay = 0 }: IconProps) {
  // 何首乌 —— 块茎 + 卷曲根须
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 96 96"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.ellipse cx="48" cy="38" rx="20" ry="14" {...pathProps(delay)} />
      <motion.path d="M48 52 C 46 64, 38 72, 28 80" {...pathProps(delay + 0.3)} />
      <motion.path d="M52 52 C 54 64, 62 72, 70 78" {...pathProps(delay + 0.4)} />
      <motion.path d="M48 52 C 48 66, 50 78, 50 86" {...pathProps(delay + 0.5)} />
      <motion.path d="M40 30 C 36 20, 34 14, 36 8" {...pathProps(delay + 0.6)} />
      <motion.path d="M56 30 C 60 22, 64 16, 70 14" {...pathProps(delay + 0.7)} />
    </motion.svg>
  )
}

function GinsengIcon({ className = "", delay = 0 }: IconProps) {
  // 人参 —— 人形根 + 顶端两片小叶
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 96 96"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path d="M48 18 C 46 32, 46 44, 48 56" {...pathProps(delay)} />
      <motion.path d="M48 56 C 42 66, 36 76, 30 84" {...pathProps(delay + 0.3)} />
      <motion.path d="M48 56 C 54 66, 60 76, 66 84" {...pathProps(delay + 0.4)} />
      <motion.path d="M48 38 C 42 40, 38 42, 34 40" {...pathProps(delay + 0.5)} />
      <motion.path d="M48 38 C 54 40, 58 42, 62 40" {...pathProps(delay + 0.55)} />
      <motion.path d="M48 18 C 42 12, 36 10, 30 12 C 36 6, 44 6, 48 10" {...pathProps(delay + 0.7)} />
      <motion.path d="M48 18 C 54 12, 60 10, 66 12 C 60 6, 52 6, 48 10" {...pathProps(delay + 0.75)} />
    </motion.svg>
  )
}

function UsmanIcon({ className = "", delay = 0 }: IconProps) {
  // 乌兹曼 —— 主茎 + 三组对生鞘叶
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 96 96"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path d="M48 86 C 48 60, 48 36, 48 12" {...pathProps(delay)} />
      <motion.path d="M48 68 C 38 66, 30 60, 22 50" {...pathProps(delay + 0.3)} />
      <motion.path d="M48 68 C 58 66, 66 60, 74 50" {...pathProps(delay + 0.35)} />
      <motion.path d="M48 50 C 38 48, 32 42, 26 32" {...pathProps(delay + 0.5)} />
      <motion.path d="M48 50 C 58 48, 64 42, 70 32" {...pathProps(delay + 0.55)} />
      <motion.path d="M48 32 C 40 30, 34 24, 30 16" {...pathProps(delay + 0.7)} />
      <motion.path d="M48 32 C 56 30, 62 24, 66 16" {...pathProps(delay + 0.75)} />
      <motion.circle cx="48" cy="12" r="2.4" fill="currentColor" stroke="none" {...pathProps(delay + 1.1, 0.5)} />
    </motion.svg>
  )
}

function SoapberryIcon({ className = "", delay = 0 }: IconProps) {
  // 无患子 —— 圆形果实 + 短茎 + 一片小叶
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 96 96"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.circle cx="48" cy="58" r="22" {...pathProps(delay)} />
      <motion.path d="M48 36 C 46 28, 44 22, 40 18" {...pathProps(delay + 0.4)} />
      <motion.path d="M40 18 C 32 16, 26 18, 22 22 C 30 22, 36 22, 42 24 Z" {...pathProps(delay + 0.6)} />
      <motion.path d="M44 52 C 46 50, 50 50, 52 52" {...pathProps(delay + 0.8)} />
    </motion.svg>
  )
}

function BiotaIcon({ className = "", delay = 0 }: IconProps) {
  // 侧柏叶 —— 鳞片状针叶簇（扇形）
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 96 96"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path d="M48 86 C 48 70, 48 52, 48 32" {...pathProps(delay)} />
      <motion.path d="M48 72 C 38 70, 30 64, 22 56" {...pathProps(delay + 0.25)} />
      <motion.path d="M48 72 C 58 70, 66 64, 74 56" {...pathProps(delay + 0.3)} />
      <motion.path d="M48 58 C 36 56, 26 50, 18 40" {...pathProps(delay + 0.45)} />
      <motion.path d="M48 58 C 60 56, 70 50, 78 40" {...pathProps(delay + 0.5)} />
      <motion.path d="M48 44 C 38 40, 30 34, 26 26" {...pathProps(delay + 0.65)} />
      <motion.path d="M48 44 C 58 40, 66 34, 70 26" {...pathProps(delay + 0.7)} />
      <motion.path d="M48 32 C 42 26, 38 20, 36 12" {...pathProps(delay + 0.85)} />
      <motion.path d="M48 32 C 54 26, 58 20, 60 12" {...pathProps(delay + 0.9)} />
    </motion.svg>
  )
}

// ===================== 数据 =====================

type Botanical = {
  id: string
  number: string
  name: string
  chinese: string
  lineage: string
  description: string
  Icon: (p: IconProps) => React.ReactElement
}

const BOTANICALS: Botanical[] = [
  {
    id: "fo-ti",
    number: "01",
    name: "Fo-Ti",
    chinese: "何首乌",
    lineage: "Eastern herbal tradition",
    description:
      "Revered in ancient Eastern herbal traditions, Fo-Ti deeply nourishes the hair roots, reinforces fragile strands and lifts the resilience of the hair shaft. It revives dull, weakened lengths and stabilises the scalp foundation for lasting, healthy vitality.",
    Icon: FoTiIcon,
  },
  {
    id: "ginseng",
    number: "02",
    name: "Ginseng",
    chinese: "人参",
    lineage: "Eastern · Ayurvedic wellness",
    description:
      "Celebrated across Eastern and Ayurvedic wellness traditions, Ginseng infuses the scalp with potent phytonutrients. It awakens dormant root energy, relieves scalp fatigue and revitalises the scalp environment for stronger, fuller hair.",
    Icon: GinsengIcon,
  },
  {
    id: "usman",
    number: "03",
    name: "Usman Herb",
    chinese: "乌兹曼",
    lineage: "Central Asian · Eastern rituals",
    description:
      "Honoured in ancient Central Asian and Eastern rituals, Usman Herb restores scalp vitality at its source. It optimises microcirculation, repairs fragile scalp conditions, balances oil and moisture, and nurtures a soft, lustrous head of hair.",
    Icon: UsmanIcon,
  },
  {
    id: "soapberry",
    number: "04",
    name: "Soapberry",
    chinese: "无患子",
    lineage: "Across ancient civilisations",
    description:
      "A classic cleanser across many ancient civilisations, Soapberry is rich in naturally occurring plant saponins. It gently lifts excess oil and impurity from the scalp, unclogs follicles, and purifies — without unsettling the scalp's own moisture barrier.",
    Icon: SoapberryIcon,
  },
  {
    id: "biota",
    number: "05",
    name: "Biota Leaf",
    chinese: "侧柏叶",
    lineage: "Eastern · Mediterranean botany",
    description:
      "Drawn from both Eastern and Mediterranean botanical therapies, Biota Leaf calms and stabilises the scalp. It tempers erratic oil secretion, eases discomfort, fortifies the scalp barrier and sustains long-term balance.",
    Icon: BiotaIcon,
  },
]

// ===================== Chapter Card =====================

function ChapterCard({
  b,
  index,
  onActivate,
}: {
  b: Botanical
  index: number
  onActivate: (id: string) => void
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onActivate(b.id)
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [b.id, onActivate])

  const { Icon } = b

  return (
    <article
      ref={ref}
      id={`botanical-${b.id}`}
      data-index={index}
      className="
        relative
        py-20 md:py-28
        border-t border-white/12
        first:border-t-0
      "
    >
      {/* 巨大半透明背景数字 */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 0.07, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6, ease: easeCustom }}
        className="
          pointer-events-none
          absolute
          left-[-8px] md:left-[-32px]
          top-6 md:top-10
          font-display font-light italic
          text-[180px] md:text-[280px] lg:text-[340px]
          leading-none
          tracking-tight
          text-white
          select-none
        "
      >
        {b.number}
      </motion.span>

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-start">
        <div>
          {/* 中文 + 谱系 */}
          <motion.div
            {...revealUp(0, 1)}
            className="flex items-baseline gap-4 text-white/60"
          >
            <span className="font-display italic text-[18px] md:text-[20px] text-white/75">
              {b.chinese}
            </span>
            <Hairline width={28} thickness={1} />
            <span className="text-[10px] tracking-[0.32em] uppercase">
              {b.lineage}
            </span>
          </motion.div>

          {/* 大字英文名 —— 嵌套 stagger：词在外、字母在内；词内 whitespace-nowrap 保护不破词 */}
          <motion.h3
            variants={staggerContainer(0.18, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="
              mt-5 md:mt-7
              font-display font-light
              text-[56px] md:text-[88px] lg:text-[112px]
              leading-[0.95]
              tracking-tight
              text-white
            "
          >
            {b.name.split(" ").map((word, wi, words) => (
              <Fragment key={`${b.id}-w-${wi}`}>
                <motion.span
                  variants={staggerContainer(0.045)}
                  className="inline-block whitespace-nowrap"
                >
                  {word.split("").map((ch, ci) => (
                    <motion.span
                      key={`${b.id}-l-${wi}-${ci}`}
                      variants={letter}
                      className="inline-block"
                    >
                      {ch}
                    </motion.span>
                  ))}
                </motion.span>
                {wi < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </motion.h3>

          {/* 段落 —— 单词级 blur stagger（主页其他 section 未用过的节奏） */}
          <motion.p
            variants={staggerContainer(0.025, 0.25)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="
              mt-10 md:mt-12
              font-display
              text-white/82
              text-[18px] md:text-[20px]
              leading-[1.7]
              max-w-xl
            "
          >
            {b.description.split(" ").map((word, i) => (
              <motion.span
                key={`${b.id}-w-${i}`}
                variants={wordVariant}
                className="inline-block"
                style={{ whiteSpace: "pre" }}
              >
                {word + " "}
              </motion.span>
            ))}
          </motion.p>
        </div>

        {/* 植物 SVG */}
        <motion.div
          {...revealUp(0.25, 1.2)}
          className="
            relative
            justify-self-center md:justify-self-end
            md:mt-6
            text-brand
            opacity-90
          "
        >
          <Icon
            className="w-[120px] md:w-[150px] lg:w-[180px] h-auto"
            delay={0.4}
          />
        </motion.div>
      </div>
    </article>
  )
}

// ===================== Section =====================

export default function BotanicalIndex() {
  const [activeId, setActiveId] = useState<string>(BOTANICALS[0].id)
  const activeIndex = useMemo(
    () => BOTANICALS.findIndex((b) => b.id === activeId),
    [activeId]
  )

  return (
    <section className="relative px-6 py-32 md:py-48">
      <div className="mx-auto max-w-6xl">
        {/* ============= Intro ============= */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 text-white/70">
            <Hairline width={32} />
            <Eyebrow>The five botanicals</Eyebrow>
            <Hairline width={32} />
          </div>

          <motion.h2
            variants={blurReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="
              mt-10
              font-display font-light italic
              text-[48px] md:text-[80px] lg:text-[96px]
              leading-[0.95]
              tracking-tight
              text-white
            "
          >
            Materia, by name.
          </motion.h2>

          <motion.p
            {...revealUp(0.3, 1.2)}
            className="
              mt-6 mx-auto
              max-w-xl
              font-display
              text-white/75
              text-[18px] md:text-[20px]
              leading-relaxed
            "
          >
            Five botanicals carry the active work of every bar — read
            one by one, from root to leaf, with their oldest names
            kept intact.
          </motion.p>
        </div>

        {/* ============= Body：左 sticky index + 右章节卡 ============= */}
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr] gap-12 md:gap-20 items-start">
          {/* 左侧 sticky 索引（仅桌面显示） */}
          <aside
            className="
              hidden md:block
              md:sticky md:top-32
              self-start
            "
            aria-label="Botanical index"
          >
            <p className="text-[10px] tracking-[0.32em] uppercase text-white/55">
              The Index
            </p>
            <ol className="relative mt-6">
              {/* 垂直竖线 */}
              <span
                aria-hidden
                className="absolute left-0 top-2 bottom-2 w-px bg-white/15"
              />
              {/* active 横滑指示条 */}
              <motion.span
                aria-hidden
                className="absolute left-[-4px] w-[9px] h-[9px] rounded-full bg-brand"
                animate={{ y: activeIndex * 56 + 8 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 22,
                  mass: 0.6,
                }}
              />
              {BOTANICALS.map((b) => {
                const isActive = b.id === activeId
                return (
                  <li
                    key={b.id}
                    className="
                      grid grid-cols-[40px_1fr]
                      items-baseline
                      gap-4
                      h-14
                      pl-6
                    "
                  >
                    <a
                      href={`#botanical-${b.id}`}
                      className={`
                        font-display italic text-[16px]
                        transition-colors duration-500
                        ${isActive ? "text-brand" : "text-white/40"}
                      `}
                    >
                      {b.number}
                    </a>
                    <a
                      href={`#botanical-${b.id}`}
                      className={`
                        font-display text-[15px] md:text-[16px]
                        transition-colors duration-500
                        ${isActive ? "text-white" : "text-white/45 hover:text-white/75"}
                      `}
                    >
                      {b.name}
                    </a>
                  </li>
                )
              })}
            </ol>
          </aside>

          {/* 右侧 chapter cards */}
          <div>
            {BOTANICALS.map((b, i) => (
              <ChapterCard
                key={b.id}
                b={b}
                index={i}
                onActivate={setActiveId}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
