"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, Eye, Globe, X } from "lucide-react"
import type { NewsItem } from "../types/news"

interface NewsDetailModalProps {
  news: NewsItem | null
  isOpen: boolean
  onClose: () => void
}

const getCategoryColor = (category: string) => {
  const colors = {
    정치: "bg-red-100 text-red-800",
    경제: "bg-blue-100 text-blue-800",
    사회: "bg-green-100 text-green-800",
    문화: "bg-purple-100 text-purple-800",
    스포츠: "bg-orange-100 text-orange-800",
    국제: "bg-indigo-100 text-indigo-800",
    생활: "bg-pink-100 text-pink-800",
    기술: "bg-cyan-100 text-cyan-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
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

export default function NewsDetailModal({ news, isOpen, onClose }: NewsDetailModalProps) {
  if (!news) return null

  // 안전한 기본값 설정
  const safeNews = {
    ...news,
    title: news.title || "제목 없음",
    summary: news.summary || "요약 정보가 없습니다.",
    content: news.content || "내용 정보가 없습니다.",
    category: news.category || "기타",
    tags: Array.isArray(news.tags) ? news.tags : [],
    viewCount: typeof news.viewCount === "number" ? news.viewCount : 0,
    source: news.source || "출처 불명",
    publishedAt: news.publishedAt || new Date().toISOString(),
    originalUrl: news.originalUrl || "#",
    imageUrl: news.imageUrl || "",
  }

  const handleExternalLink = () => {
    if (safeNews.originalUrl && safeNews.originalUrl !== "#") {
      window.open(safeNews.originalUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex gap-2 mb-3">
                <Badge className={getCategoryColor(safeNews.category)} variant="secondary">
                  {safeNews.category}
                </Badge>
              </div>
              <DialogTitle className="text-xl md:text-2xl leading-tight">{safeNews.title}</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(safeNews.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{safeNews.source}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{safeNews.viewCount.toLocaleString()} 조회</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 이미지 */}
          <div className="relative">
            <img
              src={safeNews.imageUrl || "/placeholder.svg?height=400&width=800"}
              alt={safeNews.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=400&width=800"
              }}
            />
          </div>

          {/* 요약 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-800">요약</h3>
            <p className="text-gray-700 leading-relaxed">{safeNews.summary}</p>
          </div>

          {/* 본문 */}
          <div className="prose max-w-none">
            <h3 className="font-semibold mb-3 text-gray-800">본문</h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">{safeNews.content}</div>
          </div>

          {/* 태그 */}
          {safeNews.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-gray-800">태그</h3>
              <div className="flex flex-wrap gap-2">
                {safeNews.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 원본 링크 */}
          <div className="border-t pt-4">
            <Button
              onClick={handleExternalLink}
              className="w-full md:w-auto"
              variant="default"
              disabled={!safeNews.originalUrl || safeNews.originalUrl === "#"}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              원본 기사 보기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
