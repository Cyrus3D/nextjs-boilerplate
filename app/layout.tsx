import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AdSenseScript from "@/components/adsense-script"
import Analytics from "@/components/analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "핫타이 | 태국 생활의 모든 것",
  description:
    "태국 거주자와 여행자를 위한 최고의 정보 플랫폼! 맛집, 쇼핑, 서비스, 숙박까지 태국 생활에 필요한 모든 정보를 한곳에서 만나보세요.",
  keywords:
    "핫타이, 태국정보, 태국맛집, 태국여행, 태국생활, 방콕정보, 파타야정보, 치앙마이정보, 태국서비스, 태국쇼핑, HOT THAI",
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
    title: "핫타이 | 태국 생활의 모든 것",
    description:
      "태국 거주자와 여행자를 위한 최고의 정보 플랫폼! 맛집, 쇼핑, 서비스, 숙박까지 태국 생활에 필요한 모든 정보를 한곳에서 만나보세요.",
    url: "https://hotthai.info",
    siteName: "핫타이",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "핫타이 - 태국 생활의 모든 것",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "핫타이 | 태국 생활의 모든 것",
    description:
      "태국 거주자와 여행자를 위한 최고의 정보 플랫폼! 맛집, 쇼핑, 서비스, 숙박까지 태국 생활에 필요한 모든 정보를 한곳에서 만나보세요.",
    images: ["/og-image.jpg"],
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
    google: "your-google-verification-code",
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
        <AdSenseScript />
        <Analytics />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
