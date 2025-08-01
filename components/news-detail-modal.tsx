"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Share2, ExternalLink, Zap, User } from "lucide-react"
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
    const colors: Record<string, string> = {
      현지: "bg-blue-100 text-blue-800",
      업체: "bg-green-100 text-green-800",
      정책: "bg-purple-100 text-purple-800",
      교통: "bg-orange-100 text-orange-800",
      비자: "bg-red-100 text-red-800",
      경제: "bg-yellow-100 text-yellow-800",
      문화: "bg-pink-100 text-pink-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
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
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleSourceClick = () => {
    if (article.sourceUrl) {
      window.open(article.sourceUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* Breaking News Badge */}
          {article.isBreaking && (
            <div className="flex justify-center">
              <Badge className="bg-red-600 text-white flex items-center gap-1">
                <Zap className="w-3 h-3" />
                속보
              </Badge>
            </div>
          )}

          {/* Title */}
          <DialogTitle className="text-2xl font-bold leading-tight">{article.title}</DialogTitle>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.viewCount.toLocaleString()} 조회</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}분 읽기</span>
            </div>
          </div>

          {/* Category and Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
            {article.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              공유하기
            </Button>
            {article.sourceUrl && (
              <Button onClick={handleSourceClick} variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                원문 보기
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Article Image */}
        {article.imageUrl && (
          <div className="mt-6">
            <img
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=256&width=512&text=뉴스+이미지"
              }}
            />
          </div>
        )}

        {/* Article Excerpt */}
        <div className="mt-6">
          <p className="text-lg text-gray-700 leading-relaxed font-medium">{article.excerpt}</p>
        </div>

        {/* Article Content */}
        <div className="mt-6 prose prose-lg max-w-none">
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: article.content.replace(/\n/g, "<br />"),
            }}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              작성일: {formatDate(article.created_at)}
              {article.updated_at !== article.created_at && (
                <span className="ml-2">(수정일: {formatDate(article.updated_at)})</span>
              )}
            </span>
            <span>조회수: {article.viewCount.toLocaleString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewsDetailModal
