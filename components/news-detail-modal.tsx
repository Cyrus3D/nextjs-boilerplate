"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Eye, ExternalLink, Zap, Star, User, Building, Share2, Bookmark } from "lucide-react"
import type { NewsArticle } from "../types/news"
import { formatDistanceToNow, format } from "date-fns"
import { ko } from "date-fns/locale"
import { useState } from "react"

interface NewsDetailModalProps {
  article: NewsArticle | null
  isOpen: boolean
  onClose: () => void
}

const getCategoryColor = (category: string) => {
  const colors = {
    정책: "bg-blue-100 text-blue-800",
    교통: "bg-green-100 text-green-800",
    커뮤니티: "bg-purple-100 text-purple-800",
    경제: "bg-orange-100 text-orange-800",
    문화: "bg-pink-100 text-pink-800",
    생활: "bg-yellow-100 text-yellow-800",
    사회: "bg-gray-100 text-gray-800",
    스포츠: "bg-red-100 text-red-800",
    건강: "bg-emerald-100 text-emerald-800",
    기술: "bg-indigo-100 text-indigo-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

export default function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  if (!article) return null

  const timeAgo = formatDistanceToNow(new Date(article.published_at), {
    addSuffix: true,
    locale: ko,
  })

  const publishedDate = format(new Date(article.published_at), "yyyy년 MM월 dd일 HH:mm", {
    locale: ko,
  })

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || article.content.substring(0, 100) + "...",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Share failed:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 클립보드에 복사되었습니다!")
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Here you would typically save to localStorage or send to backend
    const bookmarks = JSON.parse(localStorage.getItem("newsBookmarks") || "[]")
    if (!isBookmarked) {
      bookmarks.push(article.id)
      localStorage.setItem("newsBookmarks", JSON.stringify(bookmarks))
    } else {
      const filtered = bookmarks.filter((id: number) => id !== article.id)
      localStorage.setItem("newsBookmarks", JSON.stringify(filtered))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* Article Image */}
          {article.image_url && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <img
                src={article.image_url || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                {article.is_breaking && (
                  <Badge className="bg-red-500 text-white flex items-center gap-1 animate-pulse">
                    <Zap className="h-3 w-3" />
                    속보
                  </Badge>
                )}
                {article.is_featured && (
                  <Badge className="bg-yellow-500 text-white flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    주요뉴스
                  </Badge>
                )}
                <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
              </div>
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.view_count.toLocaleString()}
              </div>
            </div>
          )}

          {/* Article Title */}
          <DialogTitle className="text-2xl font-bold leading-tight text-left">{article.title}</DialogTitle>

          {/* Article Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex flex-wrap items-center gap-4">
              {article.source && (
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{article.source}</span>
                </div>
              )}
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{publishedDate}</span>
                <span className="text-gray-400">({timeAgo})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-1 bg-transparent"
              >
                <Share2 className="h-4 w-4" />
                공유
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className={`flex items-center gap-1 ${isBookmarked ? "bg-yellow-100 text-yellow-800" : ""}`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                {isBookmarked ? "저장됨" : "저장"}
              </Button>
            </div>
          </div>

          <Separator />
        </DialogHeader>

        {/* Article Summary */}
        {article.summary && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-800">요약</h3>
            <DialogDescription className="text-gray-700 leading-relaxed">{article.summary}</DialogDescription>
          </div>
        )}

        {/* Article Content */}
        <div className="prose max-w-none">
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{article.content}</div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">태그</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {article.external_url && (
            <Button
              onClick={() => window.open(article.external_url!, "_blank", "noopener,noreferrer")}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              원문 보기
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none bg-transparent">
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
