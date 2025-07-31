"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, ExternalLink, User, Tag } from "lucide-react"
import { NewsDetailModal } from "./news-detail-modal"

interface NewsCardProps {
  news: {
    id: number
    title: string
    summary?: string
    content: string
    category?: {
      id: number
      name: string
      color_class?: string
    }
    tags?: Array<{
      id: number
      name: string
    }>
    author?: string
    source_url?: string
    image_url?: string
    published_at: string
    view_count?: number
    is_featured?: boolean
    is_active?: boolean
    original_language?: string
    is_translated?: boolean
  }
}

export default function NewsCard({ news }: NewsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  // 안전한 기본값 설정
  const safeNews = {
    ...news,
    view_count: typeof news.view_count === "number" ? news.view_count : 0,
    summary: news.summary || news.content?.substring(0, 150) + "..." || "요약 정보가 없습니다.",
    tags: news.tags || [],
    category: news.category || null,
    author: news.author || null,
    source_url: news.source_url || null,
    image_url: news.image_url || null,
    is_featured: news.is_featured || false,
    is_translated: news.is_translated || false,
    original_language: news.original_language || "ko",
  }

  // 날짜 포맷팅 (안전하게)
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      console.error("Date formatting error:", error)
      return "날짜 정보 없음"
    }
  }

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
        {/* 이미지 섹션 */}
        {safeNews.image_url && !imageError && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={safeNews.image_url || "/placeholder.svg"}
              alt={safeNews.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {safeNews.is_featured && <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">추천</Badge>}
            {safeNews.is_translated && (
              <Badge variant="outline" className="absolute top-2 right-2 bg-white/90">
                번역됨
              </Badge>
            )}
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
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
                <span>{safeNews.view_count.toLocaleString()}</span>
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
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setIsModalOpen(true)}>
              자세히 보기
            </Button>
            {safeNews.source_url && (
              <Button variant="ghost" size="sm" asChild>
                <a href={safeNews.source_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
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
