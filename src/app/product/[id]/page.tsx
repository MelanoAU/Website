import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import ProductDetail from "@/components/product/product-detail"
import { newAndNotable } from "@/lib/data"

export const dynamicParams = false

export function generateStaticParams() {
  return (newAndNotable ?? []).map((p) => ({ id: String(p.id).trim() }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pid = decodeURIComponent(id).trim()

  const product = (newAndNotable ?? []).find(
    (p) => String(p.id).trim() === pid
  )
  if (!product) return notFound()

  const related = (newAndNotable ?? [])
    .filter((p) => p.badge === "NaN" && p.id !== product.id)
    .slice(0, 3)

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <ProductDetail product={product} related={related} />
      </main>
      <Footer />
    </>
  )
}
