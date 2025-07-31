"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Clock, Star, MessageCircle, Facebook, Instagram, Globe } from "lucide-react"
import { CardImage } from "@/components/ui/card"
import type { BusinessCard } from "@/types/business-card"

interface BusinessDetailModalProps {
  business: BusinessCard | null
  isOpen: boolean
  onClose: () => void
}

export function BusinessDetailModal({ business, isOpen, onClose }: BusinessDetailModalProps) {
  if (!business) return null

  const handleExternalLink = (url: string) => {
    if (url) {
      window.open(url.startsWith("http") ? url : `https://${url}`, "_blank", "noopener,noreferrer")
    }
  }

  const handleKakaoTalk = (kakaoId: string) => {
    if (kakaoId) {
      window.open(`https://open.kakao.com/o/${kakaoId}`, "_blank", "noopener,noreferrer")
    }
  }

  const handlePhone = (phone: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{business.title}</DialogTitle>
          <DialogDescription className="sr-only">업체 상세 정보를 확인할 수 있습니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 이미지 */}
          {business.image && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
              <CardImage
                src={business.image}
                alt={business.title}
                className="w-full h-full object-cover"
                fallback="/placeholder.svg?height=192&width=400"
              />
            </div>
          )}

          {/* 기본 정보 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="default">{business.category}</Badge>
              {business.is_premium && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  프리미엄
                </Badge>
              )}
              {business.tags?.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {business.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{business.description}</p>
            )}
          </div>

          <Separator />

          {/* 연락처 정보 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base">연락처 정보</h3>

            {business.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Button variant="link" className="p-0 h-auto text-sm" onClick={() => handlePhone(business.phone!)}>
                  {business.phone}
                </Button>
              </div>
            )}

            {business.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">{business.address}</p>
                  {business.map_url && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-xs mt-1"
                      onClick={() => handleExternalLink(business.map_url!)}
                    >
                      지도에서 보기
                    </Button>
                  )}
                </div>
              </div>
            )}

            {business.hours && (
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm whitespace-pre-line">{business.hours}</p>
              </div>
            )}
          </div>

          {/* 소셜 미디어 & 연락처 */}
          {(business.kakao_id || business.line_id || business.website || business.facebook || business.instagram) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-base">소셜 미디어 & 웹사이트</h3>
                <div className="flex flex-wrap gap-2">
                  {business.kakao_id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleKakaoTalk(business.kakao_id!)}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      카카오톡
                    </Button>
                  )}

                  {business.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExternalLink(business.website!)}
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      웹사이트
                    </Button>
                  )}

                  {business.facebook && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExternalLink(business.facebook!)}
                      className="flex items-center gap-2"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Button>
                  )}

                  {business.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExternalLink(business.instagram!)}
                      className="flex items-center gap-2"
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* 추가 정보 */}
          {business.additional_info && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-base">추가 정보</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {business.additional_info}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
