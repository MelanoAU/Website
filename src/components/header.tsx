"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { asset } from "@/lib/asset"
import Image from "next/image"
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
  ChevronRight,
} from "lucide-react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCartCount } from "@/lib/cart"

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

// 滚动行为参数
const SCROLLED_BLUR_OFFSET = 24
const DELTA_THRESHOLD = 6
const SHOW_WHEN_TOP = 64

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)
  const cartCount = useCartCount()
  const cartBadge = cartCount > 99 ? "99+" : String(cartCount)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setScrolled(y > SCROLLED_BLUR_OFFSET)

          const delta = y - lastY.current
          const goingDown = delta > DELTA_THRESHOLD
          const goingUp = delta < -DELTA_THRESHOLD

          if (y < SHOW_WHEN_TOP) {
            setHidden(false)
          } else if (goingDown) {
            setHidden(true)
          } else if (goingUp) {
            setHidden(false)
          }

          lastY.current = y
          ticking.current = false
        })
        ticking.current = true
      }
    }

    lastY.current = window.scrollY
    setScrolled(window.scrollY > SCROLLED_BLUR_OFFSET)

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "transition-transform duration-300 ease-out will-change-transform",
        hidden ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
    >
      {/* 背景层：底部用 mask 渐隐，避免与下方内容形成可见的硬边线 */}
      <div
        aria-hidden
        className={[
          "absolute inset-0 pointer-events-none transition-all duration-300",
          "bg-gradient-to-b",
          scrolled
            ? "from-black/75 via-black/50 to-transparent backdrop-blur-md"
            : "from-black/40 via-black/10 to-transparent",
        ].join(" ")}
        style={{
          maskImage: "linear-gradient(to bottom, black 65%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto w-full h-24 md:h-28 px-4 md:px-6 grid grid-cols-3 md:[grid-template-columns:1fr_auto_1fr] items-center">
        {/* ============= Left ============= */}
        <div className="flex items-center">
          {/* Mobile: hamburger sheet */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="text-white h-11 w-11 rounded-full hover:bg-white/10"
                >
                  <Menu className="size-5" strokeWidth={1.9} />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[88vw] max-w-sm p-0 bg-[#0B0B0B]/95 backdrop-blur-xl text-white border-r border-white/10"
              >
                {/* 顶部：Logo + 关闭 */}
                <SheetHeader className="px-5 py-5 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <Image
                      src={asset("images/logo@256x228.png")}
                      alt="Melano"
                      width={120}
                      height={32}
                      className="h-7 w-auto"
                    />
                    <SheetClose asChild>
                      <button
                        aria-label="Close"
                        className="h-10 w-10 grid place-items-center rounded-full text-white/85 hover:bg-white/10 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </SheetClose>
                  </div>
                </SheetHeader>

                {/* 可滚动主体 */}
                <div className="overflow-y-auto max-h-[calc(100dvh-72px)] pb-10">
                  {/* 搜索框 */}
                  <div className="px-5 pt-5">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
                      <input
                        type="search"
                        placeholder="Search products…"
                        className="
                          w-full h-11 pl-11 pr-4
                          rounded-full bg-white/[0.06] border border-white/15
                          text-sm text-white placeholder:text-white/45 outline-none
                          focus:bg-white/10 focus:border-white/30 transition-colors
                        "
                      />
                    </div>
                  </div>

                  {/* Browse */}
                  <div className="mt-7 px-3">
                    <div className="px-2 text-[11px] tracking-[0.32em] uppercase text-white/55">
                      Browse
                    </div>
                    <ul className="mt-2 space-y-1">
                      {LEFT_NAV.map((item) => (
                        <li key={item.href}>
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className="flex items-center justify-between px-3 py-3 rounded-xl text-base text-white/90 hover:bg-white/[0.06] active:bg-white/10 transition-colors"
                            >
                              <span>{item.label}</span>
                              <ChevronRight className="h-4 w-4 text-white/35" />
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Company */}
                  <div className="mt-6 px-3">
                    <div className="px-2 text-[11px] tracking-[0.32em] uppercase text-white/55">
                      Company
                    </div>
                    <ul className="mt-2 space-y-1">
                      {RIGHT_NAV.map((item) => (
                        <li key={item.href}>
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className="flex items-center justify-between px-3 py-3 rounded-xl text-base text-white/90 hover:bg-white/[0.06] active:bg-white/10 transition-colors"
                            >
                              <span>{item.label}</span>
                              <ChevronRight className="h-4 w-4 text-white/35" />
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 快捷图标区 */}
                  <div className="mt-8 px-5 grid grid-cols-3 gap-3">
                    {[
                      {
                        href: "/search",
                        label: "Search",
                        Icon: Search,
                        badge: 0,
                      },
                      {
                        href: "/cart",
                        label: "Cart",
                        Icon: ShoppingBag,
                        badge: cartCount,
                      },
                      {
                        href: "/login",
                        label: "Account",
                        Icon: User,
                        badge: 0,
                      },
                    ].map(({ href, label, Icon, badge }) => (
                      <SheetClose asChild key={label}>
                        <Link
                          href={href}
                          className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/[0.06] border border-white/10 py-4 hover:bg-white/[0.1] hover:border-white/20 transition-colors"
                        >
                          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand ring-1 ring-brand/30">
                            <Icon className="h-4 w-4" strokeWidth={1.8} />
                            {badge > 0 && (
                              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-brand text-[10px] font-semibold text-black tabular-nums ring-2 ring-[#0B0B0B]">
                                {badge > 99 ? "99+" : badge}
                              </span>
                            )}
                          </span>
                          <span className="text-[11px] tracking-[0.18em] uppercase text-white/85">
                            {label}
                          </span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {/* 底部说明 */}
                  <div className="mt-8 px-5 text-[11px] text-white/35 leading-relaxed">
                    © {new Date().getFullYear()} Melano. All rights reserved.
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop: left nav */}
          <nav className="hidden md:flex items-center gap-9">
            {LEFT_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  relative text-[12px] tracking-[0.18em] uppercase text-white/85
                  hover:text-brand transition-colors
                  after:content-[''] after:absolute after:left-0 after:-bottom-1.5
                  after:h-[1px] after:w-0 after:bg-brand
                  hover:after:w-full after:transition-[width] after:duration-300
                "
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ============= Center ============= */}
        <div className="justify-self-center">
          <Link
            href="/"
            aria-label="Melano home"
            className="inline-flex items-center"
          >
            <Image
              src={asset("images/logo@256x228.png")}
              alt="Melano"
              width={160}
              height={40}
              priority
              className="h-14 md:h-16 w-auto"
            />
          </Link>
        </div>

        {/* ============= Right ============= */}
        <div className="flex items-center justify-end gap-8 md:gap-9">
          {/* Right nav */}
          <nav className="hidden md:flex items-center gap-9">
            {RIGHT_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  relative text-[12px] tracking-[0.18em] uppercase text-white/85
                  hover:text-brand transition-colors
                  after:content-[''] after:absolute after:left-0 after:-bottom-1.5
                  after:h-[1px] after:w-0 after:bg-brand
                  hover:after:w-full after:transition-[width] after:duration-300
                "
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="h-10 w-10 grid place-items-center rounded-full text-white/85 hover:text-brand hover:bg-white/[0.06] transition-colors"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </Link>
            <Link
              href="/cart"
              aria-label={cartCount > 0 ? `Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}` : "Cart"}
              className="relative h-10 w-10 grid place-items-center rounded-full text-white/85 hover:text-brand hover:bg-white/[0.06] transition-colors"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.9} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-brand text-[10px] font-semibold text-black tabular-nums leading-none ring-2 ring-black/40">
                  {cartBadge}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              aria-label="My account"
              className="h-10 w-10 grid place-items-center rounded-full text-white/85 hover:text-brand hover:bg-white/[0.06] transition-colors"
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
