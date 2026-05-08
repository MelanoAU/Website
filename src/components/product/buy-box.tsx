"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Minus, Plus, ShieldCheck, Truck, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  id: string
  title: string
  subtitle: string
  price: string
  sizes?: string[]
}

export default function BuyBox({
  id,
  title,
  subtitle,
  price,
  sizes,
}: Props) {
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState(sizes?.[0] ?? "")

  const addToCart = () => {
    // TODO: 接入全站购物车逻辑
    console.log("add to cart", { id, qty, size })
    alert("Added to cart")
  }

  return (
    <div>
      <span className="block text-[11px] tracking-[0.32em] uppercase text-brand">
        In stock
      </span>

      <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
        {title}
      </h1>
      <p className="mt-3 text-white/75 leading-relaxed">{subtitle}</p>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="text-3xl font-medium text-white">{price}</span>
        <span className="text-sm text-white/55">incl. tax</span>
      </div>

      {/* 规格 chips */}
      {sizes?.length ? (
        <div className="mt-7">
          <label className="text-[11px] tracking-[0.28em] uppercase text-white/60">
            Size
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((s) => {
              const active = size === s
              return (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={[
                    "h-10 px-4 rounded-full text-sm transition-colors border",
                    active
                      ? "bg-brand text-black border-brand"
                      : "bg-white/[0.06] text-white/85 border-white/15 hover:bg-white/[0.1] hover:border-white/30",
                  ].join(" ")}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/15 px-4 h-9 text-xs text-white/75">
          <Check className="h-3.5 w-3.5 text-brand" />
          One size
        </div>
      )}

      {/* 数量 */}
      <div className="mt-7">
        <label className="text-[11px] tracking-[0.28em] uppercase text-white/60">
          Quantity
        </label>
        <div className="mt-3 inline-flex items-center rounded-full bg-white/[0.06] border border-white/15 overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease"
            className="h-11 w-11 grid place-items-center text-white/85 hover:bg-white/10 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            value={qty}
            onChange={(e) =>
              setQty(Math.max(1, Math.min(99, Number(e.target.value) || 1)))
            }
            className="h-11 w-12 bg-transparent text-center text-white outline-none"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <button
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            aria-label="Increase"
            className="h-11 w-11 grid place-items-center text-white/85 hover:bg-white/10 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Button
          onClick={addToCart}
          className="rounded-full h-12 bg-brand text-white hover:bg-brand/90 transition-colors"
        >
          Add to cart
        </Button>
        <Button
          asChild
          className="rounded-full h-12 bg-white text-black hover:bg-white/90 transition-colors"
        >
          <Link href="/checkout">Buy now</Link>
        </Button>
      </div>

      {/* Trust bar */}
      <ul className="mt-7 grid gap-3 text-sm text-white/75">
        <li className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-brand shrink-0" />
          Secure checkout
        </li>
        <li className="flex items-center gap-3">
          <Truck className="h-4 w-4 text-brand shrink-0" />
          Free shipping over $60
        </li>
        <li className="flex items-center gap-3">
          <RefreshCcw className="h-4 w-4 text-brand shrink-0" />
          30-day returns
        </li>
      </ul>
    </div>
  )
}
