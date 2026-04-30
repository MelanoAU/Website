"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const supabase = getSupabase()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setSubmitting(false)

    if (signInError) {
      setError(signInError.message)
      return
    }
    router.push("/account")
  }

  return (
    <div className="min-h-[100svh] flex flex-col bg-[#0b0b0b]">
      <Header />
      <div className="h-30 shrink-0" />

      <main className="flex-1 text-white">
        <section className="mx-auto w-full max-w-md px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-white/60">
            Welcome back. Enter your credentials to continue.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="text-xs uppercase tracking-wider text-white/60">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-11 rounded-none border-white/15 bg-white/5 text-white placeholder:text-white/40"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs uppercase tracking-wider text-white/60">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-11 rounded-none border-white/15 bg-white/5 text-white placeholder:text-white/40"
              />
            </div>

            {error && (
              <div className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-none h-12 bg-[#A1C1A1] text-black hover:opacity-90"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>

            <p className="pt-2 text-sm text-white/60">
              No account?{" "}
              <Link href="/signup" className="text-[#A1C1A1] hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}
