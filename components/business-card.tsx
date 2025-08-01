"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  DollarSign,
  Star,
  Eye,
  Crown,
  Zap,
  ExternalLink,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Music,
} from "lucide-react"
import type { BusinessCard as BusinessCardType } from "@/types/business-card"
import { formatPhoneNumber, getUrlType, truncateText } from "@/lib/utils"

interface BusinessCardProps {
  card: BusinessCardType
  onDetailClick?: () => void
}

export default function BusinessCard({ card, onDetailClick }: BusinessCardProps) {
  const [imageError, setImageError] = useState(false)
  const tags = card.tags || []

  const handleImageError = () => {
    setImageError(true)
  }

  const getSocialIcon = (url: string) => {
    const type = getUrlType(url)
    switch (type) {
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "youtube":
        return <Youtube className="h-4 w-4" />
      case "tiktok":
        return <Music className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  const openUrl = (url: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const openKakao = (kakaoId: string) => {
    if (kakaoId) {
      window.open(`https://open.kakao.com/o/${kakaoId}`, "_blank", "noopener,noreferrer")
    }
  }

  const openLine = (lineId: string) => {
    if (lineId) {
      window.open(`https://line.me/ti/p/${lineId}`, "_blank", "noopener,noreferrer")
    }
  }

  const callPhone = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`, "_self")
    }
  }

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 ${
        card.isPremium ? "ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-white" : ""
      } ${card.isPromoted ? "ring-2 ring-blue-400 bg-gradient-to-br from-blue-50 to-white" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={!imageError ? card.image : undefined} alt={card.title} onError={handleImageError} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {card.title.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg leading-tight truncate">{card.title}</h3>
                {card.isPremium && <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />}
                {card.isPromoted && <Zap className="h-4 w-4 text-blue-500 flex-shrink-0" />}
              </div>
              <Badge variant="secondary" className="text-xs">
                {card.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">{truncateText(card.description, 120)}</p>

        {/* Key Information */}
        <div className="space-y-2">
          {card.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{card.location}</span>
            </div>
          )}

          {card.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <button onClick={() => callPhone(card.phone!)} className="hover:text-blue-600 transition-colors truncate">
                {formatPhoneNumber(card.phone)}
              </button>
            </div>
          )}

          {card.hours && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{card.hours}</span>
            </div>
          )}

          {card.price && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{card.price}</span>
            </div>
          )}
        </div>

        {/* Promotion */}
        {card.promotion && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <Star className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm font-medium text-red-700">특별 혜택</span>
            </div>
            <p className="text-sm text-red-600">{truncateText(card.promotion, 80)}</p>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 4 && (
              <Badge variant="outline" className="text-xs text-gray-500">
                +{tags.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {card.website && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openUrl(card.website!)}
              className="flex items-center gap-1 text-xs"
            >
              <Globe className="h-3 w-3" />
              웹사이트
            </Button>
          )}

          {card.kakaoId && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openKakao(card.kakaoId!)}
              className="flex items-center gap-1 text-xs bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
            >
              <MessageCircle className="h-3 w-3" />
              카카오톡
            </Button>
          )}

          {card.lineId && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openLine(card.lineId!)}
              className="flex items-center gap-1 text-xs bg-green-50 hover:bg-green-100 border-green-200"
            >
              <MessageCircle className="h-3 w-3" />
              라인
            </Button>
          )}

          {/* Social Media Links */}
          {card.facebookUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openUrl(card.facebookUrl!)}
              className="flex items-center gap-1 text-xs"
            >
              {getSocialIcon(card.facebookUrl)}
            </Button>
          )}

          {card.instagramUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openUrl(card.instagramUrl!)}
              className="flex items-center gap-1 text-xs"
            >
              {getSocialIcon(card.instagramUrl)}
            </Button>
          )}

          {card.youtubeUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openUrl(card.youtubeUrl!)}
              className="flex items-center gap-1 text-xs"
            >
              {getSocialIcon(card.youtubeUrl)}
            </Button>
          )}

          {card.tiktokUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openUrl(card.tiktokUrl!)}
              className="flex items-center gap-1 text-xs"
            >
              {getSocialIcon(card.tiktokUrl)}
            </Button>
          )}
        </div>

        {/* Detail Button and Stats */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-xs text-gray-500">
            <Eye className="h-3 w-3 mr-1" />
            {card.viewCount || 0}회 조회
          </div>

          {onDetailClick && (
            <Button size="sm" onClick={onDetailClick} className="text-xs">
              자세히 보기
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
