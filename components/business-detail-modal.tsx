"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Globe, Clock, Star, Eye, Calendar, ExternalLink, X, MessageCircle, Share2 } from "lucide-react"
import { useState } from "react"
import type { BusinessCard } from "@/types/business-card"

interface BusinessDetailModalProps {
  business: BusinessCard | null
  isOpen: boolean
  onClose: () => void
}

export default function BusinessDetailModal({ business, isOpen, onClose }: BusinessDetailModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!business) return null

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "날짜 정보 없음"
    }
  }

  const handleExternalLink = (url: string) => {
    if (url) {
      window.open(url.startsWith("http") ? url : `https://${url}`, "_blank", "noopener,noreferrer")
    }
  }

  const handlePhoneCall = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`, "_self")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.title,
          text: business.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("공유 취소됨")
      }
    } else {
      // Fallback: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 클립보드에 복사되었습니다!")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {business.category}
              </Badge>
              {business.is_premium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">⭐ 프리미엄</Badge>
              )}
              {business.is_recommended && <Badge className="bg-green-500 text-white text-xs">👍 추천</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold leading-tight mb-2">{business.title}</DialogTitle>

          <DialogDescription className="sr-only">비즈니스 상세 정보를 표시하는 모달입니다.</DialogDescription>

          {business.subtitle && <p className="text-lg text-gray-600 mb-4">{business.subtitle}</p>}
        </DialogHeader>

        {/* 이미지 영역 */}
        {business.image && (
          <div className="mb-6">
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              {!imageError ? (
                <>
                  <img
                    src={business.image || "/placeholder.svg"}
                    alt={business.title}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />

                  {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏢</div>
                    <div className="text-sm">이미지를 불러올 수 없습니다</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">📞 연락처</h3>
              <div className="space-y-2">
                {business.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <button onClick={() => handlePhoneCall(business.phone!)} className="text-blue-600 hover:underline">
                      {business.phone}
                    </button>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <button
                      onClick={() => handleExternalLink(business.website!)}
                      className="text-blue-600 hover:underline truncate"
                    >
                      {business.website}
                    </button>
                  </div>
                )}
                {business.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                    <span className="text-sm">{business.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">📊 정보</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">{business.view_count?.toLocaleString() || 0} 조회</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">등록일: {formatDate(business.created_at)}</span>
                </div>
                {business.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">평점: {business.rating}/5.0</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 설명 */}
        {business.description && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">📝 설명</h3>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{business.description}</p>
            </div>
          </div>
        )}

        {/* 운영 시간 */}
        {business.hours && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">🕒 운영 시간</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800">{business.hours}</span>
              </div>
            </div>
          </div>
        )}

        {/* 태그 */}
        {business.tags && business.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">🏷️ 태그</h3>
            <div className="flex flex-wrap gap-2">
              {business.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 소셜 미디어 */}
        {(business.facebook || business.instagram || business.line) && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">📱 소셜 미디어</h3>
            <div className="flex gap-3">
              {business.facebook && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExternalLink(business.facebook!)}
                  className="text-blue-600"
                >
                  Facebook
                </Button>
              )}
              {business.instagram && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExternalLink(business.instagram!)}
                  className="text-pink-600"
                >
                  Instagram
                </Button>
              )}
              {business.line && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExternalLink(business.line!)}
                  className="text-green-600"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Line
                </Button>
              )}
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-3 pt-4 border-t">
          {business.phone && (
            <Button onClick={() => handlePhoneCall(business.phone!)} className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              전화하기
            </Button>
          )}
          {business.website && (
            <Button
              variant="outline"
              onClick={() => handleExternalLink(business.website!)}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              웹사이트 방문
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
