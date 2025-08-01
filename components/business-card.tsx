"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Globe, Facebook, Instagram, Youtube, MessageCircle, Eye, Star, TrendingUp } from "lucide-react"
import type { BusinessCard } from "@/lib/supabase"
import { formatPhoneNumber, detectUrlType, truncateText } from "@/lib/utils"
import { incrementViewCount, incrementExposureCount } from "@/lib/api"

interface BusinessCardProps {
  card: BusinessCard
  onDetailClick?: (card: BusinessCard) => void
}

export default function BusinessCardComponent({ card, onDetailClick }: BusinessCardProps) {
  const handleCardClick = async () => {
    try {
      await incrementViewCount(card.id)
      await incrementExposureCount(card.id)
      onDetailClick?.(card)
    } catch (error) {
      console.error("Failed to increment counters:", error)
      onDetailClick?.(card)
    }
  }

  const getSocialIcon = (url: string) => {
    const type = detectUrlType(url)
    switch (type) {
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "youtube":
        return <Youtube className="h-4 w-4" />
      case "line":
        return <MessageCircle className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const socialLinks = [
    { url: card.website, type: "website" },
    { url: card.facebook, type: "facebook" },
    { url: card.instagram, type: "instagram" },
    { url: card.youtube, type: "youtube" },
    { url: card.line, type: "line" },
    { url: card.kakao, type: "kakao" },
    { url: card.whatsapp, type: "whatsapp" },
    { url: card.telegram, type: "telegram" },
    { url: card.twitter, type: "twitter" },
    { url: card.tiktok, type: "tiktok" },
  ].filter((link) => link.url)

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
        card.is_premium ? "ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-white" : ""
      } ${card.is_promoted ? "ring-2 ring-blue-400 bg-gradient-to-br from-blue-50 to-white" : ""}`}
      onClick={handleCardClick}
    >
      <div className="relative">
        {card.image_url && (
          <img
            src={card.image_url || "/placeholder.svg"}
            alt={card.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=200&width=400&text=" + encodeURIComponent(card.title)
            }}
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {card.is_premium && (
            <Badge variant="default" className="bg-yellow-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              프리미엄
            </Badge>
          )}
          {card.is_promoted && (
            <Badge variant="default" className="bg-blue-500 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              추천
            </Badge>
          )}
          <Badge variant="secondary">{card.category}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white/80">
            <Eye className="h-3 w-3 mr-1" />
            {card.view_count}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg mb-1 line-clamp-2">{card.title}</CardTitle>
        <p className="text-sm text-gray-600 line-clamp-3">{truncateText(card.description, 120)}</p>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Contact Information */}
        <div className="space-y-2">
          {card.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{formatPhoneNumber(card.phone)}</span>
            </div>
          )}
          {card.address && (
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="line-clamp-1">{card.address}</span>
            </div>
          )}
        </div>

        {/* Social Media Links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {socialLinks.slice(0, 4).map((link, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                className="h-8 px-2 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(link.url, "_blank", "noopener,noreferrer")
                }}
              >
                {getSocialIcon(link.url!)}
              </Button>
            ))}
            {socialLinks.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{socialLinks.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {card.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{card.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            className="w-full bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              handleCardClick()
            }}
          >
            자세히 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
