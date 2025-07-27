"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    if (process.env.NODE_ENV !== "development" && !adClient.includes("xxxxxxxxx")) {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error("In-Feed Ad error:", err)
      }
    }
  }, [adClient])

  // 개발 환경 플레이스홀더 - 비즈니스 카드와 유사한 디자인
  if (process.env.NODE_ENV === "development" || adClient.includes("xxxxxxxxx")) {
    return (
      <Card
        className={`relative overflow-hidden hover:shadow-lg transition-shadow duration-300 border-yellow-200 ${className}`}
      >
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">광고</Badge>
        </div>
        <div className="relative">
          <div className="w-full h-48 bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl mb-2">📢</div>
              <span className="text-gray-600 text-sm">스폰서 콘텐츠</span>
            </div>
          </div>
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <span className="text-sm font-medium text-yellow-800">🎉 특별 프로모션</span>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs bg-blue-50">
              추천
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-50">
              인기
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-3 text-gray-500">
              <span className="text-xs">스폰서</span>
            </div>
            <div className="bg-blue-500 text-white px-3 py-1 rounded text-xs">자세히 보기</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 실제 인피드 광고
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
