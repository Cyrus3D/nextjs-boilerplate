"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, Share2, Bookmark, ExternalLink, X } from "lucide-react"
import Image from "next/image"
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
    }
  }

  const handleBookmark = () => {
    console.log("Bookmarked:", article.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* 헤더 이미지 */}
          <div className="aspect-video relative overflow-hidden">
            <Image src={article.imageUrl || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
            {article.isBreaking && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-600 text-white animate-pulse border-0">속보</Badge>
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* 콘텐츠 */}
          <div className="p-6">
            <DialogHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(article.category)} variant="outline">
                    {article.category}
                  </Badge>
                  {article.source && (
                    <Badge variant="outline" className="bg-gray-50">
                      {article.source}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    공유
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBookmark}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    북마크
                  </Button>
                </div>
              </div>

              <DialogTitle className="text-2xl font-bold leading-tight text-left">{article.title}</DialogTitle>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}분 읽기</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{article.viewCount.toLocaleString()} 조회</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>
            </DialogHeader>

            {/* 본문 */}
            <div className="mt-6 space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed font-medium">{article.excerpt}</p>
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{article.content}</div>
              </div>
            </div>

            {/* 태그 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">관련 태그</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 외부 링크 */}
            {article.externalUrl && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => window.open(article.externalUrl, "_blank")} className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  원문 보기
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewsDetailModal
