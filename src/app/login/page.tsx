"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, cubicBezier } from "framer-motion"
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import { getSupabase } from "@/lib/supabase/client"
import { mergeLocalCartToDb, safeNext } from "@/lib/cart"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

export default function LoginPage() {
  const router = useRouter()
  const [next, setNext] = useState<string>("/account")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = new URLSearchParams(window.location.search).get("next")
    setNext(safeNext(raw) ?? "/account")
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const supabase = getSupabase()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setSubmitting(false)
      setError(signInError.message)
      return
    }

    // CRITICAL: fire-and-forget the anonymous-cart merge. Awaiting it
    // here used to hang the form indefinitely when the RPC stalled in
    // the Supabase auth-lock — the redirect never fired and users were
    // stuck on "Signing in…" forever. The merge failing or hanging is
    // tolerable; the redirect is not.
    mergeLocalCartToDb().catch(() => {
      /* anonymous cart migration is best-effort */
    })

    router.replace(next)
  }

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative min-h-[100svh] flex flex-col px-6">
        <div className="h-24 md:h-28" />

        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-md">
            {/* 编辑式头 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeBezier }}
              className="text-center"
            >
              <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                Welcome back
              </span>
              <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.05]">
                Sign in.
              </h1>
              <p className="mt-3 text-sm md:text-base text-white/75">
                Pick up where you left off.
              </p>
            </motion.div>

            {/* 表单卡 */}
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
                      className="
                        w-full h-12 pl-11 pr-4
                        rounded-full bg-white/[0.06] border border-white/15
                        text-white placeholder:text-white/40 text-sm
                        outline-none focus:bg-white/10 focus:border-white/30
                        transition-colors
                      "
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-[11px] tracking-[0.28em] uppercase text-white/60"
                    >
                      Password
                    </label>
                    <Link
                      href="/login"
                      className="text-xs text-white/55 hover:text-brand transition-colors"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="mt-2 relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
                    <input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="
                        w-full h-12 pl-11 pr-4
                        rounded-full bg-white/[0.06] border border-white/15
                        text-white placeholder:text-white/40 text-sm
                        outline-none focus:bg-white/10 focus:border-white/30
                        transition-colors
                      "
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
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: easeBezier }}
              className="mt-6 text-center text-sm text-white/65"
            >
              No account?{" "}
              <Link
                href={
                  next === "/account"
                    ? "/signup"
                    : `/signup?next=${encodeURIComponent(next)}`
                }
                className="text-brand hover:underline underline-offset-4"
              >
                Create one
              </Link>
            </motion.p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
