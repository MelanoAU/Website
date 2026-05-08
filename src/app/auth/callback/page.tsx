"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, cubicBezier } from "framer-motion"
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import { getSupabase } from "@/lib/supabase/client"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

type Status = "verifying" | "success" | "error"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("verifying")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabase()

    async function run() {
      const hashParams = new URLSearchParams(
        window.location.hash.replace(/^#/, "")
      )
      const queryParams = new URL(window.location.href).searchParams
      const errParam =
        hashParams.get("error_description") ??
        hashParams.get("error") ??
        queryParams.get("error_description") ??
        queryParams.get("error")

      if (errParam) {
        setError(errParam)
        setStatus("error")
        return
      }

      const { data } = await supabase.auth.getSession()

      if (data.session) {
        setStatus("success")
        // 给用户一点点时间感受到验证成功，然后跳到 account
        window.setTimeout(() => router.replace("/account"), 1200)
      } else {
        // 没拿到 session — 把人带到 login，体验上比报错好
        setStatus("success")
        window.setTimeout(() => router.replace("/login"), 1000)
      }
    }

    run()
  }, [router])

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative min-h-[100svh] flex flex-col px-6">
        <div className="h-24 md:h-28" />

        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeBezier }}
              className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-8 text-center"
            >
              {status === "verifying" && (
                <>
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/15 text-white/85">
                    <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.8} />
                  </div>
                  <span className="mt-6 block text-[11px] tracking-[0.32em] uppercase text-white/70">
                    Verifying
                  </span>
                  <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.1]">
                    One moment.
                  </h1>
                  <p className="mt-4 text-sm md:text-base text-white/75 leading-relaxed">
                    We&apos;re confirming your link with our system. Hang
                    tight — this usually takes a second.
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      ease: easeBezier,
                    }}
                    className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand/15 ring-1 ring-brand/30 text-brand"
                  >
                    <CheckCircle2 className="h-6 w-6" strokeWidth={1.8} />
                  </motion.div>
                  <span className="mt-6 block text-[11px] tracking-[0.32em] uppercase text-brand">
                    Verified
                  </span>
                  <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.1]">
                    You&apos;re in.
                  </h1>
                  <p className="mt-4 text-sm md:text-base text-white/75 leading-relaxed">
                    Taking you to your account…
                  </p>
                </>
              )}

              {status === "error" && (
                <>
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/30 text-red-300">
                    <AlertCircle className="h-6 w-6" strokeWidth={1.8} />
                  </div>
                  <span className="mt-6 block text-[11px] tracking-[0.32em] uppercase text-red-300/85">
                    Something went wrong
                  </span>
                  <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.1]">
                    We couldn&apos;t verify that link.
                  </h1>
                  <p className="mt-4 text-sm md:text-base text-white/75 leading-relaxed">
                    {error ??
                      "The link may have expired or already been used. You can request a new one by signing up again."}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button
                      asChild
                      className="rounded-full h-12 bg-brand text-white px-6 hover:bg-brand/90"
                    >
                      <Link href="/signup">
                        Request a new link
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full h-12 bg-transparent border-white/30 text-white px-6 hover:bg-white/10 hover:text-white"
                    >
                      <Link href="/login">Back to sign in</Link>
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
