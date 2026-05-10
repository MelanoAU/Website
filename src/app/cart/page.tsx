"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { motion, AnimatePresence, cubicBezier } from "framer-motion"
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBag,
  Loader2,
  AlertCircle,
  UserRound,
} from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import FixedVideoBackground from "@/components/fixed-video-background"
import { Button } from "@/components/ui/button"
import ImgFit from "@/components/ImgFit"
import { getSupabase } from "@/lib/supabase/client"
import { fetchActiveProducts } from "@/lib/products"
import type { NewProduct } from "@/lib/products"
import {
  emitCartChanged,
  onCartChanged,
  readLocalCart,
  removeLocalItem,
  updateLocalItem,
} from "@/lib/cart"

const easeBezier = cubicBezier(0.22, 1, 0.36, 1)

type DisplayItem = {
  key: string
  id?: string // present when DB-backed; absent for local
  product_id: string
  size: string
  quantity: number
  product: NewProduct | null
  unitPrice: number
  lineTotal: number
}

function parsePrice(p: string) {
  const n = Number(p.replace(/[^\d.]/g, ""))
  return Number.isNaN(n) ? 0 : n
}

function formatPrice(amount: number) {
  return `A$${amount.toFixed(2)}`
}

function toDisplay(
  item: { id?: string; product_id: string; size: string; quantity: number },
  productMap: Map<string, NewProduct>
): DisplayItem {
  const product = productMap.get(item.product_id) ?? null
  const unit = product ? parsePrice(product.price) : 0
  return {
    key: item.id ?? `local::${item.product_id}::${item.size}`,
    id: item.id,
    product_id: item.product_id,
    size: item.size,
    quantity: item.quantity,
    product,
    unitPrice: unit,
    lineTotal: unit * item.quantity,
  }
}

