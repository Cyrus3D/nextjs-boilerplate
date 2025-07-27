import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AdsenseScript from "../components/adsense-script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "정보카드 리스트",
  description: "다양한 모임과 활동 정보를 확인해보세요",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <AdsenseScript />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
