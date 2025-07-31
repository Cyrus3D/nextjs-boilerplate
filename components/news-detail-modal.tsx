"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, Calendar, User, Eye, Star, X } from "lucide-react"
import type { NewsArticle } from "@/types/news"

interface NewsDetailModalProps {
  isOpen: boolean
  onClose: () => void
  news: NewsArticle
}

export default function NewsDetailModal({ isOpen, onClose, news }: NewsDetailModalProps) {
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

  const formatContent = (content: string) => {
    const safeContent = String(content || "")
    return safeContent.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold leading-tight mb-3">{String(news.title)}</DialogTitle>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                {news.category && (
                  <Badge variant="secondary" className={String(news.category.color_class)}>
                    {String(news.category.name)}
                  </Badge>
                )}

                {news.is_featured && (
                  <Badge variant="default" className="bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    추천
                  </Badge>
                )}

                {news.is_translated && <Badge variant="outline">번역됨</Badge>}

                <Badge variant="outline">{String(news.original_language).toUpperCase()}</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(String(news.published_at))}</span>
                </div>

                {news.author && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{String(news.author)}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{Number(news.view_count).toLocaleString()} 조회</span>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          {news.image_url && (
            <div className="mb-6">
              <img
                src={String(news.image_url) || "/placeholder.svg"}
                alt={String(news.title)}
                className="w-full max-h-96 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
            </div>
          )}

          {news.summary && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">요약</h3>
              <p className="text-muted-foreground leading-relaxed">{String(news.summary)}</p>
            </div>
          )}

          <div className="prose prose-sm max-w-none">{formatContent(String(news.content))}</div>

          {news.tags && news.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-semibold mb-3">태그</h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag) => (
                  <Badge key={Number(tag.id)} variant="outline">
                    #{String(tag.name)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {news.source_url && (
            <div className="mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => window.open(String(news.source_url), "_blank", "noopener,noreferrer")}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                원문 보기
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
