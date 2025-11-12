"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { newAndNotable } from "@/lib/data"   // ← 从 data.ts 读取你的数据（含 badge）
import { asset } from '@/lib/asset'
import { Img, Video, Source } from '@/components/AssetMedia'

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
    <section className="py-16 px-6 bg-[#A1C1A1] text-[#0B0B0B]">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-center">New and notable</h2>
        <p className="mt-3 text-center text-sm md:text-base text-black/70">
          A collection of longstanding formulations and recent additions to the range—each likely to make for a memorable gift.
        </p>

        <div className="relative mt-10">
          <div className="overflow-hidden" ref={emblaRef}>
            {/* 等高关键：items-stretch + 每个 article 用 flex-col + h-full，底部 mt-auto */}
            <div className="flex -ml-4 items-stretch">
              {items.map((p) => (
                <div key={p.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <article className="h-full flex flex-col">
                    {/* 产品图：统一 4:3 比例 */}
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-contain"
                        sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
                      />
                    </div>

                    {/* 标题 + 文案：固定最小高度，避免一高一低 */}
                    <div className="mt-6 min-h-[96px]">
                      <h3 className="text-[18px] font-semibold leading-snug">{p.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-black/75">{p.subtitle}</p>
                    </div>

                    {/* 底部：价格 + 按钮 */}
                    <div className="mt-auto">
                      <div className="mt-4 text-[15px] font-medium">{p.price}</div>
                      <div className="mt-4">
                        <Button
                          className="w-full h-12 rounded-none bg-[#2E2E2E] text-white hover:bg-black transition-colors"
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
        </div>
      </div>
    </section>
  )
}
