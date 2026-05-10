import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import FaqsContent from "./faqs-content"

export const revalidate = 60

export const metadata = {
  title: "FAQs — MelAno",
  description:
    "Common questions about orders, shipping, returns, products, and your account — answered straight.",
}

export default function FaqsPage() {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <FaqsContent />
      </main>
      <Footer />
    </>
  )
}
