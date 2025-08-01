"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, Clock, Zap, Share2, Bookmark } from "lucide-react"
import type { NewsArticle } from "../types/news"

interface NewsDetailModalProps {
  article: NewsArticle | null
  isOpen: boolean
  onClose: () => void
}

const getCategoryColor = (category: string) => {
  const colors = {
    "현지 뉴스": "bg-blue-100 text-blue-800",
    "교민 업체": "bg-green-100 text-green-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
  if (!article) return null

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 클립보드에 복사되었습니다.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex gap-2 mb-3 flex-wrap">
                {article.isBreaking && (
                  <Badge className="bg-red-100 text-red-800 flex items-center gap-1" variant="secondary">
                    <Zap className="h-3 w-3" />
                    속보
                  </Badge>
                )}
                <Badge className={getCategoryColor(article.category)} variant="secondary">
                  {article.category}
                </Badge>
                {article.readTime && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    <Clock className="h-3 w-3 mr-1" />
                    {article.readTime}분 읽기
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl font-bold leading-tight mb-4">{article.title}</DialogTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 메타 정보 */}
          <div className="flex items-center justify-between text-sm text-gray-600 border-b pb-4">
            <div className="flex items-center space-x-6">
              {article.author && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{article.author}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              {article.source && <div className="text-gray-500">출처: {article.source}</div>}
            </div>
            {article.viewCount && (
              <div className="flex items-center text-gray-500">
                <Eye className="h-4 w-4 mr-1" />
                <span>{article.viewCount.toLocaleString()} 조회</span>
              </div>
            )}
          </div>

          {/* 이미지 */}
          {article.image && (
            <div className="w-full">
              <img
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
            </div>
          )}

          {/* 기사 내용 */}
          <div className="prose max-w-none">
            <div className="text-lg leading-relaxed whitespace-pre-line">{article.content}</div>
          </div>

          {/* 태그 */}
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-center gap-4 pt-4 border-t">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              공유하기
            </Button>
            <Button variant="outline">
              <Bookmark className="h-4 w-4 mr-2" />
              북마크
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
