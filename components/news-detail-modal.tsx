"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, ExternalLink, X } from "lucide-react"

interface NewsDetailModalProps {
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
      color_class?: string
    } | null
    tags: Array<{
      id: number
      name: string
    }>
    original_language?: string
    is_translated?: boolean
  }
  isOpen: boolean
  onClose: () => void
}

export function NewsDetailModal({ news, isOpen, onClose }: NewsDetailModalProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "날짜 정보 없음"
    }
  }

  const formatViewCount = (count: number) => {
    try {
      return count.toLocaleString()
    } catch (error) {
      return "0"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl font-bold leading-tight pr-8">{news.title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(news.published_at)}</span>
            </div>

            {news.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{news.author}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{formatViewCount(news.view_count)} 조회</span>
            </div>

            {news.original_language && (
              <Badge variant="outline" className="text-xs">
                {news.original_language.toUpperCase()}
              </Badge>
            )}

            {news.is_translated && (
              <Badge variant="outline" className="text-xs">
                번역됨
              </Badge>
            )}
          </div>

          {/* 카테고리 및 태그 */}
          <div className="flex flex-wrap items-center gap-2">
            {news.category && (
              <Badge variant="secondary" className={news.category.color_class || ""}>
                {news.category.name}
              </Badge>
            )}

            {news.is_featured && <Badge className="bg-blue-500 hover:bg-blue-600">추천</Badge>}

            {news.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* 이미지 */}
          {news.image_url && (
            <div className="w-full">
              <img
                src={news.image_url || "/placeholder.svg"}
                alt={news.title}
                className="w-full h-auto max-h-96 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
            </div>
          )}

          {/* 요약 */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">요약</h3>
            <p className="text-sm leading-relaxed">{news.summary}</p>
          </div>

          {/* 본문 */}
          <div className="prose prose-sm max-w-none">
            <h3 className="font-semibold mb-3">본문</h3>
            <div className="whitespace-pre-wrap leading-relaxed">{news.content}</div>
          </div>

          {/* 원문 링크 */}
          {news.source_url && (
            <div className="flex justify-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => window.open(news.source_url!, "_blank")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                원문 보기
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
