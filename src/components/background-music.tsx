"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { asset } from "@/lib/asset"

const STORAGE_KEY = "melano:bg-music:muted"
const DEFAULT_VOLUME = 0.32

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // SSR-safe default: muted. On mount we read localStorage and reconcile.
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const stored = window.localStorage.getItem(STORAGE_KEY)
    const initialMuted = stored === "1"
    setMuted(initialMuted)

    audio.volume = DEFAULT_VOLUME
    audio.muted = initialMuted

    if (initialMuted) return

    const tryPlay = () => audio.play().catch(() => {})

    tryPlay()

    // 浏览器自动播放策略：未交互前可能被阻止。
    // 在首次用户交互时再尝试一次。
    const unlock = () => {
      tryPlay()
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("keydown", unlock)
      window.removeEventListener("touchstart", unlock)
    }
    window.addEventListener("pointerdown", unlock, { once: true })
    window.addEventListener("keydown", unlock, { once: true })
    window.addEventListener("touchstart", unlock, { once: true })

    return () => {
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("keydown", unlock)
      window.removeEventListener("touchstart", unlock)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    const next = !muted
    setMuted(next)
    audio.muted = next
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
    if (!next) {
      audio.play().catch(() => {})
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={asset("/audio/ambient.mp3")}
        loop
        preload="auto"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Play background music" : "Mute background music"}
        aria-pressed={!muted}
        className="group fixed bottom-4 right-4 z-[60] grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/45 text-white/85 shadow-[0_4px_18px_-6px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors duration-300 hover:border-[hsl(114_21%_71%)]/70 hover:text-white md:bottom-6 md:right-6 md:h-11 md:w-11"
      >
        {!muted ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border border-[hsl(114_21%_71%)]/40 motion-safe:animate-ping"
          />
        ) : null}
        {muted ? (
          <VolumeX className="relative h-4 w-4 md:h-[18px] md:w-[18px]" />
        ) : (
          <Volume2 className="relative h-4 w-4 md:h-[18px] md:w-[18px]" />
        )}
      </button>
    </>
  )
}
