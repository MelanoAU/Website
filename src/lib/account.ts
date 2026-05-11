// src/lib/account.ts
//
// Client-side helpers for the account dashboard. Wraps the Supabase
// RPCs / Auth APIs added by the migration in `migrations/account.sql`
// (see Supabase SQL editor instructions in the chat).

import { getSupabase, getSiteOrigin } from "@/lib/supabase/client"

/* ---------------------------------------------------------------- */
/*  Account summary (orders / cart / points)                         */
/* ---------------------------------------------------------------- */

export type AccountTier = "petal" | "bloom" | "bouquet"

export type AccountSummary = {
  orders_count: number
  cart_items_count: number
  reward_points: number
  tier: AccountTier
  display_name: string | null
}

export async function fetchAccountSummary(): Promise<AccountSummary> {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc("get_account_summary")
  if (error) throw new Error(error.message)
  return data as AccountSummary
}

/* ---------------------------------------------------------------- */
/*  Orders                                                           */
/* ---------------------------------------------------------------- */

export type OrderStatus =
  | "pending"
  | "paid"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"

export type OrderRow = {
  id: string
  order_number: string
  status: OrderStatus
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: string
  carrier: string | null
  tracking_number: string | null
  placed_at: string
  shipped_at: string | null
  delivered_at: string | null
}

export type OrderItemRow = {
  id: string
  order_id: string
  product_id: string
  product_title: string
  size: string
  unit_price: number
  quantity: number
  line_total: number
}

export type OrderWithItems = OrderRow & { items: OrderItemRow[] }

export async function fetchUserOrders(): Promise<OrderWithItems[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,order_number,status,subtotal,shipping,tax,total,currency,carrier,tracking_number,placed_at,shipped_at,delivered_at,order_items(id,order_id,product_id,product_title,size,unit_price,quantity,line_total)",
    )
    .order("placed_at", { ascending: false })
  if (error) throw new Error(error.message)
  type Joined = OrderRow & { order_items: OrderItemRow[] }
  return ((data ?? []) as Joined[]).map((o) => ({
    ...o,
    items: o.order_items ?? [],
  }))
}

/* ---------------------------------------------------------------- */
/*  Points ledger                                                    */
/* ---------------------------------------------------------------- */

export type PointsLedgerRow = {
  id: string
  delta: number
  reason: string
  reference_id: string | null
  balance_after: number
  created_at: string
}

export async function fetchPointsLedger(): Promise<PointsLedgerRow[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("points_ledger")
    .select("id,delta,reason,reference_id,balance_after,created_at")
    .order("created_at", { ascending: false })
    .limit(100)
  if (error) throw new Error(error.message)
  return (data ?? []) as PointsLedgerRow[]
}

/* ---------------------------------------------------------------- */
/*  Profile (settings page)                                          */
/* ---------------------------------------------------------------- */

export type UserProfile = {
  user_id: string
  display_name: string | null
  tier: AccountTier
  marketing_opt_in: boolean
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id,display_name,tier,marketing_opt_in")
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data ?? null) as UserProfile | null
}

export async function updateUserProfile(input: {
  displayName?: string | null
  marketingOptIn?: boolean
}): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.rpc("update_user_profile", {
    p_display_name: input.displayName ?? null,
    p_marketing_opt_in:
      input.marketingOptIn === undefined ? null : input.marketingOptIn,
  })
  if (error) throw new Error(error.message)
}

/* ---------------------------------------------------------------- */
/*  Identity linking (Google / Apple / Facebook / X) + phone         */
/* ---------------------------------------------------------------- */

export type LinkableProvider = "google" | "apple" | "facebook" | "twitter"

export type LinkedIdentity = {
  identity_id: string
  id: string
  user_id: string
  provider: string
  identity_data?: Record<string, unknown> | null
  created_at?: string
  last_sign_in_at?: string
}

/** All identities currently attached to the signed-in user. */
export async function fetchUserIdentities(): Promise<LinkedIdentity[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.getUserIdentities()
  if (error) throw new Error(error.message)
  return (data?.identities ?? []) as unknown as LinkedIdentity[]
}

/**
 * Begin the OAuth flow to link a new provider to the current account.
 * Supabase handles the redirect — caller doesn't need to await navigation.
 */
export async function linkProvider(provider: LinkableProvider): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.auth.linkIdentity({
    provider,
    options: { redirectTo: `${getSiteOrigin()}/auth/callback` },
  })
  if (error) {
    if (
      error.message.toLowerCase().includes("provider is not enabled") ||
      error.message.toLowerCase().includes("unsupported provider")
    ) {
      throw new Error(
        `${prettyProvider(provider)} sign-in isn't enabled on this site yet — please come back soon.`,
      )
    }
    throw new Error(error.message)
  }
}

export async function unlinkProvider(
  identity: LinkedIdentity,
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.auth.unlinkIdentity(
    identity as unknown as Parameters<
      typeof supabase.auth.unlinkIdentity
    >[0],
  )
  if (error) throw new Error(error.message)
}

/** Update the user's phone — Supabase will send an OTP for verification. */
export async function startPhoneUpdate(phone: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.auth.updateUser({ phone })
  if (error) throw new Error(error.message)
}

export async function verifyPhoneOtp(
  phone: string,
  token: string,
): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "phone_change",
  })
  if (error) throw new Error(error.message)
}

/**
 * Remove the phone from the current user. Supabase Auth's public API
 * doesn't expose a phone-unset (updateUser({ phone: "" }) is silently
 * a no-op), so we call a SECURITY DEFINER RPC that nulls the columns
 * on auth.users directly.
 */
export async function removePhone(): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.rpc("remove_user_phone")
  if (error) throw new Error(error.message)
}

/* ---------------------------------------------------------------- */
/*  Display helpers                                                  */
/* ---------------------------------------------------------------- */

export function prettyProvider(p: string): string {
  switch (p) {
    case "google":
      return "Google"
    case "apple":
      return "Apple"
    case "facebook":
      return "Facebook"
    case "twitter":
      return "X"
    case "email":
      return "Email"
    case "phone":
      return "Phone"
    default:
      return p.charAt(0).toUpperCase() + p.slice(1)
  }
}

/**
 * Pick the best display label for an identity — provider-specific
 * shape, falling back through email → name → identity id.
 */
export function identityDisplayName(identity: LinkedIdentity): string {
  const d = (identity.identity_data ?? {}) as Record<string, unknown>
  const tryStr = (k: string) =>
    typeof d[k] === "string" ? (d[k] as string) : null
  return (
    tryStr("user_name") ??
    tryStr("preferred_username") ??
    tryStr("nickname") ??
    tryStr("name") ??
    tryStr("full_name") ??
    tryStr("email") ??
    identity.id.slice(0, 8) + "…"
  )
}

export function prettyPointsReason(reason: string): string {
  if (reason === "signup_bonus") return "Welcome gift"
  if (reason.startsWith("order:")) return `Order ${reason.split(":")[1]}`
  if (reason.startsWith("review:")) return "Review bonus"
  if (reason.startsWith("redeem:")) return `Redeemed: ${reason.split(":")[1].replace(/_/g, " ")}`
  if (reason === "birthday_bonus") return "Birthday gift"
  if (reason === "referral_bonus") return "Referral bonus"
  return reason.replace(/_/g, " ")
}
