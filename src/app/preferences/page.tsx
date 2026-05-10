import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import PreferencesContent from "./preferences-content"

export const revalidate = 60

export const metadata = {
  title: "Communication preferences — MelAno",
  description:
    "Choose what you hear from Melano and how often. One-click control across newsletters, drops, restocks, member events, and Foundation updates.",
}

export default function PreferencesPage() {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <PreferencesContent />
      </main>
      <Footer />
    </>
  )
}
