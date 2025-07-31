"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  ExternalLink,
  X,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react"
import type { BusinessCard } from "@/types/business-card"

interface BusinessDetailModalProps {
  business: BusinessCard | null
  isOpen: boolean
  onClose: () => void
}

export default function BusinessDetailModal({ business, isOpen, onClose }: BusinessDetailModalProps) {
  if (!business) return null

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "")

    // Format Thai phone numbers
    if (cleaned.startsWith("66")) {
      return `+66 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
    } else if (cleaned.startsWith("0")) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    }

    return phone
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      음식점: "bg-orange-100 text-orange-800",
      카페: "bg-amber-100 text-amber-800",
      쇼핑: "bg-blue-100 text-blue-800",
      서비스: "bg-green-100 text-green-800",
      의료: "bg-red-100 text-red-800",
      교육: "bg-purple-100 text-purple-800",
      숙박: "bg-indigo-100 text-indigo-800",
      교통: "bg-gray-100 text-gray-800",
      기타: "bg-slate-100 text-slate-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleWebsite = (url: string) => {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`
    window.open(formattedUrl, "_blank", "noopener,noreferrer")
  }

  const handleKakaoTalk = (kakaoId: string) => {
    window.open(`https://open.kakao.com/o/${kakaoId}`, "_blank", "noopener,noreferrer")
  }

  const handleSocialMedia = (platform: string, handle: string) => {
    let url = ""
    switch (platform) {
      case "facebook":
        url = `https://facebook.com/${handle}`
        break
      case "instagram":
        url = `https://instagram.com/${handle}`
        break
      case "twitter":
        url = `https://twitter.com/${handle}`
        break
    }
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getCategoryColor(business.category)}>{business.category}</Badge>
              {business.is_premium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">⭐ 프리미엄</Badge>
              )}
              {business.tags && business.tags.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {business.tags[0]}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <DialogTitle className="text-xl font-bold leading-tight pr-8">{business.title}</DialogTitle>

          <DialogDescription className="sr-only">비즈니스 정보의 상세 내용을 보여주는 모달입니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Business Image */}
          {business.image_url && (
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={business.image_url || "/placeholder.svg"}
                alt={business.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=192&width=400"
                }}
              />
            </div>
          )}

          {/* Description */}
          {business.description && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">📝 소개</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{business.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">📞 연락처 정보</h3>
              <div className="space-y-3">
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="flex-1">{formatPhoneNumber(business.phone)}</span>
                    <Button size="sm" variant="outline" onClick={() => handleCall(business.phone)}>
                      전화걸기
                    </Button>
                  </div>
                )}

                {business.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="flex-1 truncate">{business.website}</span>
                    <Button size="sm" variant="outline" onClick={() => handleWebsite(business.website)}>
                      <ExternalLink className="w-3 h-3 mr-1" />
                      방문
                    </Button>
                  </div>
                )}

                {business.kakao_id && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-yellow-600" />
                    <span className="flex-1">카카오톡: {business.kakao_id}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleKakaoTalk(business.kakao_id)}
                      className="bg-yellow-50 hover:bg-yellow-100"
                    >
                      채팅
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          {business.location && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">📍 위치</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-700">{business.location}</p>
                    {business.map_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 bg-transparent"
                        onClick={() => window.open(business.map_url, "_blank", "noopener,noreferrer")}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        지도 보기
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Business Hours */}
          {business.hours && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">🕒 운영시간</h3>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-600 mt-1" />
                  <p className="text-gray-700 whitespace-pre-wrap">{business.hours}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Media */}
          {(business.facebook || business.instagram || business.twitter) && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">🌐 소셜 미디어</h3>
                <div className="space-y-2">
                  {business.facebook && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialMedia("facebook", business.facebook)}
                      className="w-full justify-start"
                    >
                      <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                      Facebook: {business.facebook}
                    </Button>
                  )}
                  {business.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialMedia("instagram", business.instagram)}
                      className="w-full justify-start"
                    >
                      <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                      Instagram: @{business.instagram}
                    </Button>
                  )}
                  {business.twitter && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialMedia("twitter", business.twitter)}
                      className="w-full justify-start"
                    >
                      <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                      Twitter: @{business.twitter}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {business.tags && business.tags.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">🏷️ 태그</h3>
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rating */}
          {business.rating && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{business.rating}</span>
                  <span className="text-gray-500">/ 5.0</span>
                  {business.review_count && (
                    <span className="text-sm text-gray-500">({business.review_count}개 리뷰)</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* View Count */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            조회수: {business.view_count?.toLocaleString() || 0}회
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