export default function CartPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<DisplayItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busyKey, setBusyKey] = useState<string | null>(null)

  const refresh = useCallback(async (currentUser: User | null) => {
    setLoading(true)
    setError(null)

    // 拉一份产品目录，按 id 索引；用于把 cart_items / 本地 cart 行
    // 转成包含 title / image / price 的 DisplayItem
    const productList = await fetchActiveProducts().catch(() => [])
    const productMap = new Map<string, NewProduct>(
      productList.map((p) => [p.id, p])
    )

    if (currentUser) {
      const supabase = getSupabase()
      const { data, error: e } = await supabase
        .from("cart_items")
        .select("id, product_id, size, quantity, updated_at")
        .order("updated_at", { ascending: false })
      setLoading(false)
      if (e) {
        setError(e.message)
        return
      }
      setItems(
        (data ?? []).map((row: {
          id: string
          product_id: string
          size: string
          quantity: number
        }) => toDisplay(row, productMap))
      )
    } else {
      setItems(readLocalCart().map((row) => toDisplay(row, productMap)))
      setLoading(false)
    }
  }, [])

  // Initial auth probe + listen for auth / cart changes
  useEffect(() => {
    const supabase = getSupabase()
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      const u = data.session?.user ?? null
      setUser(u)
      setAuthChecked(true)
      await refresh(u)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        refresh(u)
      }
    )

    const off = onCartChanged(() => {
      // 用最新的 user 闭包刷新
      supabase.auth
        .getSession()
        .then(({ data }) => refresh(data.session?.user ?? null))
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
      off()
    }
  }, [refresh])

  async function updateQty(item: DisplayItem, nextQty: number) {
    const safe = Math.max(1, Math.min(99, nextQty))
    if (safe === item.quantity) return

    const prev = items
    setBusyKey(item.key)
    setItems((cur) =>
      cur.map((it) =>
        it.key === item.key
          ? { ...it, quantity: safe, lineTotal: it.unitPrice * safe }
          : it
      )
    )

    if (item.id) {
      const supabase = getSupabase()
      const { error: e } = await supabase
        .from("cart_items")
        .update({ quantity: safe })
        .eq("id", item.id)
      setBusyKey(null)
      if (e) {
        setError(e.message)
        setItems(prev)
        return
      }
      emitCartChanged()
    } else {
      updateLocalItem(item.product_id, item.size, safe)
      setBusyKey(null)
    }
  }

  async function removeItem(item: DisplayItem) {
    const prev = items
    setBusyKey(item.key)
    setItems((cur) => cur.filter((it) => it.key !== item.key))

    if (item.id) {
      const supabase = getSupabase()
      const { error: e } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", item.id)
      setBusyKey(null)
      if (e) {
        setError(e.message)
        setItems(prev)
        return
      }
      emitCartChanged()
    } else {
      removeLocalItem(item.product_id, item.size)
      setBusyKey(null)
    }
  }

  const totalUnits = items.reduce((s, it) => s + it.quantity, 0)
  const subtotal = items.reduce((s, it) => s + it.lineTotal, 0)

  return (
    <>
      <FixedVideoBackground />
      <Header />
      <main className="relative min-h-[100svh] flex flex-col px-6">
        <div className="h-24 md:h-28" />

        {/* Page header */}
        <div className="mx-auto max-w-6xl w-full pt-6 md:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeBezier }}
          >
            <span className="block text-[11px] md:text-xs tracking-[0.32em] uppercase text-white/70">
              Your bag
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
              {!authChecked || loading
                ? "Loading…"
                : items.length === 0
                  ? "Empty for now."
                  : `${totalUnits} item${totalUnits === 1 ? "" : "s"} ready.`}
            </h1>
            {items.length > 0 && (
              <p className="mt-3 text-sm md:text-base text-white/65">
                Review your selection. Quantities update live.
              </p>
            )}
          </motion.div>
        </div>

        {/* Body */}
        <div className="mx-auto max-w-6xl w-full pb-24 mt-10 flex-1">
          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {!authChecked || loading ? (
            <CenteredLoader label="Loading your bag…" />
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {!user && (
                <SaveCartHint />
              )}

              <div className="grid gap-10 md:grid-cols-12">
                {/* Items */}
                <ul className="md:col-span-7 space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((it, i) => (
                      <CartRow
                        key={it.key}
                        item={it}
                        busy={busyKey === it.key}
                        onQtyChange={(q) => updateQty(it, q)}
                        onRemove={() => removeItem(it)}
                        delay={i * 0.04}
                      />
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Summary */}
                <aside className="md:col-span-5 md:sticky md:top-32 self-start">
                  <SummaryCard
                    subtotal={subtotal}
                    count={totalUnits}
                    onCheckout={() => router.push("/checkout")}
                  />
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

// ----- subcomponents -----

function CenteredLoader({ label }: { label: string }) {
  return (
    <div className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 px-6 py-16 text-center">
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-white/70" />
      <p className="mt-4 text-sm text-white/70">{label}</p>
    </div>
  )
}

function SaveCartHint() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeBezier }}
      className="mb-6 flex items-start gap-3 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 px-5 py-4"
    >
      <UserRound className="h-4 w-4 text-brand mt-0.5 shrink-0" />
      <p className="text-sm text-white/85 leading-relaxed">
        Want this saved across devices?{" "}
        <Link
          href="/login?next=/cart"
          className="text-brand hover:underline underline-offset-4"
        >
          Sign in
        </Link>{" "}
        or{" "}
        <Link
          href="/signup?next=/cart"
          className="text-brand hover:underline underline-offset-4"
        >
          create an account
        </Link>
        . We&apos;ll merge your bag automatically.
      </p>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeBezier }}
      className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-10 text-center max-w-md mx-auto"
    >
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/15 text-white/85">
        <ShoppingBag className="h-6 w-6" strokeWidth={1.8} />
      </div>
      <span className="mt-6 block text-[11px] tracking-[0.32em] uppercase text-white/70">
        Nothing here yet
      </span>
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-white leading-[1.1]">
        Your bag is empty.
      </h2>
      <p className="mt-4 text-sm text-white/75 leading-relaxed">
        Browse the range — every formula is hand-crafted in small batches.
      </p>
      <div className="mt-8">
        <Button
          asChild
          className="rounded-full h-12 bg-brand text-white px-6 hover:bg-brand/90"
        >
          <Link href="/shop">
            Browse the shop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}

