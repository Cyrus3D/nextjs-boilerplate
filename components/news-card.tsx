"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Share2, Bookmark, ExternalLink } from "lucide-react"
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
      // 토스트 알림 표시 (실제 구현시)
      console.log("링크가 복사되었습니다.")
    }
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    // 북마크 기능 구현 (실제 구현시)
    console.log("북마크에 추가되었습니다.")
  }

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (article.externalUrl) {
      window.open(article.externalUrl, "_blank")
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={`${getCategoryColor(article.category)} text-xs font-medium`} variant="secondary">
              {article.category}
            </Badge>
            {article.isBreaking && (
              <Badge className="bg-red-600 text-white animate-pulse text-xs font-medium">속보</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 w-8 p-0">
              <Share2 className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleBookmark} className="h-8 w-8 p-0">
              <Bookmark className="w-3 h-3" />
            </Button>
            {article.externalUrl && (
              <Button variant="ghost" size="sm" onClick={handleExternalLink} className="h-8 w-8 p-0">
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold line-clamp-2 leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 이미지 */}
        {article.imageUrl && (
          <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
            <img
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* 요약 */}
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{article.excerpt}</p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="inline-block text-gray-400 text-xs px-2 py-1">+{article.tags.length - 3}</span>
          )}
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
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
          <div className="flex flex-col items-end">
            <span>{formatDate(article.publishedAt)}</span>
            <span className="text-gray-400">{article.author}</span>
          </div>
        </div>

        {/* 더 보기 버튼 */}
        <Button
          onClick={() => onReadMore(article)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          자세히 보기
        </Button>
      </CardContent>
    </Card>
  )
}
