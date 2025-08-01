"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, MessageCircle, Globe, Map, Crown, Share2 } from "lucide-react"
import type { BusinessCard } from "@/types/business-card"
import { getUrlType } from "@/lib/utils"

interface BusinessDetailModalProps {
  card: BusinessCard | null
  isOpen: boolean
  onClose: () => void
}

export default function BusinessDetailModal({ card, isOpen, onClose }: BusinessDetailModalProps) {
  if (!card) return null

  const urlType = getUrlType(card.website)

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: card.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleContactClick = (type: string, value: string) => {
    switch (type) {
      case "phone":
        window.open(`tel:${value}`, "_self")
        break
      case "kakao":
        navigator.clipboard.writeText(value)
        alert(`카카오톡 ID가 복사되었습니다: ${value}`)
        break
      case "line":
        navigator.clipboard.writeText(value)
        alert(`라인 ID가 복사되었습니다: ${value}`)
        break
      case "website":
        window.open(value, "_blank", "noopener,noreferrer")
        break
      case "facebook":
        window.open(value, "_blank", "noopener,noreferrer")
        break
      case "instagram":
        window.open(value, "_blank", "noopener,noreferrer")
        break
      case "youtube":
        window.open(value, "_blank", "noopener,noreferrer")
        break
      case "tiktok":
        window.open(value, "_blank", "noopener,noreferrer")
        break
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-4">
            {/* Image */}
            <div className="relative">
              <img
                src={card.image || "/placeholder.svg?height=300&width=600"}
                alt={card.title}
                className="w-full h-64 object-cover rounded-lg"
              />
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

            {/* Title and Description */}
            <div>
              <DialogTitle className="text-2xl font-bold mb-2">{card.title}</DialogTitle>
              <p className="text-gray-600 leading-relaxed">{card.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">연락처 정보</h3>

            {card.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{card.location}</span>
              </div>
            )}

            {card.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600 hover:text-blue-800"
                  onClick={() => handleContactClick("phone", card.phone!)}
                >
                  {card.phone}
                </Button>
              </div>
            )}

            {card.hours && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{card.hours}</span>
              </div>
            )}
          </div>

          {/* Price and Promotion */}
          {(card.price || card.promotion) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">가격 및 프로모션</h3>

              {card.price && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <span className="text-green-800 font-medium">{card.price}</span>
                </div>
              )}

              {card.promotion && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <span className="text-yellow-800 font-medium">🎉 {card.promotion}</span>
                </div>
              )}
            </div>
          )}

          {/* Contact Methods */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">연락 방법</h3>
            <div className="grid grid-cols-2 gap-3">
              {card.kakaoId && (
                <Button
                  variant="outline"
                  onClick={() => handleContactClick("kakao", card.kakaoId!)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  카카오톡
                </Button>
              )}

              {card.lineId && (
                <Button
                  variant="outline"
                  onClick={() => handleContactClick("line", card.lineId!)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  라인
                </Button>
              )}

              {card.phone && (
                <Button
                  variant="outline"
                  onClick={() => handleContactClick("phone", card.phone!)}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  전화하기
                </Button>
              )}

              {card.website && (
                <Button
                  variant="outline"
                  onClick={() => handleContactClick("website", card.website!)}
                  className="flex items-center gap-2"
                >
                  {urlType === "map" ? (
                    <>
                      <Map className="h-4 w-4" />
                      지도 보기
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" />
                      웹사이트
                    </>
                  )}
                </Button>
              )}

              {card.facebookUrl && (
                <Button
                  variant="outline"
                  onClick={() => handleContactClick("facebook", card.facebookUrl!)}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  페이스북
                </Button>
              )}

              {card.instagramUrl && (
                <Button
                  variant="outline"
                  onClick={() => handleContactClick("instagram", card.instagramUrl!)}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  인스타그램
                </Button>
              )}

              {card.youtubeUrl && (
                <Button
                  variant="outline"
                  onClick={() => handleContactClick("youtube", card.youtubeUrl!)}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  유튜브
                </Button>
              )}

              {card.tiktokUrl && (
                <Button
                  variant="outline"
                  onClick={() => handleContactClick("tiktok", card.tiktokUrl!)}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  틱톡
                </Button>
              )}
            </div>
          </div>

          {/* Share Button */}
          <div className="pt-4 border-t">
            <Button onClick={handleShare} variant="outline" className="w-full bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              공유하기
            </Button>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-500 text-center">조회수: {card.viewCount.toLocaleString()}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
