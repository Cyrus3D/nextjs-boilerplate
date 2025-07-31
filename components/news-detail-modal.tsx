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

  const getSourceBadgeInfo = (sourceUrl: string, source: string) => {
    if (!sourceUrl && !source) return { name: "기타", color: "bg-gray-200 text-gray-800" }

    // URL to Korean pronunciation and color mapping
    const urlToBadgeMap: { [key: string]: { name: string; color: string } } = {
      // Thai news sources - Blue tones
      "thaipbs.or.th": { name: "타이피비에스", color: "bg-blue-500 text-white" },
      "bangkokpost.com": { name: "방콕포스트", color: "bg-blue-600 text-white" },
      "nationthailand.com": { name: "네이션", color: "bg-blue-400 text-white" },
      "thairath.co.th": { name: "타이랏", color: "bg-red-500 text-white" },
      "khaosod.co.th": { name: "카오솟", color: "bg-orange-500 text-white" },
      "matichon.co.th": { name: "마티촌", color: "bg-green-600 text-white" },
      "dailynews.co.th": { name: "데일리뉴스", color: "bg-purple-500 text-white" },
      "posttoday.com": { name: "포스트투데이", color: "bg-indigo-500 text-white" },
      "manager.co.th": { name: "매니저", color: "bg-teal-500 text-white" },
      "sanook.com": { name: "사누크", color: "bg-pink-500 text-white" },
      "kapook.com": { name: "카푸크", color: "bg-cyan-500 text-white" },
      "mthai.com": { name: "엠타이", color: "bg-lime-500 text-white" },
      "thansettakij.com": { name: "탄셋타킷", color: "bg-emerald-500 text-white" },
      "prachachat.net": { name: "프라차챗", color: "bg-violet-500 text-white" },
      "workpointnews.com": { name: "워크포인트", color: "bg-rose-500 text-white" },
      "ch3plus.com": { name: "채널3", color: "bg-amber-500 text-white" },
      "tnn.co.th": { name: "티엔엔", color: "bg-sky-500 text-white" },
      "springnews.co.th": { name: "스프링뉴스", color: "bg-green-500 text-white" },
      "amarintv.com": { name: "아마린", color: "bg-red-600 text-white" },
      "newsk.net": { name: "뉴스케이", color: "bg-slate-600 text-white" },

      // Korean news sources - Red/Orange tones
      "chosun.com": { name: "조선일보", color: "bg-red-700 text-white" },
      "joongang.co.kr": { name: "중앙일보", color: "bg-blue-700 text-white" },
      "donga.com": { name: "동아일보", color: "bg-green-700 text-white" },
      "hani.co.kr": { name: "한겨레", color: "bg-green-800 text-white" },
      "khan.co.kr": { name: "경향신문", color: "bg-purple-700 text-white" },
      "mk.co.kr": { name: "매일경제", color: "bg-orange-600 text-white" },
      "hankyung.com": { name: "한국경제", color: "bg-blue-800 text-white" },
      "ytn.co.kr": { name: "와이티엔", color: "bg-red-600 text-white" },
      "sbs.co.kr": { name: "에스비에스", color: "bg-blue-500 text-white" },
      "kbs.co.kr": { name: "케이비에스", color: "bg-blue-600 text-white" },
      "mbc.co.kr": { name: "엠비씨", color: "bg-red-500 text-white" },
      "jtbc.co.kr": { name: "제이티비씨", color: "bg-orange-500 text-white" },
      "news1.kr": { name: "뉴스원", color: "bg-indigo-600 text-white" },
      "newsis.com": { name: "뉴시스", color: "bg-teal-600 text-white" },
      "yonhapnews.co.kr": { name: "연합뉴스", color: "bg-slate-700 text-white" },

      // International sources - Dark tones
      "cnn.com": { name: "씨엔엔", color: "bg-red-800 text-white" },
      "bbc.com": { name: "비비씨", color: "bg-red-900 text-white" },
      "reuters.com": { name: "로이터", color: "bg-orange-700 text-white" },
      "ap.org": { name: "에이피", color: "bg-blue-900 text-white" },
      "bloomberg.com": { name: "블룸버그", color: "bg-black text-white" },
      "wsj.com": { name: "월스트리트", color: "bg-gray-800 text-white" },
      "nytimes.com": { name: "뉴욕타임스", color: "bg-gray-900 text-white" },
      "washingtonpost.com": { name: "워싱턴포스트", color: "bg-slate-800 text-white" },
      "theguardian.com": { name: "가디언", color: "bg-blue-800 text-white" },
      "ft.com": { name: "파이낸셜", color: "bg-pink-800 text-white" },
      "economist.com": { name: "이코노미스트", color: "bg-red-800 text-white" },
      "time.com": { name: "타임", color: "bg-red-700 text-white" },
      "newsweek.com": { name: "뉴스위크", color: "bg-blue-700 text-white" },
      "forbes.com": { name: "포브스", color: "bg-green-800 text-white" },
      "techcrunch.com": { name: "테크크런치", color: "bg-green-600 text-white" },
      "wired.com": { name: "와이어드", color: "bg-black text-white" },
      "engadget.com": { name: "엔가젯", color: "bg-blue-600 text-white" },
      "theverge.com": { name: "더버지", color: "bg-purple-600 text-white" },
      "arstechnica.com": { name: "아르스테크니카", color: "bg-orange-600 text-white" },
    }

    // Extract domain from URL
    let domain = ""
    if (sourceUrl) {
      try {
        const url = new URL(sourceUrl.startsWith("http") ? sourceUrl : `https://${sourceUrl}`)
        domain = url.hostname.replace("www.", "")
      } catch {
        // If URL parsing fails, try to extract domain from string
        const match = sourceUrl.match(/(?:https?:\/\/)?(?:www\.)?([^/\s]+)/i)
        domain = match ? match[1] : ""
      }
    }

    // Check if we have a mapping for this domain
    if (domain && urlToBadgeMap[domain]) {
      return urlToBadgeMap[domain]
    }

    // Fallback: use source name and truncate to 4 characters with default color
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

  // 유효한 이미지 URL이 있는지 확인
  const hasValidImage = isValidImageUrl(news.image_url)
  const normalizedImageUrl = hasValidImage ? normalizeImageUrl(String(news.image_url)) : ""

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-2">
              {/* Source Badge - First with unique color */}
              <Badge className={`${sourceBadgeInfo.color} text-xs font-medium`}>{sourceBadgeInfo.name}</Badge>

              {/* Category Badge - Second */}
              <Badge className={`${getCategoryColor(String(news.category))} text-xs`}>{String(news.category)}</Badge>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Globe className="w-3 h-3" />
                <span>{String(news.language || "ko").toUpperCase()}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <DialogTitle className="text-xl font-bold leading-tight pr-8">{String(news.title || "")}</DialogTitle>

          <DialogDescription className="sr-only">뉴스 기사의 상세 내용을 보여주는 모달입니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 이미지 영역 - 향상된 이미지 처리 */}
          {hasValidImage && (
            <div className="w-full h-64 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
              {!imageError ? (
                <>
                  <img
                    src={normalizedImageUrl || "/placeholder.svg"}
                    alt={String(news.title || "뉴스 이미지")}
                    className={`w-full h-full object-cover rounded-lg transition-all duration-300 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    crossOrigin="anonymous"
                    onLoad={() => {
                      console.log("✅ Modal image loaded successfully:", normalizedImageUrl)
                      setImageLoaded(true)
                    }}
                    onError={(e) => {
                      console.error("❌ Modal image failed to load:", normalizedImageUrl)
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
                <div className="text-center text-gray-500 flex flex-col items-center justify-center">
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-sm">이미지를 불러올 수 없습니다</div>
                </div>
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 border-b pb-4">
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
          </div>

          {/* Summary */}
          {news.summary && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📝 요약</h3>
              <p className="text-blue-800 leading-relaxed">{String(news.summary)}</p>
            </div>
          )}

          {/* Content */}
          {news.content && (
            <div className="prose max-w-none">
              <h3 className="font-semibold text-gray-900 mb-3">📄 본문</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{String(news.content)}</div>
            </div>
          )}

          {/* AI Analysis */}
          {news.ai_analysis && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">🤖 AI 분석</h3>
              <p className="text-purple-800 leading-relaxed">{String(news.ai_analysis)}</p>
            </div>
          )}

          {/* Tags */}
          {Array.isArray(news.tags) && news.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🏷️ 태그</h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    #{String(tag)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {news.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold">📍 위치:</span>
              <span>{String(news.location)}</span>
            </div>
          )}

          {/* External Link */}
          {news.url && (
            <div className="flex justify-center pt-4 border-t">
              <Button
                onClick={() => window.open(String(news.url), "_blank", "noopener,noreferrer")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                원문 보기
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
