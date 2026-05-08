"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { motion, cubicBezier } from "framer-motion"
import {
  ShoppingBag,
  Heart,
  Sparkles,
  Settings,
  Loader2,
  LogOut,
  ArrowRight,
  ChevronRight,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import { getSupabase } from "@/lib/supabase/client"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

const ACTIONS = [
  {
    icon: ShoppingBag,
    label: "Orders",
    sub: "Track every shipment",
    href: "/account",
  },
  {
    icon: Heart,
    label: "Saved",
    sub: "Your wishlist & re-orders",
    href: "/account",
  },
  {
    icon: Sparkles,
    label: "Rewards",
    sub: "Points & member perks",
    href: "/account",
  },
  {
    icon: Settings,
    label: "Settings",
    sub: "Profile, address, payment",
    href: "/account",
  },
]

const STATS = [
  { label: "Orders", value: "0" },
  { label: "Saved items", value: "0" },
  { label: "Reward points", value: "0" },
]

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

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace("/login")
        else setUser(session.user)
      }
    )

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [router])

  async function handleSignOut() {
    await getSupabase().auth.signOut()
    router.replace("/login")
  }

  // 从 email 取一个友好的展示名
  const displayName = user?.email
    ? user.email.split("@")[0].replace(/[._-]+/g, " ")
    : ""

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative min-h-[100svh] flex flex-col">
        <div className="h-24 md:h-28" />

        {loading ? (
          <div className="flex-1 flex items-center justify-center px-6 py-10">
            <div className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-8 text-center">
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
                  Signed in as{" "}
                  <span className="text-white">{user.email}</span>
                </p>
              </motion.section>

              {/* ==== 2. Quick stats ==== */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease: easeBezier }}
                className="mt-10 grid gap-4 sm:grid-cols-3"
              >
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 px-6 py-5"
                  >
                    <div className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[11px] tracking-[0.28em] uppercase text-white/55">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* ==== 3. Quick actions ==== */}
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
                          bg-black/55 backdrop-blur-md border border-white/10
                          p-6
                          hover:border-white/20 hover:bg-black/65
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
                          <p className="mt-1.5 text-sm text-white/65">{sub}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* ==== 4. Account details ==== */}
              <motion.section
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.24, ease: easeBezier }}
                className="mt-12 grid gap-6 md:grid-cols-12"
              >
                <div className="md:col-span-7">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Account details
                  </h2>
                  <dl className="mt-5 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 divide-y divide-white/10">
                    <div className="grid grid-cols-3 gap-4 px-5 py-4 text-sm">
                      <dt className="col-span-1 text-white/55 tracking-wider uppercase text-[11px]">
                        Email
                      </dt>
                      <dd className="col-span-2 text-white/90 break-all">
                        {user.email}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 px-5 py-4 text-sm">
                      <dt className="col-span-1 text-white/55 tracking-wider uppercase text-[11px]">
                        Joined
                      </dt>
                      <dd className="col-span-2 text-white/90">
                        {new Date(user.created_at).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 px-5 py-4 text-sm">
                      <dt className="col-span-1 text-white/55 tracking-wider uppercase text-[11px]">
                        User ID
                      </dt>
                      <dd className="col-span-2 text-white/55 font-mono text-xs break-all">
                        {user.id}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Signout panel */}
                <div className="md:col-span-5">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Session
                  </h2>
                  <div className="mt-5 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-6">
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
