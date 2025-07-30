"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, Eye, Globe } from "lucide-react"
import type { NewsItem } from "../types/news"

interface NewsCardProps {
  news: NewsItem
  onDetailClick: (news: NewsItem) => void
}

const getCategoryColor = (category: string) => {
  const colors = {
    정치: "bg-red-100 text-red-800",
    경제: "bg-blue-100 text-blue-800",
    사회: "bg-green-100 text-green-800",
    문화: "bg-purple-100 text-purple-800",
    스포츠: "bg-orange-100 text-orange-800",
    국제: "bg-indigo-100 text-indigo-800",
    생활: "bg-pink-100 text-pink-800",
    기술: "bg-cyan-100 text-cyan-800",
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
  } else if (diffInHours < 48) {
    return "어제"
  } else {
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    })
  }
}

export default function NewsCard({ news, onDetailClick }: NewsCardProps) {
  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(news.originalUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => onDetailClick(news)}
    >
      <div className="relative">
        <img
          src={news.imageUrl || "/placeholder.svg?height=200&width=400"}
          alt={news.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <Badge className={getCategoryColor(news.category)} variant="secondary">
            {news.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white text-gray-700"
            onClick={handleExternalLink}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg mb-1 line-clamp-2 leading-tight">{news.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-3">{news.summary}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(news.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3" />
              <span>{news.viewCount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Globe className="h-3 w-3" />
            <span className="truncate">{news.source}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {news.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {news.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{news.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="pt-3 border-t mt-auto">
          <div className="flex justify-between items-center">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onDetailClick(news)
              }}
              className="flex-1 mr-2"
            >
              자세히 보기
            </Button>
            <Button size="sm" variant="ghost" onClick={handleExternalLink} className="px-3">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
