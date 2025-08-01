"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, Clock, Zap } from "lucide-react"
import type { NewsArticle } from "../types/news"

interface NewsCardProps {
  article: NewsArticle
  onDetailClick: (article: NewsArticle) => void
}

const getCategoryColor = (category: string) => {
  const colors = {
    "현지 뉴스": "bg-blue-100 text-blue-800",
    "교민 업체": "bg-green-100 text-green-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return "방금 전"
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`
  } else {
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
}

export default function NewsCard({ article, onDetailClick }: NewsCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => onDetailClick(article)}
    >
      <div className="relative">
        <img
          src={article.image || "/placeholder.svg?height=200&width=400"}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {article.isBreaking && (
            <Badge className="bg-red-100 text-red-800 flex items-center gap-1" variant="secondary">
              <Zap className="h-3 w-3" />
              속보
            </Badge>
          )}
          <Badge className={getCategoryColor(article.category)} variant="secondary">
            {article.category}
          </Badge>
        </div>
        {article.readTime && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/70 text-white">
              <Clock className="h-3 w-3 mr-1" />
              {article.readTime}분
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg mb-1 line-clamp-2 leading-tight">{article.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-3">{article.excerpt}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0 space-y-3 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {article.author && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{article.author}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
            {article.viewCount && (
              <div className="flex items-center text-gray-500">
                <Eye className="h-4 w-4 mr-1" />
                <span>{article.viewCount.toLocaleString()}</span>
              </div>
            )}
          </div>

          {article.source && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
              <span className="text-sm font-medium text-gray-700">출처: {article.source}</span>
            </div>
          )}

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

        <div className="pt-2 border-t mt-auto">
          <div className="flex justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onDetailClick(article)
              }}
            >
              기사 읽기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
