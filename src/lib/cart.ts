"use client"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth"

const LOCAL_CART_KEY = "melano:cart"
const CART_EVENT = "melano:cart-changed"
const NEXT_KEY = "melano:next"

export type LocalCartItem = {
  product_id: string
  size: string // '' === one size
  quantity: number
}

// ============================================================
// Event bus — used to keep cart count badges and the cart page
// in sync across tabs/components without a global store.
// ============================================================

export function emitCartChanged() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(CART_EVENT))
}

export function onCartChanged(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const handler = () => cb()
  const storageHandler = (e: StorageEvent) => {
    if (e.key === LOCAL_CART_KEY || e.key === null) cb()
  }
  window.addEventListener(CART_EVENT, handler)
  window.addEventListener("storage", storageHandler)
  return () => {
    window.removeEventListener(CART_EVENT, handler)
    window.removeEventListener("storage", storageHandler)
  }
}

// ============================================================
// Local cart (anonymous) — persisted in localStorage
// ============================================================

export function readLocalCart(): LocalCartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(LOCAL_CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (it): it is LocalCartItem =>
        typeof it === "object" &&
        it !== null &&
        typeof it.product_id === "string" &&
        typeof it.size === "string" &&
        typeof it.quantity === "number" &&
        it.quantity > 0
    )
  } catch {
    return []
  }
}

function writeLocalCart(items: LocalCartItem[]) {
  if (typeof window === "undefined") return
  if (items.length === 0) {
    window.localStorage.removeItem(LOCAL_CART_KEY)
  } else {
    window.localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items))
  }
  emitCartChanged()
}

export function addLocalItem(productId: string, size: string, qty: number) {
  const items = readLocalCart()
  const idx = items.findIndex(
    (it) => it.product_id === productId && it.size === size
  )
  const safeQty = Math.max(1, Math.min(99, qty))
  if (idx >= 0) {
    items[idx] = {
      ...items[idx],
      quantity: Math.min(99, items[idx].quantity + safeQty),
    }
  } else {
    items.push({ product_id: productId, size, quantity: safeQty })
  }
  writeLocalCart(items)
}

export function updateLocalItem(
  productId: string,
  size: string,
  qty: number
) {
  const safe = Math.max(1, Math.min(99, qty))
  const next = readLocalCart().map((it) =>
    it.product_id === productId && it.size === size
      ? { ...it, quantity: safe }
      : it
  )
  writeLocalCart(next)
}

export function removeLocalItem(productId: string, size: string) {
  const next = readLocalCart().filter(
    (it) => !(it.product_id === productId && it.size === size)
  )
  writeLocalCart(next)
}

export function clearLocalCart() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(LOCAL_CART_KEY)
  emitCartChanged()
}

// ============================================================
// Merge anonymous cart → DB (called after login / verify)
// ============================================================

export async function mergeLocalCartToDb(): Promise<void> {
  const items = readLocalCart()
  if (items.length === 0) return
  const supabase = getSupabase()

  // 顺序 upsert 即可（量级很小），失败的项保留在本地，下次再合并
  const remaining: LocalCartItem[] = []
  for (const it of items) {
    const { error } = await supabase.rpc("cart_upsert_item", {
      p_product_id: it.product_id,
      p_size: it.size,
      p_quantity: it.quantity,
    })
    if (error) remaining.push(it)
  }

  if (remaining.length === 0) {
    clearLocalCart()
  } else {
    writeLocalCart(remaining)
  }
  emitCartChanged()
}

// ============================================================
// "next" redirect path — survive email-verification round-trips
// ============================================================

export function setNextRedirect(path: string | null) {
  if (typeof window === "undefined") return
  if (!path || !path.startsWith("/")) {
    window.sessionStorage.removeItem(NEXT_KEY)
    return
  }
  window.sessionStorage.setItem(NEXT_KEY, path)
}

export function popNextRedirect(): string | null {
  if (typeof window === "undefined") return null
  const v = window.sessionStorage.getItem(NEXT_KEY)
  if (v) window.sessionStorage.removeItem(NEXT_KEY)
  return v
}

export function safeNext(raw: string | null | undefined): string | null {
  if (!raw) return null
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : null
}

// ============================================================
// useCartCount — live badge counter for the header
// ============================================================

export function useCartCount(): number {
  const auth = useAuth()
  const userId = auth.status === "authenticated" ? auth.user.id : null
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    let active = true

    const refresh = async () => {
      if (userId) {
        const supabase = getSupabase()
        const { data } = await supabase.from("cart_items").select("quantity")
        const total = (data ?? []).reduce(
          (s: number, r: { quantity?: number }) => s + (r.quantity ?? 0),
          0,
        )
        if (active) setCount(total)
      } else {
        const items = readLocalCart()
        if (active) setCount(items.reduce((s, it) => s + it.quantity, 0))
      }
    }

    refresh()
    const off = onCartChanged(() => {
      refresh()
    })
    return () => {
      active = false
      off()
    }
  }, [userId])

  return count
}
