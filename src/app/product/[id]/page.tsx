// src/app/product/[id]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import Gallery from "@/components/product/gallery"
import BuyBox from "@/components/product/buy-box"
import { newAndNotable } from "@/lib/data"
import Header from "@/components/header"
import Footer from "@/components/footer"

// 静态导出：声明只允许生成期列出的参数
export const dynamicParams = false

// 构建期产出所有可访问的产品路径（若只想导出 badge === "NaN"，可在此处过滤）
export function generateStaticParams() {
  return (newAndNotable ?? []).map(p => ({ id: String(p.id).trim() }))
}

// ✅ Next.js 16：params 是 Promise，需要 async + await
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pid = decodeURIComponent(id).trim()

  const product = (newAndNotable ?? []).find(p => String(p.id).trim() === pid)
  if (!product) return notFound()

  // 相关推荐：仅展示 badge === "NaN" 且排除当前
  const related = (newAndNotable ?? [])
    .filter(p => p.badge === "NaN" && p.id !== product.id)
    .slice(0, 4)

  const gallery: string[] = (product as any).images ?? [product.image]

  return (
    <>
        <Header />
        <div className="bg-[#0b0b0b] h-25" />
        <main className="bg-[#0b0b0b] text-white">
        {/* 面包屑 */}
        <div className="mx-auto max-w-6xl px-6 pt-6 text-sm text-white/70">
            <Link href="/" className="hover:text-[#A1C1A1]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-[#A1C1A1]">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{product.title}</span>
        </div>

        {/* 主体：左图右购 */}
        <section className="mx-auto max-w-6xl px-6 py-10 grid gap-8 md:grid-cols-2">
            <Gallery images={gallery} title={product.title} />
            <BuyBox
            id={product.id}
            title={product.title}
            subtitle={product.subtitle}
            price={product.price}
            sizes={(product as any).sizes}
            />
        </section>

        {/* 简要详情 */}
        <section className="mx-auto max-w-4xl px-6 pb-12 space-y-6">
            <details className="group border-t border-white/10 pt-6">
            <summary className="cursor-pointer list-none text-lg font-semibold select-none flex items-center justify-between">
                Product details
                <span className="text-white/40 transition-transform group-open:rotate-90">›</span>
            </summary>
            <div className="mt-3 text-white/80 leading-relaxed">
                {product.subtitle}. Crafted with care. Vegan-friendly. No animal testing.
            </div>
            </details>
            <details className="group border-t border-white/10 pt-6">
            <summary className="cursor-pointer list-none text-lg font-semibold select-none flex items-center justify-between">
                Shipping & returns
                <span className="text-white/40 transition-transform group-open:rotate-90">›</span>
            </summary>
            <div className="mt-3 text-white/80 leading-relaxed">
                Free shipping over $60. 30-day returns on unused items. See our{" "}
                <Link href="/returns" className="underline underline-offset-4 hover:text-[#A1C1A1]">policy</Link>.
            </div>
            </details>
        </section>

        {/* 相关推荐 */}
        {related.length > 0 && (
            <section className="bg-[#171717]">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <h3 className="text-2xl font-semibold">You may also like</h3>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map(p => (
                    <Link key={p.id} href={`/product/${p.id}`} className="group block">
                    <div className="relative aspect-[4/3] bg-black/20">
                        <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-contain" />
                    </div>
                    <div className="mt-3 text-[15px] font-medium">{p.title}</div>
                    <div className="text-sm text-white/70">{p.price}</div>
                    </Link>
                ))}
                </div>
            </div>
            </section>
        )}
        </main>
        <Footer />
    </>
  )
}
