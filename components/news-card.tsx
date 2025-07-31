"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ExternalLink, Calendar, User } from "lucide-react"
import { NewsDetailModal } from "./news-detail-modal"
import { incrementNewsViewCount } from "@/lib/admin-news-actions"

interface NewsCardProps {
  news: {
    id: number
    title: string
    summary: string
    content: string
    author?: string | null
    source_url?: string | null
    image_url?: string | null
    published_at: string
    view_count: number
    is_featured: boolean
    category?: {
      id: number
      name: string
      color_class: string
    } | null
    tags: Array<{
      id: number
      name: string
    }>
  }
}

export function NewsCard({ news }: NewsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentViewCount, setCurrentViewCount] = useState(news.view_count || 0)

  const handleReadMore = async () => {
    setIsModalOpen(true)

    // 조회수 증가
    try {
      await incrementNewsViewCount(news.id)
      setCurrentViewCount((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to increment view count:", error)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "날짜 없음"
    }
  }

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <>
      <Card
        className={`h-full transition-all duration-200 hover:shadow-lg ${news.is_featured ? "ring-2 ring-blue-500" : ""}`}
      >
        {news.image_url && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={news.image_url || "/placeholder.svg"}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            {news.category && (
              <Badge variant="secondary" className={news.category.color_class}>
                {news.category.name}
              </Badge>
            )}
            {news.is_featured && (
              <Badge variant="default" className="bg-blue-500 text-white">
                추천
              </Badge>
            )}
          </div>

          <CardTitle className="text-lg leading-tight line-clamp-2">{news.title}</CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{news.summary}</p>

          {news.tags && news.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {news.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {news.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{news.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(news.published_at)}</span>
              </div>

              {news.author && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{news.author}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{formatViewCount(currentViewCount)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="default" size="sm" onClick={handleReadMore} className="flex-1">
              자세히 보기
            </Button>

            {news.source_url && (
              <Button variant="outline" size="sm" onClick={() => window.open(news.source_url!, "_blank")}>
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <NewsDetailModal news={news} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
