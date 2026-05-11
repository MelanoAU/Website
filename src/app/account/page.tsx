"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { motion, cubicBezier } from "framer-motion"
import {
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Settings,
  Loader2,
  LogOut,
  ArrowRight,
  ChevronRight,
  Mail,
  Phone,
  Plus,
  X as XClose,
  AlertCircle,
  Check,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import {
  AppleIcon,
  GoogleIcon,
  type SocialIconProps,
} from "@/components/social-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getSupabase } from "@/lib/supabase/client"
import {
  fetchAccountSummary,
  fetchUserIdentities,
  identityDisplayName,
  linkProvider,
  prettyProvider,
  removePhone,
  startPhoneUpdate,
  unlinkProvider,
  verifyPhoneOtp,
  type AccountSummary,
  type LinkableProvider,
  type LinkedIdentity,
} from "@/lib/account"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const ACTIONS = [
  {
    icon: ShoppingBag,
    label: "Orders",
    sub: "Track every shipment",
    href: "/account/orders",
  },
  {
    icon: ShoppingCart,
    label: "Cart",
    sub: "Items waiting in your bag",
    href: "/cart",
  },
  {
    icon: Sparkles,
    label: "Rewards",
    sub: "Points & member perks",
    href: "/account/rewards",
  },
  {
    icon: Settings,
    label: "Settings",
    sub: "Profile, password, identities",
    href: "/account/settings",
  },
] as const

type ProviderDef = {
  key: "phone" | LinkableProvider
  label: string
  Icon: React.ComponentType<SocialIconProps>
}

const PROVIDERS: ProviderDef[] = [
  { key: "phone",  label: "Phone",  Icon: Phone },
  { key: "apple",  label: "Apple",  Icon: AppleIcon },
  { key: "google", label: "Google", Icon: GoogleIcon },
]

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<AccountSummary | null>(null)
  const [identities, setIdentities] = useState<LinkedIdentity[]>([])
  const [busyProvider, setBusyProvider] = useState<string | null>(null)
  const [providerError, setProviderError] = useState<string | null>(null)
  const [providerNotice, setProviderNotice] = useState<string | null>(null)
  const [phoneEditing, setPhoneEditing] = useState(false)
  const [phoneInput, setPhoneInput] = useState("")
  const [otpInput, setOtpInput] = useState("")
  const [otpStep, setOtpStep] = useState<"phone" | "otp">("phone")

  const refreshAccountData = useCallback(async () => {
    try {
      const [s, ids] = await Promise.all([
        fetchAccountSummary().catch(() => null),
        fetchUserIdentities().catch(() => [] as LinkedIdentity[]),
      ])
      if (s) setSummary(s)
      setIdentities(ids)
    } catch {
      /* noop */
    }
  }, [])

  // Initial auth probe + listener
  useEffect(() => {
    const supabase = getSupabase()
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      const sessionUser = data.session?.user ?? null
      if (!sessionUser) {
        router.replace("/login?next=/account")
        return
      }
      setUser(sessionUser)
      setLoading(false)
      await refreshAccountData()
    })

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace("/login?next=/account")
        } else {
          setUser(session.user)
          refreshAccountData()
        }
      },
    )

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [router, refreshAccountData])

  async function handleSignOut() {
    await getSupabase().auth.signOut()
    router.replace("/login")
  }

  async function handleLink(provider: LinkableProvider) {
    setProviderError(null)
    setProviderNotice(null)
    setBusyProvider(provider)
    try {
      await linkProvider(provider)
      // Supabase will redirect through OAuth — no further action here
    } catch (err) {
      setProviderError(
        err instanceof Error ? err.message : "Couldn't start the link flow.",
      )
      setBusyProvider(null)
    }
  }

  async function handleUnlink(identity: LinkedIdentity) {
    if (
      !window.confirm(
        `Unlink ${prettyProvider(identity.provider)}? You'll no longer be able to sign in with this method.`,
      )
    ) {
      return
    }
    setProviderError(null)
    setProviderNotice(null)
    setBusyProvider(identity.provider)
    try {
      await unlinkProvider(identity)
      setProviderNotice(
        `${prettyProvider(identity.provider)} unlinked successfully.`,
      )
      await refreshAccountData()
    } catch (err) {
      setProviderError(
        err instanceof Error ? err.message : "Couldn't unlink that account.",
      )
    } finally {
      setBusyProvider(null)
    }
  }

  function handlePhoneStart() {
    if (!phoneInput.trim()) return
    setProviderError(null)
    setProviderNotice(null)
    setBusyProvider("phone")

    // supabase.auth.updateUser({ phone }) is known to occasionally hang
    // even after the OTP has been dispatched — a Supabase JS auth-lock
    // quirk. Fire the request, and advance the UI on a short timer
    // regardless. If the request genuinely fails (bad number format,
    // Twilio rejection, etc.) the catch handler rolls the UI back.
    let cancelAdvance = false

    startPhoneUpdate(phoneInput.trim()).catch((err: unknown) => {
      cancelAdvance = true
      setProviderError(
        err instanceof Error
          ? err.message
          : "Couldn't send a verification code. Check the number and try again.",
      )
      setOtpStep("phone")
      setBusyProvider(null)
    })

    window.setTimeout(() => {
      if (cancelAdvance) return
      setBusyProvider(null)
      setOtpStep("otp")
    }, 1500)
  }

  async function handlePhoneVerify() {
    if (!otpInput.trim()) return
    setProviderError(null)
    setBusyProvider("phone")
    try {
      await verifyPhoneOtp(phoneInput.trim(), otpInput.trim())
      setProviderNotice("Phone number verified and linked.")
      setPhoneEditing(false)
      setPhoneInput("")
      setOtpInput("")
      setOtpStep("phone")
      // Refresh user object so user.phone updates
      const { data } = await getSupabase().auth.getSession()
      if (data.session?.user) setUser(data.session.user)
      await refreshAccountData()
    } catch (err) {
      setProviderError(
        err instanceof Error ? err.message : "That code didn't match.",
      )
    } finally {
      setBusyProvider(null)
    }
  }

  async function handlePhoneRemove() {
    if (!window.confirm("Remove your phone number from this account?")) return
    setBusyProvider("phone")
    try {
      await removePhone()
      const { data } = await getSupabase().auth.getSession()
      if (data.session?.user) setUser(data.session.user)
      setProviderNotice("Phone number removed.")
    } catch (err) {
      setProviderError(
        err instanceof Error ? err.message : "Couldn't remove the phone.",
      )
    } finally {
      setBusyProvider(null)
    }
  }

  // Display name: prefer summary.display_name, fall back to email-derived
  const displayName =
    summary?.display_name ||
    (user?.email ? user.email.split("@")[0].replace(/[._-]+/g, " ") : "")

  // Identities by provider for quick lookup
  const identityByProvider = new Map<string, LinkedIdentity>()
  for (const i of identities) identityByProvider.set(i.provider, i)

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative min-h-[100svh] flex flex-col">
        <div className="h-24 md:h-28" />

        {loading ? (
          <div className="flex-1 flex items-center justify-center px-6 py-10">
            <div className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 p-8 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/70" />
              <p className="mt-4 text-sm text-white/70">Loading account…</p>
            </div>
          </div>
        ) : user ? (
          <div className="flex-1 px-6 pb-24">
            <div className="mx-auto max-w-6xl">
              {/* ==== 1. Greeting header ==== */}
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeBezier }}
                className="pt-6 md:pt-12"
              >
                <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
                  Your account
                </span>
                <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05] capitalize">
                  Welcome, {displayName || "there"}.
                </h1>
                <p className="mt-3 text-sm md:text-base text-white/70">
                  Signed in as <span className="text-white">{user.email}</span>
                  {summary?.tier && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand/15 border border-brand/30 px-2.5 py-0.5 text-[10px] tracking-[0.22em] uppercase text-brand">
                      <Sparkles className="h-3 w-3" strokeWidth={2.4} />
                      {summary.tier}
                    </span>
                  )}
                </p>
              </motion.section>

              {/* ==== 2. Quick stats (live from supabase) ==== */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease: easeBezier }}
                className="mt-10 grid gap-4 sm:grid-cols-3"
              >
                <StatCard
                  label="Orders"
                  value={summary?.orders_count ?? null}
                  href="/account/orders"
                />
                <StatCard
                  label="Cart items"
                  value={summary?.cart_items_count ?? null}
                  href="/cart"
                />
                <StatCard
                  label="Reward points"
                  value={summary?.reward_points ?? null}
                  href="/account/rewards"
                />
              </motion.div>

              {/* ==== 3. Quick actions (white-glass cards) ==== */}
              <motion.section
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.16, ease: easeBezier }}
                className="mt-12"
              >
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Quick actions
                </h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {ACTIONS.map(({ icon: Icon, label, sub, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="
                          group h-full flex flex-col justify-between rounded-2xl
                          bg-white/[0.06] backdrop-blur-md border border-white/10
                          p-6
                          hover:bg-white/[0.09] hover:border-white/15
                          transition-colors
                        "
                      >
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                          <Icon className="h-5 w-5" strokeWidth={1.8} />
                        </div>
                        <div className="mt-8">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-white">
                              {label}
                            </span>
                            <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <p className="mt-1.5 text-sm text-white/65">
                            {sub}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* ==== 4. Account details + Connected accounts ==== */}
              <motion.section
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.24, ease: easeBezier }}
                className="mt-12 grid gap-6 md:grid-cols-12"
              >
                {/* Connected accounts (left, wider) */}
                <div className="md:col-span-7">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Account details
                  </h2>
                  <dl className="mt-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 divide-y divide-white/10">
                    {/* Email row */}
                    <DetailRow
                      icon={Mail}
                      label="Email"
                      value={user.email ?? "—"}
                      meta="Verified"
                    />

                    {/* Phone row */}
                    <PhoneRow
                      currentPhone={user.phone ?? null}
                      editing={phoneEditing}
                      step={otpStep}
                      phoneInput={phoneInput}
                      otpInput={otpInput}
                      busy={busyProvider === "phone"}
                      onStartEdit={() => {
                        setPhoneEditing(true)
                        setOtpStep("phone")
                        setProviderError(null)
                        setProviderNotice(null)
                      }}
                      onCancelEdit={() => {
                        setPhoneEditing(false)
                        setPhoneInput("")
                        setOtpInput("")
                        setOtpStep("phone")
                        setProviderError(null)
                      }}
                      onPhoneInput={setPhoneInput}
                      onOtpInput={setOtpInput}
                      onSendCode={handlePhoneStart}
                      onVerify={handlePhoneVerify}
                      onRemove={handlePhoneRemove}
                    />

                    {/* OAuth providers */}
                    {PROVIDERS.filter((p) => p.key !== "phone").map((p) => {
                      const linked = identityByProvider.get(p.key)
                      const busy = busyProvider === p.key
                      return (
                        <ProviderRow
                          key={p.key}
                          provider={p}
                          identity={linked}
                          busy={busy}
                          onLink={() => handleLink(p.key as LinkableProvider)}
                          onUnlink={() => linked && handleUnlink(linked)}
                        />
                      )
                    })}

                    {/* Joined */}
                    <div className="grid grid-cols-3 gap-4 px-5 py-4 text-sm">
                      <dt className="col-span-1 text-white/55 tracking-wider uppercase text-[11px] flex items-center gap-2">
                        Joined
                      </dt>
                      <dd className="col-span-2 text-white/90">
                        {new Date(user.created_at).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </dd>
                    </div>
                  </dl>

                  {(providerError || providerNotice) && (
                    <div
                      className={cn(
                        "mt-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
                        providerError
                          ? "border-red-500/30 bg-red-500/10 text-red-200"
                          : "border-brand/30 bg-brand/10 text-brand",
                      )}
                    >
                      {providerError ? (
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      ) : (
                        <Check className="h-4 w-4 mt-0.5 shrink-0" />
                      )}
                      <span className="leading-relaxed">
                        {providerError ?? providerNotice}
                      </span>
                    </div>
                  )}
                </div>

                {/* Session panel (right) */}
                <div className="md:col-span-5">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Session
                  </h2>
                  <div className="mt-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 p-6">
                    <p className="text-sm text-white/75 leading-relaxed">
                      Done for the day? You&apos;ll need to sign in again next
                      time you visit.
                    </p>
                    <Button
                      onClick={handleSignOut}
                      className="mt-5 w-full rounded-full h-12 bg-white/[0.06] border border-white/15 text-white hover:bg-white/10 hover:border-white/30 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                    <Button
                      asChild
                      className="mt-3 w-full rounded-full h-12 bg-brand text-white hover:bg-brand/90"
                    >
                      <Link href="/shop">
                        Back to shop
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  )
}

