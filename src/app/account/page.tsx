"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getSupabase } from "@/lib/supabase/client"

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    let active = true

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      if (!data.user) {
        router.replace("/login")
        return
      }
      setUser(data.user)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login")
      else setUser(session.user)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [router])

  async function handleSignOut() {
    await getSupabase().auth.signOut()
    router.replace("/login")
  }

  return (
    <div className="min-h-[100svh] flex flex-col bg-[#0b0b0b]">
      <Header />
      <div className="h-30 shrink-0" />

      <main className="flex-1 text-white">
        <section className="mx-auto w-full max-w-2xl px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-semibold">My account</h1>

          {loading ? (
            <p className="mt-6 text-sm text-white/60">Loading…</p>
          ) : (
            user && (
              <div className="mt-8 space-y-6">
                <div className="border border-white/10 bg-white/5 p-6">
                  <div className="text-xs uppercase tracking-wider text-white/60">Email</div>
                  <div className="mt-1 text-base text-white">{user.email}</div>

                  <div className="mt-5 text-xs uppercase tracking-wider text-white/60">User ID</div>
                  <div className="mt-1 text-xs text-white/50 font-mono break-all">{user.id}</div>

                  <div className="mt-5 text-xs uppercase tracking-wider text-white/60">
                    Joined
                  </div>
                  <div className="mt-1 text-sm text-white/80">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>

                <Button
                  onClick={handleSignOut}
                  className="rounded-none h-11 bg-transparent text-white border border-white/25 hover:border-[#A1C1A1] hover:text-[#A1C1A1]"
                >
                  Sign out
                </Button>
              </div>
            )
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
