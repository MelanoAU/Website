import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
  )
}

let cached: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (cached) return cached
  cached = createClient(url!, anonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  })
  return cached
}

export function getSiteOrigin(): string {
  if (typeof window === "undefined") return ""
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  return `${window.location.origin}${basePath}`
}
