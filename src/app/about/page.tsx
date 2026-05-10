import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import AboutContent from "./about-content"

export const revalidate = 60

export const metadata = {
  title: "About — MelAno",
  description:
    "Melano is a plant-first cosmetics brand hand-crafted in Melbourne. Small batches, ethical sourcing, never tested on animals.",
}

export default function AboutPage() {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <AboutContent />
      </main>
      <Footer />
    </>
  )
}
