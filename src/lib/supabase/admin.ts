// src/lib/supabase/admin.ts
//
// Service-role Supabase client for server-only contexts where the actor
// is NOT the end user — currently just the Stripe webhook, which arrives
// as a POST from Stripe's servers carrying no Supabase session, but
// still needs to update the user's order and clear their cart.
//
// Service-role bypasses RLS, so this client must NEVER be imported from
// any code that runs in the browser. The runtime guard at the top
// surfaces the mistake immediately if it ever gets pulled into a client
// bundle by accident.

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let cached: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error(
      "getSupabaseAdmin() called in the browser — service-role keys must never reach the client.",
    )
  }
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for the admin Supabase client.",
    )
  }

  cached = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
  return cached
}
