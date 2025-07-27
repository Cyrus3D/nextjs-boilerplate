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
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("Google Ads error:", err)
    }
  }, [])

  // 개발 환경에서는 플레이스홀더 표시
  if (process.env.NODE_ENV === "development" || adClient.includes("xxxxxxxxx")) {
    return (
      <div className="w-full flex justify-center my-4">
        <div
          className="bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-600 font-medium"
          style={{
            width: "100%",
            height: "90px",
            ...style,
          }}
        >
          광고 배너 영역 (애드센스 승인 후 표시됩니다)
        </div>
      </div>
    )
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
