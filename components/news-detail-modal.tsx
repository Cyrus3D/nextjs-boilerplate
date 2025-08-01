"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatDateTime } from "@/lib/utils"
import type { NewsArticle } from "@/types/news"
import { Clock, Eye, ExternalLink, Share2, AlertTriangle, User } from "lucide-react"

interface NewsDetailModalProps {
  article: NewsArticle | null
  isOpen: boolean
  onClose: () => void
}

export function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
  if (!article) return null

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || article.title,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {article.isBreaking && (
                  <Badge variant="destructive" className="animate-pulse">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    속보
                  </Badge>
                )}
                <Badge variant="secondary">{article.category}</Badge>
              </div>
              <DialogTitle className="text-2xl font-bold leading-tight">{article.title}</DialogTitle>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                공유
              </Button>
              {article.sourceUrl && (
                <Button size="sm" variant="outline" asChild>
                  <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    원문
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDateTime(article.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount.toLocaleString()} 조회</span>
              </div>
              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Article Image */}
          {article.imageUrl && (
            <div className="w-full">
              <img
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-auto max-h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Article Summary */}
          {article.summary && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">요약</h3>
              <p className="text-gray-700">{article.summary}</p>
            </div>
          )}

          {/* Article Content */}
          <div className="prose max-w-none">
            <div
              className="text-gray-800 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">태그</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Translation Info */}
          {article.language !== "ko" && article.translatedTitle && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-800">번역 정보</h3>
              <p className="text-sm text-blue-700">
                이 기사는 {article.language === "th" ? "태국어" : "외국어"}에서 번역되었습니다.
              </p>
              {article.translatedSummary && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-blue-800">번역된 요약:</p>
                  <p className="text-sm text-blue-700">{article.translatedSummary}</p>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Footer Actions */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">
              게시일: {formatDateTime(article.publishedAt || article.createdAt)}
              {article.updatedAt !== article.createdAt && <span> • 수정일: {formatDateTime(article.updatedAt)}</span>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                공유하기
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
