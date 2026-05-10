import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import ContactContent from "./contact-content"

export const revalidate = 60

export const metadata = {
  title: "Contact us — MelAno",
  description:
    "Reach the Melano team. Real humans, Australian hours, two business-day response.",
}

export default function ContactPage() {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative overflow-x-clip">
        <ContactContent />
      </main>
      <Footer />
    </>
  )
}
