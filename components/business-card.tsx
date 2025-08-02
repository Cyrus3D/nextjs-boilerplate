"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Globe, Facebook, Instagram, Youtube, MessageCircle, Eye, Crown, Zap } from "lucide-react"
import type { BusinessCard } from "@/lib/supabase"
import { formatPhoneNumber, detectUrlType } from "@/lib/utils"
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
      className={`h-full transition-all duration-200 hover:shadow-lg cursor-pointer relative overflow-hidden ${
        card.is_premium ? "ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-white" : ""
      } ${card.is_promoted ? "ring-2 ring-blue-400 bg-gradient-to-br from-blue-50 to-white" : ""}`}
      onClick={handleCardClick}
    >
      {/* Premium/Promoted badges */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {card.is_premium && (
          <Badge className="bg-yellow-500 text-white">
            <Crown className="h-3 w-3 mr-1" />
            프리미엄
          </Badge>
        )}
        {card.is_promoted && (
          <Badge className="bg-blue-500 text-white">
            <Zap className="h-3 w-3 mr-1" />
            추천
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">{card.title}</CardTitle>
            <Badge variant="secondary" className="mb-2">
              {card.category}
            </Badge>
          </div>
          {card.image_url && !imageError && (
            <div className="flex-shrink-0">
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
              <Phone className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
              <span>{formatPhoneNumber(card.phone)}</span>
            </div>
          )}

          {card.address && (
            <div className="flex items-center text-sm text-gray-700">
              <MapPin className="h-4 w-4 mr-2 text-red-600 flex-shrink-0" />
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
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{card.view_count.toLocaleString()} 조회</span>
            </div>
            <div>
              <span>노출 {card.exposure_count.toLocaleString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
