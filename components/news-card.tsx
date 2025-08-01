"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, ExternalLink, Zap } from "lucide-react"
import type { NewsArticle } from "@/types/news"

interface NewsCardProps {
  article: NewsArticle
  onReadMore: (article: NewsArticle) => void
}

export default function NewsCard({ article, onReadMore }: NewsCardProps) {
  const getCategoryColor = (category: string) => {
    return category === "local"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-green-100 text-green-800 border-green-200"
  }

  const getCategoryLabel = (category: string) => {
    return category === "local" ? "현지 뉴스" : "교민 업체"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "방금 전"
    if (diffInHours < 24) return `${diffInHours}시간 전`
    if (diffInHours < 48) return "어제"
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {article.isBreaking && (
              <Badge className="bg-red-500 text-white flex items-center gap-1 animate-pulse">
                <Zap className="h-3 w-3" />
                속보
              </Badge>
            )}
            <Badge variant="outline" className={getCategoryColor(article.category)}>
              {getCategoryLabel(article.category)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{article.viewCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime}분</span>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
          {article.title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        {article.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 min-h-[4.5rem]">{article.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{article.author}</span>
            <span className="text-xs text-gray-400">{formatDate(article.publishedAt)}</span>
          </div>

          <Button onClick={() => onReadMore(article)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            자세히 보기
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                #{tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-50 text-gray-500">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
