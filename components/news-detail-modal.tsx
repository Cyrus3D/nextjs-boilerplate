"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Eye, Clock, Share2, Bookmark, ExternalLink, X } from "lucide-react"
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {article.isBreaking && <Badge className="bg-red-600 text-white font-bold animate-pulse">속보</Badge>}
              <Badge className={`${getCategoryColor(article.category)} font-medium`}>{article.category}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <DialogTitle className="text-2xl font-bold leading-tight text-left">{article.title}</DialogTitle>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}분 읽기</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                공유
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-1" />
                저장
              </Button>
              {article.sourceUrl && (
                <Button variant="outline" size="sm" onClick={() => window.open(article.sourceUrl, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  원문
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {article.imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          )}

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 font-medium leading-relaxed mb-6">{article.excerpt}</p>

            <div className="text-gray-800 leading-relaxed whitespace-pre-line">{article.content}</div>
          </div>

          {article.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">관련 태그</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
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
          <div className="flex items-center space-x-2">
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
