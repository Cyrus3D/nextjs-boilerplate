"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Globe,
  Crown,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  Hash,
  X,
  Share2,
  Heart,
  Copy,
  Check,
  Eye,
  Calendar,
} from "lucide-react"
import { useState } from "react"
import type { BusinessCard } from "@/types/business-card"
import { getUrlType } from "@/lib/utils"

interface BusinessDetailModalProps {
  card: BusinessCard | null
  isOpen: boolean
  onClose: () => void
}

const getCategoryColor = (category: string) => {
  const colors = {
    음식점: "bg-red-500",
    배송서비스: "bg-blue-500",
    여행서비스: "bg-green-500",
    식품: "bg-orange-500",
    이벤트서비스: "bg-purple-500",
    방송서비스: "bg-indigo-500",
    전자제품: "bg-cyan-500",
    유흥업소: "bg-pink-500",
    교통서비스: "bg-emerald-500",
    서비스: "bg-gray-500",
    프리미엄: "bg-yellow-500",
  }
  return colors[category as keyof typeof colors] || "bg-gray-500"
}

export default function BusinessDetailModal({ card, isOpen, onClose }: BusinessDetailModalProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!card) return null

  const urlType = getUrlType(card.website)

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleMapClick = (location: string) => {
    const searchQuery = encodeURIComponent(`${card.title} ${location} 방콕 태국`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, "_blank")
  }

  const handleWebsiteClick = (url: string) => {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`
    window.open(fullUrl, "_blank")
  }

  const handleKakaoClick = (kakaoId: string) => {
    window.open(`https://open.kakao.com/o/${kakaoId}`, "_blank")
  }

  const handleLineClick = (lineId: string) => {
    window.open(`https://line.me/ti/p/${lineId}`, "_blank")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: card.description,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      handleCopy(window.location.href, "share")
    }
  }

  const quickActions = [
    {
      icon: Phone,
      label: "전화하기",
      action: () => card.phone && handlePhoneClick(card.phone),
      available: !!card.phone,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: MapPin,
      label: "위치보기",
      action: () => card.location && handleMapClick(card.location),
      available: !!card.location,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: MessageCircle,
      label: "카카오톡",
      action: () => card.kakaoId && handleKakaoClick(card.kakaoId),
      available: !!card.kakaoId,
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      icon: Globe,
      label: "웹사이트",
      action: () => card.website && handleWebsiteClick(card.website),
      available: !!card.website,
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ]

  const socialLinks = [
    { platform: "facebook", url: card.facebookUrl, icon: Facebook, label: "Facebook", color: "bg-blue-600" },
    { platform: "instagram", url: card.instagramUrl, icon: Instagram, label: "Instagram", color: "bg-pink-500" },
    { platform: "youtube", url: card.youtubeUrl, icon: Youtube, label: "YouTube", color: "bg-red-600" },
    { platform: "tiktok", url: card.tiktokUrl, icon: Hash, label: "TikTok", color: "bg-black" },
  ].filter((link) => link.url && link.url.trim() !== "")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] sm:w-[85vw] lg:w-[75vw] max-h-[90vh] p-0 gap-0 rounded-xl">
        <div className="flex flex-col h-[90vh] rounded-xl overflow-hidden">
          {/* Header with Hero Image */}
          <div className="relative h-60 sm:h-48 lg:h-52 flex-shrink-0">
            <img
              src={card.image || "/placeholder.svg?height=256&width=800"}
              alt={card.title}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Action Buttons */}
            <div className="absolute top-3 left-3 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Title and Category */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {card.isPremium && (
                      <Badge className="bg-yellow-500 text-white flex items-center gap-1 shadow-lg">
                        <Crown className="h-3 w-3" />
                        프리미엄
                      </Badge>
                    )}
                    <Badge className={`${getCategoryColor(card.category)} text-white shadow-lg`}>{card.category}</Badge>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 leading-tight">{card.title}</h1>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{card.exposureCount || 0}회 조회</span>
                    </div>
                    {card.lastExposedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(card.lastExposedAt).toLocaleDateString("ko-KR")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex-shrink-0 bg-white border-b p-3">
            <div className="flex gap-2 overflow-x-auto">
              {quickActions
                .filter((action) => action.available)
                .map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white flex-shrink-0 min-w-[100px]`}
                    size="sm"
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-3 sm:p-4 space-y-4">
              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-900">업체 소개</h2>
                <p className="text-gray-700 leading-relaxed text-base">{card.description}</p>
              </div>

              {/* Special Offers */}
              {(card.price || card.promotion) && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900">💰 특별 혜택</h2>
                  <div className="space-y-3">
                    {card.price && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-green-800 mb-1">가격 정보</h3>
                            <p className="text-green-700 text-lg font-medium">{card.price}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-700 border-green-300 hover:bg-green-100 bg-transparent w-12"
                            onClick={() => handleCopy(card.price!, "price")}
                          >
                            {copiedField === "price" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}
                    {card.promotion && (
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-orange-800 mb-1">🎉 프로모션</h3>
                            <p className="text-orange-700 text-lg font-medium">{card.promotion}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-orange-700 border-orange-300 hover:bg-orange-100 bg-transparent w-12"
                            onClick={() => handleCopy(card.promotion!, "promotion")}
                          >
                            {copiedField === "promotion" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-900">📞 연락처 정보</h2>
                <div className="space-y-3">
                  {card.location && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-blue-900 mb-1">위치</h3>
                          <p className="text-blue-800 break-all">{card.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleMapClick(card.location!)}
                          className="bg-blue-500 hover:bg-blue-600 w-28"
                        >
                          지도에서 보기
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleCopy(card.location!, "location")} className="w-12">
                          {copiedField === "location" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  {card.phone && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors border border-green-200">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-green-900 mb-1">전화번호</h3>
                          <p className="text-green-800 font-mono break-all">{card.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handlePhoneClick(card.phone!)}
                          className="bg-green-500 hover:bg-green-600 w-28"
                        >
                          전화하기
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleCopy(card.phone!, "phone")} className="w-12">
                          {copiedField === "phone" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  {card.hours && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 border border-purple-200">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-purple-900 mb-1">운영시간</h3>
                        <p className="text-purple-800 whitespace-pre-line break-all">{card.hours}</p>
                      </div>
                    </div>
                  )}

                  {card.website && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Globe className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-indigo-900 mb-1">
                            {urlType === "map" ? "지도 링크" : "웹사이트"}
                          </h3>
                          <p className="text-indigo-800 break-all text-sm">{card.website}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleWebsiteClick(card.website!)}
                          className="bg-indigo-500 hover:bg-indigo-600 w-28"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {urlType === "map" ? "지도 보기" : "사이트 방문"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleCopy(card.website!, "website")} className="w-12">
                          {copiedField === "website" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">💬 메신저</h2>
                    <div className="space-y-3">
                      {card.kakaoId && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                              <MessageCircle className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-yellow-900 mb-1">카카오톡 ID</h3>
                              <p className="text-yellow-800 font-mono break-all">{card.kakaoId}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 sm:flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleKakaoClick(card.kakaoId!)}
                              className="bg-yellow-500 hover:bg-yellow-600 w-28"
                            >
                              카톡 열기
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleCopy(card.kakaoId!, "kakao")} className="w-12">
                              {copiedField === "kakao" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      )}
                      {card.lineId && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-200">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <MessageCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-green-900 mb-1">라인 ID</h3>
                              <p className="text-green-800 font-mono break-all">{card.lineId}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 sm:flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleLineClick(card.lineId!)}
                              className="bg-green-500 hover:bg-green-600 w-28"
                            >
                              라인 열기
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleCopy(card.lineId!, "line")} className="w-12">
                              {copiedField === "line" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Social Media */}
              {socialLinks.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">🌐 소셜 미디어</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {socialLinks.map((social) => (
                        <Button
                          key={social.platform}
                          variant="outline"
                          className={`${social.color} text-white border-0 hover:opacity-90 h-12`}
                          onClick={() => handleWebsiteClick(social.url!)}
                        >
                          <social.icon className="h-5 w-5 mr-2" />
                          {social.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Tags */}
              {card.tags && card.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">🏷️ 태그</h2>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Bottom Spacing */}
              <div className="h-4" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
