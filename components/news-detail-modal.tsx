"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Calendar, ExternalLink, User, Tag, Globe, X } from "lucide-react"

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
    } | null
    tags?: Array<{
      id: number
      name: string
    }>
    author?: string | null
    source_url?: string | null
    image_url?: string | null
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
  // 안전한 타입 변환
  const safeNews = {
    id: Number(news.id),
    title: String(news.title || "제목 없음"),
    summary: String(news.summary || "요약 정보가 없습니다."),
    content: String(news.content || "내용 없음"),
    view_count: Number(news.view_count) || 0,
    tags: Array.isArray(news.tags) ? news.tags : [],
    category: news.category || null,
    author: news.author ? String(news.author) : null,
    source_url: news.source_url ? String(news.source_url) : null,
    image_url: news.image_url ? String(news.image_url) : null,
    published_at: String(news.published_at || new Date().toISOString()),
    is_featured: Boolean(news.is_featured),
    is_translated: Boolean(news.is_translated),
    original_language: String(news.original_language || "ko"),
    is_active: Boolean(news.is_active),
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "날짜 정보 없음"
      }
      return date.toLocaleDateString("ko-KR", {
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

  // 조회수 포맷팅
  const formatViewCount = (count: number) => {
    try {
      return count.toLocaleString()
    } catch (error) {
      return "0"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold leading-tight mb-2">{safeNews.title}</DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(safeNews.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatViewCount(safeNews.view_count)} 조회</span>
                  </div>
                  {safeNews.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{safeNews.author}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" size="sm" onClick={onClose} className="self-end">
                  <X className="h-4 w-4" />
                </Button>
                {safeNews.category && (
                  <Badge variant="secondary" className={safeNews.category.color_class || ""}>
                    {safeNews.category.name}
                  </Badge>
                )}
                {safeNews.is_featured && <Badge className="bg-red-500 hover:bg-red-600">추천</Badge>}
                {safeNews.is_translated && <Badge variant="outline">번역됨</Badge>}
              </div>
            </div>
          </DialogHeader>

          {/* 이미지 */}
          {safeNews.image_url && (
            <div className="px-6 pt-4">
              <img
                src={safeNews.image_url || "/placeholder.svg"}
                alt={safeNews.title}
                className="w-full max-h-64 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
            </div>
          )}

          {/* 내용 */}
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              {/* 요약 */}
              {safeNews.summary && safeNews.summary !== "요약 정보가 없습니다." && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">요약</h3>
                  <p className="text-sm leading-relaxed">{safeNews.summary}</p>
                </div>
              )}

              {/* 본문 */}
              <div className="prose prose-sm max-w-none">
                <div className="leading-relaxed whitespace-pre-wrap">{safeNews.content}</div>
              </div>

              {/* 태그 */}
              {safeNews.tags.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">태그</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {safeNews.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 언어 정보 */}
              {safeNews.original_language && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">원본 언어: {safeNews.original_language.toUpperCase()}</span>
                    {safeNews.is_translated && (
                      <Badge variant="outline" className="ml-2">
                        AI 번역됨
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* 푸터 */}
          <div className="p-6 pt-4 border-t bg-muted/20">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={onClose}>
                닫기
              </Button>
              {safeNews.source_url && (
                <Button asChild>
                  <a
                    href={safeNews.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    원문 보기
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
