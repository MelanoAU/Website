// src/lib/stripe.ts
//
// Server-side Stripe SDK singleton. Never imported from client code —
// it would leak STRIPE_SECRET_KEY into the browser bundle.

import Stripe from "stripe"

let cached: Stripe | null = null

export function getStripe(): Stripe {
  if (cached) return cached
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY. Set it in .env.local (dev) or your hosting platform's environment variables.",
    )
  }
  // Intentionally omit `apiVersion` — the installed SDK pins one for us
  // and bumping the SDK is the deliberate moment to opt into a new API
  // version. Hard-coding a string here would silently drift the moment
  // we upgrade the SDK without updating it.
  cached = new Stripe(key, {
    typescript: true,
    appInfo: { name: "melano-site" },
  })
  return cached
}

// Maps the country labels shown in the checkout form (see
// COUNTRIES in src/app/checkout/page.tsx) to ISO-3166-1 alpha-2.
// Stripe Tax + Customer addresses require the alpha-2 form.
export const COUNTRY_TO_ISO: Record<string, string> = {
  Australia: "AU",
  "United States": "US",
  "New Zealand": "NZ",
  "United Kingdom": "GB",
  Canada: "CA",
}

export function isoForCountry(label: string): string | null {
  return COUNTRY_TO_ISO[label] ?? null
}
