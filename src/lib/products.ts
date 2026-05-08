// src/lib/products.ts
//
// All product data on the public site comes from the Supabase `products`
// table. This module fetches it via raw `fetch()` so the same code runs
// at build time (generateStaticParams / Server Components) and in the
// browser (cart / checkout client lookups).
//
// RLS limits anon reads to `active = true`, so an unauthenticated GET
// already only returns customer-visible products.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

/// 公开使用的产品视图。和原本 `data.ts` 里 `NewProduct` 字段保持兼容，
/// 这样 UI 组件不用大动。
export type NewProduct = {
  id: string
  title: string
  subtitle: string
  price: string        // 已格式化为 "A$XX.XX"
  image: string
  sizes?: string[]     // 没有规格时为 undefined
}

type ProductRow = {
  id: string
  title: string
  subtitle: string | null
  price: number | string
  image: string | null
  sizes: string[] | null
  active?: boolean
}

function rowToProduct(row: ProductRow): NewProduct {
  const priceNumber =
    typeof row.price === "number" ? row.price : Number(row.price)
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    price: `A$${(isFinite(priceNumber) ? priceNumber : 0).toFixed(2)}`,
    image: row.image ?? "",
    sizes: row.sizes && row.sizes.length > 0 ? row.sizes : undefined,
  }
}

async function rest<T>(path: string): Promise<T> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    // 不缓存 —— 我们主动控制何时重新抓取
    cache: "no-store",
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Supabase ${res.status}: ${body || res.statusText}`)
  }
  return (await res.json()) as T
}

/// 列出所有公开可见的产品。RLS 自动过滤为 active=true。
export async function fetchActiveProducts(): Promise<NewProduct[]> {
  const rows = await rest<ProductRow[]>(
    `products?select=id,title,subtitle,price,image,sizes&order=title.asc`
  )
  return rows.map(rowToProduct)
}

/// 仅取 id —— 给 generateStaticParams 用，构建时枚举所有 /product/[id]。
export async function fetchProductIds(): Promise<string[]> {
  const rows = await rest<Array<{ id: string }>>(`products?select=id`)
  return rows.map((r) => r.id)
}

/// 单个产品。找不到返回 null。
export async function fetchProduct(id: string): Promise<NewProduct | null> {
  const rows = await rest<ProductRow[]>(
    `products?select=id,title,subtitle,price,image,sizes&id=eq.${encodeURIComponent(id)}&limit=1`
  )
  return rows[0] ? rowToProduct(rows[0]) : null
}
