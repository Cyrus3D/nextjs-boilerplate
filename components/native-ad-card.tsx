"use client"

import { useEffect, useRef } from "react"

interface NativeAdCardProps {
  adSlot: string
  className?: string
  adClient?: string
  style?: "card" | "inline" | "feed"
}

export default function NativeAdCard({
  adSlot,
  className = "",
  style = "card",
  adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || "ca-pub-xxxxxxxxxxxxxxxxx",
}: NativeAdCardProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 애드센스가 제대로 설정된 경우에만 광고 로드
    if (adClient && !adClient.includes("xxxxxxxxx")) {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error("Native Ad Card error:", err)
      }
    }
  }, [adClient])

  // 애드센스 승인 전에는 광고를 표시하지 않음
  if (!adClient || adClient.includes("xxxxxxxxx")) {
    return null
  }

  // 실제 네이티브 광고만 표시
  return (
    <div className={`native-ad-card ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
        data-full-width-responsive="true"
      />
    </div>
  )
}
