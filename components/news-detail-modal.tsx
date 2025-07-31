"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, User, Tag } from "lucide-react"
import { CardImage } from "@/components/ui/card"
import type { NewsItem } from "@/types/news"

interface NewsDetailModalProps {
  news: NewsItem | null
  isOpen: boolean
  onClose: () => void
}

export function NewsDetailModal({ news, isOpen, onClose }: NewsDetailModalProps) {
  if (!news) return null

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold leading-tight">{news.title}</DialogTitle>
          <DialogDescription className="sr-only">뉴스 상세 내용을 확인할 수 있습니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {news.published_at && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(news.published_at)}</span>
              </div>
            )}
            {news.source && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{news.source}</span>
              </div>
            )}
            {news.category && (
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <Badge variant="secondary">{news.category}</Badge>
              </div>
            )}
          </div>

          {/* 이미지 */}
          {validImageUrl && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
              <CardImage
                src={validImageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
                fallback="/placeholder.svg?height=256&width=400"
              />
            </div>
          )}

          {/* 요약 */}
          {news.summary && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">요약</h3>
              <p className="text-sm leading-relaxed">{news.summary}</p>
            </div>
          )}

          {/* 본문 */}
          {news.content && (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">{news.content}</div>
            </div>
          )}

          {/* 원문 링크 */}
          {news.url && (
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(news.url, "_blank", "noopener,noreferrer")}
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
