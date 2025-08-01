"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Share2, Bookmark, ExternalLink, X } from "lucide-react"
import Image from "next/image"
import type { NewsArticle } from "../types/news"

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={`${getCategoryColor(article.category)} font-medium`}>{article.category}</Badge>
              {article.isBreaking && <Badge className="bg-red-600 text-white font-bold">속보</Badge>}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <DialogTitle className="text-2xl font-bold leading-tight text-left">{article.title}</DialogTitle>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>by {article.author}</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}분 읽기</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <Image
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>

          <div className="prose prose-gray max-w-none">
            <div className="text-lg leading-relaxed whitespace-pre-line">{article.content}</div>
          </div>

          {article.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">태그</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                공유하기
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                북마크
              </Button>
            </div>

            {article.sourceUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  원문 보기
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
