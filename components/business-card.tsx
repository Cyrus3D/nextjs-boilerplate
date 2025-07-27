"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, Star, MessageCircle, Globe, Zap, Map, Search } from "lucide-react"
import type { BusinessCard } from "../types/business-card"
import { isValidLocation, getUrlType } from "../lib/utils"

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
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

export default function BusinessCardComponent({ card, onDetailClick }: BusinessCardProps) {
  const urlType = getUrlType(card.website)

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${card.isPromoted ? "ring-2 ring-yellow-400" : ""}`}
      onClick={() => onDetailClick(card)}
    >
      <div className="relative">
        <img
          src={card.image || "/placeholder.svg?height=200&width=400"}
          alt={card.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={getCategoryColor(card.category)} variant="secondary">
            {card.category}
          </Badge>
          {card.isPromoted && (
            <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1" variant="secondary">
              <Zap className="h-3 w-3" />
              추천
            </Badge>
          )}
        </div>
        {card.rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium ml-1">{card.rating}</span>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg mb-1 line-clamp-1">{card.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-3">{card.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
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
            <span className="text-sm font-medium text-green-800">{card.price}</span>
          </div>
        )}

        {card.promotion && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <span className="text-sm font-medium text-yellow-800">🎉 {card.promotion}</span>
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

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-3 text-gray-500">
            {card.kakaoId && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">카톡</span>
              </div>
            )}
            {/* URL 타입에 따라 아이콘 표시 */}
            {urlType === "map" && (
              <div className="flex items-center space-x-1">
                <Map className="h-4 w-4" />
                <span className="text-xs">지도</span>
              </div>
            )}
            {urlType === "website" && (
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span className="text-xs">웹사이트</span>
              </div>
            )}
            {/* 위치 정보로 검색 가능한 경우 */}
            {isValidLocation(card.location) && (
              <div className="flex items-center space-x-1">
                <Search className="h-4 w-4" />
                <span className="text-xs">검색</span>
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onDetailClick(card)
            }}
          >
            자세히 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
