"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, ExternalLink, Zap, Pin } from "lucide-react"
import type { NewsArticle } from "../types/news"

interface NewsCardProps {
  article: NewsArticle
  onDetailClick: (article: NewsArticle) => void
}

const getCategoryColor = (category: string) => {
  const colors = {
    정치: "bg-red-100 text-red-800",
    경제: "bg-blue-100 text-blue-800",
    사회: "bg-green-100 text-green-800",
    문화: "bg-purple-100 text-purple-800",
    스포츠: "bg-orange-100 text-orange-800",
    국제: "bg-indigo-100 text-indigo-800",
    교민소식: "bg-pink-100 text-pink-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    return `${diffInMinutes}분 전`
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays}일 전`
    } else {
      return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      })
    }
  }
}

export default function NewsCard({ article, onDetailClick }: NewsCardProps) {
  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
        article.isBreaking ? "ring-2 ring-red-200" : ""
      }`}
      onClick={() => onDetailClick(article)}
    >
      <div className="relative">
        <img
          src={article.imageUrl || "/placeholder.svg?height=200&width=400"}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {/* 속보 배지 */}
          {article.isBreaking && (
            <Badge className="bg-red-500 text-white flex items-center gap-1 animate-pulse">
              <Zap className="h-3 w-3" />
              속보
            </Badge>
          )}
          {/* 고정 배지 */}
          {article.isPinned && (
            <Badge className="bg-yellow-500 text-white flex items-center gap-1">
              <Pin className="h-3 w-3" />
              고정
            </Badge>
          )}
          {/* 카테고리 배지 */}
          <Badge className={getCategoryColor(article.category)} variant="secondary">
            {article.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg mb-1 line-clamp-2 leading-tight">{article.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-3">{article.summary}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-3 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          {/* 뉴스 메타 정보 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{article.viewCount.toLocaleString()}</span>
              </div>
            </div>
            <span className="font-medium">{article.source}</span>
          </div>

          {/* 작성자 정보 */}
          {article.author && (
            <div className="text-xs text-gray-600">
              <span>기자: {article.author}</span>
            </div>
          )}

          {/* 태그 */}
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {article.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 4}
              </Badge>
            )}
          </div>
        </div>

        <div className="pt-2 border-t mt-auto space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {article.url && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  <span>원문 보기</span>
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onDetailClick(article)
              }}
            >
              자세히 보기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
