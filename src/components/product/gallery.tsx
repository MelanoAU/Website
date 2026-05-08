"use client"

import { useState } from "react"
import { motion, AnimatePresence, cubicBezier } from "framer-motion"
import ImgFit from "@/components/ImgFit"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

export default function Gallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-4">
      {/* 主图：1:1 方形，毛玻璃衬底，淡淡内描边 */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[active]}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: easeBezier }}
            className="absolute inset-0"
          >
            <ImgFit src={images[active]} alt={title} mode="contain" />
          </motion.div>
        </AnimatePresence>
        {/* 顶部柔光 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent" />
      </div>

      {/* 缩略图组（仅在多于 1 张时显示） */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              aria-label={`Image ${i + 1}`}
              onClick={() => setActive(i)}
              className={[
                "relative aspect-square overflow-hidden rounded-xl bg-white/[0.04] backdrop-blur-md border transition-all",
                i === active
                  ? "border-brand ring-2 ring-brand/40"
                  : "border-white/10 hover:border-white/30",
              ].join(" ")}
            >
              <ImgFit src={src} alt={`${title} ${i + 1}`} mode="contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
