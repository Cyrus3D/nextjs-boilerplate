"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Phone,
  Clock,
  Star,
  MessageCircle,
  Globe,
  Zap,
  ExternalLink,
  Copy,
  Share2,
  Map,
  Search,
} from "lucide-react"
import type { BusinessCard } from "../types/business-card"
import {
  generateGoogleMapsSearchUrl,
  isValidLocation,
  cleanLocationForSearch,
  isMapUrl,
  isWebsiteUrl,
} from "../lib/utils"

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
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

export default function BusinessDetailModal({ card, isOpen, onClose }: BusinessDetailModalProps) {
  if (!card) return null

  const handleCopyPhone = () => {
    if (card.phone) {
      navigator.clipboard.writeText(card.phone)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description,
        url: window.location.href,
      })
    }
  }

  // 지도 검색 링크 생성
  const handleMapSearch = () => {
    if (card.location) {
      const cleanedLocation = cleanLocationForSearch(card.location)
      const mapUrl = generateGoogleMapsSearchUrl(cleanedLocation, card.title)
      window.open(mapUrl, "_blank")
    }
  }

  // URL 타입에 따른 처리
  const websiteIsMap = card.website && isMapUrl(card.website)
  const websiteIsWebsite = card.website && isWebsiteUrl(card.website)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getCategoryColor(card.category)} variant="secondary">
                  {card.category}
                </Badge>
                {card.isPromoted && (
                  <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1" variant="secondary">
                    <Zap className="h-3 w-3" />
                    추천
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl">{card.title}</DialogTitle>
            </div>
            {card.rating && (
              <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium ml-1">{card.rating}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 이미지 */}
          <div className="relative">
            <img
              src={card.image || "/placeholder.svg?height=300&width=600"}
              alt={card.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* 설명 */}
          <div>
            <h3 className="font-semibold text-lg mb-2">상세 정보</h3>
            <DialogDescription className="text-base leading-relaxed">{card.description}</DialogDescription>
          </div>

          {/* 프로모션 정보 */}
          {card.promotion && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">특별 혜택</span>
              </div>
              <p className="text-yellow-700">{card.promotion}</p>
            </div>
          )}

          {/* 가격 정보 */}
          {card.price && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-green-800">가격 정보</span>
              </div>
              <p className="text-green-700 text-lg font-semibold">{card.price}</p>
            </div>
          )}

          <Separator />

          {/* 연락처 및 기본 정보 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">연락처 및 정보</h3>

            {card.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-900">{card.location}</p>
                  <div className="flex gap-2 mt-2">
                    {/* 웹사이트가 지도 링크인 경우 */}
                    {websiteIsMap && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-blue-600"
                        onClick={() => window.open(card.website, "_blank")}
                      >
                        <Map className="h-3 w-3 mr-1" />
                        정확한 위치 보기 <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                    {/* 위치 정보로 구글 맵 검색 (지도 링크가 없는 경우에만) */}
                    {!websiteIsMap && isValidLocation(card.location) && (
                      <Button variant="link" size="sm" className="p-0 h-auto text-green-600" onClick={handleMapSearch}>
                        <Search className="h-3 w-3 mr-1" />
                        지도에서 검색 <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {card.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-gray-900">{card.phone}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyPhone}>
                      <Copy className="h-3 w-3 mr-1" />
                      복사
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(`tel:${card.phone}`)}>
                      전화걸기
                    </Button>
                  </div>
                </div>
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
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-gray-900">카카오톡: {card.kakaoId}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://open.kakao.com/o/${card.kakaoId}`)}
                  >
                    카톡 연결
                  </Button>
                </div>
              </div>
            )}

            {card.lineId && (
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-gray-900">라인: {card.lineId}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://line.me/ti/p/${card.lineId}`)}
                  >
                    라인 연결
                  </Button>
                </div>
              </div>
            )}

            {/* 웹사이트가 실제 웹사이트인 경우에만 표시 */}
            {websiteIsWebsite && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-gray-900 truncate">웹사이트</span>
                  <Button variant="outline" size="sm" onClick={() => window.open(card.website, "_blank")}>
                    <Globe className="h-3 w-3 mr-1" />
                    웹사이트 방문 <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* 태그 */}
          <div>
            <h3 className="font-semibold text-lg mb-3">태그</h3>
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleShare} variant="outline" className="flex-1 bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              공유하기
            </Button>
            <Button onClick={onClose} className="flex-1">
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
