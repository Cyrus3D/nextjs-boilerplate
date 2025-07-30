import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "태국 한인 정보 카드 | 태국 생활 필수 정보",
  description:
    "태국에서 필요한 모든 한인 업체 정보를 한 곳에서 찾아보세요. 음식점, 서비스, 쇼핑 등 다양한 카테고리의 업체 정보를 제공합니다.",
  keywords: "태국, 한인, 업체, 정보, 음식점, 서비스, 방콕, 파타야, 치앙마이",
  authors: [{ name: "태국 한인 정보 카드" }],
  creator: "태국 한인 정보 카드",
  publisher: "태국 한인 정보 카드",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hot-thai.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "태국 한인 정보 카드",
    description: "태국에서 필요한 모든 한인 업체 정보를 한 곳에서",
    url: "/",
    siteName: "태국 한인 정보 카드",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "태국 한인 정보 카드",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "태국 한인 정보 카드",
    description: "태국에서 필요한 모든 한인 업체 정보를 한 곳에서",
    images: ["/placeholder.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "ca-pub-1234567890123456",
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "한인정보",
    "application-name": "태국 한인 정보 카드",
    "msapplication-TileColor": "#3b82f6",
    "theme-color": "#3b82f6",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'