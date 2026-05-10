import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import RewardsContent from "./rewards-content"

export const revalidate = 60

export const metadata = {
  title: "Rewards — MelAno",
  description:
    "Join Melano Rewards — earn points on every ritual, unlock botanical perks, member-only drops, and rituals on the house.",
}

export default function RewardsPage() {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <RewardsContent />
      </main>
      <Footer />
    </>
  )
}
