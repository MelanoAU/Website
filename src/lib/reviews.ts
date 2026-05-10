// src/lib/reviews.ts
//
// All review data is sourced from Supabase. Server-side reads use raw
// fetch() against PostgREST (mirroring src/lib/products.ts) so the same
// route benefits from Next.js ISR caching. Client-side mutations
// (submitting a review, toggling helpful votes) go through the
// supabase-js RPC functions defined in the schema, which enforce the
// auth.uid() check server-side.

import { getSupabase } from "@/lib/supabase/client"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

/* ---------------------------------------------------------------- */
/*  Public types                                                     */
/* ---------------------------------------------------------------- */

export type ReviewCategory = "skin" | "hair" | "body"

export type Review = {
  id: string
  authorName: string
  initials: string
  avatarTone: string
  location: string | null
  date: string // ISO timestamp
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  body: string
  productId: string
  productTitle: string
  category: ReviewCategory
  verified: boolean
  withPhoto: boolean
  helpfulCount: number
}

export type ReviewStats = {
  total: number
  avg: number
  distribution: Array<{ stars: 1 | 2 | 3 | 4 | 5; count: number; pct: number }>
  recommendPct: number
  repurchasePct: number
}

/* ---------------------------------------------------------------- */
/*  Internal helpers                                                 */
/* ---------------------------------------------------------------- */

type DbReviewRow = {
  id: string
  product_id: string
  rating: number
  title: string
  body: string
  author_name: string
  location: string | null
  category: string
  with_photo: boolean
  verified: boolean
  helpful_count: number
  created_at: string
  status: string
}

const AVATAR_TONES = [
  "from-emerald-500/30 to-emerald-300/10",
  "from-amber-500/30 to-amber-300/10",
  "from-rose-500/30 to-rose-300/10",
  "from-sky-500/30 to-sky-300/10",
  "from-fuchsia-500/30 to-fuchsia-300/10",
  "from-teal-500/30 to-teal-300/10",
  "from-indigo-500/30 to-indigo-300/10",
  "from-lime-500/30 to-lime-300/10",
  "from-orange-500/30 to-orange-300/10",
]

function pickAvatarTone(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i)
    h |= 0
  }
  return AVATAR_TONES[Math.abs(h) % AVATAR_TONES.length]
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  const out = parts.map((p) => p[0]?.toUpperCase() ?? "").join("")
  return out || "?"
}

function rowToReview(row: DbReviewRow, productTitle: string): Review {
  const r = Math.max(1, Math.min(5, Math.round(row.rating))) as
    | 1
    | 2
    | 3
    | 4
    | 5
  const cat: ReviewCategory =
    row.category === "hair" || row.category === "body" ? row.category : "skin"
  return {
    id: row.id,
    authorName: row.author_name,
    initials: initialsFrom(row.author_name),
    avatarTone: pickAvatarTone(row.id),
    location: row.location,
    date: row.created_at,
    rating: r,
    title: row.title,
    body: row.body,
    productId: row.product_id,
    productTitle,
    category: cat,
    verified: row.verified,
    withPhoto: row.with_photo,
    helpfulCount: row.helpful_count,
  }
}

async function rest<T>(path: string, tags: string[]): Promise<T | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 60, tags },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

/* ---------------------------------------------------------------- */
/*  Server-side reads                                                */
/* ---------------------------------------------------------------- */

/**
 * Fetch every published review, newest-first, with the product title
 * already resolved so the UI doesn't need its own lookup.
 *
 * ISR cached for 60 seconds with the "reviews" tag — purge after a
 * write with `revalidateTag('reviews')` if you want the new submission
 * to appear immediately on subsequent server renders.
 */
export async function fetchPublishedReviews(): Promise<Review[]> {
  const rows = await rest<DbReviewRow[]>(
    "reviews?select=id,product_id,rating,title,body,author_name,location,category,with_photo,verified,helpful_count,created_at,status&status=eq.published&order=created_at.desc",
    ["reviews"],
  )
  if (!rows || rows.length === 0) return []

  // Resolve product titles for all referenced product_ids in one trip.
  const ids = Array.from(new Set(rows.map((r) => r.product_id)))
  const productMap = new Map<string, string>()
  if (ids.length > 0) {
    const inList = ids.map((id) => `"${id}"`).join(",")
    const products = await rest<Array<{ id: string; title: string }>>(
      `products?select=id,title&id=in.(${inList})`,
      ["products"],
    )
    for (const p of products ?? []) productMap.set(p.id, p.title)
  }

  return rows.map((r) => rowToReview(r, productMap.get(r.product_id) ?? "Melano product"))
}

/**
 * Aggregate headline numbers — average rating, star distribution, and a
 * "would recommend" percentage (defined as rating ≥ 4).
 */
export function computeStats(reviews: Review[]): ReviewStats {
  const total = reviews.length
  if (total === 0) {
    return {
      total: 0,
      avg: 0,
      distribution: [5, 4, 3, 2, 1].map((s) => ({
        stars: s as 1 | 2 | 3 | 4 | 5,
        count: 0,
        pct: 0,
      })),
      recommendPct: 0,
      repurchasePct: 0,
    }
  }
  const sum = reviews.reduce((s, r) => s + r.rating, 0)
  const avg = Math.round((sum / total) * 10) / 10
  const distribution = ([5, 4, 3, 2, 1] as const).map((s) => {
    const count = reviews.filter((r) => r.rating === s).length
    return { stars: s, count, pct: (count / total) * 100 }
  })
  const recommend = reviews.filter((r) => r.rating >= 4).length
  // Repurchase proxy: reviews where rating ≥ 5 AND verified — a tighter
  // signal than just "would recommend".
  const repurchase = reviews.filter((r) => r.verified && r.rating >= 5).length
  return {
    total,
    avg,
    distribution,
    recommendPct: Math.round((recommend / total) * 100),
    repurchasePct: Math.round((repurchase / total) * 100),
  }
}

/* ---------------------------------------------------------------- */
/*  Client-side mutations (call through Supabase RPCs)               */
/* ---------------------------------------------------------------- */

export type SubmitReviewInput = {
  productId: string
  category: ReviewCategory
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  body: string
  authorName: string
  location?: string | null
  withPhoto?: boolean
}

export type SubmitReviewResult = { id: string }

/** Submit a review via the `submit_review` RPC. Requires a signed-in user. */
export async function submitReview(
  input: SubmitReviewInput,
): Promise<SubmitReviewResult> {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc("submit_review", {
    p_product_id: input.productId,
    p_rating: input.rating,
    p_title: input.title,
    p_body: input.body,
    p_author_name: input.authorName,
    p_location: input.location ?? null,
    p_category: input.category,
    p_with_photo: input.withPhoto ?? false,
  })
  if (error) throw new Error(error.message)
  return { id: data as string }
}

/**
 * Toggle a helpful vote for a review. Returns true if the vote was
 * added, false if it was removed. Requires a signed-in user.
 */
export async function toggleReviewHelpful(
  reviewId: string,
): Promise<boolean> {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc("toggle_review_helpful", {
    p_review_id: reviewId,
  })
  if (error) throw new Error(error.message)
  return Boolean(data)
}

/** Set of review IDs the current user has marked helpful. */
export async function fetchUserHelpfulVotes(
  userId: string,
): Promise<Set<string>> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("review_helpful_votes")
    .select("review_id")
    .eq("user_id", userId)
  if (error || !data) return new Set()
  return new Set(
    (data as Array<{ review_id: string }>).map((r) => r.review_id),
  )
}
