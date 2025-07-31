"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, Globe } from "lucide-react"
import type { NewsItem } from "@/types/news"

interface NewsCardProps {
  news: NewsItem
  onDetailClick: (news: NewsItem) => void
}

export default function NewsCard({ news, onDetailClick }: NewsCardProps) {
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
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "날짜 정보 없음"
    }
  }

  const getSourceBadgeFromUrl = (sourceUrl: string, source: string) => {
    if (!sourceUrl && !source) return "기타"

    // URL to Korean pronunciation mapping
    const urlToBadgeMap: { [key: string]: string } = {
      // Thai news sources
      "thaipbs.or.th": "타이피비에스",
      "bangkokpost.com": "방콕포스트",
      "nationthailand.com": "네이션",
      "thairath.co.th": "타이랏",
      "khaosod.co.th": "카오솟",
      "matichon.co.th": "마티촌",
      "dailynews.co.th": "데일리뉴스",
      "posttoday.com": "포스트투데이",
      "manager.co.th": "매니저",
      "sanook.com": "사누크",
      "kapook.com": "카푸크",
      "mthai.com": "엠타이",
      "thansettakij.com": "탄셋타킷",
      "prachachat.net": "프라차챗",
      "workpointnews.com": "워크포인트",
      "ch3plus.com": "채널3",
      "tnn.co.th": "티엔엔",
      "springnews.co.th": "스프링뉴스",
      "amarintv.com": "아마린",
      "newsk.net": "뉴스케이",

      // Korean news sources
      "chosun.com": "조선일보",
      "joongang.co.kr": "중앙일보",
      "donga.com": "동아일보",
      "hani.co.kr": "한겨레",
      "khan.co.kr": "경향신문",
      "mk.co.kr": "매일경제",
      "hankyung.com": "한국경제",
      "ytn.co.kr": "와이티엔",
      "sbs.co.kr": "에스비에스",
      "kbs.co.kr": "케이비에스",
      "mbc.co.kr": "엠비씨",
      "jtbc.co.kr": "제이티비씨",
      "news1.kr": "뉴스원",
      "newsis.com": "뉴시스",
      "yonhapnews.co.kr": "연합뉴스",

      // International sources
      "cnn.com": "씨엔엔",
      "bbc.com": "비비씨",
      "reuters.com": "로이터",
      "ap.org": "에이피",
      "bloomberg.com": "블룸버그",
      "wsj.com": "월스트리트",
      "nytimes.com": "뉴욕타임스",
      "washingtonpost.com": "워싱턴포스트",
      "theguardian.com": "가디언",
      "ft.com": "파이낸셜",
      "economist.com": "이코노미스트",
      "time.com": "타임",
      "newsweek.com": "뉴스위크",
      "forbes.com": "포브스",
      "techcrunch.com": "테크크런치",
      "wired.com": "와이어드",
      "engadget.com": "엔가젯",
      "theverge.com": "더버지",
      "arstechnica.com": "아르스테크니카",
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

    // Fallback: use source name and truncate to 4 characters
    if (source) {
      const koreanChars = source.match(/[가-힣]/g)
      if (koreanChars && koreanChars.length > 0) {
        return koreanChars.slice(0, 4).join("")
      }

      const words = source.split(/\s+/)
      return words
        .map((word) => word.charAt(0).toUpperCase())
        .join("")
        .slice(0, 4)
    }

    return "기타"
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardHeader className="pb-3" onClick={() => onDetailClick(news)}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {/* Source Badge - First */}
            <Badge className="bg-gray-200 text-gray-800 text-xs">
              {getSourceBadgeFromUrl(String(news.source_url || ""), String(news.source || ""))}
            </Badge>

            {/* Category Badge - Second */}
            <Badge className={`${getCategoryColor(String(news.category))} text-xs`}>{String(news.category)}</Badge>

            {/* Featured Badge - Hidden */}
            {/* {news.is_featured && (
              <Badge className="bg-yellow-500 text-white text-xs">
                <Star className="w-3 h-3 mr-1" />
                추천
              </Badge>
            )} */}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Globe className="w-3 h-3" />
            <span>{String(news.language || "ko").toUpperCase()}</span>
          </div>
        </div>

        <h3 className="font-semibold text-lg leading-tight group-hover:text-blue-600 transition-colors mb-2 h-[3rem] overflow-hidden line-clamp-2">
          {String(news.title || "")}
        </h3>

        {/* Image Area */}
        <div className="h-[7.5rem] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
          {news.image_url ? (
            <img
              src={String(news.image_url) || "/placeholder.svg"}
              alt={String(news.title || "뉴스 이미지")}
              className="w-full h-full object-cover rounded-lg"
              crossOrigin="anonymous"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                const placeholder = target.nextElementSibling as HTMLElement
                if (placeholder) placeholder.style.display = "block"
              }}
            />
          ) : null}
          <div
            className={`text-center text-gray-500 ${news.image_url ? "hidden" : "block"}`}
            style={{ display: news.image_url ? "none" : "block" }}
          >
            <div className="text-2xl mb-1">📷</div>
            <div className="text-xs">이미지 영역</div>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed h-[4.5rem] overflow-hidden line-clamp-3">
          {String(news.summary || "")}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Meta Information */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(String(news.published_at || news.created_at))}</span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="truncate">{String(news.source || "알 수 없음")}</span>
          </div>

          {news.reading_time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{Number(news.reading_time)} 분 읽기</span>
            </div>
          )}

          {news.location && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">📍 {String(news.location)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(news.tags) && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {news.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{String(tag)}
              </Badge>
            ))}
            {news.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{news.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* AI Analysis Preview */}
        {news.ai_analysis && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
            <p className="text-purple-800 text-xs font-medium">🤖 AI 분석: {String(news.ai_analysis)}</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{Number(news.view_count || 0).toLocaleString()} 조회</span>
          </div>
          <span>{formatDate(String(news.created_at))}</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onDetailClick(news)}
          className="w-full bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300"
          variant="outline"
        >
          기사 읽기
        </Button>
      </CardContent>
    </Card>
  )
}
