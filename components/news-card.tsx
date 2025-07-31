"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ExternalLink, Calendar, User, Star } from "lucide-react"
import { incrementNewsViewCount } from "@/lib/admin-news-actions"
import NewsDetailModal from "./news-detail-modal"

interface NewsCardProps {
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
  is_active: boolean
  original_language: string
  is_translated: boolean
  category?: {
    id: number
    name: string
    color_class: string
  } | null
  tags?: Array<{
    id: number
    name: string
  }>
  onViewCountUpdate?: (id: number, newCount: number) => void
}

export default function NewsCard({
  id,
  title,
  summary,
  content,
  author,
  source_url,
  image_url,
  published_at,
  view_count,
  is_featured,
  is_active,
  original_language,
  is_translated,
  category,
  tags = [],
  onViewCountUpdate,
}: NewsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentViewCount, setCurrentViewCount] = useState(Number(view_count) || 0)

  const handleCardClick = async () => {
    try {
      // 조회수 증가
      await incrementNewsViewCount(Number(id))
      const newViewCount = currentViewCount + 1
      setCurrentViewCount(newViewCount)

      // 부모 컴포넌트에 알림
      if (onViewCountUpdate) {
        onViewCountUpdate(Number(id), newViewCount)
      }

      // 모달 열기
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error incrementing view count:", error)
      // 조회수 증가 실패해도 모달은 열기
      setIsModalOpen(true)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(String(dateString))
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return String(dateString)
    }
  }

  const truncateText = (text: string, maxLength = 150) => {
    const safeText = String(text || "")
    return safeText.length > maxLength ? safeText.substring(0, maxLength) + "..." : safeText
  }

  if (!is_active) {
    return null
  }

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full flex flex-col"
        onClick={handleCardClick}
      >
        {image_url && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <img
              src={String(image_url) || "/placeholder.svg"}
              alt={String(title)}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1">{String(title)}</h3>
            {is_featured && <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            {category && (
              <Badge variant="secondary" className={String(category.color_class)}>
                {String(category.name)}
              </Badge>
            )}

            {is_translated && (
              <Badge variant="outline" className="text-xs">
                번역됨
              </Badge>
            )}

            <Badge variant="outline" className="text-xs">
              {String(original_language).toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <p className="text-muted-foreground text-sm mb-4 flex-1">{truncateText(String(summary))}</p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={Number(tag.id)} variant="outline" className="text-xs">
                  #{String(tag.name)}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(String(published_at))}</span>
              </div>

              {author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{String(author)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{currentViewCount.toLocaleString()}</span>
              </div>

              {source_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(String(source_url), "_blank", "noopener,noreferrer")
                  }}
                  title="원문 보기"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <NewsDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        news={{
          id: Number(id),
          title: String(title),
          summary: String(summary),
          content: String(content),
          author: author ? String(author) : null,
          source_url: source_url ? String(source_url) : null,
          image_url: image_url ? String(image_url) : null,
          published_at: String(published_at),
          view_count: currentViewCount,
          is_featured: Boolean(is_featured),
          is_active: Boolean(is_active),
          original_language: String(original_language),
          is_translated: Boolean(is_translated),
          created_at: String(published_at),
          updated_at: String(published_at),
          category,
          tags,
        }}
      />
    </>
  )
}
