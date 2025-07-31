"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  DollarSign,
  Star,
  ExternalLink,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Eye,
  Calendar,
} from "lucide-react"
import type { BusinessCard } from "@/types/business-card"
import Image from "next/image"

interface BusinessDetailModalProps {
  card: BusinessCard | null
  isOpen: boolean
  onClose: () => void
}

export default function BusinessDetailModal({ card, isOpen, onClose }: BusinessDetailModalProps) {
  if (!card) {
    return null
  }

  const handlePhoneClick = () => {
    if (card.phone) {
      window.open(`tel:${card.phone}`, "_self")
    }
  }

  const handleWebsiteClick = () => {
    if (card.website) {
      let url = card.website
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url
      }
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const handleKakaoClick = () => {
    if (card.kakaoId) {
      window.open(`https://open.kakao.com/o/${card.kakaoId}`, "_blank", "noopener,noreferrer")
    }
  }

  const handleLineClick = () => {
    if (card.lineId) {
      window.open(`https://line.me/ti/p/${card.lineId}`, "_blank", "noopener,noreferrer")
    }
  }

  const handleSocialClick = (url: string) => {
    if (url) {
      let socialUrl = url
      if (!socialUrl.startsWith("http://") && !socialUrl.startsWith("https://")) {
        socialUrl = "https://" + socialUrl
      }
      window.open(socialUrl, "_blank", "noopener,noreferrer")
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "정보 없음"
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "정보 없음"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-2xl font-bold">{String(card.title || "업체명 없음")}</DialogTitle>
                <DialogDescription className="sr-only">
                  업체 상세 정보를 확인할 수 있습니다. 연락처, 위치, 운영시간 및 기타 정보가 포함되어 있습니다.
                </DialogDescription>
                {card.isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    프리미엄
                  </Badge>
                )}
                {card.isPromoted && <Badge variant="secondary">추천</Badge>}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Badge variant="outline">{String(card.category || "기타")}</Badge>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{Number(card.exposureCount || 0).toLocaleString()} 노출</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>등록일: {formatDate(card.created_at)}</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{String(card.description || "설명이 없습니다.")}</p>
            </div>

            {card.image && (
              <div className="flex-shrink-0">
                <Image
                  src={card.image || "/placeholder.svg"}
                  alt={String(card.title || "업체 이미지")}
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=150&width=200&text=이미지 없음"
                  }}
                />
              </div>
            )}
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {card.location && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">위치</h4>
                    <p className="text-gray-700">{String(card.location)}</p>
                  </div>
                </div>
              )}

              {card.phone && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">전화번호</h4>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={handlePhoneClick}
                    >
                      {String(card.phone)}
                    </Button>
                  </div>
                </div>
              )}

              {card.hours && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">운영시간</h4>
                    <p className="text-gray-700 whitespace-pre-line">{String(card.hours)}</p>
                  </div>
                </div>
              )}

              {card.price && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">가격 정보</h4>
                    <p className="text-gray-700 whitespace-pre-line">{String(card.price)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Promotion */}
            {card.promotion && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">🎉 특별 혜택</h4>
                <p className="text-orange-800 whitespace-pre-line">{String(card.promotion)}</p>
              </div>
            )}

            {/* Contact Methods */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">연락 방법</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {card.website && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start bg-transparent"
                    onClick={handleWebsiteClick}
                  >
                    <Globe className="w-4 h-4" />
                    웹사이트
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Button>
                )}

                {card.kakaoId && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                    onClick={handleKakaoClick}
                  >
                    <MessageCircle className="w-4 h-4 text-yellow-600" />
                    카카오톡
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Button>
                )}

                {card.lineId && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start bg-green-50 border-green-200 hover:bg-green-100"
                    onClick={handleLineClick}
                  >
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    라인
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Button>
                )}

                {card.phone && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start bg-blue-50 border-blue-200 hover:bg-blue-100"
                    onClick={handlePhoneClick}
                  >
                    <Phone className="w-4 h-4 text-blue-600" />
                    전화하기
                  </Button>
                )}
              </div>
            </div>

            {/* Social Media */}
            {(card.facebookUrl || card.instagramUrl || card.tiktokUrl || card.threadsUrl || card.youtubeUrl) && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">소셜 미디어</h4>
                <div className="flex flex-wrap gap-3">
                  {card.facebookUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                      onClick={() => handleSocialClick(card.facebookUrl!)}
                    >
                      <Facebook className="w-4 h-4 text-blue-600" />
                      Facebook
                    </Button>
                  )}

                  {card.instagramUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                      onClick={() => handleSocialClick(card.instagramUrl!)}
                    >
                      <Instagram className="w-4 h-4 text-pink-600" />
                      Instagram
                    </Button>
                  )}

                  {card.youtubeUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                      onClick={() => handleSocialClick(card.youtubeUrl!)}
                    >
                      <Youtube className="w-4 h-4 text-red-600" />
                      YouTube
                    </Button>
                  )}

                  {card.tiktokUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                      onClick={() => handleSocialClick(card.tiktokUrl!)}
                    >
                      <div className="w-4 h-4 bg-black rounded-sm" />
                      TikTok
                    </Button>
                  )}

                  {card.threadsUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                      onClick={() => handleSocialClick(card.threadsUrl!)}
                    >
                      <div className="w-4 h-4 bg-gray-800 rounded-sm" />
                      Threads
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {Array.isArray(card.tags) && card.tags.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">태그</h4>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      #{String(tag)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <strong>등록일:</strong> {formatDate(card.created_at)}
                </div>
                <div>
                  <strong>최종 수정:</strong> {formatDate(card.updated_at)}
                </div>
                <div>
                  <strong>노출 횟수:</strong> {Number(card.exposureCount || 0).toLocaleString()}회
                </div>
                <div>
                  <strong>노출 가중치:</strong> {Number(card.exposureWeight || 1.0).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
