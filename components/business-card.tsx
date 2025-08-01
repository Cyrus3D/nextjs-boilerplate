"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Phone,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  Eye,
  TrendingUp,
  Crown,
  Star,
  ExternalLink,
} from "lucide-react"
import type { BusinessCard as BusinessCardType } from "@/lib/supabase"
import { formatPhoneNumber, detectUrlType, truncateText } from "@/lib/utils"
import { incrementViewCount, incrementExposureCount } from "@/lib/api"

interface BusinessCardProps {
  card: BusinessCardType
  onClick?: () => void
}

export default function BusinessCard({ card, onClick }: BusinessCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCardClick = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      await Promise.all([incrementViewCount(card.id), incrementExposureCount(card.id)])
      onClick?.()
    } catch (error) {
      console.error("Failed to increment counters:", error)
      onClick?.()
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    window.open(url, "_blank", "noopener,noreferrer")
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
      case "website":
        return <Globe className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  const cardClasses = `
    group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1
    ${card.is_premium ? "ring-2 ring-yellow-400 ring-opacity-50" : ""}
    ${card.is_promoted ? "bg-gradient-to-br from-blue-50 to-indigo-50" : ""}
  `

  return (
    <Card className={cardClasses} onClick={handleCardClick}>
      {/* Premium/Promoted Badges */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {card.is_premium && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Crown className="h-3 w-3 mr-1" />
            프리미엄
          </Badge>
        )}
        {card.is_promoted && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
            <Star className="h-3 w-3 mr-1" />
            추천
          </Badge>
        )}
      </div>

      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        {!imageError && card.image_url ? (
          <Image
            src={card.image_url || "/placeholder.svg"}
            alt={card.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🏢</div>
              <div className="text-sm text-gray-500 font-medium">{card.category}</div>
            </div>
          </div>
        )}

        {/* Overlay with stats */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{card.view_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{card.exposure_count.toLocaleString()}</span>
              </div>
            </div>
            <Badge variant="outline" className="bg-white/20 text-white border-white/30">
              {card.category}
            </Badge>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
          {card.title}
        </CardTitle>
        <p className="text-sm text-gray-600 line-clamp-3">{truncateText(card.description, 120)}</p>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Contact Info */}
        <div className="space-y-2">
          {card.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-green-600" />
              <span className="font-mono">{formatPhoneNumber(card.phone)}</span>
            </div>
          )}

          {card.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-red-600" />
              <span className="line-clamp-1">{card.address}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {(card.website || card.facebook || card.instagram || card.youtube) && (
          <div className="flex gap-2">
            {card.website && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-transparent"
                onClick={(e) => handleLinkClick(e, card.website!)}
              >
                {getSocialIcon(card.website)}
              </Button>
            )}
            {card.facebook && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 bg-transparent"
                onClick={(e) => handleLinkClick(e, card.facebook!)}
              >
                <Facebook className="h-4 w-4" />
              </Button>
            )}
            {card.instagram && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-pink-600 hover:bg-pink-50 bg-transparent"
                onClick={(e) => handleLinkClick(e, card.instagram!)}
              >
                <Instagram className="h-4 w-4" />
              </Button>
            )}
            {card.youtube && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 bg-transparent"
                onClick={(e) => handleLinkClick(e, card.youtube!)}
              >
                <Youtube className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {card.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{card.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
