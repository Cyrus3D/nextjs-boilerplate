"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Eye, User } from "lucide-react"
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

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-0 shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          {/* 이미지 영역 */}
          <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {/* 카테고리 배지 */}
            <div className="absolute top-3 left-3">
              <Badge className={`${getCategoryColor(article.category)} text-xs font-medium border`} variant="secondary">
                {article.category}
              </Badge>
            </div>
            {/* 속보 배지 */}
            {article.isBreaking && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-red-600 text-white animate-pulse text-xs font-medium border-0">속보</Badge>
              </div>
            )}
          </div>

          {/* 콘텐츠 영역 */}
          <div className="p-4 flex flex-col flex-1 space-y-3">
            {/* 제목 */}
            <h3 className="font-bold text-lg leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
              {article.title}
            </h3>

            {/* 요약 */}
            <p className="text-gray-600 text-sm line-clamp-3 flex-1 min-h-[4.5rem] leading-relaxed">
              {article.excerpt}
            </p>

            {/* 태그 */}
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
              {article.tags.length > 3 && (
                <span className="text-gray-400 text-xs px-2 py-1">+{article.tags.length - 3}</span>
              )}
            </div>

            {/* 메타 정보 */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}분</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{article.viewCount.toLocaleString()}</span>
                </div>
              </div>
              <span className="font-medium">{formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
