import type React from "react"
import { Playfair_Display, Outfit } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "冷蔵庫管理アプリ",
  description: "食材を管理して、美味しい料理を作ろう",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${playfair.variable} ${outfit.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
