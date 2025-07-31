"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Phone,
  Clock,
  Eye,
  Globe,
  ExternalLink,
  X,
  Crown,
  Star,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react"
import { useState } from "react"
import type { BusinessCard } from "@/types/business-card"

interface BusinessDetailModalProps {
  card: BusinessCard
  isOpen: boolean
  onClose: () => void
}

export default function BusinessDetailModal({ card, isOpen, onClose }: BusinessDetailModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "날짜 정보 없음"
    }
  }

  // 이미지 URL 유효성 검증 함수
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false

    const urlString = String(url).trim()
    if (!urlString || urlString === "null" || urlString === "undefined") return false

    // URL 형식 검증
    try {
      new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`)
      return true
    } catch {
      return false
    }
  }

  // 이미지 URL 정규화 함수
  const normalizeImageUrl = (url: string): string => {
    const urlString = url.trim()
    if (urlString.startsWith("http")) {
      return urlString
    }
    return `https://${urlString}`
  }

  const hasValidImage = isValidImageUrl(card.image)
  const normalizedImageUrl = hasValidImage ? normalizeImageUrl(String(card.image)) : ""

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getCategoryColor(String(card.category))} text-xs`}>{String(card.category)}</Badge>
              {card.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  프리미엄
                </Badge>
              )}
              {card.isPromoted && !card.isPremium && (
                <Badge className="bg-blue-500 text-white text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  추천업체
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
              <span className="sr-only">닫기</span>
            </Button>
          </div>
          <DialogTitle className="text-2xl font-bold leading-tight pr-8">{String(card.title || "")}</DialogTitle>
          <DialogDescription className="text-base text-gray-600 leading-relaxed">
            {String(card.description || "")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 이미지 영역 */}
          {hasValidImage && (
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              {!imageError ? (
                <>
                  <img
                    src={normalizedImageUrl || "/placeholder.svg"}
                    alt={String(card.title || "업체 이미지")}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />

                  {/* 로딩 스피너 */}
                  {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
          )}

          {/* 연락처 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {card.location && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">위치</div>
                  <div className="text-sm text-gray-600">{String(card.location)}</div>
                </div>
              </div>
            )}

            {card.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">전화번호</div>
                  <div className="text-sm text-gray-600">
                    <a href={`tel:${card.phone}`} className="hover:text-blue-600">
                      {String(card.phone)}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {card.hours && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">운영시간</div>
                  <div className="text-sm text-gray-600">{String(card.hours)}</div>
                </div>
              </div>
            )}

            {(card.kakaoId || card.lineId) && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">메신저</div>
                  <div className="flex gap-2 text-sm">
                    {card.kakaoId && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        카톡: {String(card.kakaoId)}
                      </span>
                    )}
                    {card.lineId && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        라인: {String(card.lineId)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 가격 및 프로모션 정보 */}
          {(card.price || card.promotion) && (
            <div className="space-y-3">
              {card.price && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">💰 가격 정보</h4>
                  <p className="text-green-800">{String(card.price)}</p>
                </div>
              )}
              {card.promotion && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">🎉 프로모션</h4>
                  <p className="text-orange-800">{String(card.promotion)}</p>
                </div>
              )}
            </div>
          )}

          {/* 태그 */}
          {Array.isArray(card.tags) && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{String(tag)}
                </Badge>
              ))}
            </div>
          )}

          {/* 소셜 미디어 링크 */}
          {(card.facebookUrl || card.instagramUrl || card.youtubeUrl) && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">소셜 미디어</h4>
              <div className="flex gap-3">
                {card.facebookUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a href={String(card.facebookUrl)} target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </a>
                  </Button>
                )}
                {card.instagramUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a href={String(card.instagramUrl)} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </a>
                  </Button>
                )}
                {card.youtubeUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a href={String(card.youtubeUrl)} target="_blank" rel="noopener noreferrer">
                      <Youtube className="w-4 h-4 mr-2" />
                      YouTube
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* 통계 정보 */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>노출 횟수: {Number(card.exposureCount || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>등록일: {formatDate(String(card.created_at))}</span>
            </div>
          </div>

          {/* 웹사이트 링크 */}
          {card.website && (
            <div className="border-t pt-4">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a
                  href={String(card.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {card.website.includes("maps.google") || card.website.includes("goo.gl/maps")
                    ? "지도에서 보기"
                    : "웹사이트 방문"}
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
