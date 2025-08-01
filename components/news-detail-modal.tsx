"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDateTime, getInitials } from "@/lib/utils"
import type { NewsArticle } from "@/types/news"
import { Clock, Eye, ExternalLink, Share2, Calendar, Tag, Zap, X } from "lucide-react"

interface NewsDetailModalProps {
  article: NewsArticle
  isOpen: boolean
  onClose: () => void
}

export function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(`${article.title}\n\n${article.excerpt}\n\n${window.location.href}`)
        // You could show a toast notification here
      }
    } catch (error) {
      console.error("Error sharing:", error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleExternalLink = () => {
    if (article.sourceUrl) {
      window.open(article.sourceUrl, "_blank", "noopener,noreferrer")
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      현지: "bg-blue-100 text-blue-800",
      업체: "bg-green-100 text-green-800",
      정책: "bg-purple-100 text-purple-800",
      교통: "bg-yellow-100 text-yellow-800",
      비자: "bg-red-100 text-red-800",
      경제: "bg-indigo-100 text-indigo-800",
      문화: "bg-pink-100 text-pink-800",
      사회: "bg-gray-100 text-gray-800",
      스포츠: "bg-orange-100 text-orange-800",
      연예: "bg-rose-100 text-rose-800",
      기술: "bg-cyan-100 text-cyan-800",
      건강: "bg-emerald-100 text-emerald-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  {article.isBreaking && (
                    <Badge variant="destructive" className="animate-pulse">
                      <Zap className="h-3 w-3 mr-1" />
                      속보
                    </Badge>
                  )}
                  <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                </div>
                <DialogTitle className="text-2xl font-bold leading-tight">{article.title}</DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{getInitials(article.author)}</AvatarFallback>
                </Avatar>
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(article.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}분 읽기</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount.toLocaleString()} 조회</span>
              </div>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Tag className="h-4 w-4 text-gray-400" />
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </DialogHeader>

          <Separator />

          {/* Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Featured Image */}
              {article.imageUrl && (
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              )}

              {/* Excerpt */}
              <div className="text-lg text-gray-700 font-medium leading-relaxed">{article.excerpt}</div>

              <Separator />

              {/* Article Content */}
              <div className="prose prose-gray max-w-none">
                <div
                  className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: article.content.replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              {/* Source Link */}
              {article.sourceUrl && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">원문 보기</h4>
                      <p className="text-sm text-gray-600">더 자세한 내용은 원문에서 확인하세요</p>
                    </div>
                    <Button onClick={handleExternalLink} variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      원문 링크
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          {/* Footer Actions */}
          <div className="p-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">마지막 업데이트: {formatDateTime(article.updatedAt)}</div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleShare} disabled={isSharing}>
                  <Share2 className="h-4 w-4 mr-2" />
                  {isSharing ? "공유 중..." : "공유하기"}
                </Button>
                <Button onClick={onClose}>닫기</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
