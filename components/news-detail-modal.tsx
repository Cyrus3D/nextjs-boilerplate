"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Calendar, ExternalLink, User, Tag, Globe } from "lucide-react"

interface NewsDetailModalProps {
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
    view_count: number
    is_featured?: boolean
    is_active?: boolean
    original_language?: string
    is_translated?: boolean
  }
  isOpen: boolean
  onClose: () => void
}

export function NewsDetailModal({ news, isOpen, onClose }: NewsDetailModalProps) {
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("ko-KR", {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl font-bold leading-tight flex-1">{news.title}</DialogTitle>
            <div className="flex gap-2 flex-shrink-0">
              {news.is_featured && <Badge className="bg-red-500 hover:bg-red-600">추천</Badge>}
              {news.category && (
                <Badge variant="secondary" className={news.category.color_class || ""}>
                  {news.category.name}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* 이미지 */}
            {news.image_url && (
              <div className="relative">
                <img
                  src={news.image_url || "/placeholder.svg"}
                  alt={news.title}
                  className="w-full max-h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            )}

            {/* 메타 정보 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-4">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{news.view_count.toLocaleString()} 조회</span>
              </div>
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
              {news.original_language && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{news.original_language.toUpperCase()}</span>
                  {news.is_translated && <Badge variant="outline">번역됨</Badge>}
                </div>
              )}
            </div>

            {/* 요약 */}
            {news.summary && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">요약</h3>
                <p className="text-sm">{news.summary}</p>
              </div>
            )}

            {/* 본문 */}
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">{news.content}</div>
            </div>

            {/* 태그 */}
            {news.tags && news.tags.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">태그</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 원본 링크 */}
            {news.source_url && (
              <div className="border-t pt-4">
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <a href={news.source_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    원본 기사 보기
                  </a>
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
