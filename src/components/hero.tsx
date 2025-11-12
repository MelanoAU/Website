"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
// 顶部新增
import { cubicBezier } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { asset } from '@/lib/asset'
import { Img, Video, Source } from '@/components/AssetMedia'

// 用一个可复用的 easing 函数
const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: easeBezier }
})

export default function Hero() {
  return (
    <section className="relative h-screen md:h-[90svh] flex items-center justify-center px-6 text-center overflow-hidden">
      {/* 背景视频 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
      <video
        className="w-full h-full object-cover"
        src={asset('/videos/hero.mp4')}
        // iOS/Safari 自播放的关键：muted + playsInline
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        poster={asset('/images/hero-poster.jpg')}
      />
        {/* 叠一层渐变遮罩，保证文字对比度 */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/35" />
        {/* 可选：在底部再加一层由下到上透明的渐变，提升层次 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* 前景内容 */}
      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.h1
          {...fadeUp(0.05)}
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-white"
        >
          Glow Naturally with Melano
        </motion.h1>

        <motion.p
          {...fadeUp(0.15)}
          className="mt-4 text-base md:text-lg text-white/85"
        >
          Discover premium organic cosmetics for radiant skin.
        </motion.p>

        <motion.div {...fadeUp(0.25)} className="mt-8">
          <div className="inline-block border border-white p-1 md:p-1.5">
            <Button
            className="
              group rounded-full bg-brand text-white
              font-semibold text-base
              px-7 md:px-8 py-3 md:py-3.5
              transition-all
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-brand/70
              focus-visible:ring-offset-2 focus-visible:ring-offset-black
            "
          >
            Shop Now for Beauty
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
