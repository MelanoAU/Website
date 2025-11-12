"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Search, ShoppingCart, User, ChevronRight } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { asset } from '@/lib/asset'


const LEFT_NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/reviews", label: "Reviews" },
  { href: "/rewards", label: "Rewards" },
]

const RIGHT_NAV = [
  { href: "/professionals", label: "Professionals" },
  { href: "/about", label: "About Us" },
]

// 可调参数
const SCROLLED_BLUR_OFFSET = 24;  // 超过此距离开始加毛玻璃/底边
const DELTA_THRESHOLD = 6;        // 需要超过这个像素差才认定为“方向变化”
const SHOW_WHEN_TOP = 64;         // 距顶部小于该值时强制显示

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false) // true=上移隐藏，false=下移出现
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          // 1) 顶部阴影/毛玻璃启用
          setScrolled(y > SCROLLED_BLUR_OFFSET)

          // 2) 根据滚动方向隐藏/显示
          const delta = y - lastY.current
          const goingDown = delta > DELTA_THRESHOLD
          const goingUp = delta < -DELTA_THRESHOLD

          if (y < SHOW_WHEN_TOP) {
            // 回到顶端附近时，始终显示
            setHidden(false)
          } else if (goingDown) {
            setHidden(true)   // 向下：隐藏
          } else if (goingUp) {
            setHidden(false)  // 向上：出现
          }

          lastY.current = y
          ticking.current = false
        })
        ticking.current = true
      }
    }

    // 初始化一次
    lastY.current = window.scrollY
    setScrolled(window.scrollY > SCROLLED_BLUR_OFFSET)

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50",
        // 动效：向上隐藏 / 向下出现
        "transition-transform duration-300 ease-out will-change-transform",
        hidden ? "-translate-y-full" : "translate-y-0",
        // 背景：初始透明；滚动后加半透明+毛玻璃+底边
        scrolled ? "bg-black/70 nav-blur border-b border-white/5" : "bg-transparent",
      ].join(" ")}
    >
      {/* 三栏：左 1fr | 中 auto | 右 1fr，保证 Logo 几何居中 */}
      <div className="mx-auto w-full h-30 px-4 md:px-6 grid grid-cols-3 md:[grid-template-columns:1fr_auto_1fr] items-center">
        {/* 左栏：桌面导航 / 移动端汉堡 */}
        <div className="flex items-center">
          {/* Mobile: 汉堡抽屉（更美观+可搜索+点击自动关闭） */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open Menu" className="text-white">
                  <Menu />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[86vw] max-w-sm p-0 bg-[#0B0B0B] text-white border-r border-white/10"
              >
                {/* 顶部：Logo + 关闭 */}
                <SheetHeader className="px-4 py-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <Image src={asset('images/logo@256x228.png')} alt="Melano" width={120} height={32} className="h-7 w-auto" />
                    <SheetClose asChild>
                      <button aria-label="Close" className="p-2 rounded-full hover:bg-white/10">
                        <X className="h-5 w-5" />
                      </button>
                    </SheetClose>
                  </div>
                </SheetHeader>

                {/* 可滚动主体 */}
                <div className="overflow-y-auto max-h-[calc(100dvh-64px)] pb-8">
                  {/* 搜索框 */}
                  <div className="px-4 pt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                      <input
                        type="search"
                        placeholder="Search products…"
                        className="w-full h-11 pl-10 pr-3 rounded-xl bg-white/5 text-white placeholder:text-white/50
                                  outline-none ring-0 focus:bg-white/10 transition-colors"
                      />
                    </div>
                  </div>

                  {/* 分组：Browse（左侧导航） */}
                  <div className="mt-6 px-2">
                    <div className="px-2 text-xs tracking-wider text-white/50 uppercase">Browse</div>
                    <ul className="mt-2 space-y-1">
                      {LEFT_NAV.map((item) => (
                        <li key={item.href}>
                          <SheetClose asChild>
                            <a
                              href={item.href}
                              className="flex items-center justify-between px-3 py-3 rounded-lg
                                        text-base text-white/90 hover:bg-white/5 active:bg-white/10"
                            >
                              <span>{item.label}</span>
                              <ChevronRight className="h-4 w-4 opacity-40" />
                            </a>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 分组：Company（右侧导航） */}
                  <div className="mt-6 px-2">
                    <div className="px-2 text-xs tracking-wider text-white/50 uppercase">Company</div>
                    <ul className="mt-2 space-y-1">
                      {RIGHT_NAV.map((item) => (
                        <li key={item.href}>
                          <SheetClose asChild>
                            <a
                              href={item.href}
                              className="flex items-center justify-between px-3 py-3 rounded-lg
                                        text-base text-white/90 hover:bg-white/5 active:bg-white/10"
                            >
                              <span>{item.label}</span>
                              <ChevronRight className="h-4 w-4 opacity-40" />
                            </a>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 快捷图标区 */}
                  <div className="mt-8 px-4 grid grid-cols-3 gap-3">
                    <SheetClose asChild>
                      <a
                        href="/search"
                        className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white/5 py-3 hover:bg-white/10"
                      >
                        <Search className="h-5 w-5" />
                        <span className="text-xs text-white/80">Search</span>
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <a
                        href="/cart"
                        className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white/5 py-3 hover:bg-white/10"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="text-xs text-white/80">Cart</span>
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <a
                        href="/account"
                        className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white/5 py-3 hover:bg-white/10"
                      >
                        <User className="h-5 w-5" />
                        <span className="text-xs text-white/80">Account</span>
                      </a>
                    </SheetClose>
                  </div>

                  {/* 底部说明 */}
                  <div className="mt-6 px-4 text-[11px] text-white/40 leading-relaxed">
                    © {new Date().getFullYear()} Melano. All rights reserved.
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop: 左侧导航 */}
          <nav className="hidden md:flex items-center gap-10">
            {LEFT_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/90 hover:text-brand transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 中栏：Logo 居中 */}
        <div className="justify-self-center">
          <Link href="/" aria-label="Melano home" className="inline-flex items-center">
            {/* 
              width/height 只是占位以避免布局抖动，
              实际显示高度用 Tailwind 控制：h-7 md:h-8
            */}
            <Image
              src={asset('images/logo@256x228.png')}
              alt="Melano"
              width={160}
              height={40}
              priority
              className="h-20 w-auto md:h-20"
            />
          </Link>
        </div>

        {/* 右栏：右侧导航 + 图标 */}
        <div className="flex items-center justify-end gap-10">
          <nav className="hidden md:flex items-center gap-10">
            {RIGHT_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/90 hover:text-brand transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 图标：Search / Cart / Account */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/search" aria-label="Search" className="text-white/90 hover:text-brand">
              <Search className="h-5 w-5" />
            </Link>
            <Link href="/cart" aria-label="Cart" className="text-white/90 hover:text-brand">
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <Link href="/account" aria-label="My Account" className="text-white/90 hover:text-brand">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
