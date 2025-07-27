"use client"

import type React from "react"

import { useEffect } from "react"

interface GoogleAdsProps {
  adSlot: string
  adFormat?: string
  fullWidthResponsive?: boolean
  style?: React.CSSProperties
}

export default function GoogleAds({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
}: GoogleAdsProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("Google Ads error:", err)
    }
  }, [])

  return (
    <div className="w-full flex justify-center my-4">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxxx" // 실제 사용시 본인의 애드센스 ID로 변경
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}
