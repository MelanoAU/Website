import Header from "@/components/header"
import FixedVideoBackground from "@/components/fixed-video-background"
import Hero from "@/components/hero"
import Mission from "@/components/mission"
import BotanicalSpotlight from "@/components/botanical-spotlight"
import BrandEthos from "@/components/brand-ethos"
import BotanicalIndex from "@/components/botanical-index"
import NewAndNotable from "@/components/new-and-notable"
import AtelierProcess from "@/components/atelier-process"
import ClosingCta from "@/components/closing-cta"
import Footer from "@/components/footer"
import { fetchActiveProducts } from "@/lib/products"

export const revalidate = 60

export default async function HomePage() {
  const products = await fetchActiveProducts()

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip text-white">
        <Hero />
        <Mission />
        <BotanicalSpotlight />
        <BrandEthos />
        <BotanicalIndex />
        <NewAndNotable products={products} />
        <AtelierProcess />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}
