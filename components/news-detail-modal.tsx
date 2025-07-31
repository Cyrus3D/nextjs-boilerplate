"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, ExternalLink, Eye, Globe, Tag } from "lucide-react"
import type { NewsItem } from "@/types/news"
import { incrementNewsViewCount } from "@/lib/admin-news-actions"
import { useEffect } from "react"

interface NewsDetailModalProps {
  news: NewsItem | null
  isOpen: boolean
  onClose: () => void
}

export default function NewsDetailModal({ news, isOpen, onClose }: NewsDetailModalProps) {
  // Increment view count when modal opens
  useEffect(() => {
    if (isOpen && news?.id) {
      incrementNewsViewCount(news.id)
    }
  }, [isOpen, news?.id])

  if (!news) {
    return null
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "날짜 정보 없음"
    }
  }

  const handleSourceClick = () => {
    if (news.source_url) {
      window.open(news.source_url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold leading-tight mb-3">
                {String(news.title || "제목 없음")}
              </DialogTitle>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(String(news.published_at || news.created_at || ""))}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{String(news.source || "알 수 없음")}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{Number(news.view_count || 0).toLocaleString()} 조회</span>
                </div>

                {news.reading_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Number(news.reading_time)} 분 읽기</span>
                  </div>
                )}
              </div>
            </div>

            {news.source_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSourceClick}
                className="flex items-center gap-2 bg-transparent"
              >
                <ExternalLink className="w-4 h-4" />
                원문 보기
              </Button>
            )}
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Summary */}
            {news.summary && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <h3 className="font-semibold text-blue-900 mb-2">요약</h3>
                <p className="text-blue-800 leading-relaxed">{String(news.summary)}</p>
              </div>
            )}

            {/* Content */}
            {news.content && (
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: String(news.content).replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            )}

            {/* Korean Translation */}
            {news.content_ko && news.content_ko !== news.content && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  한국어 번역
                </h3>
                <div
                  className="text-green-800 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: String(news.content_ko).replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            )}

            {/* AI Analysis */}
            {news.ai_analysis && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-3">AI 분석</h3>
                <div
                  className="text-purple-800 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: String(news.ai_analysis).replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            )}

            {/* Tags */}
            {Array.isArray(news.tags) && news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                {news.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {String(tag)}
                  </Badge>
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <strong>카테고리:</strong> {String(news.category || "일반")}
                </div>
                <div>
                  <strong>언어:</strong> {String(news.language || "알 수 없음")}
                </div>
                {news.author && (
                  <div>
                    <strong>작성자:</strong> {String(news.author)}
                  </div>
                )}
                {news.location && (
                  <div>
                    <strong>지역:</strong> {String(news.location)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
