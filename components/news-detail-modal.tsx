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
  // 날짜 포맷팅
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold leading-tight mb-2">{news.title}</DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(news.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{news.view_count.toLocaleString()} 조회</span>
                  </div>
                  {news.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{news.author}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {news.category && (
                  <Badge variant="secondary" className={news.category.color_class || ""}>
                    {news.category.name}
                  </Badge>
                )}
                {news.is_featured && <Badge className="bg-red-500 hover:bg-red-600">추천</Badge>}
                {news.is_translated && <Badge variant="outline">번역됨</Badge>}
              </div>
            </div>
          </DialogHeader>

          {/* 이미지 */}
          {news.image_url && (
            <div className="px-6 pt-4">
              <img
                src={news.image_url || "/placeholder.svg"}
                alt={news.title}
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
              {news.summary && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">요약</h3>
                  <p className="text-sm leading-relaxed">{news.summary}</p>
                </div>
              )}

              {/* 본문 */}
              <div className="prose prose-sm max-w-none">
                <div
                  className="leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              </div>

              {/* 태그 */}
              {news.tags && news.tags.length > 0 && (
                <div className="pt-4 border-t">
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

              {/* 언어 정보 */}
              {news.original_language && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">원본 언어: {news.original_language.toUpperCase()}</span>
                    {news.is_translated && (
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
              {news.source_url && (
                <Button asChild>
                  <a
                    href={news.source_url}
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
