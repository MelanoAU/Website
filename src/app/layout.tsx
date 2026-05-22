import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import "./globals.css"
import BackgroundMusic from "@/components/background-music"
import { Analytics } from '@vercel/analytics/next'

// Fraunces — 现代衬线变量字体，soft 轴 + 旋转上下文 axis，
// 比 Cormorant 更有手工感和当代奢华品牌气质（Aesop / Susanne Kaufmann 类）
const fraunces = Fraunces({
  subsets: ["latin"],
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
    <html lang="en" className={`dark ${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased font-sans">
        {children}
        <BackgroundMusic />
        <Analytics />
      </body>
    </html>
  )
}
