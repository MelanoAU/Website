import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import FoundationContent from "./foundation-content"

export const revalidate = 60

export const metadata = {
  title: "Foundation — MelAno",
  description:
    "The Melano Foundation supports botanical conservation, women in trades, and skin-positive education across Australia.",
}

export default function FoundationPage() {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <FoundationContent />
      </main>
      <Footer />
    </>
  )
}
