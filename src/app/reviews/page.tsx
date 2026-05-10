import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import ReviewsContent from "./reviews-content"
import { computeStats, fetchPublishedReviews } from "@/lib/reviews"
import { fetchActiveProducts } from "@/lib/products"

export const revalidate = 60

export const metadata = {
  title: "Reviews — MelAno",
  description:
    "Real customer reviews of Melano's plant-based cosmetics — verified, unfiltered, and lovingly written.",
}

export default async function ReviewsPage() {
  const [reviews, products] = await Promise.all([
    fetchPublishedReviews(),
    fetchActiveProducts(),
  ])
  const stats = computeStats(reviews)

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <ReviewsContent
          initialReviews={reviews}
          initialStats={stats}
          products={products}
        />
      </main>
      <Footer />
    </>
  )
}
