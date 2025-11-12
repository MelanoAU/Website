import Header from "@/components/header"
import Hero from "@/components/hero"
import Mission from "@/components/mission"
import NewAndNotable from "@/components/new-and-notable" 

import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="overflow-x-clip">
        <Hero />
        <Mission />
        <NewAndNotable />
      </main>
      <Footer />
    </>
  )
}
