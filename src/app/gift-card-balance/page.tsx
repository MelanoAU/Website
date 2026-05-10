import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import GiftCardBalanceContent from "./gift-card-balance-content"

export const revalidate = 60

export const metadata = {
  title: "Gift card balance — MelAno",
  description:
    "Check the remaining balance on your Melano gift card and see your usage history.",
}

export default function GiftCardBalancePage() {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <GiftCardBalanceContent />
      </main>
      <Footer />
    </>
  )
}
