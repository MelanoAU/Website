"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, cubicBezier } from "framer-motion"
import { Button } from "@/components/ui/button"
import { newAndNotable } from "@/lib/data"   // ← 从 data.ts 读取你的数据（含 badge）
import { asset } from '@/lib/asset'
import { Img, Video, Source } from '@/components/AssetMedia'
import ImgFit from '@/components/ImgFit'

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

export default function NewAndNotable() {
  // 只保留 badge === "NaN" 的条目
  const items = (newAndNotable ?? []).filter(p => p.badge === "NaN")

  // 若没有可展示的项目，可选择直接不渲染该区块
  if (!items.length) return null

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [snaps, setSnaps] = useState<number[]>([])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setSnaps(emblaApi.scrollSnapList())
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  return (
    <section className="relative px-6 py-24">
      <div
        aria-hidden
        className="absolute inset-x-0 inset-y-6 md:inset-y-10 mx-auto max-w-7xl rounded-3xl bg-black/55 backdrop-blur-md border border-white/10"
      />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeBezier }}
          className="text-center"
        >
          <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
            The Range
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-white">
            New and notable
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-white/75">
            A collection of longstanding formulations and recent additions to the range — each likely to make for a memorable gift.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: easeBezier }}
          className="relative mt-12"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            {/* 等高关键：items-stretch + 每个 article 用 flex-col + h-full，底部 mt-auto */}
            <div className="flex -ml-4 items-stretch">
              {items.map((p) => (
                <div key={p.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <article className="h-full flex flex-col rounded-2xl bg-white/[0.04] border border-white/10 p-5 hover:bg-white/[0.07] hover:border-white/15 transition-colors">
                    {/* 产品图：统一 4:3 比例 */}
                    <Link href={`/product/${p.id}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5">
                      <ImgFit src={p.image} alt={p.title} mode="contain" />
                    </Link>

                    {/* 标题 + 文案：固定最小高度，避免一高一低 */}
                    <Link href={`/product/${p.id}`} className="mt-5 min-h-[88px] block">
                      <h3 className="text-[18px] font-semibold leading-snug text-white">{p.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-white/70">{p.subtitle}</p>
                    </Link>

                    {/* 底部：价格 + 按钮 */}
                    <div className="mt-auto">
                      <div className="mt-4 text-[15px] font-medium text-white">{p.price}</div>
                      <div className="mt-4">
                        <Button
                          className="w-full h-12 rounded-full bg-brand text-white hover:bg-brand/90 transition-colors"
                          asChild
                        >
                          <Link href={`/product/${p.id}`}>Add to cart</Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
