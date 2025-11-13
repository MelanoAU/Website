// src/components/product/buy-box.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Props = {
  id: string
  title: string
  subtitle: string
  price: string
  sizes?: string[]
}

export default function BuyBox({ id, title, subtitle, price, sizes }: Props) {
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState(sizes?.[0] ?? "")

  const addToCart = () => {
    // TODO: 接你全站的购物车逻辑（context/state/server action）
    console.log("add to cart", { id, qty, size })
    alert("Added to cart")
  }

  return (
    <div className="md:pl-8">
      <h1 className="text-3xl md:text-4xl font-semibold">{title}</h1>
      <p className="mt-3 text-white/80">{subtitle}</p>

      <div className="mt-6 text-2xl font-medium">{price}</div>

      {/* 规格（若存在） */}
      {sizes?.length ? (
        <div className="mt-6">
          <label className="text-xs uppercase tracking-wider text-white/60">Size</label>
          <div className="mt-2">
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="h-11 w-48 rounded-none border border-white/20 bg-transparent text-white
                         focus:outline-none focus:ring-0 appearance-none pr-8"
            >
              {sizes.map(s => (
                <option key={s} value={s} className="bg-[#0b0b0b] text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {/* 数量 */}
      <div className="mt-6">
        <label className="text-xs uppercase tracking-wider text-white/60">Quantity                   </label>
        <div className="mt-2 inline-flex items-center border border-white/20">
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="h-11 w-10 grid place-items-center hover:bg-white/5"
            aria-label="Decrease"
          >−</button>
          <input
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="h-11 w-12 bg-transparent text-center outline-none"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <button
            onClick={() => setQty(q => Math.min(99, q + 1))}
            className="h-11 w-10 grid place-items-center hover:bg-white/5"
            aria-label="Increase"
          >＋</button>
          </div>
      </div>

      {/* CTA 按钮 */}
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Button
          onClick={addToCart}
          className="rounded-none bg-[#A1C1A1] text-black hover:opacity-90 h-12"
        >
          Add to cart
        </Button>
        <Button
          className="rounded-none bg-white text-black hover:bg-[#A1C1A1] h-12"
          asChild
        >
          <a href="/checkout">Buy now</a>
        </Button>
      </div>

      {/* 信任条 / 说明 */}
      <ul className="mt-6 space-y-1 text-sm text-white/70">
        <li>• Secure checkout</li>
        <li>• Free shipping over $60</li>
        <li>• 30-day returns</li>
      </ul>
    </div>
  )
}
