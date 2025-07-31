"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, ExternalLink, Zap, Star, User, Building } from "lucide-react"
import type { NewsArticle } from "../types/news"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

interface NewsCardProps {
  article: NewsArticle
  onDetailClick: (article: NewsArticle) => void
}

const getCategoryColor = (category: string) => {
  const colors = {
    정책: "bg-blue-100 text-blue-800",
    교통: "bg-green-100 text-green-800",
    커뮤니티: "bg-purple-100 text-purple-800",
    경제: "bg-orange-100 text-orange-800",
    문화: "bg-pink-100 text-pink-800",
    생활: "bg-yellow-100 text-yellow-800",
    사회: "bg-gray-100 text-gray-800",
    스포츠: "bg-red-100 text-red-800",
    건강: "bg-emerald-100 text-emerald-800",
    기술: "bg-indigo-100 text-indigo-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

export default function NewsCard({ article, onDetailClick }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.published_at), {
    addSuffix: true,
    locale: ko,
  })

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col ${
        article.is_breaking ? "ring-2 ring-red-500 ring-opacity-50" : ""
      } ${article.is_featured ? "bg-gradient-to-br from-yellow-50 to-orange-50" : ""}`}
      onClick={() => onDetailClick(article)}
    >
      <div className="relative">
        <img
          src={article.image_url || "/placeholder.svg?height=200&width=400&query=news+article"}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {/* Breaking News Badge */}
          {article.is_breaking && (
            <Badge className="bg-red-500 text-white flex items-center gap-1 animate-pulse" variant="secondary">
              <Zap className="h-3 w-3" />
              속보
            </Badge>
          )}

          {/* Featured Badge */}
          {article.is_featured && (
            <Badge className="bg-yellow-500 text-white flex items-center gap-1" variant="secondary">
              <Star className="h-3 w-3" />
              주요뉴스
            </Badge>
          )}

          {/* Category Badge */}
          <Badge className={getCategoryColor(article.category)} variant="secondary">
            {article.category}
          </Badge>
        </div>

        {/* View Count */}
        <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {article.view_count.toLocaleString()}
        </div>
      </div>

      <CardHeader className="pb-3 flex-1">
        <CardTitle className="text-lg mb-2 line-clamp-2 leading-tight">{article.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-3 mb-3">
          {article.summary || article.content.substring(0, 150) + "..."}
        </CardDescription>

        {/* Article Meta Information */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {article.source && (
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span>{article.source}</span>
                </div>
              )}
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{article.author}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
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
      </CardHeader>

      <CardContent className="pt-0 mt-auto">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onDetailClick(article)
            }}
            className="flex-1"
          >
            자세히 보기
          </Button>

          {article.external_url && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                window.open(article.external_url!, "_blank", "noopener,noreferrer")
              }}
              className="px-3"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
