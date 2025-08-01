"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Share2, Bookmark, ExternalLink } from "lucide-react"
import type { NewsArticle } from "@/types/news"

interface NewsCardProps {
  article: NewsArticle
  onReadMore: (article: NewsArticle) => void
}

export default function NewsCard({ article, onReadMore }: NewsCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

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
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "교민 업체":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
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
      // 폴백: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 클립보드에 복사되었습니다!")
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // 실제 구현에서는 로컬 스토리지나 서버에 저장
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={getCategoryColor(article.category)} variant="secondary">
              {article.category}
            </Badge>
            {article.isBreaking && <Badge className="bg-red-600 text-white animate-pulse">속보</Badge>}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
          </div>
        </div>

        <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {article.imageUrl && (
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{article.excerpt}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}분</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{article.viewCount.toLocaleString()}</span>
            </div>
          </div>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">by {article.author}</span>
            {article.source && (
              <Badge variant="outline" className="text-xs">
                {article.source}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {article.externalUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(article.externalUrl, "_blank")}
                className="h-8 px-2 text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                원문
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReadMore(article)}
              className="h-8 px-3 text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              자세히 보기
            </Button>
          </div>
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-gray-50 text-gray-600 hover:bg-gray-100">
                #{tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
