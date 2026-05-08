import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import ProductDetail from "@/components/product/product-detail"
import {
  fetchActiveProducts,
  fetchProduct,
  fetchProductIds,
} from "@/lib/products"

export const dynamicParams = false

export async function generateStaticParams() {
  const ids = await fetchProductIds()
  return ids.map((id) => ({ id }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pid = decodeURIComponent(id).trim()

  const product = await fetchProduct(pid)
  if (!product) return notFound()

  const all = await fetchActiveProducts()
  const related = all.filter((p) => p.id !== product.id).slice(0, 3)

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
