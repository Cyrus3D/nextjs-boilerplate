"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Globe,
  Map,
  Crown,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  Hash,
} from "lucide-react"
import type { BusinessCard } from "@/types/business-card"
import { getUrlType } from "@/lib/utils"

interface BusinessDetailModalProps {
  card: BusinessCard | null
  isOpen: boolean
  onClose: () => void
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
    프리미엄: "bg-yellow-100 text-yellow-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

export default function BusinessDetailModal({ card, isOpen, onClose }: BusinessDetailModalProps) {
  if (!card) return null

  const urlType = getUrlType(card.website)

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleMapClick = (location: string) => {
    const searchQuery = encodeURIComponent(location + " 방콕 태국")
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, "_blank")
  }

  const handleWebsiteClick = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank")
    } else {
      window.open(`https://${url}`, "_blank")
    }
  }

  const handleSocialClick = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank")
    } else {
      window.open(`https://${url}`, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto mx-auto">
        <div className="relative w-full mx-auto">
          {/* Hero Image Section */}
          <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden rounded-t-lg">
            <img
              src={card.image || "/placeholder.svg?height=320&width=800"}
              alt={card.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              {card.isPremium && (
                <Badge className="bg-yellow-500 text-white flex items-center gap-1 shadow-lg">
                  <Crown className="h-3 w-3" />
                  프리미엄
                </Badge>
              )}
              <Badge className={`${getCategoryColor(card.category)} shadow-lg`} variant="secondary">
                {card.category}
              </Badge>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <DialogHeader className="text-left">
                <DialogTitle className="text-white text-xl sm:text-2xl lg:text-3xl font-bold drop-shadow-lg">
                  {card.title}
                </DialogTitle>
              </DialogHeader>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 space-y-6 w-full">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">업체 소개</h3>
              <p className="text-gray-700 leading-relaxed">{card.description}</p>
            </div>

            {/* Special Offers */}
            {(card.price || card.promotion) && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">특별 혜택</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {card.price && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-green-700 font-medium">💰 가격 정보</span>
                      </div>
                      <p className="text-green-800 font-semibold">{card.price}</p>
                    </div>
                  )}
                  {card.promotion && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-orange-700 font-medium">🎉 프로모션</span>
                      </div>
                      <p className="text-orange-800 font-semibold">{card.promotion}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">연락처 정보</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {card.location && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900">위치</span>
                      <p className="text-gray-700 break-words">{card.location}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 bg-transparent"
                        onClick={() => handleMapClick(card.location!)}
                      >
                        <Map className="h-4 w-4 mr-1" />
                        지도에서 보기
                      </Button>
                    </div>
                  </div>
                )}

                {card.phone && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Phone className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900">전화번호</span>
                      <p className="text-gray-700">{card.phone}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 bg-transparent"
                        onClick={() => handlePhoneClick(card.phone!)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        전화하기
                      </Button>
                    </div>
                  </div>
                )}

                {card.hours && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Clock className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900">운영시간</span>
                      <p className="text-gray-700 whitespace-pre-line">{card.hours}</p>
                    </div>
                  </div>
                )}

                {card.website && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    {urlType === "map" ? (
                      <Map className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Globe className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900">
                        {urlType === "map" ? "지도 링크" : "웹사이트"}
                      </span>
                      <p className="text-gray-700 break-all text-sm">{card.website}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 bg-transparent"
                        onClick={() => handleWebsiteClick(card.website!)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {urlType === "map" ? "지도 보기" : "사이트 방문"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Messaging Apps */}
            {(card.kakaoId || card.lineId) && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4">메신저 연락</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {card.kakaoId && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <MessageCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-yellow-900">카카오톡 ID</span>
                          <p className="text-yellow-800 font-mono break-all">{card.kakaoId}</p>
                        </div>
                      </div>
                    )}
                    {card.lineId && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <MessageCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-green-900">라인 ID</span>
                          <p className="text-green-800 font-mono break-all">{card.lineId}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Social Media */}
            {(card.facebookUrl || card.instagramUrl || card.youtubeUrl || card.tiktokUrl) && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4">소셜 미디어</h3>
                  <div className="flex flex-wrap gap-3">
                    {card.facebookUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        onClick={() => handleSocialClick(card.facebookUrl!)}
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                    {card.instagramUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100"
                        onClick={() => handleSocialClick(card.instagramUrl!)}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                    {card.youtubeUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        onClick={() => handleSocialClick(card.youtubeUrl!)}
                      >
                        <Youtube className="h-4 w-4 mr-2" />
                        YouTube
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                    {card.tiktokUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        onClick={() => handleSocialClick(card.tiktokUrl!)}
                      >
                        <Hash className="h-4 w-4 mr-2" />
                        TikTok
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4">태그</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="pt-4 border-t bg-gray-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 rounded-b-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  <p>조회수: {card.exposureCount || 0}회</p>
                  {card.lastExposedAt && (
                    <p>마지막 업데이트: {new Date(card.lastExposedAt).toLocaleDateString("ko-KR")}</p>
                  )}
                </div>
                <Button onClick={onClose} className="w-full sm:w-auto">
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
