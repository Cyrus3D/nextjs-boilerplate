"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Globe, Facebook, Instagram, Youtube, Twitter, Eye, Star, TrendingUp } from "lucide-react"
import type { BusinessCard as BusinessCardType } from "@/lib/supabase"
import { formatPhoneNumber, getUrlType, formatViewCount } from "@/lib/utils"
import { incrementViewCount, incrementExposureCount } from "@/lib/api"

interface BusinessCardProps {
  card: BusinessCardType
  onCardClick?: (card: BusinessCardType) => void
}

export function BusinessCard({ card, onCardClick }: BusinessCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleCardClick = async () => {
    try {
      await incrementViewCount(card.id)
      await incrementExposureCount(card.id)
      onCardClick?.(card)
    } catch (error) {
      console.error("Failed to increment counters:", error)
      onCardClick?.(card)
    }
  }

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const getSocialIcon = (type: string) => {
    switch (type) {
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "youtube":
        return <Youtube className="h-4 w-4" />
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "website":
        return <Globe className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const socialLinks = [
    { url: card.website, type: "website" },
    { url: card.facebook, type: "facebook" },
    { url: card.instagram, type: "instagram" },
    { url: card.youtube, type: "youtube" },
    { url: card.twitter, type: "twitter" },
  ].filter((link) => link.url)

  // Safely handle tags
  const tags = card.tags || []
  const displayTags = tags.slice(0, 4)

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] relative overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Premium/Promoted Badges */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {card.is_premium && (
          <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Star className="h-3 w-3 mr-1" />
            프리미엄
          </Badge>
        )}
        {card.is_promoted && (
          <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">
            <TrendingUp className="h-3 w-3 mr-1" />
            추천
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Business Image */}
          <div className="flex-shrink-0">
            {card.image_url && !imageError ? (
              <img
                src={card.image_url || "/placeholder.svg"}
                alt={card.title}
                className="w-16 h-16 rounded-lg object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">{card.title.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Business Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">
              {card.title}
            </h3>
            <Badge variant="outline" className="mb-2">
              {card.category}
            </Badge>
            <p className="text-sm text-muted-foreground line-clamp-2">{card.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {card.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{formatPhoneNumber(card.phone)}</span>
            </div>
          )}
          {card.address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="line-clamp-1">{card.address}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex gap-2 mb-4">
            {socialLinks.slice(0, 4).map((link, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-transparent"
                onClick={(e) => handleLinkClick(e, link.url!)}
              >
                {getSocialIcon(getUrlType(link.url!))}
              </Button>
            ))}
            {socialLinks.length > 4 && (
              <Badge variant="secondary" className="h-8 px-2">
                +{socialLinks.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Tags */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {displayTags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{formatViewCount(card.view_count)} 조회</span>
          </div>
          <div className="text-right">
            <span>노출 {formatViewCount(card.exposure_count)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
