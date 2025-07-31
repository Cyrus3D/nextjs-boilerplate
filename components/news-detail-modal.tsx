"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Calendar, User, Eye } from "lucide-react"

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
      color_class: string
    } | null
    tags: Array<{
      id: number
      name: string
    }>
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
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

              <DialogTitle className="text-xl leading-tight">{news.title}</DialogTitle>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(news.published_at)}</span>
              </div>

              {news.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{news.author}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatViewCount(news.view_count)} 조회</span>
              </div>
            </div>

            {news.source_url && (
              <Button variant="outline" size="sm" onClick={() => window.open(news.source_url!, "_blank")}>
                <ExternalLink className="w-4 h-4 mr-2" />
                원문 보기
              </Button>
            )}
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-6">
          {news.image_url && (
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={news.image_url || "/placeholder.svg"}
                alt={news.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            <div className="text-lg font-medium text-muted-foreground mb-4">{news.summary}</div>

            <div className="whitespace-pre-wrap leading-relaxed">{news.content}</div>
          </div>

          {news.tags && news.tags.length > 0 && (
            <div>
              <Separator className="mb-4" />
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground mr-2">태그:</span>
                {news.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
