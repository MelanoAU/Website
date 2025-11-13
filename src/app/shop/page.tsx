"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { newAndNotable } from "@/lib/data"
import ImgFit from '@/components/ImgFit'
import { ChevronDown } from "lucide-react"


type SortKey = "relevance" | "price-asc" | "price-desc" | "title-asc"

function parsePrice(p: string) {
  // 从 "$65.00" 提取数字 65.00
  const n = Number(p.replace(/[^\d.]/g, ""))
  return isNaN(n) ? 0 : n
}

export default function ShopPage() {
  const [q, setQ] = useState("")
  const [sort, setSort] = useState<SortKey>("relevance")

  // 只展示 badge === "NaN"；如果要全部，改成：const base = newAndNotable ?? [];
  const base = (newAndNotable ?? []).filter((p) => p.badge === "NaN")

  const items = useMemo(() => {
    const ql = q.trim().toLowerCase()

    let arr = base.filter((p) => {
      if (!ql) return true
      return (
        p.title.toLowerCase().includes(ql) ||
        p.subtitle.toLowerCase().includes(ql)
      )
    })

    switch (sort) {
      case "price-asc":
        arr = [...arr].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
        break
      case "price-desc":
        arr = [...arr].sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
        break
      case "title-asc":
        arr = [...arr].sort((a, b) => a.title.localeCompare(b.title))
        break
      case "relevance":
      default:
        // 不动，保持原顺序即可（可按你数据顺序作为“人肉排序”）
        break
    }
    return arr
  }, [q, sort, base])

  return (
    <div className="min-h-[100svh] flex flex-col bg-[#0b0b0b]">
      <Header />
      {/* 顶部占位，避免被 fixed header 遮住；如你已有统一占位，可删 */}
      <div className="bg-[#0b0b0b] h-25" />

      <main className="flex-1 text-white">
        <section className="mx-auto max-w-6xl px-6 py-10">
          {/* 标题与工具条 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">Shop</h1>
              <p className="mt-2 text-white/70">Browse our latest products.</p>
            </div>

            <div className="flex items-center gap-3">
              {/* 搜索 */}
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                className="h-11 w-48 sm:w-64 rounded-none border border-white/20 bg-transparent
                           px-3 text-sm placeholder:text-white/50 outline-none focus:border-white/40"
              />
              {/* 排序 */}
              <div className="relative">
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="h-11 w-48 rounded-none border border-white/20 bg-transparent text-sm
                            pl-4 pr-12 appearance-none outline-none focus:border-white/40"
                >
                    <option className="bg-[#0b0b0b]" value="relevance">Sort: Relevance</option>
                    <option className="bg-[#0b0b0b]" value="price-asc">Price: Low to High</option>
                    <option className="bg-[#0b0b0b]" value="price-desc">Price: High to Low</option>
                    <option className="bg-[#0b0b0b]" value="title-asc">Title: A → Z</option>
                </select>

                {/* 右侧自定义箭头，不占点击事件 */}
                <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60"
                />
                </div>
            </div>
          </div>

          {/* 结果统计 */}
          <div className="mt-4 text-sm text-white/60">{items.length} result{items.length !== 1 ? "s" : ""}</div>

          {/* 商品网格 */}
          {items.length ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <article key={p.id} className="group flex flex-col bg-[#111]/60 border border-white/10">
                  {/* 图 */}
                  <Link href={`/product/${p.id}`} className="relative aspect-[4/3] bg-black/20">
                    <ImgFit src={p.image} alt={p.title} mode="contain" />
                    {/* <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-contain"
                      sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
                      priority={false}
                    /> */}
                  </Link>

                  {/* 文案 */}
                  <div className="flex flex-col flex-1 p-4">
                    <Link href={`/product/${p.id}`} className="block">
                      <h3 className="text-[18px] font-semibold leading-snug group-hover:text-[#A1C1A1] transition-colors">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-white/70">{p.subtitle}</p>
                    </Link>

                    {/* 底部：价格 + 按钮 */}
                    <div className="mt-auto pt-4">
                      <div className="text-[15px] font-medium">{p.price}</div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <Button
                          asChild
                          className="rounded-none h-11 bg-[#0b0b0b] text-white border border-[#A1C1A1]"
                        >
                          <Link href={`/product/${p.id}`}>View</Link>
                        </Button>
                        <Button
                          onClick={() => alert(`Added ${p.title} to cart`)}
                          className="rounded-none h-11 bg-[#A1C1A1] text-black hover:bg-white"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 text-white/70">No products found.</div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
