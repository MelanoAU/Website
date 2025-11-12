import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "MelAno - Glow Naturally",
  description: "Premium herbal cosmetics & soap brand."
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
