// src/components/product/gallery.tsx
"use client"

import Image from "next/image"
import { useState } from "react"
import ImgFit from '@/components/ImgFit'

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)

  return (
    <div>
      {/* 大图：4:3 等比，暗底衬托 */}
      <div className="relative aspect-[4/3] bg-black/20">
        <ImgFit src={images[active]} alt={title} mode="contain" />
        {/* <Image
          key={images[active]}
          src={images[active]}
          alt={title}
          fill
          className="object-contain"
          sizes="(min-width:1280px) 50vw, 100vw"
          priority
        /> */}
      </div>

      {/* 缩略图 */}
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              aria-label={`image ${i + 1}`}
              onClick={() => setActive(i)}
              className={[
                "relative aspect-square bg-black/20",
                i === active ? "ring-2 ring-[#A1C1A1]" : "ring-1 ring-white/10"
              ].join(" ")}
            >
              <Image src={src} alt={`${title} ${i + 1}`} fill className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
