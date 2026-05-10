import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import TrackOrderContent from "./track-order-content"

export const revalidate = 60

export const metadata = {
  title: "Track your order — MelAno",
  description:
    "Enter your order number and email to see live shipping status, carrier updates, and estimated delivery.",
}

export default function TrackOrderPage() {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <TrackOrderContent />
      </main>
      <Footer />
    </>
  )
}
