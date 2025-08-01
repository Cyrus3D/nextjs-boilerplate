"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X, Clock, Eye, User, Calendar, ExternalLink, Share2, Heart, Copy, Check, Tag } from "lucide-react"
import { useState } from "react"
import type { NewsArticle } from "@/types/news"

interface NewsDetailModalProps {
  article: NewsArticle | null
  isOpen: boolean
  onClose: () => void
}

export default function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!article) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
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
    } else {
      handleCopy(window.location.href, "share")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] p-0 gap-0 rounded-xl overflow-hidden">
        <div className="flex flex-col h-[95vh]">
          {/* 헤더 */}
          <div className="relative flex-shrink-0">
            {/* 이미지 */}
            {article.imageUrl && (
              <div className="aspect-video w-full bg-gray-100">
                <img
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* 닫기 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-10 w-10 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* 액션 버튼들 */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
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

            {/* 제목과 메타 정보 */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={`${getCategoryColor(article.category)} border`} variant="outline">
                      {article.category}
                    </Badge>
                    {article.isBreaking && (
                      <Badge className="bg-red-600 text-white animate-pulse border-red-600">속보</Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{article.title}</h1>
                  <div className="flex items-center gap-6 text-white/80 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}분 읽기</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{article.viewCount.toLocaleString()}회 조회</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 스크롤 가능한 콘텐츠 */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-8 space-y-8">
              {/* 요약 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-3 text-blue-900">📋 요약</h2>
                <p className="text-blue-800 leading-relaxed text-base">{article.excerpt}</p>
              </div>

              {/* 본문 */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">📰 본문</h2>
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">{article.content}</div>
                </div>
              </div>

              <Separator />

              {/* 태그 */}
              {article.tags && article.tags.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    태그
                  </h2>
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

              {/* 원문 링크 */}
              {article.sourceUrl && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">🔗 원문 링크</h2>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 break-all text-sm">{article.sourceUrl}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => window.open(article.sourceUrl, "_blank")}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          원문 보기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(article.sourceUrl!, "source")}
                          className="w-12"
                        >
                          {copiedField === "source" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 하단 여백 */}
              <div className="h-8" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
