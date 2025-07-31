"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, ExternalLink, X } from "lucide-react"
import { useState } from "react"
import type { NewsItem } from "@/types/news"
import { getSourceBadgeInfo } from "@/utils/source-badge-info"

interface NewsDetailModalProps {
  news: NewsItem | null
  isOpen: boolean
  onClose: () => void
}

export default function NewsDetailModal({ news, isOpen, onClose }: NewsDetailModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [hasValidImage, setHasValidImage] = useState(false)
  const [normalizedImageUrl, setNormalizedImageUrl] = useState("")

  if (!news) return null

  const getCategoryColor = (category: string) => {
    const colors = {
      정책: "bg-blue-100 text-blue-800",
      경제: "bg-green-100 text-green-800",
      사회: "bg-purple-100 text-purple-800",
      문화: "bg-pink-100 text-pink-800",
      교통: "bg-indigo-100 text-indigo-800",
      의료: "bg-red-100 text-red-800",
      생활: "bg-orange-100 text-orange-800",
      일반: "bg-gray-100 text-gray-800",
      정치: "bg-red-100 text-red-800",
      스포츠: "bg-orange-100 text-orange-800",
      기술: "bg-indigo-100 text-indigo-800",
      국제: "bg-yellow-100 text-yellow-800",
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

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const normalizeUrl = (url: string): string => {
    if (!url) return ""
    if (url.startsWith("//")) return `https:${url}`
    if (url.startsWith("/")) return `https://example.com${url}`
    if (!url.startsWith("http")) return `https://${url}`
    return url
  }

  const imageUrl = news.image_url ? normalizeUrl(news.image_url) : ""
  const validImageUrl = imageUrl && isValidUrl(imageUrl) ? imageUrl : ""

  const handleExternalLink = () => {
    if (news.source_url) {
      window.open(news.source_url, "_blank", "noopener,noreferrer")
    }
  }

  // Set state for image validity and normalization
  if (imageUrl && isValidUrl(imageUrl)) {
    setNormalizedImageUrl(imageUrl)
    setHasValidImage(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                className={`${getSourceBadgeInfo(String(news.source_url || ""), String(news.source || "")).color} text-xs font-medium`}
              >
                {getSourceBadgeInfo(String(news.source_url || ""), String(news.source || "")).name}
              </Badge>
              <Badge className={`${getCategoryColor(String(news.category))} text-xs`}>{String(news.category)}</Badge>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Globe className="w-3 h-3" />
                <span>{String(news.language || "ko").toUpperCase()}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <DialogTitle className="text-2xl font-bold leading-tight mb-2">{String(news.title || "")}</DialogTitle>
          <DialogDescription className="sr-only">뉴스 기사 상세 내용을 표시하는 모달입니다.</DialogDescription>
        </DialogHeader>

        {/* 이미지 영역 - 향상된 처리 */}
        {hasValidImage && (
          <div className="mb-6">
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={normalizedImageUrl || "/placeholder.svg"}
                alt={String(news.title || "뉴스 이미지")}
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
            </div>
          </div>
        )}

        <div className="space-y-6 p-6">
          {/* 요약 */}
          {news.summary && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">📝 요약</h3>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">{String(news.summary)}</p>
              </div>
            </div>
          )}

          {/* 본문 */}
          {news.content && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">📄 본문</h3>
              <div className="prose max-w-none">
                <div
                  className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: String(news.content).replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </div>
          )}

          {/* AI 분석 */}
          {news.ai_analysis && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">🤖 AI 분석</h3>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-800">{String(news.ai_analysis)}</p>
              </div>
            </div>
          )}

          {/* 태그 */}
          {Array.isArray(news.tags) && news.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">🏷️ 태그</h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    #{String(tag)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 메타 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <strong>카테고리:</strong> {String(news.category || "알 수 없음")}
              </div>
              <div>
                <strong>언어:</strong> {String(news.language || "알 수 없음")}
              </div>
              {news.author && (
                <div>
                  <strong>작성자:</strong> {String(news.author)}
                </div>
              )}
              {news.location && (
                <div>
                  <strong>지역:</strong> {String(news.location)}
                </div>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4 border-t">
            {news.source_url && (
              <Button onClick={handleExternalLink} className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                원문 보기
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
