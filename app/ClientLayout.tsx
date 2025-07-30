"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ServiceWorkerRegistration from "@/components/service-worker-registration"
import AdSenseScript from "@/components/adsense-script"
import Analytics from "@/components/analytics"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
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

        {/* Critical CSS for faster initial rendering */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS for initial render */
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              margin: 0; 
              padding: 0; 
              background: #ffffff;
            }
            .skeleton { 
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
              border-radius: 0.5rem;
            }
            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            .spinner {
              width: 2rem;
              height: 2rem;
              border: 2px solid #f3f4f6;
              border-top: 2px solid #3b82f6;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .grid { 
              display: grid; 
              gap: 1rem; 
            }
            @media (min-width: 640px) { 
              .grid { grid-template-columns: repeat(2, 1fr); } 
            }
            @media (min-width: 1024px) { 
              .grid { grid-template-columns: repeat(3, 1fr); } 
            }
            @media (min-width: 1280px) { 
              .grid { grid-template-columns: repeat(4, 1fr); } 
            }
            .container {
              width: 100%;
              margin-left: auto;
              margin-right: auto;
              padding-left: 1rem;
              padding-right: 1rem;
            }
            @media (min-width: 640px) { .container { max-width: 640px; } }
            @media (min-width: 768px) { .container { max-width: 768px; } }
            @media (min-width: 1024px) { .container { max-width: 1024px; } }
            @media (min-width: 1280px) { .container { max-width: 1280px; } }
          `,
          }}
        />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.openweathermap.org" />
        <link rel="dns-prefetch" href="//api.exchangerate-api.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />

        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* AdSense verification */}
        <meta name="google-adsense-account" content="ca-pub-2092124280694668" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />

        {/* Viewport and mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="format-detection" content="telephone=no" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="한인정보" />
        <meta name="application-name" content="태국 한인 정보 카드" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
          <ServiceWorkerRegistration />
          <AdSenseScript />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
