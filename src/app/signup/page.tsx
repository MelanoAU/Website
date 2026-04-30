"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabase, getSiteOrigin } from "@/lib/supabase/client"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    setSubmitting(true)
    const supabase = getSupabase()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getSiteOrigin()}/auth/callback`,
      },
    })
    setSubmitting(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }
    setDone(true)
  }

  return (
    <div className="min-h-[100svh] flex flex-col bg-[#0b0b0b]">
      <Header />
      <div className="h-30 shrink-0" />

      <main className="flex-1 text-white">
        <section className="mx-auto w-full max-w-md px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-white/60">
            Join Melano to track orders, save favorites, and unlock rewards.
          </p>

          {done ? (
            <div className="mt-8 border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Check your email</h2>
              <p className="mt-2 text-sm text-white/70">
                We sent a confirmation link to <span className="text-white">{email}</span>. Click
                it to verify your account, then come back and sign in.
              </p>
              <Button
                asChild
                className="mt-6 rounded-none h-11 bg-[#A1C1A1] text-black hover:opacity-90"
              >
                <Link href="/login">Go to sign in</Link>
              </Button>
            </div>
          ) : (
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
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 h-11 rounded-none border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label htmlFor="confirm" className="text-xs uppercase tracking-wider text-white/60">
                  Confirm password
                </label>
                <Input
                  id="confirm"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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
                {submitting ? "Creating account…" : "Create account"}
              </Button>

              <p className="pt-2 text-sm text-white/60">
                Already have an account?{" "}
                <Link href="/login" className="text-[#A1C1A1] hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