/* ---------------------------------------------------------------- */
/*  Subcomponents                                                    */
/* ---------------------------------------------------------------- */

function StatCard({
  label,
  value,
  href,
}: {
  label: string
  value: number | null
  href: string
}) {
  return (
    <Link
      href={href}
      className="
        group block rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 px-6 py-5
        hover:bg-white/[0.09] hover:border-white/15 transition-colors
      "
    >
      <div className="text-3xl md:text-4xl font-semibold text-white tracking-tight tabular-nums">
        {value === null ? (
          <Loader2 className="h-6 w-6 animate-spin text-white/40" />
        ) : (
          value.toLocaleString()
        )}
      </div>
      <div className="mt-1 text-[11px] tracking-[0.28em] uppercase text-white/55">
        {label}
      </div>
    </Link>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
  meta,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: React.ReactNode
  meta?: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-12 gap-4 px-5 py-4 text-sm items-center">
      <dt className="col-span-4 md:col-span-3 text-white/55 tracking-wider uppercase text-[11px] inline-flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        {label}
      </dt>
      <dd className="col-span-6 md:col-span-7 text-white/90 break-all">
        {value}
      </dd>
      <dd className="col-span-2 text-right">
        {meta && (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 border border-brand/30 px-2 py-0.5 text-[10px] tracking-[0.18em] uppercase text-brand">
            <Check className="h-3 w-3" strokeWidth={2.4} />
            {meta}
          </span>
        )}
      </dd>
    </div>
  )
}

