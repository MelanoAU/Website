"use client"

// /checkout/cancel
//
// Stripe redirects here when the buyer abandons or cancels payment on
// the hosted Checkout page. The order row stays in 'pending' /
// 'unpaid' state in Supabase — that's intentional. We don't delete it
// because:
//   - the user might come back and retry from /account → /checkout
//   - it gives us a record of abandoned-checkout funnels later
//
// The cart_items are still intact (webhook only clears them on success),
// so the user can hit "Try again" and walk straight back into checkout
// with everything restored.

import Link from "next/link"
import { motion, cubicBezier } from "framer-motion"
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

export default function CheckoutCancelPage() {
  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative min-h-[100svh] flex flex-col px-6">
        <div className="h-24 md:h-28" />
        <div className="mx-auto max-w-6xl w-full pt-6 md:pt-10 pb-24 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeBezier }}
            className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-10 md:p-12 text-center max-w-xl mx-auto"
          >
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/15 text-white/85">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <span className="mt-6 block text-[11px] tracking-[0.32em] uppercase text-white/70">
              Payment cancelled
            </span>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.1]">
              No worries — nothing was charged.
            </h1>
            <p className="mt-4 text-sm text-white/75 leading-relaxed">
              Your bag is still saved. Pick up where you left off whenever
              you&apos;re ready.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="rounded-full h-12 bg-brand text-white px-6 hover:bg-brand/90"
              >
                <Link href="/checkout">
                  Try again
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full h-12 bg-transparent border-white/30 text-white px-6 hover:bg-white/10 hover:text-white"
              >
                <Link href="/cart">
                  <ArrowLeft className="h-4 w-4" />
                  Back to bag
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
