"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, TrendingUp, ExternalLink } from "lucide-react"
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
        return "bg-blue-100 text-blue-800"
      case "교민 업체":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 shadow-sm bg-white h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className={getCategoryColor(article.category)} variant="secondary">
              {article.category}
            </Badge>
            {article.isBreaking && <Badge className="bg-red-600 text-white animate-pulse">속보</Badge>}
          </div>
          <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
        <CardTitle className="text-lg line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {article.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* 이미지 */}
        {article.imageUrl && (
          <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden">
            <img
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* 요약 */}
        <p className="text-gray-600 text-sm line-clamp-3 flex-1 min-h-[4.5rem] leading-6">{article.excerpt}</p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {article.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{article.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
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
          <span>{formatDate(article.publishedAt)}</span>
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
          {article.sourceUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                window.open(article.sourceUrl, "_blank")
              }}
              className="px-3"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
