"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardImage } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink } from "lucide-react"
import type { NewsItem } from "@/types/news"

interface NewsCardProps {
  news: NewsItem
  onClick?: () => void
}

export function NewsCard({ news, onClick }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      })
    } catch {
      return ""
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

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onClick?.()
  }

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (news.url) {
      window.open(news.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 h-full" onClick={handleCardClick}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {news.source && (
              <Badge variant="outline" className="text-xs">
                {news.source}
              </Badge>
            )}
            {news.category && (
              <Badge variant="secondary" className="text-xs">
                {news.category}
              </Badge>
            )}
          </div>
          {news.published_at && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(news.published_at)}</span>
            </div>
          )}
        </div>

        <CardTitle className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </CardTitle>
      </CardHeader>

      {/* 이미지 영역 */}
      {validImageUrl && (
        <div className="px-4 pb-2">
          <div className="relative w-full h-32 rounded-md overflow-hidden bg-muted">
            <CardImage
              src={validImageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
              fallback="/placeholder.svg?height=128&width=200"
            />
          </div>
        </div>
      )}

      <CardContent className="p-4 pt-2 flex-1 flex flex-col justify-between">
        {news.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">{news.summary}</p>
        )}

        {news.url && (
          <div className="flex justify-end">
            <button
              onClick={handleExternalClick}
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              aria-label="원문 보기"
            >
              <ExternalLink className="h-3 w-3" />
              <span>원문</span>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
