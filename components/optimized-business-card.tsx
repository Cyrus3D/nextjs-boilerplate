"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, MessageCircle, Globe, Map, Crown } from "lucide-react"
import { memo, useState, useCallback } from "react"
import Image from "next/image"
import type { BusinessCard } from "../types/business-card"
import { getUrlType } from "../lib/utils"

interface BusinessCardProps {
  card: BusinessCard
  onDetailClick: (card: BusinessCard) => void
}

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

// 메모이제이션으로 불필요한 리렌더링 방지
const OptimizedBusinessCard = memo(function OptimizedBusinessCard({ card, onDetailClick }: BusinessCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoading(false)
  }, [])

  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
  }, [])

  const handleCardClick = useCallback(() => {
    onDetailClick(card)
  }, [card, onDetailClick])

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDetailClick(card)
    },
    [card, onDetailClick],
  )

  const urlType = getUrlType(card.website)

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* 최적화된 이미지 로딩 */}
        <div className="relative w-full h-48 bg-gray-200">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400">로딩중...</div>
            </div>
          )}
          <Image
            src={
              imageError
                ? "/placeholder.svg?height=200&width=400"
                : card.image || "/placeholder.svg?height=200&width=400"
            }
            alt={card.title}
            fill
            className={`object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
            quality={75}
          />
        </div>
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {card.isPremium && (
            <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1" variant="secondary">
              <Crown className="h-3 w-3" />
              프리미엄
            </Badge>
          )}
          <Badge className={getCategoryColor(card.category)} variant="secondary">
            {card.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg mb-1 line-clamp-1">{card.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-3">{card.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-3 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          {card.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{card.location}</span>
            </div>
          )}

          {card.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{card.phone}</span>
            </div>
          )}

          {card.hours && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{card.hours}</span>
            </div>
          )}

          {card.price && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              <span className="text-sm font-medium text-green-800 line-clamp-1">{card.price}</span>
            </div>
          )}

          {card.promotion && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
              <span className="text-sm font-medium text-yellow-800 line-clamp-1">🎉 {card.promotion}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {card.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{card.tags.length - 4}
              </Badge>
            )}
          </div>
        </div>

        <div className="pt-2 border-t mt-auto space-y-2">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500 min-h-[20px]">
              {card.kakaoId && (
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">카톡</span>
                </div>
              )}
              {card.lineId && (
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">라인</span>
                </div>
              )}
              {card.phone && (
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span className="text-xs">전화</span>
                </div>
              )}
              {card.facebookUrl && (
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">페북</span>
                </div>
              )}
              {card.instagramUrl && (
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">인스타</span>
                </div>
              )}
              {card.youtubeUrl && (
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">유튜브</span>
                </div>
              )}
              {card.tiktokUrl && (
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">틱톡</span>
                </div>
              )}
              {getUrlType(card.website) === "website" && (
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">웹사이트</span>
                </div>
              )}
              {getUrlType(card.website) === "map" && (
                <div className="flex items-center space-x-1">
                  <Map className="h-4 w-4" />
                  <span className="text-xs">지도</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <Button size="sm" variant="outline" onClick={handleButtonClick}>
              자세히 보기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

export default OptimizedBusinessCard
