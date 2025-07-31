"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, Eye, Globe, Crown, Star, MessageCircle } from "lucide-react"
import { useState } from "react"
import type { BusinessCardType } from "@/types/business-card"

interface BusinessCardProps {
  card: BusinessCardType
  onDetailClick: (card: BusinessCardType) => void
}

export default function BusinessCard({ card, onDetailClick }: BusinessCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const getCategoryColor = (category: string) => {
    const colors = {
      음식점: "bg-red-100 text-red-800",
      배송서비스: "bg-blue-100 text-blue-800",
      여행서비스: "bg-green-100 text-green-800",
      식품: "bg-orange-100 text-orange-800",
      이벤트서비스: "bg-purple-100 text-purple-800",
      방송서비스: "bg-indigo-100 text-indigo-800",
      전자제품: "bg-cyan-100 text-cyan-800",
      유흥업소: "bg-pink-100 text-pink-800",
      교통서비스: "bg-emerald-100 text-emerald-800",
      서비스: "bg-gray-100 text-gray-800",
      프리미엄: "bg-yellow-100 text-yellow-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "날짜 정보 없음"
    }
  }

  // 이미지 URL 유효성 검증 함수
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false

    const urlString = String(url).trim()
    if (!urlString || urlString === "null" || urlString === "undefined") return false

    // URL 형식 검증
    try {
      new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`)
      return true
    } catch {
      return false
    }
  }

  // 이미지 URL 정규화 함수
  const normalizeImageUrl = (url: string): string => {
    const urlString = url.trim()
    if (urlString.startsWith("http")) {
      return urlString
    }
    return `https://${urlString}`
  }

  const getBusinessBadgeInfo = (category: string, isPremium: boolean, isPromoted: boolean) => {
    // Premium gets special treatment
    if (isPremium) {
      return { name: "프리미엄", color: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" }
    }

    // Promoted gets special treatment
    if (isPromoted) {
      return { name: "추천업체", color: "bg-blue-500 text-white" }
    }

    // Category-based business type badges
    const businessBadgeMap: { [key: string]: { name: string; color: string } } = {
      음식점: { name: "맛집", color: "bg-red-500 text-white" },
      배송서비스: { name: "배송업체", color: "bg-blue-500 text-white" },
      여행서비스: { name: "여행사", color: "bg-green-500 text-white" },
      식품: { name: "식품업체", color: "bg-orange-500 text-white" },
      이벤트서비스: { name: "이벤트", color: "bg-purple-500 text-white" },
      방송서비스: { name: "방송업체", color: "bg-indigo-500 text-white" },
      전자제품: { name: "전자업체", color: "bg-cyan-500 text-white" },
      유흥업소: { name: "유흥업소", color: "bg-pink-500 text-white" },
      교통서비스: { name: "교통업체", color: "bg-emerald-500 text-white" },
      서비스: { name: "서비스업", color: "bg-gray-500 text-white" },
      프리미엄: { name: "프리미엄", color: "bg-yellow-500 text-white" },
    }

    return businessBadgeMap[category] || { name: "일반업체", color: "bg-gray-400 text-white" }
  }

  const businessBadgeInfo = getBusinessBadgeInfo(
    String(card.category || ""),
    Boolean(card.isPremium),
    Boolean(card.isPromoted),
  )

  // 유효한 이미지 URL이 있는지 확인
  const hasValidImage = isValidImageUrl(card.image)
  const normalizedImageUrl = hasValidImage ? normalizeImageUrl(String(card.image)) : ""

  return (
    <Card className="w-full h-full flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardHeader className="pb-3 flex-shrink-0" onClick={() => onDetailClick(card)}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Business Badge - First with unique color */}
            <Badge className={`${businessBadgeInfo.color} text-xs font-medium flex items-center gap-1`}>
              {card.isPremium && <Crown className="w-3 h-3" />}
              {card.isPromoted && !card.isPremium && <Star className="w-3 h-3" />}
              {businessBadgeInfo.name}
            </Badge>

            {/* Category Badge - Second */}
            <Badge className={`${getCategoryColor(String(card.category))} text-xs`}>{String(card.category)}</Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
            <Globe className="w-3 h-3" />
            <span>KR</span>
          </div>
        </div>

        <h3 className="font-semibold text-lg leading-tight group-hover:text-blue-600 transition-colors mb-2 h-[3rem] overflow-hidden line-clamp-2">
          {String(card.title || "")}
        </h3>

        {/* Image Area - 고정 높이 */}
        <div className="h-[7.5rem] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-2 overflow-hidden relative flex-shrink-0">
          {hasValidImage && !imageError ? (
            <>
              <img
                src={normalizedImageUrl || "/placeholder.svg"}
                alt={String(card.title || "업체 이미지")}
                className={`w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-105 ${
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                loading="lazy"
                onLoad={() => {
                  setImageLoaded(true)
                }}
                onError={() => {
                  setImageError(true)
                }}
              />

              {/* 로딩 스피너 */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 flex flex-col items-center justify-center">
              <div className="text-2xl mb-1">🏢</div>
              <div className="text-xs">업체 이미지</div>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed h-[4.5rem] overflow-hidden line-clamp-3">
          {String(card.description || "")}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 flex-grow flex flex-col">
        {/* Meta Information */}
        <div className="space-y-2 text-sm text-gray-600 flex-grow">
          {card.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{String(card.location)}</span>
            </div>
          )}

          {card.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{String(card.phone)}</span>
            </div>
          )}

          {card.hours && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{String(card.hours)}</span>
            </div>
          )}

          {/* Contact Methods */}
          {(card.kakaoId || card.lineId || card.website) && (
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {card.kakaoId && <span className="text-xs bg-yellow-100 px-2 py-1 rounded">카톡</span>}
                {card.lineId && <span className="text-xs bg-green-100 px-2 py-1 rounded">라인</span>}
                {card.website && (
                  <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                    {card.website.includes("maps.google") || card.website.includes("goo.gl/maps") ? "지도" : "웹사이트"}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(card.tags) && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{String(tag)}
              </Badge>
            ))}
            {card.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{card.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Business Special Info */}
        {(card.price || card.promotion) && (
          <div className="space-y-2">
            {card.price && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                <p className="text-green-800 text-xs font-medium">💰 가격: {String(card.price)}</p>
              </div>
            )}
            {card.promotion && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                <p className="text-orange-800 text-xs font-medium">🎉 프로모션: {String(card.promotion)}</p>
              </div>
            )}
          </div>
        )}

        {/* Stats - 하단 고정 */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t mt-auto">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{Number(card.exposureCount || 0).toLocaleString()} 노출</span>
          </div>
          <span>{formatDate(String(card.created_at))}</span>
        </div>

        {/* Action Button - 하단 고정 */}
        <Button
          onClick={() => onDetailClick(card)}
          className="w-full bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300 mt-2"
          variant="outline"
        >
          자세히 보기
        </Button>
      </CardContent>
    </Card>
  )
}
