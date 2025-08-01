"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, User, ExternalLink } from "lucide-react"
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
    } else if (diffInHours < 48) {
      return "어제"
    } else {
      return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "현지 뉴스": "bg-red-100 text-red-800",
      "교민 업체": "bg-blue-100 text-blue-800",
      정책: "bg-green-100 text-green-800",
      교통: "bg-yellow-100 text-yellow-800",
      비자: "bg-purple-100 text-purple-800",
      경제: "bg-emerald-100 text-emerald-800",
      문화: "bg-pink-100 text-pink-800",
      스포츠: "bg-orange-100 text-orange-800",
      일반: "bg-gray-100 text-gray-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card
      className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={`${getCategoryColor(article.category)} text-xs font-medium`}>{article.category}</Badge>
          {article.isBreaking && <Badge className="bg-red-600 text-white text-xs font-bold animate-pulse">속보</Badge>}
        </div>

        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        {article.excerpt && <p className="text-sm text-gray-600 line-clamp-2 mt-2">{article.excerpt}</p>}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Article Image */}
        {article.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=128&width=256&text=뉴스+이미지"
              }}
            />
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Article Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}분</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{article.viewCount}</span>
          </div>
        </div>

        {/* Published Date */}
        <div className="text-xs text-gray-400 mb-3">{formatDate(article.publishedAt)}</div>

        {/* Source Link */}
        {article.sourceUrl && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <ExternalLink className="w-3 h-3" />
            <span>원문 보기</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
