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
  Facebook,
  Instagram,
  Youtube,
  MessageSquare,
} from "lucide-react"
import type { BusinessCard } from "../types/business-card"
import { isValidLocation, getUrlType } from "../lib/utils"

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

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "facebook":
      return <Facebook className="h-4 w-4" />
    case "instagram":
      return <Instagram className="h-4 w-4" />
    case "youtube":
      return <Youtube className="h-4 w-4" />
    case "tiktok":
      return <MessageSquare className="h-4 w-4" />
    case "threads":
      return <MessageSquare className="h-4 w-4" />
    default:
      return <Globe className="h-4 w-4" />
  }
}

const getSocialColor = (platform: string) => {
  const colors = {
    facebook: "bg-blue-600 hover:bg-blue-700",
    instagram: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    youtube: "bg-red-600 hover:bg-red-700",
    tiktok: "bg-black hover:bg-gray-800",
    threads: "bg-gray-800 hover:bg-gray-900",
  }
  return colors[platform.toLowerCase() as keyof typeof colors] || "bg-gray-600 hover:bg-gray-700"
}

export default function BusinessDetailModal({ card, isOpen, onClose }: BusinessDetailModalProps) {
  if (!card) return null

  const urlType = getUrlType(card.website)

  // 소셜 미디어 링크들을 배열로 정리
  const socialLinks = [
    { platform: "facebook", url: card.facebook_url, label: "Facebook" },
    { platform: "instagram", url: card.instagram_url, label: "Instagram" },
    { platform: "youtube", url: card.youtube_url, label: "YouTube" },
    { platform: "tiktok", url: card.tiktok_url, label: "TikTok" },
    { platform: "threads", url: card.threads_url, label: "Threads" },
  ].filter((link) => link.url && link.url.trim() !== "")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{card.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 이미지 */}
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

          {/* 기본 정보 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">상세 정보</h3>
              <p className="text-gray-700 leading-relaxed">{card.description}</p>
            </div>

            {/* 연락처 정보 */}
            <div className="space-y-3">
              {card.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-900">{card.location}</span>
                    {isValidLocation(card.location) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-2 bg-transparent"
                        onClick={() => {
                          const query = encodeURIComponent(card.location)
                          window.open(`https://maps.google.com/maps?q=${query}`, "_blank")
                        }}
                      >
                        <Map className="h-4 w-4 mr-1" />
                        지도 보기
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {card.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-900">{card.phone}</span>
                  <Button size="sm" variant="outline" onClick={() => window.open(`tel:${card.phone}`, "_self")}>
                    전화걸기
                  </Button>
                </div>
              )}

              {card.hours && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-900">{card.hours}</span>
                </div>
              )}

              {card.kakaoId && (
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-900">카카오톡: {card.kakaoId}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://open.kakao.com/o/${card.kakaoId}`, "_blank")}
                  >
                    카톡 열기
                  </Button>
                </div>
              )}

              {card.website && (
                <div className="flex items-center gap-3">
                  {urlType === "map" ? (
                    <Map className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <Globe className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                  <span className="text-gray-900 truncate flex-1">{card.website}</span>
                  <Button size="sm" variant="outline" onClick={() => window.open(card.website, "_blank")}>
                    {urlType === "map" ? "지도 보기" : "웹사이트 방문"}
                  </Button>
                </div>
              )}
            </div>

            {/* 소셜 미디어 링크 */}
            {socialLinks.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-3">소셜 미디어</h4>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social) => (
                    <Button
                      key={social.platform}
                      size="sm"
                      className={`text-white ${getSocialColor(social.platform)}`}
                      onClick={() => window.open(social.url, "_blank")}
                    >
                      {getSocialIcon(social.platform)}
                      <span className="ml-2">{social.label} 팔로우</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* 가격 및 프로모션 */}
            {(card.price || card.promotion) && (
              <div className="space-y-3">
                {card.price && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-1">가격 정보</h4>
                    <p className="text-green-700">{card.price}</p>
                  </div>
                )}

                {card.promotion && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-1">🎉 특별 혜택</h4>
                    <p className="text-yellow-700">{card.promotion}</p>
                  </div>
                )}
              </div>
            )}

            {/* 태그 */}
            {card.tags.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-3">관련 태그</h4>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
