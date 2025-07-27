"use client"

import type React from "react"
import { useEffect } from "react"

interface GoogleAdsProps {
  adSlot: string
  adFormat?: string
  fullWidthResponsive?: boolean
  style?: React.CSSProperties
  adClient?: string
}

export default function GoogleAds({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
  adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || "ca-pub-xxxxxxxxxxxxxxxxx",
}: GoogleAdsProps) {
  useEffect(() => {
    // 애드센스가 제대로 설정된 경우에만 광고 로드
    if (adClient && !adClient.includes("xxxxxxxxx")) {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error("Google Ads error:", err)
      }
    }
  }, [adClient])

  // 애드센스 승인 전에는 광고를 표시하지 않음
  if (!adClient || adClient.includes("xxxxxxxxx")) {
    return null
  }

  return (
    <div className="w-full flex justify-center my-4">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}
