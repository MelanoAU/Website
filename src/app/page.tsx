import Header from "@/components/header"
import FixedVideoBackground from "@/components/fixed-video-background"
import Hero from "@/components/hero"
import Mission from "@/components/mission"
import Pillars from "@/components/pillars"
import NewAndNotable from "@/components/new-and-notable"
import ClosingCta from "@/components/closing-cta"
import Footer from "@/components/footer"
import { fetchActiveProducts } from "@/lib/products"

export default async function HomePage() {
  const products = await fetchActiveProducts()

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <Hero />
        <Mission />
        <Pillars />
        <NewAndNotable products={products} />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}
