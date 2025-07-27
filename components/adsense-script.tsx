"use client"

import Script from "next/script"

export default function AdsenseScript() {
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID

  // 애드센스 클라이언트 ID가 제대로 설정되지 않으면 스크립트를 로드하지 않음
  if (!adClient || adClient.includes("xxxxxxxxx")) {
    return null
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
