"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { motion, cubicBezier } from "framer-motion"
import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  MailCheck,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import { getSupabase, getSiteOrigin } from "@/lib/supabase/client"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

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
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative min-h-[100svh] flex flex-col px-6">
        <div className="h-24 md:h-28" />

        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-md">
            {done ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeBezier }}
                className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-8 text-center"
              >
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand/15 ring-1 ring-brand/30 text-brand">
                  <MailCheck className="h-6 w-6" strokeWidth={1.8} />
                </div>
                <span className="mt-6 block text-[11px] tracking-[0.32em] uppercase text-brand">
                  Almost there
                </span>
                <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.1]">
                  Check your inbox.
                </h1>
                <p className="mt-4 text-sm md:text-base text-white/75 leading-relaxed">
                  We sent a confirmation link to{" "}
                  <span className="text-white">{email}</span>. Click it to
                  verify your account, then come back and sign in.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    asChild
                    className="rounded-full h-12 bg-brand text-white px-6 hover:bg-brand/90"
                  >
                    <Link href="/login">
                      Go to sign in
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full h-12 bg-transparent border-white/30 text-white px-6 hover:bg-white/10 hover:text-white"
                  >
                    <Link href="/">Back to site</Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: easeBezier }}
                  className="text-center"
                >
                  <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                    Join Melano
                  </span>
                  <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.05]">
                    Create your account.
                  </h1>
                  <p className="mt-3 text-sm md:text-base text-white/75">
                    Track orders, save favourites, and unlock rewards.
                  </p>
                </motion.div>

                <motion.form
                  onSubmit={onSubmit}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: easeBezier }}
                  className="mt-10 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-6 md:p-7"
                >
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[11px] tracking-[0.28em] uppercase text-white/60"
                      >
                        Email
                      </label>
                      <div className="mt-2 relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
                        <input
                          id="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full h-12 pl-11 pr-4 rounded-full bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 text-sm outline-none focus:bg-white/10 focus:border-white/30 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-[11px] tracking-[0.28em] uppercase text-white/60"
                      >
                        Password
                      </label>
                      <div className="mt-2 relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
                        <input
                          id="password"
                          type="password"
                          required
                          minLength={8}
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className="w-full h-12 pl-11 pr-4 rounded-full bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 text-sm outline-none focus:bg-white/10 focus:border-white/30 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirm"
                        className="block text-[11px] tracking-[0.28em] uppercase text-white/60"
                      >
                        Confirm password
                      </label>
                      <div className="mt-2 relative">
                        <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
                        <input
                          id="confirm"
                          type="password"
                          required
                          minLength={8}
                          autoComplete="new-password"
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          placeholder="Repeat your password"
                          className="w-full h-12 pl-11 pr-4 rounded-full bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 text-sm outline-none focus:bg-white/10 focus:border-white/30 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 w-full rounded-full h-12 bg-brand text-white hover:bg-brand/90 disabled:opacity-70 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account…
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="mt-5 text-center text-[11px] text-white/45 leading-relaxed">
                    By creating an account you agree to our{" "}
                    <Link
                      href="/terms"
                      className="underline underline-offset-2 hover:text-white/70"
                    >
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link
                      href="/privacy"
                      className="underline underline-offset-2 hover:text-white/70"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </motion.form>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: easeBezier }}
                  className="mt-6 text-center text-sm text-white/65"
                >
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-brand hover:underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </motion.p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
