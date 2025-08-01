"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Globe, Facebook, Instagram, Youtube, MessageCircle, Star, Eye } from "lucide-react"
import type { BusinessCard } from "@/lib/supabase"
import { formatPhoneNumber, detectUrlType, formatViewCount } from "@/lib/utils"
import { incrementExposureCount } from "@/lib/api"

interface BusinessCardProps {
  card: BusinessCard
  onCardClick?: (card: BusinessCard) => void
  showViewCount?: boolean
}

export default function BusinessCardComponent({ card, onCardClick, showViewCount = false }: BusinessCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleCardClick = async () => {
    // Increment exposure count when card is clicked
    await incrementExposureCount(card.id)
    onCardClick?.(card)
  }

  const getSocialIcon = (type: string) => {
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
      className={`h-full transition-all duration-200 hover:shadow-lg cursor-pointer ${
        card.is_premium ? "ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-white" : ""
      } ${card.is_promoted ? "ring-2 ring-blue-400 bg-gradient-to-br from-blue-50 to-white" : ""}`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
              {card.title}
              {card.is_premium && <Star className="inline-block ml-2 h-4 w-4 text-yellow-500 fill-current" />}
            </CardTitle>
            <Badge variant="secondary" className="mt-2">
              {card.category}
            </Badge>
          </div>
          {card.image_url && !imageError && (
            <div className="ml-3 flex-shrink-0">
              <img
                src={card.image_url || "/placeholder.svg"}
                alt={card.title}
                className="w-16 h-16 rounded-lg object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{card.description}</p>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          {card.phone && (
            <div className="flex items-center text-sm text-gray-700">
              <Phone className="h-4 w-4 mr-2 text-green-600" />
              <span>{formatPhoneNumber(card.phone)}</span>
            </div>
          )}

          {card.address && (
            <div className="flex items-center text-sm text-gray-700">
              <MapPin className="h-4 w-4 mr-2 text-red-600" />
              <span className="line-clamp-1">{card.address}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {socialLinks.slice(0, 4).map((link, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 px-2 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(link.url, "_blank")
                }}
              >
                {getSocialIcon(detectUrlType(link.url))}
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
          <div className="flex flex-wrap gap-1 mb-4">
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

        {/* View Count */}
        {showViewCount && card.view_count > 0 && (
          <div className="flex items-center text-xs text-gray-500 mt-2">
            <Eye className="h-3 w-3 mr-1" />
            <span>{formatViewCount(card.view_count)} 조회</span>
          </div>
        )}

        {/* Premium/Promoted Badges */}
        <div className="flex gap-2 mt-3">
          {card.is_premium && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">프리미엄</Badge>}
          {card.is_promoted && <Badge className="bg-blue-100 text-blue-800 border-blue-300">추천</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}
