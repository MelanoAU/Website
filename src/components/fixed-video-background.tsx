"use client"

import { asset } from "@/lib/asset"

export default function FixedVideoBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden bg-black pointer-events-none"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={asset("/videos/hero.mp4")}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        poster={asset("/images/hero-poster.jpg")}
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  )
}
