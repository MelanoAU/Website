export const gallery = [
  { src: "https://images.unsplash.com/photo-1584118624012-df056829fbd3?q=80&w=1200", alt: "Herbal soap 1" },
  { src: "https://images.unsplash.com/photo-1616422285623-13ff0162193f?q=80&w=1200", alt: "Herbal soap 2" },
  { src: "https://images.unsplash.com/photo-1548130149-a6955bd8d6f9?q=80&w=1200", alt: "Herbal oil" },
  { src: "https://images.unsplash.com/photo-1629198735666-305fe27b47c9?q=80&w=1200", alt: "Packaging" },
  { src: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1200", alt: "Texture" },
  { src: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba2?q=80&w=1200", alt: "Lifestyle" }
]
// src/lib/data.ts（追加）
export type NewProduct = {
  id: string
  title: string
  subtitle: string
  price: string
  image: string
  sizes?: string[] // 没有就表示 One size only
  badge?: "NaN" | "Normal"
}

export const newAndNotable: NewProduct[] = [
  {
    id: "ss-01",
    title: "Melano Eucalyptus Shampoo Soap",
    subtitle: "Cooling, Clarifying & Scalp-Balancing",
    price: "$65.00",
    image: "/Website/images/M_eucalyptus_SS@1600x1200.webp",
    sizes: undefined,
    badge: "NaN"
  },
  {
    id: "ss-01",
    title: "Melano Wurtzman Shampoo Soap",
    subtitle: "Fortifying Cleanse, Scalp-Balancing",
    price: "$46.00",
    image: "/Website/images/M_wurtzman_SS@1600x1200.webp",
    sizes: ["16.9 fl oz", "33.8 fl oz"],
    badge: "NaN"
  },
  {
    id: "guest-01",
    title: "Melano Mint Shampoo Soap",
    subtitle: "Mint-Fresh Cleanse, Oil-Balancing",
    price: "$52.00",
    image: "/Website/images/M_mint_SS@1600x1200.webp",
    sizes: undefined,
    badge: "NaN"
  },
]
