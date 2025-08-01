"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/utils"
import { incrementNewsViewCount } from "@/lib/api"
import type { NewsArticle } from "@/types/news"
import { Clock, Eye, ExternalLink, AlertTriangle } from "lucide-react"

interface NewsCardProps {
  article: NewsArticle
  onClick: (article: NewsArticle) => void
}

export function NewsCard({ article, onClick }: NewsCardProps) {
  const handleClick = () => {
    incrementNewsViewCount(article.id)
    onClick(article)
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={article.imageUrl || "/placeholder.svg?height=200&width=400"}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {article.isBreaking && (
            <Badge variant="destructive" className="animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              속보
            </Badge>
          )}
          <Badge variant="secondary">{article.category}</Badge>
        </div>
        {article.sourceUrl && (
          <div className="absolute top-3 right-3">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg mb-1 line-clamp-2">{article.title}</CardTitle>
        {article.summary && <p className="text-sm text-gray-600 line-clamp-3">{article.summary}</p>}
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatRelativeTime(article.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{article.viewCount.toLocaleString()}</span>
            </div>
          </div>
          {article.author && <span className="text-xs text-gray-400">by {article.author}</span>}
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            className="w-full bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
          >
            자세히 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
