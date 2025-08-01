"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, Star, Crown, Eye } from "lucide-react"
import type { BusinessCardType } from "@/types/business-card"
import Image from "next/image"

interface BusinessCardProps {
  card: BusinessCardType
  onDetailClick: (card: BusinessCardType) => void
}

export default function BusinessCard({ card, onDetailClick }: BusinessCardProps) {
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

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (card.phone) {
      window.open(`tel:${card.phone}`, "_self")
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardHeader className="pb-3" onClick={() => onDetailClick(card)}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {truncateText(String(card.title || ""), 50)}
          </h3>
          <div className="flex flex-col gap-1 items-end">
            {card.isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                <Crown className="w-3 h-3 mr-1" />
                프리미엄
              </Badge>
            )}
            {card.isPromoted && (
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                추천
              </Badge>
            )}
          </div>
        </div>

        <Badge className={`${getCategoryColor(String(card.category))} w-fit text-xs`}>{String(card.category)}</Badge>

        <p className="text-gray-600 text-sm leading-relaxed mt-2">
          {truncateText(String(card.description || ""), 120)}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Image */}
        {card.image && (
          <div className="relative h-32 w-full rounded-md overflow-hidden bg-gray-100">
            <Image
              src={card.image || "/placeholder.svg"}
              alt={String(card.title || "업체 이미지")}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=128&width=300&text=이미지+없음"
              }}
            />
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          {card.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{String(card.location)}</span>
            </div>
          )}

          {card.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{String(card.phone)}</span>
            </div>
          )}

          {card.hours && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{String(card.hours)}</span>
            </div>
          )}
        </div>

        {/* Price/Promotion */}
        {(card.price || card.promotion) && (
          <div className="space-y-2">
            {card.price && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                <p className="text-green-800 text-sm font-medium">💰 {String(card.price)}</p>
              </div>
            )}
            {card.promotion && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                <p className="text-orange-800 text-sm font-medium">🎉 {String(card.promotion)}</p>
              </div>
            )}
          </div>
        )}

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

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{Number(card.exposureCount || 0).toLocaleString()} 노출</span>
          </div>
          <span>{new Date(String(card.created_at)).toLocaleDateString("ko-KR")}</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onDetailClick(card)}
          className="w-full bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300"
          variant="outline"
        >
          자세히 보기
        </Button>
      </CardContent>
    </Card>
  )
}
