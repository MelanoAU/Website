"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, cubicBezier } from "framer-motion"
import {
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getSupabase } from "@/lib/supabase/client"
import { mergeLocalCartToDb, safeNext } from "@/lib/cart"
import { useAuth } from "@/lib/auth"
import {
  AppleIcon,
  GoogleIcon,
  type SocialIconProps,
} from "@/components/social-icons"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

type Tab = "email" | "phone"
type PhoneStep = "phone" | "otp"
type OAuthProvider = "apple" | "google"

const inputClass =
  "w-full h-12 pl-11 pr-4 rounded-full bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 text-sm outline-none focus:bg-white/10 focus:border-white/30 transition-colors"

const OAUTH: Array<{
  provider: OAuthProvider
  label: string
  Icon: React.ComponentType<SocialIconProps>
}> = [
  { provider: "google", label: "Google", Icon: GoogleIcon },
  { provider: "apple", label: "Apple", Icon: AppleIcon },
]

export default function LoginPage() {
  const router = useRouter()
  const auth = useAuth()

  const [next, setNext] = useState<string>("/account")
  const [tab, setTab] = useState<Tab>("email")

  // Email form
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Phone form
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [phoneStep, setPhoneStep] = useState<PhoneStep>("phone")

  // Shared
  const [submitting, setSubmitting] = useState(false)
  const [busyProvider, setBusyProvider] = useState<OAuthProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = new URLSearchParams(window.location.search).get("next")
    setNext(safeNext(raw) ?? "/account")
  }, [])

  // Redirect once authenticated — covers all success paths (email,
  // phone OTP, OAuth return, or already-signed-in users hitting /login).
  useEffect(() => {
    if (auth.status !== "authenticated") return
    mergeLocalCartToDb().catch(() => {
      /* best-effort */
    })
    router.replace(next)
  }, [auth.status, next, router])

  /* ---------------- Email sign-in ---------------- */
  async function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
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
    // The auth state listener fires SIGNED_IN, which the redirect
    // effect picks up. Leave submitting=true so the button stays
    // disabled until the page tears down.
  }

  /* ---------------- OAuth sign-in ---------------- */
  async function handleOAuth(provider: OAuthProvider) {
    setError(null)
    setBusyProvider(provider)
    try {
      const supabase = getSupabase()
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      const { error: e2 } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      })
      if (e2) throw e2
      // Supabase redirects — control leaves this page.
    } catch (err) {
      const label = provider === "google" ? "Google" : "Apple"
      setError(
        err instanceof Error
          ? err.message
          : `Couldn't start ${label} sign-in.`,
      )
      setBusyProvider(null)
    }
  }

  /* ---------------- Phone OTP step 1: send code ---------------- */
  // signInWithOtp can hang in the SDK auth-lock even after the SMS
  // has gone out. Fire it but advance the UI after 1.5s regardless.
  function handlePhoneSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = phone.trim()
    if (!trimmed) return
    setError(null)
    setSubmitting(true)

    let cancelAdvance = false
    const supabase = getSupabase()
    supabase.auth
      .signInWithOtp({ phone: trimmed })
      .then(({ error: e2 }) => {
        if (e2) {
          cancelAdvance = true
          setError(e2.message)
          setSubmitting(false)
        }
      })
      .catch((err: unknown) => {
        cancelAdvance = true
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't send a verification code. Check the number and try again.",
        )
        setSubmitting(false)
      })

    window.setTimeout(() => {
      if (cancelAdvance) return
      setSubmitting(false)
      setPhoneStep("otp")
    }, 1500)
  }

  /* ---------------- Phone OTP step 2: verify ---------------- */
  function handlePhoneVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const token = otp.trim()
    if (!token) return
    setError(null)
    setSubmitting(true)

    const supabase = getSupabase()
    supabase.auth
      .verifyOtp({ phone: phone.trim(), token, type: "sms" })
      .then(({ error: e2 }) => {
        if (e2) {
          setError(e2.message)
          setSubmitting(false)
        }
        // Success path is handled by the redirect-on-authenticated effect
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "That code didn't match.",
        )
        setSubmitting(false)
      })

    // Safety net — if 8s passes and we're still here (no SIGNED_IN
    // event despite the request not rejecting), let the user retry.
    window.setTimeout(() => {
      setSubmitting((cur) => {
        if (cur) {
          setError(
            "Verification took too long. The code may still be valid — try again.",
          )
        }
        return false
      })
    }, 8000)
  }

  function resetPhoneFlow() {
    setPhoneStep("phone")
    setOtp("")
    setError(null)
  }

  // Already signed in? Show a tiny confirm card while the redirect
  // effect fires — feels nicer than a flash of the form.
  if (auth.status === "authenticated") {
    return (
      <>
        <FixedVideoBackground />
        <Header />
        <main className="relative min-h-[100svh] flex flex-col px-6">
          <div className="h-24 md:h-28" />
          <div className="flex-1 flex items-center justify-center py-10">
            <div className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 p-8 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/70" />
              <p className="mt-4 text-sm text-white/70">
                Already signed in — taking you back…
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

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

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: easeBezier }}
              className="mt-10 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-6 md:p-7"
            >
              {/* Tabs */}
              <div className="grid grid-cols-2 gap-1 rounded-full bg-white/[0.05] border border-white/10 p-1 mb-6">
                {(["email", "phone"] as const).map((t) => {
                  const active = tab === t
                  const Icon = t === "email" ? Mail : Phone
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTab(t)
                        setError(null)
                      }}
                      className={cn(
                        "h-10 rounded-full text-xs tracking-[0.16em] uppercase inline-flex items-center justify-center gap-2 transition-colors",
                        active
                          ? "bg-brand/20 text-brand"
                          : "text-white/65 hover:text-white",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                      {t}
                    </button>
                  )
                })}
              </div>

              {/* Email tab */}
              {tab === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                        className={inputClass}
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
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <ErrorBanner error={error} />

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-full h-12 bg-brand text-white hover:bg-brand/90 disabled:opacity-70 transition-colors"
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
                </form>
              )}

              {/* Phone tab */}
              {tab === "phone" && (
                <AnimatePresence mode="wait" initial={false}>
                  {phoneStep === "phone" ? (
                    <motion.form
                      key="phone-step"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.3, ease: easeBezier }}
                      onSubmit={handlePhoneSend}
                      className="space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-[11px] tracking-[0.28em] uppercase text-white/60"
                        >
                          Mobile number
                        </label>
                        <div className="mt-2 relative">
                          <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45" />
                          <input
                            id="phone"
                            type="tel"
                            required
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+61 412 345 678"
                            className={inputClass}
                          />
                        </div>
                        <p className="mt-2 text-[11px] text-white/45 leading-relaxed">
                          Include the country code (e.g. <span className="text-white/65">+61</span> for Australia).
                        </p>
                      </div>

                      <ErrorBanner error={error} />

                      <Button
                        type="submit"
                        disabled={submitting || !phone.trim()}
                        className="mt-2 w-full rounded-full h-12 bg-brand text-white hover:bg-brand/90 disabled:opacity-70 transition-colors"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending code…
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send code
                          </>
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="otp-step"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.3, ease: easeBezier }}
                      onSubmit={handlePhoneVerify}
                      className="space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="otp"
                          className="block text-[11px] tracking-[0.28em] uppercase text-white/60"
                        >
                          6-digit code
                        </label>
                        <input
                          id="otp"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          required
                          autoComplete="one-time-code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="000000"
                          className="mt-2 w-full h-12 px-4 rounded-full bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 text-center text-base tabular-nums tracking-widest outline-none focus:bg-white/10 focus:border-white/30 transition-colors"
                        />
                        <p className="mt-2 text-[11px] text-white/45 leading-relaxed">
                          We sent a code to{" "}
                          <span className="text-white/85">{phone}</span>.
                        </p>
                      </div>

                      <ErrorBanner error={error} />

                      <Button
                        type="submit"
                        disabled={submitting || otp.trim().length < 4}
                        className="w-full rounded-full h-12 bg-brand text-white hover:bg-brand/90 disabled:opacity-70 transition-colors"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Verifying…
                          </>
                        ) : (
                          <>
                            Verify &amp; sign in
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={resetPhoneFlow}
                        className="w-full text-xs text-white/55 hover:text-brand transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="h-3 w-3" strokeWidth={2} />
                        Use a different number
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              )}

              {/* Divider */}
              <div className="mt-7 mb-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] tracking-[0.28em] uppercase text-white/45">
                  or continue with
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-3">
                {OAUTH.map(({ provider, label, Icon }) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => handleOAuth(provider)}
                    disabled={busyProvider !== null}
                    className="
                      inline-flex items-center justify-center gap-2 rounded-full h-12 px-4
                      bg-white/[0.06] border border-white/15 text-white text-sm font-medium
                      hover:bg-white/[0.1] hover:border-white/25
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-colors
                    "
                  >
                    {busyProvider === provider ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>

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

function ErrorBanner({ error }: { error: string | null }) {
  if (!error) return null
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      <span className="leading-relaxed">{error}</span>
    </div>
  )
}
