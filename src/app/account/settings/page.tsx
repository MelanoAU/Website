"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, cubicBezier } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Mail,
  KeyRound,
  Save,
  AlertCircle,
  Check,
  ShieldAlert,
  UserRound,
  BellRing,
  Trash2,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getSupabase } from "@/lib/supabase/client"
import { useRequireAuth } from "@/lib/auth"
import {
  fetchUserProfile,
  updateUserProfile,
  type UserProfile,
} from "@/lib/account"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const inputClass =
  "w-full h-11 rounded-xl bg-white/[0.06] border border-white/15 px-4 text-sm text-white placeholder:text-white/45 outline-none focus:bg-white/10 focus:border-white/30 transition-colors"

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors border",
        on
          ? "bg-brand/30 border-brand/50"
          : "bg-white/[0.06] border-white/15 hover:bg-white/[0.1]",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full transition-transform",
          on ? "translate-x-6 bg-brand" : "translate-x-1 bg-white/65",
        )}
      />
    </button>
  )
}

export default function SettingsPage() {
  const auth = useRequireAuth("/account/settings")
  const user = auth.status === "authenticated" ? auth.user : null
  const authReady = auth.status === "authenticated"

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [marketingOptIn, setMarketingOptIn] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileNotice, setProfileNotice] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Email change
  const [newEmail, setNewEmail] = useState("")
  const [emailBusy, setEmailBusy] = useState(false)
  const [emailNotice, setEmailNotice] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  // Password change
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pwBusy, setPwBusy] = useState(false)
  const [pwNotice, setPwNotice] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)

  useEffect(() => {
    if (!authReady) return
    let active = true
    fetchUserProfile()
      .then((p) => {
        if (!active) return
        setProfile(p)
        setDisplayName(p?.display_name ?? "")
        setMarketingOptIn(p?.marketing_opt_in ?? true)
      })
      .catch(() => {
        /* ignore — profile is optional, page still works */
      })
    return () => {
      active = false
    }
  }, [authReady])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileError(null)
    setProfileNotice(null)
    setSavingProfile(true)
    try {
      await updateUserProfile({
        displayName: displayName.trim() || null,
        marketingOptIn,
      })
      setProfile((p) =>
        p
          ? {
              ...p,
              display_name: displayName.trim() || null,
              marketing_opt_in: marketingOptIn,
            }
          : p,
      )
      setProfileNotice("Profile saved.")
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Couldn't save profile.",
      )
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail.trim()) return
    setEmailError(null)
    setEmailNotice(null)
    setEmailBusy(true)
    try {
      const supabase = getSupabase()
      const { error } = await supabase.auth.updateUser({
        email: newEmail.trim(),
      })
      if (error) throw error
      setEmailNotice(
        "Confirmation emails sent to both your old and new addresses. Click both links to complete the change.",
      )
      setNewEmail("")
    } catch (err) {
      setEmailError(
        err instanceof Error ? err.message : "Couldn't update email.",
      )
    } finally {
      setEmailBusy(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!newPassword || newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords don't match.")
      return
    }
    setPwError(null)
    setPwNotice(null)
    setPwBusy(true)
    try {
      const supabase = getSupabase()
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
      setPwNotice("Password updated successfully.")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setPwError(
        err instanceof Error ? err.message : "Couldn't update password.",
      )
    } finally {
      setPwBusy(false)
    }
  }

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative min-h-[100svh] flex flex-col">
        <div className="h-24 md:h-28" />

        <div className="flex-1 px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeBezier }}
              className="pt-6 md:pt-12"
            >
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase text-white/65 hover:text-brand transition-colors mb-5"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                Back to account
              </Link>
              <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                Settings
              </span>
              <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
                Profile &amp; security.
              </h1>
            </motion.div>

            {!authReady || !user ? (
              <div className="mt-10 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 px-6 py-16 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/70" />
                <p className="mt-4 text-sm text-white/70">Loading…</p>
              </div>
            ) : (
              <div className="mt-10 space-y-6">
                {/* Profile */}
                <SectionCard
                  icon={UserRound}
                  title="Display profile"
                  desc="How your name appears on reviews and order receipts."
                >
                  <form
                    onSubmit={handleSaveProfile}
                    className="space-y-4"
                  >
                    <label className="block">
                      <span className="block text-[11px] tracking-[0.28em] uppercase text-white/60 mb-2">
                        Display name
                      </span>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder={profile?.display_name ?? "e.g. Amelia W."}
                        className={inputClass}
                      />
                    </label>

                    <div className="flex items-start justify-between gap-4 pt-2">
                      <div className="min-w-0">
                        <span className="block text-sm font-medium text-white inline-flex items-center gap-2">
                          <BellRing className="h-4 w-4 text-brand" strokeWidth={1.8} />
                          Marketing emails
                        </span>
                        <p className="mt-1 text-xs text-white/65 leading-relaxed">
                          Monthly newsletter, restocks, and member-only drops.
                          Always one-click unsubscribable.
                        </p>
                      </div>
                      <Toggle
                        label="Marketing emails"
                        on={marketingOptIn}
                        onChange={setMarketingOptIn}
                      />
                    </div>

                    <Notice notice={profileNotice} error={profileError} />

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={savingProfile}
                        className="rounded-full h-11 px-5 bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-70"
                      >
                        {savingProfile ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" strokeWidth={2} />
                        )}
                        Save profile
                      </Button>
                    </div>
                  </form>
                </SectionCard>

                {/* Email */}
                <SectionCard
                  icon={Mail}
                  title="Change email"
                  desc={`Currently signed in as ${user.email}.`}
                >
                  <form onSubmit={handleChangeEmail} className="space-y-4">
                    <label className="block">
                      <span className="block text-[11px] tracking-[0.28em] uppercase text-white/60 mb-2">
                        New email
                      </span>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="new@example.com"
                        className={inputClass}
                      />
                    </label>
                    <Notice notice={emailNotice} error={emailError} />
                    <div className="pt-1">
                      <Button
                        type="submit"
                        disabled={emailBusy || !newEmail.trim()}
                        className="rounded-full h-11 px-5 bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-70"
                      >
                        {emailBusy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                        Send verification
                      </Button>
                    </div>
                  </form>
                </SectionCard>

                {/* Password */}
                <SectionCard
                  icon={KeyRound}
                  title="Change password"
                  desc="At least 8 characters. Choose something you don't use elsewhere."
                >
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="block text-[11px] tracking-[0.28em] uppercase text-white/60 mb-2">
                          New password
                        </span>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          minLength={8}
                          autoComplete="new-password"
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className="block text-[11px] tracking-[0.28em] uppercase text-white/60 mb-2">
                          Confirm new password
                        </span>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          minLength={8}
                          autoComplete="new-password"
                          className={inputClass}
                        />
                      </label>
                    </div>
                    <Notice notice={pwNotice} error={pwError} />
                    <div className="pt-1">
                      <Button
                        type="submit"
                        disabled={pwBusy || !newPassword || !confirmPassword}
                        className="rounded-full h-11 px-5 bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-70"
                      >
                        {pwBusy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <KeyRound className="h-4 w-4" strokeWidth={2} />
                        )}
                        Update password
                      </Button>
                    </div>
                  </form>
                </SectionCard>

                {/* Danger zone */}
                <SectionCard
                  icon={ShieldAlert}
                  title="Delete account"
                  desc="Permanently deletes your profile, reviews, and orders history. This can't be undone."
                  tone="danger"
                >
                  <p className="text-sm text-white/75 leading-relaxed">
                    For safety, account deletion is handled by our team. Email
                    us with the address tied to your account and we&rsquo;ll
                    confirm and process within 7 business days.
                  </p>
                  <div className="mt-4">
                    <Button
                      asChild
                      className="rounded-full h-11 px-5 bg-red-500/15 border border-red-500/40 text-red-200 hover:bg-red-500/25 hover:border-red-500/60 transition-colors"
                    >
                      <Link href="/contact">
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                        Request deletion
                      </Link>
                    </Button>
                  </div>
                </SectionCard>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function SectionCard({
  icon: Icon,
  title,
  desc,
  tone = "default",
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  desc: string
  tone?: "default" | "danger"
  children: React.ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: easeBezier }}
      className={cn(
        "rounded-2xl backdrop-blur-md border p-6 md:p-7",
        tone === "danger"
          ? "bg-red-500/[0.04] border-red-500/30"
          : "bg-white/[0.06] border-white/10",
      )}
    >
      <div className="flex items-start gap-4 mb-5">
        <span
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-xl ring-1 shrink-0",
            tone === "danger"
              ? "bg-red-500/15 text-red-200 ring-red-500/30"
              : "bg-brand/15 text-brand ring-brand/30",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-semibold text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-white/70 leading-relaxed">{desc}</p>
        </div>
      </div>
      {children}
    </motion.section>
  )
}

function Notice({
  notice,
  error,
}: {
  notice?: string | null
  error?: string | null
}) {
  if (!notice && !error) return null
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
        error
          ? "border-red-500/30 bg-red-500/10 text-red-200"
          : "border-brand/30 bg-brand/10 text-brand",
      )}
    >
      {error ? (
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      ) : (
        <Check className="h-4 w-4 mt-0.5 shrink-0" />
      )}
      <span className="leading-relaxed">{error ?? notice}</span>
    </div>
  )
}
