import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "태국 한인 비즈니스 | 당신의 사이트명",
  description: "태국 거주 한인들을 위한 비즈니스 정보 플랫폼",
  keywords: "태국, 한인, 비즈니스, 맛집, 서비스",
  authors: [{ name: "당신의 이름" }],
  openGraph: {
    title: "태국 한인 비즈니스",
    description: "태국 거주 한인들을 위한 비즈니스 정보",
    url: "https://your-domain.com",
    siteName: "당신의 사이트명",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
