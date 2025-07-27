"use client"

import { useEffect, useRef } from "react"

interface InFeedAdProps {
  adSlot: string
  className?: string
  adClient?: string
}

export default function InFeedAd({
  adSlot,
  className = "",
  adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || "ca-pub-xxxxxxxxxxxxxxxxx",
}: InFeedAdProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 애드센스가 제대로 설정된 경우에만 광고 로드
    if (adClient && !adClient.includes("xxxxxxxxx")) {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error("In-Feed Ad error:", err)
      }
    }
  }, [adClient])

  // 애드센스 승인 전에는 광고를 표시하지 않음
  if (!adClient || adClient.includes("xxxxxxxxx")) {
    return null
  }

  // 실제 인피드 광고만 표시
  return (
    <div className={`in-feed-ad ${className}`} ref={adRef}>
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
        data-ad-layout="in-article"
        data-ad-layout-key="-fb+5w+4e-db+86"
        data-full-width-responsive="true"
      />
    </div>
  )
}
