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
      color_class?: string
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
  // 안전한 타입 변환
  const safeNews = {
    id: Number(news.id),
    title: String(news.title || "제목 없음"),
    summary: String(news.summary || "요약 정보가 없습니다."),
    content: String(news.content || "내용 없음"),
    author: news.author ? String(news.author) : null,
    source_url: news.source_url ? String(news.source_url) : null,
    image_url: news.image_url ? String(news.image_url) : null,
    published_at: String(news.published_at || new Date().toISOString()),
    view_count: Number(news.view_count) || 0,
    is_featured: Boolean(news.is_featured),
    is_active: Boolean(news.is_active),
    is_translated: Boolean(news.is_translated),
    original_language: String(news.original_language || "ko"),
    category: news.category || null,
    tags: Array.isArray(news.tags) ? news.tags : [],
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(String(dateString))
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

  const formatViewCount = (count: number) => {
    try {
      const numCount = Number(count)
      return numCount.toLocaleString()
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
                <DialogTitle className="text-xl font-bold leading-tight mb-2">{String(safeNews.title)}</DialogTitle>
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
                      <span>{String(safeNews.author)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" size="sm" onClick={onClose} className="self-end">
                  <X className="h-4 w-4" />
                </Button>
                {safeNews.category && (
                  <Badge variant="secondary" className={String(safeNews.category.color_class || "")}>
                    {String(safeNews.category.name)}
                  </Badge>
                )}
                {safeNews.is_featured && <Badge className="bg-blue-500 hover:bg-blue-600">추천</Badge>}
                {safeNews.is_translated && <Badge variant="outline">번역됨</Badge>}
              </div>
            </div>
          </DialogHeader>

          {/* 이미지 */}
          {safeNews.image_url && (
            <div className="px-6 pt-4">
              <img
                src={String(safeNews.image_url) || "/placeholder.svg"}
                alt={String(safeNews.title)}
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
              {safeNews.summary && String(safeNews.summary) !== "요약 정보가 없습니다." && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">요약</h3>
                  <p className="text-sm leading-relaxed">{String(safeNews.summary)}</p>
                </div>
              )}

              {/* 본문 */}
              <div className="prose prose-sm max-w-none">
                <div className="leading-relaxed whitespace-pre-wrap">{String(safeNews.content)}</div>
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
                      <Badge key={Number(tag.id)} variant="outline">
                        {String(tag.name)}
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
                    <span className="text-sm">원본 언어: {String(safeNews.original_language).toUpperCase()}</span>
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
                <Button onClick={() => window.open(String(safeNews.source_url), "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  원문 보기
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
