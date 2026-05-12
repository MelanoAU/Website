import Header from "@/components/header"
import Hero from "@/components/hero"
import Mission from "@/components/mission"
import BotanicalSpotlight from "@/components/botanical-spotlight"
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
      <Header />

      {/*
        主页背景：暖纸 cream（仅主页）。其他页面仍用 FixedVideoBackground
        的深色视频背景（这次没动）。atelier-paper 给整个 main 叠一层极淡
        的纸纤维 noise，纸质触感。
      */}
      <main className="relative overflow-x-clip bg-parchment text-charcoal atelier-paper">
        <Hero />
        <Mission />
        <BotanicalSpotlight />
        <NewAndNotable products={products} />
        <AtelierProcess />
        <ClosingCta />

        {/*
          底部 seam 渐变：cream → 深色 footer 之间的过渡带。
          没有它，cream 段会硬切到深色 footer，接缝突兀。
        */}
        <div
          aria-hidden
          className="h-32 md:h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(239,231,214,0) 0%, rgba(31,26,18,0.6) 60%, #0D0D0D 100%)",
          }}
        />
      </main>

      <Footer />
    </>
  )
}
