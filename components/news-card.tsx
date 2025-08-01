"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, ExternalLink, Share2, Bookmark, TrendingUp } from "lucide-react"
import Image from "next/image"
import type { NewsArticle } from "@/types/news"

interface NewsCardProps {
  article: NewsArticle
  onReadMore: (article: NewsArticle) => void
}

export default function NewsCard({ article, onReadMore }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "방금 전"
    if (diffInHours < 24) return `${diffInHours}시간 전`
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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
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

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    // 북마크 기능 구현
    console.log("Bookmarked:", article.id)
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 shadow-sm bg-white">
      <div className="relative">
        {/* 이미지 */}
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <Image
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.isBreaking && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-600 text-white animate-pulse border-0">속보</Badge>
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={handleBookmark}
            >
              <Bookmark className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className={getCategoryColor(article.category)} variant="outline">
              {article.category}
            </Badge>
            {article.source && (
              <Badge variant="outline" className="text-xs bg-gray-50">
                {article.source}
              </Badge>
            )}
          </div>
          <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
        <CardTitle className="text-lg line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {article.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{article.excerpt}</p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200">
              #{tag}
            </Badge>
          ))}
          {article.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
              +{article.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}분</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{article.viewCount.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span>{article.author}</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onReadMore(article)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            자세히 보기
          </Button>
          {article.externalUrl && (
            <Button
              variant="outline"
              size="sm"
              className="px-3 bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                window.open(article.externalUrl, "_blank")
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
