"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Eye, Share2, Bookmark, ExternalLink } from "lucide-react"
import type { NewsArticle } from "@/types/news"

interface NewsDetailModalProps {
  article: NewsArticle | null
  isOpen: boolean
  onClose: () => void
}

export function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
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
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "교민 업체":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      console.log("링크가 복사되었습니다.")
    }
  }

  const handleBookmark = () => {
    console.log("북마크에 추가되었습니다.")
  }

  const handleExternalLink = () => {
    if (article.externalUrl) {
      window.open(article.externalUrl, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`${getCategoryColor(article.category)} text-sm font-medium`} variant="secondary">
                {article.category}
              </Badge>
              {article.isBreaking && (
                <Badge className="bg-red-600 text-white animate-pulse text-sm font-medium">속보</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              <Button variant="ghost" size="sm" onClick={handleBookmark}>
                <Bookmark className="w-4 h-4 mr-2" />
                북마크
              </Button>
              {article.externalUrl && (
                <Button variant="ghost" size="sm" onClick={handleExternalLink}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  원문
                </Button>
              )}
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold leading-tight text-left">{article.title}</DialogTitle>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="font-medium">{article.author}</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}분 읽기</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount.toLocaleString()}</span>
              </div>
            </div>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {/* 이미지 */}
          {article.imageUrl && (
            <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
              <img
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 요약 */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-blue-900 font-medium text-lg leading-relaxed">{article.excerpt}</p>
          </div>

          {/* 본문 */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">{article.content}</div>
          </div>

          {/* 태그 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">관련 태그</h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 출처 */}
          {article.source && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">출처:</span> {article.source}
              </p>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={handleShare} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            공유하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewsDetailModal
