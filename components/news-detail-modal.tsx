"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, Globe, ExternalLink, X } from "lucide-react"
import { useState } from "react"
import type { NewsItem } from "@/types/news"

interface NewsDetailModalProps {
  news: NewsItem
  isOpen: boolean
  onClose: () => void
}

export default function NewsDetailModal({ news, isOpen, onClose }: NewsDetailModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

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

  const hasValidImage = isValidImageUrl(news.image_url)
  const normalizedImageUrl = hasValidImage ? normalizeImageUrl(String(news.image_url)) : ""

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getCategoryColor(String(news.category))} text-xs`}>{String(news.category)}</Badge>
              <Badge variant="outline" className="text-xs">
                {String(news.language || "ko").toUpperCase()}
              </Badge>
              {news.is_featured && <Badge className="bg-yellow-500 text-white text-xs">⭐ 주요뉴스</Badge>}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
              <span className="sr-only">닫기</span>
            </Button>
          </div>
          <DialogTitle className="text-2xl font-bold leading-tight pr-8">{String(news.title || "")}</DialogTitle>
          <DialogDescription className="text-base text-gray-600 leading-relaxed">
            {String(news.summary || "")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 이미지 영역 - 개선된 이미지 처리 */}
          {hasValidImage && (
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              {!imageError ? (
                <>
                  <img
                    src={normalizedImageUrl || "/placeholder.svg"}
                    alt={String(news.title || "뉴스 이미지")}
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
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-sm">이미지를 불러올 수 없습니다</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 메타 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>발행일: {formatDate(String(news.published_at || news.created_at))}</span>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>출처: {String(news.source || "알 수 없음")}</span>
            </div>

            {news.author && (
              <div className="flex items-center gap-2">
                <span>👤</span>
                <span>기자: {String(news.author)}</span>
              </div>
            )}

            {news.reading_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>읽기 시간: {Number(news.reading_time)} 분</span>
              </div>
            )}

            {news.location && (
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>지역: {String(news.location)}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>조회수: {Number(news.view_count || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* 태그 */}
          {Array.isArray(news.tags) && news.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{String(tag)}
                </Badge>
              ))}
            </div>
          )}

          {/* AI 분석 */}
          {news.ai_analysis && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">🤖 AI 분석</h4>
              <p className="text-purple-800 text-sm">{String(news.ai_analysis)}</p>
            </div>
          )}

          {/* 본문 내용 */}
          <div className="prose max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {String(news.content || news.summary || "")}
            </div>
          </div>

          {/* 원문 링크 */}
          {news.source_url && (
            <div className="border-t pt-4">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a
                  href={String(news.source_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  원문 보기
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
