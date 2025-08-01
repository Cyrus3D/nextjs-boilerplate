"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Share2, Bookmark, ExternalLink } from "lucide-react"
import type { NewsArticle } from "../types/news"

interface NewsCardProps {
  article: NewsArticle
  onDetailClick: (article: NewsArticle) => void
}

export default function NewsCard({ article, onDetailClick }: NewsCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "방금 전"
    if (diffInHours < 24) return `${diffInHours}시간 전`
    if (diffInHours < 48) return "어제"
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    // 실제 구현시 로컬 스토리지나 서버에 저장
  }

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (article.sourceUrl) {
      window.open(article.sourceUrl, "_blank")
    }
  }

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border border-gray-200">
      <div className="relative">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <Image
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {article.isBreaking && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-600 text-white font-bold animate-pulse">속보</Badge>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge className={`${getCategoryColor(article.category)} font-medium`}>{article.category}</Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3
            className="font-bold text-lg leading-tight text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors"
            onClick={() => onDetailClick(article)}
          >
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{article.excerpt}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}분 읽기</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{article.viewCount.toLocaleString()}</span>
            </div>
          </div>
          <span className="font-medium">{formatDate(article.publishedAt)}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">by</span>
            <span className="text-xs font-medium text-gray-700">{article.author}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100" onClick={handleShare}>
              <Share2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 hover:bg-gray-100 ${isBookmarked ? "text-yellow-600" : ""}`}
              onClick={handleBookmark}
            >
              <Bookmark className={`w-3 h-3 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
            {article.sourceUrl && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100" onClick={handleExternalLink}>
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
