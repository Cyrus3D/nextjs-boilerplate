"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ExternalLink, Calendar, User, Tag } from "lucide-react"
import { NewsDetailModal } from "./news-detail-modal"
import { incrementNewsViewCount } from "@/lib/admin-news-actions"

interface NewsCardProps {
  news: {
    id: number
    title: string
    summary?: string
    content: string
    author?: string | null
    source_url?: string | null
    image_url?: string | null
    published_at: string
    view_count?: number
    is_featured?: boolean
    is_active?: boolean
    original_language?: string
    is_translated?: boolean
    category?: {
      id: number
      name: string
      color_class?: string
    } | null
    tags?: Array<{
      id: number
      name: string
    }>
  }
}

export default function NewsCard({ news }: NewsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentViewCount, setCurrentViewCount] = useState(Number(news.view_count) || 0)
  const [imageError, setImageError] = useState(false)

  // 안전한 기본값 설정
  const safeNews = {
    id: Number(news.id),
    title: String(news.title || "제목 없음"),
    summary: String(news.summary || news.content?.substring(0, 150) + "..." || "요약 정보가 없습니다."),
    content: String(news.content || "내용 없음"),
    author: news.author ? String(news.author) : null,
    source_url: news.source_url ? String(news.source_url) : null,
    image_url: news.image_url ? String(news.image_url) : null,
    published_at: String(news.published_at || new Date().toISOString()),
    view_count: Number(news.view_count) || 0,
    is_featured: Boolean(news.is_featured),
    is_active: Boolean(news.is_active),
    is_translated: Boolean(news.is_translated),
    original_language: String(news.original_language || "ko"),
    category: news.category || null,
    tags: Array.isArray(news.tags) ? news.tags : [],
  }

  const handleReadMore = async () => {
    setIsModalOpen(true)

    // 조회수 증가
    try {
      await incrementNewsViewCount(safeNews.id)
      setCurrentViewCount((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to increment view count:", error)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "날짜 정보 없음"
      }
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      console.error("Date formatting error:", error)
      return "날짜 정보 없음"
    }
  }

  const formatViewCount = (count: number) => {
    try {
      if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`
      }
      return count.toLocaleString()
    } catch (error) {
      return "0"
    }
  }

  return (
    <>
      <Card
        className={`h-full flex flex-col hover:shadow-lg transition-shadow duration-200 ${safeNews.is_featured ? "ring-2 ring-blue-500" : ""}`}
      >
        {/* 이미지 섹션 */}
        {safeNews.image_url && !imageError && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={safeNews.image_url || "/placeholder.svg"}
              alt={safeNews.title}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {safeNews.is_featured && (
              <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600">추천</Badge>
            )}
            {safeNews.is_translated && (
              <Badge variant="outline" className="absolute top-2 right-2 bg-white/90">
                번역됨
              </Badge>
            )}
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">{safeNews.title}</CardTitle>
            {safeNews.category && (
              <Badge variant="secondary" className={safeNews.category.color_class || ""}>
                {safeNews.category.name}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* 요약 */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{safeNews.summary}</p>

          {/* 태그 */}
          {safeNews.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {safeNews.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {safeNews.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{safeNews.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* 메타 정보 */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{formatViewCount(currentViewCount)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(safeNews.published_at)}</span>
              </div>
            </div>
            {safeNews.original_language && (
              <Badge variant="outline" className="text-xs">
                {safeNews.original_language.toUpperCase()}
              </Badge>
            )}
          </div>

          {/* 작성자 */}
          {safeNews.author && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <User className="h-3 w-3" />
              <span>{safeNews.author}</span>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-2 mt-auto">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleReadMore}>
              자세히 보기
            </Button>
            {safeNews.source_url && (
              <Button variant="ghost" size="sm" onClick={() => window.open(safeNews.source_url!, "_blank")}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 상세 모달 */}
      <NewsDetailModal news={safeNews} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
