import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Analytics from "@/components/analytics"
import AdSenseScript from "@/components/adsense-script"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "핫타이 - 태국 한인 비즈니스 정보",
  description: "태국 거주 한국인을 위한 최고의 비즈니스 정보 플랫폼. 맛집, 쇼핑, 서비스업체 정보를 한눈에!",
  keywords: "태국, 한인, 비즈니스, 맛집, 쇼핑, 서비스, 방콕, 파타야, 치앙마이",
  authors: [{ name: "핫타이" }],
  creator: "핫타이",
  publisher: "핫타이",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://hotthai.info"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "핫타이 - 태국 한인 비즈니스 정보",
    description: "태국 거주 한국인을 위한 최고의 비즈니스 정보 플랫폼",
    url: "https://hotthai.info",
    siteName: "핫타이",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "핫타이 - 태국 한인 비즈니스 정보",
    description: "태국 거주 한국인을 위한 최고의 비즈니스 정보 플랫폼",
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* AdSense Verification Code - Must be in head for Google crawler */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2092124280694668"
          crossOrigin="anonymous"
        />
        <AdSenseScript />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
