"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, Zap } from "lucide-react"
import type { NewsArticle } from "@/types/news"

interface NewsCardProps {
  article: NewsArticle
  onClick: () => void
}

export default function NewsCard({ article, onClick }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "방금 전"
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}일 전`
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      현지: "bg-blue-100 text-blue-800",
      업체: "bg-green-100 text-green-800",
      정책: "bg-purple-100 text-purple-800",
      교통: "bg-orange-100 text-orange-800",
      비자: "bg-red-100 text-red-800",
      경제: "bg-yellow-100 text-yellow-800",
      문화: "bg-pink-100 text-pink-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full" onClick={onClick}>
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative">
          <img
            src={article.imageUrl || "/placeholder.svg?height=200&width=400&text=뉴스+이미지"}
            alt={article.title}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=200&width=400&text=뉴스+이미지"
            }}
          />
          {article.isBreaking && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-red-600 text-white flex items-center gap-1">
                <Zap className="w-3 h-3" />
                속보
              </Badge>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{article.title}</h3>

          <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span>{article.author}</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.readTime}분</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{article.viewCount}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
