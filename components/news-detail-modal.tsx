"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Eye, Share2, Bookmark, ExternalLink } from "lucide-react"
import type { NewsArticle } from "@/types/news"
import { useState } from "react"

interface NewsDetailModalProps {
  article: NewsArticle | null
  isOpen: boolean
  onClose: () => void
}

export default function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  if (!article) return null

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "현지 뉴스":
        return "bg-blue-100 text-blue-800"
      case "교민 업체":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log("공유 취소됨")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 클립보드에 복사되었습니다!")
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge className={getCategoryColor(article.category)} variant="secondary">
                {article.category}
              </Badge>
              {article.isBreaking && <Badge className="bg-red-600 text-white animate-pulse">속보</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 w-8 p-0">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`h-8 w-8 p-0 ${isBookmarked ? "text-yellow-600" : ""}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              {article.externalUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(article.externalUrl, "_blank")}
                  className="h-8 w-8 p-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <DialogTitle className="text-2xl leading-tight text-left">{article.title}</DialogTitle>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>by {article.author}</span>
              {article.source && (
                <Badge variant="outline" className="text-xs">
                  {article.source}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}분</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount.toLocaleString()}</span>
              </div>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {article.imageUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 font-medium leading-relaxed mb-6">{article.excerpt}</p>

            <div className="text-gray-800 leading-relaxed whitespace-pre-line">{article.content}</div>
          </div>

          {article.tags.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">태그</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">이 기사가 도움이 되셨나요?</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              👍 도움됨
            </Button>
            <Button variant="outline" size="sm">
              👎 아니요
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