function PhoneRow({
  currentPhone,
  editing,
  step,
  phoneInput,
  otpInput,
  busy,
  onStartEdit,
  onCancelEdit,
  onPhoneInput,
  onOtpInput,
  onSendCode,
  onVerify,
  onRemove,
}: {
  currentPhone: string | null
  editing: boolean
  step: "phone" | "otp"
  phoneInput: string
  otpInput: string
  busy: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onPhoneInput: (v: string) => void
  onOtpInput: (v: string) => void
  onSendCode: () => void
  onVerify: () => void
  onRemove: () => void
}) {
  return (
    <div className="px-5 py-4 text-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="inline-flex items-center gap-2 text-white/55 tracking-wider uppercase text-[11px]">
          <Phone className="h-3.5 w-3.5" strokeWidth={1.8} />
          Phone
        </div>
        {!editing && (
          <div className="flex items-center gap-2">
            {currentPhone ? (
              <>
                <span className="text-white/90">{currentPhone}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 border border-brand/30 px-2 py-0.5 text-[10px] tracking-[0.18em] uppercase text-brand">
                  <Check className="h-3 w-3" strokeWidth={2.4} />
                  Linked
                </span>
                <button
                  type="button"
                  onClick={onRemove}
                  disabled={busy}
                  className="ml-1 inline-flex items-center gap-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-white/75 px-3 h-8 text-[11px] tracking-[0.14em] uppercase transition-colors disabled:opacity-60"
                >
                  <XClose className="h-3 w-3" strokeWidth={2} />
                  Unlink
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onStartEdit}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 hover:bg-brand/25 border border-brand/40 hover:border-brand/60 text-brand px-3 h-8 text-[11px] tracking-[0.14em] uppercase transition-colors disabled:opacity-60"
              >
                <Plus className="h-3 w-3" strokeWidth={2.4} />
                Link
              </button>
            )}
          </div>
        )}
      </div>

      {editing && (
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] items-end">
          {step === "phone" ? (
            <>
              <label className="block">
                <span className="block text-[10px] tracking-[0.22em] uppercase text-white/55 mb-1.5">
                  Mobile number (with country code)
                </span>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => onPhoneInput(e.target.value)}
                  placeholder="+61 412 345 678"
                  className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/15 px-4 text-sm text-white placeholder:text-white/45 outline-none focus:bg-white/10 focus:border-white/30 transition-colors"
                />
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={onSendCode}
                  disabled={busy || !phoneInput.trim()}
                  className="h-11 rounded-full bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-70 px-5"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Send code</>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={onCancelEdit}
                  className="h-11 rounded-full bg-white/[0.06] border border-white/15 text-white hover:bg-white/10 transition-colors px-5"
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <label className="block">
                <span className="block text-[10px] tracking-[0.22em] uppercase text-white/55 mb-1.5">
                  6-digit code we just texted you
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => onOtpInput(e.target.value)}
                  placeholder="000000"
                  className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/15 px-4 text-sm tabular-nums text-white placeholder:text-white/45 outline-none focus:bg-white/10 focus:border-white/30 transition-colors"
                />
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={onVerify}
                  disabled={busy || otpInput.trim().length < 4}
                  className="h-11 rounded-full bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-70 px-5"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Verify</>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={onCancelEdit}
                  className="h-11 rounded-full bg-white/[0.06] border border-white/15 text-white hover:bg-white/10 transition-colors px-5"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function ProviderRow({
  provider,
  identity,
  busy,
  onLink,
  onUnlink,
}: {
  provider: ProviderDef
  identity?: LinkedIdentity
  busy: boolean
  onLink: () => void
  onUnlink: () => void
}) {
  const Icon = provider.Icon
  const linked = !!identity
  const display = linked ? identityDisplayName(identity!) : null
  return (
    <div className="px-5 py-4 text-sm flex items-center justify-between gap-4 flex-wrap">
      <div className="inline-flex items-center gap-2 text-white/55 tracking-wider uppercase text-[11px]">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        {provider.label}
      </div>
      <div className="flex items-center gap-2">
        {linked ? (
          <>
            <span className="text-white/90 truncate max-w-[180px] sm:max-w-[260px]">
              {display}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 border border-brand/30 px-2 py-0.5 text-[10px] tracking-[0.18em] uppercase text-brand">
              <Check className="h-3 w-3" strokeWidth={2.4} />
              Linked
            </span>
            <button
              type="button"
              onClick={onUnlink}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-white/75 px-3 h-8 text-[11px] tracking-[0.14em] uppercase transition-colors disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <XClose className="h-3 w-3" strokeWidth={2} />
                  Unlink
                </>
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onLink}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 hover:bg-brand/25 border border-brand/40 hover:border-brand/60 text-brand px-3 h-8 text-[11px] tracking-[0.14em] uppercase transition-colors disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <Plus className="h-3 w-3" strokeWidth={2.4} />
                Link
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
