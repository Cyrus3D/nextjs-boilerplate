"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPhoneNumber, detectUrlType, truncateText } from "@/lib/utils"
import { incrementViewCount, incrementExposureCount } from "@/lib/api"
import type { BusinessCardType } from "@/lib/supabase"
import { Phone, MapPin, Globe, Facebook, Instagram, Youtube, MessageCircle, Eye, Star, TrendingUp } from "lucide-react"

interface BusinessCardProps {
  card: BusinessCardType
  onClick: (card: BusinessCardType) => void
}

export function BusinessCardComponent({ card, onClick }: BusinessCardProps) {
  const handleClick = () => {
    incrementViewCount(card.id)
    incrementExposureCount(card.id)
    onClick(card)
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

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
        card.is_premium ? "ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-white" : ""
      } ${card.is_promoted ? "ring-2 ring-blue-400 bg-gradient-to-br from-blue-50 to-white" : ""}`}
      onClick={handleClick}
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
        {(card.website || card.facebook || card.instagram || card.youtube || card.line) && (
          <div className="flex flex-wrap gap-2">
            {card.website && (
              <Button size="sm" variant="outline" className="h-8 px-2 bg-transparent" asChild>
                <a href={card.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  {getSocialIcon(card.website)}
                </a>
              </Button>
            )}
            {card.facebook && (
              <Button size="sm" variant="outline" className="h-8 px-2 bg-transparent" asChild>
                <a href={card.facebook} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            )}
            {card.instagram && (
              <Button size="sm" variant="outline" className="h-8 px-2 bg-transparent" asChild>
                <a href={card.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
            )}
            {card.youtube && (
              <Button size="sm" variant="outline" className="h-8 px-2 bg-transparent" asChild>
                <a href={card.youtube} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
            )}
            {card.line && (
              <Button size="sm" variant="outline" className="h-8 px-2 bg-transparent" asChild>
                <a href={card.line} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
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

        <div className="pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            className="w-full bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
          >
            자세히 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
