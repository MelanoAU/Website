// On-demand revalidation endpoint for the Mac POS.
//
// After the POS edits a product (insert / update / delete / activate),
// it should POST here so Vercel's edge cache for the affected pages is
// purged immediately, instead of waiting for the 60s ISR window.
//
// Request:
//   POST /api/revalidate
//   Header: x-revalidate-secret: <REVALIDATE_SECRET env>
//   Body  : { "productId"?: string }   // omit to refresh the whole catalogue
//
// Responses:
//   200 { revalidated: true, tags: [...] }
//   401 unauthorized
//   400 bad request

import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { timingSafeEqual } from "node:crypto"

export const runtime = "nodejs"

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return timingSafeEqual(aBuf, bBuf)
}

export async function POST(req: Request) {
  const expected = process.env.REVALIDATE_SECRET
  if (!expected) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET not configured on the server" },
      { status: 500 }
    )
  }

  const provided = req.headers.get("x-revalidate-secret") ?? ""
  if (!safeEqual(provided, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let body: { productId?: unknown } = {}
  try {
    body = (await req.json()) as { productId?: unknown }
  } catch {
    // empty body is fine — treat as catalogue-wide refresh
  }

  const tags = ["products"]
  if (typeof body.productId === "string" && body.productId.length > 0) {
    tags.push(`product:${body.productId}`)
  }

  // `{ expire: 0 }` forces an immediate purge (vs stale-while-revalidate).
  // Required as a second arg in Next 16 — calling without one logs a
  // deprecation warning and may go away in a future release.
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 })
  }

  return NextResponse.json({ revalidated: true, tags })
}
