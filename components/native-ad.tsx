"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface NativeAdProps {
  adSlot: string
  adFormat?: "fluid" | "rectangle" | "horizontal"
  className?: string
  adClient?: string
}

export default function NativeAd({
  adSlot,
  adFormat = "fluid",
  className = "",
  adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || "ca-pub-xxxxxxxxxxxxxxxxx",
}: NativeAdProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 개발 환경이 아니고 애드센스가 설정된 경우에만 광고 로드
    if (process.env.NODE_ENV !== "development" && !adClient.includes("xxxxxxxxx")) {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error("Native Ad error:", err)
      }
    }
  }, [adClient])

  // 개발 환경에서는 네이티브 광고 플레이스홀더 표시
  if (process.env.NODE_ENV === "development" || adClient.includes("xxxxxxxxx")) {
    return (
      <Card className={`relative overflow-hidden ${className}`}>
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-600">
            광고
          </Badge>
        </div>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
              <span className="text-gray-400 text-xs">이미지</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="flex items-center space-x-2 mt-3">
                <div className="h-6 bg-blue-200 rounded px-2 w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-4">네이티브 광고 영역 (애드센스 승인 후 표시됩니다)</div>
        </CardContent>
      </Card>
    )
  }

  // 실제 네이티브 광고
  return (
    <div className={`native-ad-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        data-ad-layout="in-article"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
      />
    </div>
  )
}
