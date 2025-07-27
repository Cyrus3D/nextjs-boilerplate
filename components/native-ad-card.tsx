"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

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
    if (process.env.NODE_ENV !== "development" && !adClient.includes("xxxxxxxxx")) {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error("Native Ad Card error:", err)
      }
    }
  }, [adClient])

  // 개발 환경 플레이스홀더
  if (process.env.NODE_ENV === "development" || adClient.includes("xxxxxxxxx")) {
    if (style === "card") {
      return (
        <Card className={`relative overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
              광고
            </Badge>
          </div>
          <div className="relative">
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <span className="text-gray-500 text-sm">광고 이미지</span>
            </div>
          </div>
          <CardHeader className="pb-3">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <ExternalLink className="h-4 w-4 mr-2" />
              <span>스폰서 링크</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <span className="text-sm font-medium text-blue-800">특별 혜택 제공</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-3 text-gray-500">
                <span className="text-xs">스폰서</span>
              </div>
              <div className="h-8 bg-blue-200 rounded px-3 flex items-center">
                <span className="text-xs text-blue-800">자세히 보기</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    // 인라인 스타일
    return (
      <div className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            광고
          </Badge>
          <span className="text-xs text-gray-500">스폰서</span>
        </div>
        <div className="text-center text-gray-500 text-sm">네이티브 광고 (애드센스 승인 후 표시됩니다)</div>
      </div>
    )
  }

  // 실제 네이티브 광고
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
