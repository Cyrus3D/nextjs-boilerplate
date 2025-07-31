"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Eye, ExternalLink, Share2, Bookmark, Zap, Pin } from "lucide-react"
import type { NewsArticle } from "../types/news"

interface NewsDetailModalProps {
  article: NewsArticle | null
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
    교민소식: "bg-pink-100 text-pink-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
  if (!article) return null

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.url || window.location.href,
        })
      } catch (error) {
        console.log("공유 취소됨")
      }
    } else {
      // 폴백: 클립보드에 복사
      navigator.clipboard.writeText(article.url || window.location.href)
      alert("링크가 클립보드에 복사되었습니다.")
    }
  }

  const handleExternalLink = () => {
    if (article.url) {
      window.open(article.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {article.isBreaking && (
              <Badge className="bg-red-500 text-white flex items-center gap-1 animate-pulse">
                <Zap className="h-3 w-3" />
                속보
              </Badge>
            )}
            {article.isPinned && (
              <Badge className="bg-yellow-500 text-white flex items-center gap-1">
                <Pin className="h-3 w-3" />
                고정
              </Badge>
            )}
            <Badge className={getCategoryColor(article.category)} variant="secondary">
              {article.category}
            </Badge>
          </div>

          <DialogTitle className="text-2xl font-bold leading-tight text-left">{article.title}</DialogTitle>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatFullDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount.toLocaleString()} 조회</span>
              </div>
              <span className="font-medium">{article.source}</span>
              {article.author && <span>기자: {article.author}</span>}
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                공유
              </Button>
              <Button size="sm" variant="outline">
                <Bookmark className="h-4 w-4 mr-1" />
                저장
              </Button>
              {article.url && (
                <Button size="sm" variant="outline" onClick={handleExternalLink}>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  원문
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {/* 이미지 */}
          {article.imageUrl && (
            <div className="w-full">
              <img
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-64 sm:h-80 object-cover rounded-lg"
              />
            </div>
          )}

          {/* 요약 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-800">요약</h3>
            <p className="text-gray-700 leading-relaxed">{article.summary}</p>
          </div>

          {/* 본문 */}
          {article.content && (
            <div className="prose max-w-none">
              <h3 className="font-semibold mb-3 text-gray-800">본문</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{article.content}</div>
            </div>
          )}

          {/* 태그 */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">태그</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* 관련 링크 */}
          {article.url && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-800">관련 링크</h3>
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 hover:text-blue-800"
                onClick={handleExternalLink}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                원문 기사 보기
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
