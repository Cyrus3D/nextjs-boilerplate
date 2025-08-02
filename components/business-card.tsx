"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  Eye,
  Star,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react"
import { cn, formatPhoneNumber, normalizeUrl, formatNumber } from "@/lib/utils"
import { incrementViewCount, incrementExposureCount } from "@/lib/api"

interface BusinessCardProps {
  id: string
  title: string
  description: string
  category: string
  phone?: string
  address?: string
  website?: string
  kakao_id?: string
  line_id?: string
  facebook?: string
  instagram?: string
  youtube?: string
  tags: string[]
  view_count: number
  exposure_count: number
  is_premium: boolean
  is_promoted: boolean
  is_active: boolean
  className?: string
  onClick?: () => void
}

export function BusinessCard({
  id,
  title,
  description,
  category,
  phone,
  address,
  website,
  kakao_id,
  line_id,
  facebook,
  instagram,
  youtube,
  tags,
  view_count,
  exposure_count,
  is_premium,
  is_promoted,
  is_active,
  className,
  onClick,
}: BusinessCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  // 카드 클릭 핸들러
  const handleCardClick = async () => {
    if (onClick) {
      setIsLoading(true)
      try {
        // 조회수 증가
        await incrementViewCount(id)
        onClick()
      } catch (error) {
        console.error("조회수 증가 실패:", error)
        onClick() // 오류가 있어도 모달은 열기
      } finally {
        setIsLoading(false)
      }
    }
  }

  // 연락처 클릭 핸들러
  const handleContactClick = async (url: string, type: string) => {
    try {
      // 노출수 증가
      await incrementExposureCount(id)

      const normalizedUrl = normalizeUrl(url)

      // URL 타입에 따른 처리
      if (type === "phone") {
        window.location.href = `tel:${url}`
      } else if (type === "email") {
        window.location.href = `mailto:${url}`
      } else {
        window.open(normalizedUrl, "_blank", "noopener,noreferrer")
      }
    } catch (error) {
      console.error("연락처 클릭 처리 실패:", error)
    }
  }

  // 연락처 정보 수집
  const contacts = []

  if (phone) {
    contacts.push({
      type: "phone",
      value: phone,
      icon: Phone,
      label: formatPhoneNumber(phone),
      color: "text-green-600",
    })
  }

  if (kakao_id) {
    contacts.push({
      type: "kakao",
      value: kakao_id,
      icon: MessageCircle,
      label: `카카오톡: ${kakao_id}`,
      color: "text-yellow-600",
    })
  }

  if (line_id) {
    contacts.push({
      type: "line",
      value: line_id,
      icon: MessageCircle,
      label: `라인: ${line_id}`,
      color: "text-green-500",
    })
  }

  if (website) {
    contacts.push({
      type: "website",
      value: website,
      icon: Globe,
      label: "웹사이트",
      color: "text-blue-600",
    })
  }

  if (facebook) {
    contacts.push({
      type: "facebook",
      value: facebook,
      icon: Facebook,
      label: "페이스북",
      color: "text-blue-700",
    })
  }

  if (instagram) {
    contacts.push({
      type: "instagram",
      value: instagram,
      icon: Instagram,
      label: "인스타그램",
      color: "text-pink-600",
    })
  }

  if (youtube) {
    contacts.push({
      type: "youtube",
      value: youtube,
      icon: Youtube,
      label: "유튜브",
      color: "text-red-600",
    })
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        is_premium && "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 shadow-amber-100",
        is_promoted && "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-blue-100",
        !is_active && "opacity-60",
        className,
      )}
      onClick={handleCardClick}
    >
      {/* 프리미엄/프로모션 배지 */}
      {is_premium && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-amber-500 text-white shadow-lg">
            <Star className="w-3 h-3 mr-1" />
            프리미엄
          </Badge>
        </div>
      )}

      {is_promoted && !is_premium && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-blue-500 text-white shadow-lg">추천</Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle
              className={cn(
                "text-lg font-semibold leading-tight mb-1 group-hover:text-blue-600 transition-colors",
                is_premium && "text-amber-800",
                is_promoted && "text-blue-800",
              )}
            >
              {title}
            </CardTitle>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>

              {address && (
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-[120px]">{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <CardDescription className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* 태그 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 text-gray-500">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* 연락처 정보 */}
        {contacts.length > 0 && (
          <div className="space-y-2 mb-3">
            {contacts.slice(0, 2).map((contact, index) => {
              const Icon = contact.icon
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start h-8 px-2 text-xs hover:bg-gray-50", contact.color)}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleContactClick(contact.value, contact.type)
                  }}
                >
                  <Icon className="w-3 h-3 mr-2" />
                  <span className="truncate">{contact.label}</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                </Button>
              )
            })}

            {contacts.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center h-8 px-2 text-xs text-gray-500 hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCardClick()
                }}
              >
                연락처 {contacts.length - 2}개 더 보기
              </Button>
            )}
          </div>
        )}

        {/* 통계 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              <span>{formatNumber(view_count)}</span>
            </div>

            <div className="flex items-center">
              <ExternalLink className="w-3 h-3 mr-1" />
              <span>{formatNumber(exposure_count)}</span>
            </div>
          </div>

          {!is_active && (
            <Badge variant="outline" className="text-xs text-gray-400">
              비활성
            </Badge>
          )}
        </div>
      </CardContent>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </Card>
  )
}
