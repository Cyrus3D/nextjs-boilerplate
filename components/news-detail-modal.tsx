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
  news: NewsArticle | null
}

export default function NewsDetailModal({ isOpen, onClose, news }: NewsDetailModalProps) {
  // Early return if news is null or undefined
  if (!news) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>뉴스를 찾을 수 없습니다</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-muted-foreground">요청하신 뉴스를 찾을 수 없습니다.</p>
            <Button onClick={onClose} className="mt-4">
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "날짜 없음"

    try {
      const date = new Date(String(dateString))
      if (isNaN(date.getTime())) return "잘못된 날짜"

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

  const formatContent = (content: string | null | undefined) => {
    const safeContent = String(content || "내용이 없습니다.")
    return safeContent.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph || "\u00A0"} {/* Non-breaking space for empty paragraphs */}
      </p>
    ))
  }

  const safeTitle = String(news.title || "제목 없음")
  const safeSummary = String(news.summary || "")
  const safeContent = String(news.content || "내용이 없습니다.")
  const safeAuthor = news.author ? String(news.author) : null
  const safeSourceUrl = news.source_url ? String(news.source_url) : null
  const safeImageUrl = news.image_url ? String(news.image_url) : null
  const safePublishedAt = String(news.published_at || "")
  const safeViewCount = Number(news.view_count) || 0
  const safeOriginalLanguage = String(news.original_language || "ko")
  const safeIsFeatured = Boolean(news.is_featured)
  const safeIsTranslated = Boolean(news.is_translated)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold leading-tight mb-3">{safeTitle}</DialogTitle>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                {news.category && (
                  <Badge variant="secondary" className={String(news.category.color_class || "")}>
                    {String(news.category.name || "카테고리 없음")}
                  </Badge>
                )}

                {safeIsFeatured && (
                  <Badge variant="default" className="bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    추천
                  </Badge>
                )}

                {safeIsTranslated && <Badge variant="outline">번역됨</Badge>}

                <Badge variant="outline">{safeOriginalLanguage.toUpperCase()}</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(safePublishedAt)}</span>
                </div>

                {safeAuthor && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{safeAuthor}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{safeViewCount.toLocaleString()} 조회</span>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          {safeImageUrl && (
            <div className="mb-6">
              <img
                src={safeImageUrl || "/placeholder.svg"}
                alt={safeTitle}
                className="w-full max-h-96 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
            </div>
          )}

          {safeSummary && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">요약</h3>
              <p className="text-muted-foreground leading-relaxed">{safeSummary}</p>
            </div>
          )}

          <div className="prose prose-sm max-w-none">{formatContent(safeContent)}</div>

          {news.tags && news.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-semibold mb-3">태그</h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag) => (
                  <Badge key={Number(tag.id)} variant="outline">
                    #{String(tag.name || "태그")}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {safeSourceUrl && (
            <div className="mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => window.open(safeSourceUrl, "_blank", "noopener,noreferrer")}
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
