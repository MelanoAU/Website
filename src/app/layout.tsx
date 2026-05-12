import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import "./globals.css"

// 衬线显示字体 — 用于所有大标题，赋予品牌"自然奢华"的视觉重量
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
})

// 正文 sans-serif
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MelAno - Glow Naturally",
  description: "Premium herbal cosmetics & soap brand."
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  )
}
