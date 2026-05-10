import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import ReviewsContent from "./reviews-content"

export const revalidate = 60

export const metadata = {
  title: "Reviews — MelAno",
  description:
    "Real customer reviews of Melano's plant-based cosmetics — verified, unfiltered, and lovingly written.",
}

export default function ReviewsPage() {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <ReviewsContent />
      </main>
      <Footer />
    </>
  )
}
