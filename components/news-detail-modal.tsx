"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, Eye, Globe, ExternalLink, Share2, X, User, MapPin } from "lucide-react"
import type { NewsItem } from "@/types/news"

interface NewsDetailModalProps {
  news: NewsItem | null
  isOpen: boolean
  onClose: () => void
}

export default function NewsDetailModal({ news, isOpen, onClose }: NewsDetailModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Reset image states when news changes
  useEffect(() => {
    if (news) {
      setImageLoaded(false)
      setImageError(false)
    }
  }, [news])

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: String(news.title),
          text: String(news.summary),
          url: String(news.source_url || window.location.href),
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(String(news.source_url || window.location.href))
        alert("링크가 클립보드에 복사되었습니다!")
      } catch (error) {
        console.log("Error copying to clipboard:", error)
      }
    }
  }

  const handleExternalLink = () => {
    if (news.source_url) {
      window.open(String(news.source_url), "_blank", "noopener,noreferrer")
    }
  }

  const sourceBadgeInfo = getSourceBadgeInfo(String(news.source_url || ""), String(news.source || ""))

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

  // 유효한 이미지 URL이 있는지 확인
  const hasValidImage = isValidImageUrl(news.image_url)
  const normalizedImageUrl = hasValidImage ? normalizeImageUrl(String(news.image_url)) : ""

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`${sourceBadgeInfo.color} text-xs font-medium`}>{sourceBadgeInfo.name}</Badge>
                <Badge className={`${getCategoryColor(String(news.category))} text-xs`}>{String(news.category)}</Badge>
                <Badge variant="outline" className="text-xs">
                  {String(news.language || "ko").toUpperCase()}
                </Badge>
              </div>
              <DialogTitle className="text-xl md:text-2xl font-bold leading-tight mb-2">
                {String(news.title)}
              </DialogTitle>
              <DialogDescription className="sr-only">뉴스 기사 상세 내용</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {news.source_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExternalLink}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <ExternalLink className="w-4 h-4" />
                  원문
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-1 bg-transparent"
              >
                <Share2 className="w-4 h-4" />
                공유
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {/* Image Section */}
            <div className="w-full h-64 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
              {hasValidImage && !imageError ? (
                <>
                  <img
                    src={normalizedImageUrl || "/placeholder.svg?height=200&width=400"}
                    alt={String(news.title || "뉴스 이미지")}
                    className={`w-full h-full object-cover rounded-lg transition-all duration-300 ${
                      imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
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
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="뉴스 이미지 플레이스홀더"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(String(news.published_at || news.created_at))}</span>
              </div>
              {news.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{String(news.author)}</span>
                </div>
              )}
              {news.reading_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{Number(news.reading_time)} 분 읽기</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{Number(news.view_count || 0).toLocaleString()} 조회</span>
              </div>
              {news.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{String(news.location)}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Summary */}
            {news.summary && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📋 요약</h3>
                <p className="text-blue-800 leading-relaxed">{String(news.summary)}</p>
              </div>
            )}

            {/* AI Analysis */}
            {news.ai_analysis && (
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🤖 AI 분석</h3>
                <p className="text-purple-800 leading-relaxed">{String(news.ai_analysis)}</p>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-sm max-w-none">
              <h3 className="font-semibold text-gray-900 mb-3">📰 기사 내용</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {String(news.content_ko || news.content || "기사 내용이 없습니다.")}
              </div>
            </div>

            {/* Tags */}
            {Array.isArray(news.tags) && news.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🏷️ 태그</h3>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{String(tag)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Source Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📰 출처 정보</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{String(news.source || "알 수 없음")}</span>
                </div>
                {news.source_url && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <a
                      href={String(news.source_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {String(news.source_url)}
                    </a>
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  게시일: {formatDate(String(news.created_at))}
                  {news.updated_at && news.updated_at !== news.created_at && (
                    <span> • 수정일: {formatDate(String(news.updated_at))}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
