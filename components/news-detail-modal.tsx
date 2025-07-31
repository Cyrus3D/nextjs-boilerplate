"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, Globe, ExternalLink, X } from "lucide-react"
import { useState } from "react"
import type { NewsItem } from "@/types/news"

interface NewsDetailModalProps {
  news: NewsItem | null
  isOpen: boolean
  onClose: () => void
}

export default function NewsDetailModal({ news, isOpen, onClose }: NewsDetailModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

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

  // 이미지 URL 유효성 검증 및 정규화
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false
    const urlString = String(url).trim()
    if (!urlString || urlString === "null" || urlString === "undefined") return false

    try {
      new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`)
      return true
    } catch {
      return false
    }
  }

  const normalizeImageUrl = (url: string): string => {
    const urlString = url.trim()
    if (urlString.startsWith("http")) {
      return urlString
    }
    return `https://${urlString}`
  }

  const getSourceBadgeInfo = (sourceUrl: string, source: string) => {
    if (!sourceUrl && !source) return { name: "기타", color: "bg-gray-200 text-gray-800" }

    const urlToBadgeMap: { [key: string]: { name: string; color: string } } = {
      "thaipbs.or.th": { name: "타이피비에스", color: "bg-blue-500 text-white" },
      "bangkokpost.com": { name: "방콕포스트", color: "bg-blue-600 text-white" },
      "nationthailand.com": { name: "네이션", color: "bg-blue-400 text-white" },
      "thairath.co.th": { name: "타이랏", color: "bg-red-500 text-white" },
      "khaosod.co.th": { name: "카오솟", color: "bg-orange-500 text-white" },
      "matichon.co.th": { name: "마티촌", color: "bg-green-600 text-white" },
      "dailynews.co.th": { name: "데일리뉴스", color: "bg-purple-500 text-white" },
      "newsk.net": { name: "뉴스케이", color: "bg-slate-600 text-white" },
    }

    let domain = ""
    if (sourceUrl) {
      try {
        const url = new URL(sourceUrl.startsWith("http") ? sourceUrl : `https://${sourceUrl}`)
        domain = url.hostname.replace("www.", "")
      } catch {
        const match = sourceUrl.match(/(?:https?:\/\/)?(?:www\.)?([^/\s]+)/i)
        domain = match ? match[1] : ""
      }
    }

    if (domain && urlToBadgeMap[domain]) {
      return urlToBadgeMap[domain]
    }

    if (source) {
      const koreanChars = source.match(/[가-힣]/g)
      if (koreanChars && koreanChars.length > 0) {
        return {
          name: koreanChars.slice(0, 4).join(""),
          color: "bg-gray-500 text-white",
        }
      }

      const words = source.split(/\s+/)
      return {
        name: words
          .map((word) => word.charAt(0).toUpperCase())
          .join("")
          .slice(0, 4),
        color: "bg-gray-500 text-white",
      }
    }

    return { name: "기타", color: "bg-gray-400 text-white" }
  }

  const sourceBadgeInfo = getSourceBadgeInfo(String(news.source_url || ""), String(news.source || ""))
  const hasValidImage = isValidImageUrl(news.image_url)
  const normalizedImageUrl = hasValidImage ? normalizeImageUrl(String(news.image_url)) : ""

  const handleExternalLink = () => {
    if (news.url) {
      window.open(news.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${sourceBadgeInfo.color} text-xs font-medium`}>{sourceBadgeInfo.name}</Badge>
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

          <DialogTitle className="text-2xl font-bold leading-tight mb-4">{String(news.title || "")}</DialogTitle>

          <DialogDescription className="sr-only">뉴스 기사 상세 내용을 표시하는 모달입니다.</DialogDescription>
        </DialogHeader>

        {/* 이미지 영역 - 향상된 처리 */}
        {hasValidImage && (
          <div className="mb-6">
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              {!imageError ? (
                <>
                  <img
                    src={normalizedImageUrl || "/placeholder.svg"}
                    alt={String(news.title || "뉴스 이미지")}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    loading="lazy"
                    onLoad={() => {
                      setImageLoaded(true)
                    }}
                    onError={() => {
                      setImageError(true)
                    }}
                  />

                  {/* 로딩 스피너 */}
                  {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
          </div>
        )}

        {/* 메타 정보 */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(String(news.published_at || news.created_at))}</span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>{String(news.source || "알 수 없음")}</span>
          </div>

          {news.reading_time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{Number(news.reading_time)} 분 읽기</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{Number(news.view_count || 0).toLocaleString()} 조회</span>
          </div>

          {news.location && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">📍 {String(news.location)}</span>
            </div>
          )}
        </div>

        {/* 요약 */}
        {news.summary && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">📝 요약</h3>
            <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              {String(news.summary)}
            </p>
          </div>
        )}

        {/* 본문 */}
        {news.content && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">📄 본문</h3>
            <div className="prose max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{String(news.content)}</div>
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

        {/* 액션 버튼 */}
        <div className="flex gap-3 pt-4 border-t">
          {news.url && (
            <Button onClick={handleExternalLink} className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              원문 보기
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
