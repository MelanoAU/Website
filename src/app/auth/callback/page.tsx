"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getSupabase } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabase()

    async function run() {
      const url = new URL(window.location.href)
      const code = url.searchParams.get("code")
      const errParam = url.searchParams.get("error_description") ?? url.searchParams.get("error")

      if (errParam) {
        setError(errParam)
        return
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          setError(exchangeError.message)
          return
        }
      }

      const { data } = await supabase.auth.getSession()
      router.replace(data.session ? "/account" : "/login")
    }

    run()
  }, [router])

  return (
    <div className="min-h-[100svh] flex flex-col bg-[#0b0b0b]">
      <Header />
      <div className="h-30 shrink-0" />

      <main className="flex-1 text-white">
        <section className="mx-auto w-full max-w-md px-6 py-10">
          {error ? (
            <>
              <h1 className="text-2xl font-semibold">We couldn&apos;t verify that link</h1>
              <p className="mt-3 text-sm text-white/70">{error}</p>
            </>
          ) : (
            <p className="text-sm text-white/60">Verifying your link…</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
