"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatRelativeTime, getInitials, cn } from "@/lib/utils"
import { incrementNewsViewCount } from "@/lib/api"
import type { NewsArticle } from "@/types/news"
import { Clock, Eye, ExternalLink, Share2, Zap } from "lucide-react"

interface NewsCardProps {
  article: NewsArticle
  onClick?: () => void
  className?: string
}

export function NewsCard({ article, onClick, className }: NewsCardProps) {
  const handleClick = async () => {
    try {
      await incrementNewsViewCount(article.id)
      onClick?.()
    } catch (error) {
      console.error("Failed to increment view count:", error)
      onClick?.()
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${article.title}\n${window.location.href}`)
        // You could show a toast notification here
      } catch (error) {
        console.error("Error copying to clipboard:", error)
      }
    }
  }

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (article.sourceUrl) {
      window.open(article.sourceUrl, "_blank", "noopener,noreferrer")
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      현지: "bg-blue-100 text-blue-800",
      업체: "bg-green-100 text-green-800",
      정책: "bg-purple-100 text-purple-800",
      교통: "bg-yellow-100 text-yellow-800",
      비자: "bg-red-100 text-red-800",
      경제: "bg-indigo-100 text-indigo-800",
      문화: "bg-pink-100 text-pink-800",
      사회: "bg-gray-100 text-gray-800",
      스포츠: "bg-orange-100 text-orange-800",
      연예: "bg-rose-100 text-rose-800",
      기술: "bg-cyan-100 text-cyan-800",
      건강: "bg-emerald-100 text-emerald-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        article.isBreaking && "ring-2 ring-red-200",
        className,
      )}
      onClick={handleClick}
    >
      {/* Image */}
      {article.imageUrl && (
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
          {article.isBreaking && (
            <div className="absolute top-3 left-3">
              <Badge variant="destructive" className="animate-pulse">
                <Zap className="h-3 w-3 mr-1" />
                속보
              </Badge>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/50 text-white">
              {article.category}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
              {article.title}
            </h3>
          </div>
          {!article.imageUrl && article.isBreaking && (
            <Badge variant="destructive" className="animate-pulse shrink-0">
              <Zap className="h-3 w-3 mr-1" />
              속보
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 mt-2">{article.excerpt}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Category and Tags */}
          <div className="flex flex-wrap gap-2">
            {!article.imageUrl && (
              <Badge variant="secondary" className={getCategoryColor(article.category)}>
                {article.category}
              </Badge>
            )}
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Author and Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{getInitials(article.author)}</AvatarFallback>
              </Avatar>
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{article.readTime}분</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{article.viewCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Published Date */}
          <div className="text-xs text-gray-400">{formatRelativeTime(article.publishedAt)}</div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-gray-500 hover:text-gray-700">
              <Share2 className="h-4 w-4 mr-1" />
              공유
            </Button>

            {article.sourceUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExternalLink}
                className="text-gray-500 hover:text-gray-700"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                원문
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
