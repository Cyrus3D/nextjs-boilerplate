"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X, Clock, Eye, Calendar, User, ExternalLink, Share2, Heart, Bookmark, Zap, Tag } from "lucide-react"
import { useState } from "react"
import type { NewsArticle } from "@/types/news"

interface NewsDetailModalProps {
  article: NewsArticle | null
  isOpen: boolean
  onClose: () => void
}

export default function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  if (!article) return null

  const getCategoryColor = (category: string) => {
    return category === "local" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
  }

  const getCategoryLabel = (category: string) => {
    return category === "local" ? "현지 뉴스" : "교민 업체"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    }
  }

  const handleExternalLink = () => {
    if (article.sourceUrl) {
      window.open(article.sourceUrl, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] lg:w-[80vw] max-h-[90vh] p-0 gap-0 rounded-xl">
        <div className="flex flex-col h-[90vh] rounded-xl overflow-hidden">
          {/* Header with Image */}
          <div className="relative flex-shrink-0">
            {article.imageUrl && (
              <div className="relative h-64 sm:h-80">
                <img
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 h-10 w-10 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Action Buttons */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-yellow-500 text-yellow-500" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Title and Meta Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {article.isBreaking && (
                      <Badge className="bg-red-500 text-white flex items-center gap-1 animate-pulse">
                        <Zap className="h-3 w-3" />
                        속보
                      </Badge>
                    )}
                    <Badge className={getCategoryColor(article.category)}>{getCategoryLabel(article.category)}</Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">{article.title}</h1>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{article.viewCount.toLocaleString()}회 조회</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}분 읽기</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Header without image */}
            {!article.imageUrl && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {article.isBreaking && (
                      <Badge className="bg-red-500 text-white flex items-center gap-1 animate-pulse">
                        <Zap className="h-3 w-3" />
                        속보
                      </Badge>
                    )}
                    <Badge className="bg-white/20 text-white">{getCategoryLabel(article.category)}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">{article.title}</h1>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{article.viewCount.toLocaleString()}회</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime}분</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6 space-y-6">
              {/* Author and Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{article.author}</p>
                    <p className="text-sm text-gray-500">{formatDate(article.publishedAt)}</p>
                  </div>
                </div>
                {article.sourceUrl && (
                  <Button
                    onClick={handleExternalLink}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ExternalLink className="h-4 w-4" />
                    원문 보기
                  </Button>
                )}
              </div>

              <Separator />

              {/* Excerpt */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-blue-900 font-medium leading-relaxed">{article.excerpt}</p>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{article.content}</div>
              </div>

              <Separator />

              {/* Tags */}
              {article.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">관련 태그</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? "text-red-600 border-red-200 bg-red-50" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                    좋아요
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={isBookmarked ? "text-yellow-600 border-yellow-200 bg-yellow-50" : ""}
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                    북마크
                  </Button>
                </div>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Share2 className="h-4 w-4" />
                  공유하기
                </Button>
              </div>

              {/* Bottom Spacing */}
              <div className="h-4" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
