import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import CareersContent from "./careers-content"

export const revalidate = 60

export const metadata = {
  title: "Careers — MelAno",
  description:
    "Join Melano. Small team, four-day week, transparent pay, and a workshop in Brunswick that smells like rosemary by 9am.",
}

export default function CareersPage() {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <CareersContent />
      </main>
      <Footer />
    </>
  )
}