function CartRow({
  item,
  busy,
  onQtyChange,
  onRemove,
  delay,
}: {
  item: DisplayItem
  busy: boolean
  onQtyChange: (q: number) => void
  onRemove: () => void
  delay: number
}) {
  const { product } = item

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, delay, ease: easeBezier }}
      className="relative overflow-hidden rounded-2xl bg-black/55 backdrop-blur-md border border-white/10"
    >
      <div className="grid grid-cols-[112px_1fr] sm:grid-cols-[140px_1fr] gap-4 sm:gap-5 p-4 sm:p-5">
        {/* Image */}
        <Link
          href={product ? `/product/${product.id}` : "/shop"}
          className="relative aspect-square overflow-hidden rounded-xl bg-white/[0.04] border border-white/10"
        >
          {product ? (
            <ImgFit src={product.image} alt={product.title} mode="contain" />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs text-white/55">
              missing
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={product ? `/product/${product.id}` : "/shop"}
                className="block"
              >
                <h3 className="text-base sm:text-lg font-semibold leading-snug text-white hover:text-brand transition-colors truncate">
                  {product?.title ?? "Unavailable product"}
                </h3>
              </Link>
              {product?.subtitle && (
                <p className="mt-1 text-xs sm:text-sm text-white/65 line-clamp-1">
                  {product.subtitle}
                </p>
              )}
              <span className="mt-2 inline-flex items-center rounded-full bg-white/[0.06] border border-white/10 px-3 h-6 text-[11px] text-white/75">
                {item.size && item.size.length > 0 ? item.size : "One size"}
              </span>
            </div>

            <button
              onClick={onRemove}
              aria-label="Remove from bag"
              className="h-9 w-9 grid place-items-center rounded-full text-white/55 hover:text-red-300 hover:bg-white/[0.06] transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom row: qty stepper + line total */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="inline-flex items-center rounded-full bg-white/[0.06] border border-white/15 overflow-hidden">
              <button
                onClick={() => onQtyChange(item.quantity - 1)}
                aria-label="Decrease"
                disabled={item.quantity <= 1 || busy}
                className="h-10 w-10 grid place-items-center text-white/85 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="h-10 w-10 grid place-items-center text-sm text-white tabular-nums">
                {item.quantity}
              </span>
              <button
                onClick={() => onQtyChange(item.quantity + 1)}
                aria-label="Increase"
                disabled={item.quantity >= 99 || busy}
                className="h-10 w-10 grid place-items-center text-white/85 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="text-right">
              <div className="text-base sm:text-lg font-semibold text-white tabular-nums">
                {formatPrice(item.lineTotal)}
              </div>
              {item.quantity > 1 && (
                <div className="text-[11px] text-white/55 tabular-nums">
                  {formatPrice(item.unitPrice)} each
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {busy && (
        <div className="absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-[1px]">
          <Loader2 className="h-5 w-5 animate-spin text-white/85" />
        </div>
      )}
    </motion.li>
  )
}

function SummaryCard({
  subtotal,
  count,
  onCheckout,
}: {
  subtotal: number
  count: number
  onCheckout: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: easeBezier }}
      className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-6 md:p-7"
    >
      <span className="block text-[11px] tracking-[0.32em] uppercase text-white/60">
        Order summary
      </span>
      <h2 className="mt-3 text-xl md:text-2xl font-semibold text-white">
        {count} item{count === 1 ? "" : "s"}
      </h2>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-baseline justify-between">
          <dt className="text-white/65">Subtotal</dt>
          <dd className="text-white tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-white/65">Shipping</dt>
          <dd className="text-white/55 text-xs">Calculated at checkout</dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-white/65">Tax</dt>
          <dd className="text-white/55 text-xs">Calculated at checkout</dd>
        </div>
      </dl>

      <div className="mt-6 pt-5 border-t border-white/10 flex items-baseline justify-between">
        <span className="text-[11px] tracking-[0.28em] uppercase text-white/60">
          Total
        </span>
        <span className="text-2xl font-semibold text-white tabular-nums">
          {formatPrice(subtotal)}
        </span>
      </div>

      <Button
        onClick={onCheckout}
        className="mt-6 w-full rounded-full h-12 bg-brand text-white hover:bg-brand/90"
      >
        Checkout
        <ArrowRight className="h-4 w-4" />
      </Button>

      <Button
        asChild
        className="mt-3 w-full rounded-full h-12 bg-white/[0.06] border border-white/15 text-white hover:bg-white/10 hover:border-white/30 transition-colors"
      >
        <Link href="/shop">Continue shopping</Link>
      </Button>

      <p className="mt-5 text-[11px] text-white/45 leading-relaxed text-center">
        Free shipping over A$60 · 30-day returns · Secure checkout
      </p>
    </motion.div>
  )
}
