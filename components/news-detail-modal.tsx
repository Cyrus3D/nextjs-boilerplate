"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Eye, User, Calendar, ExternalLink, Share2, Bookmark } from "lucide-react"
import type { NewsArticle } from "@/types/news"

interface NewsDetailModalProps {
  article: NewsArticle | null
  isOpen: boolean
  onClose: () => void
}

export function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
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
        return "bg-blue-100 text-blue-800"
      case "교민 업체":
        return "bg-green-100 text-green-800"
      case "정책":
        return "bg-purple-100 text-purple-800"
      case "교통":
        return "bg-orange-100 text-orange-800"
      case "비자":
        return "bg-red-100 text-red-800"
      case "경제":
        return "bg-yellow-100 text-yellow-800"
      case "문화":
        return "bg-pink-100 text-pink-800"
      case "스포츠":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
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
      } catch (error) {
        console.log("공유 취소됨")
      }
    } else {
      // 폴백: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 클립보드에 복사되었습니다!")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* 카테고리와 속보 배지 */}
          <div className="flex items-center gap-2">
            <Badge className={getCategoryColor(article.category)} variant="secondary">
              {article.category}
            </Badge>
            {article.isBreaking && <Badge className="bg-red-600 text-white animate-pulse">속보</Badge>}
          </div>

          {/* 제목 */}
          <DialogTitle className="text-2xl font-bold leading-tight text-left">{article.title}</DialogTitle>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}분 읽기</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.viewCount.toLocaleString()} 조회</span>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              공유하기
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              북마크
            </Button>
            {article.sourceUrl && (
              <Button variant="outline" size="sm" onClick={() => window.open(article.sourceUrl, "_blank")}>
                <ExternalLink className="w-4 h-4 mr-2" />
                원문 보기
              </Button>
            )}
          </div>
        </DialogHeader>

        <Separator className="my-6" />

        {/* 요약 */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">📝 요약</h3>
          <p className="text-gray-700 leading-relaxed">{article.excerpt}</p>
        </div>

        {/* 이미지 */}
        {article.imageUrl && (
          <div className="mb-6">
            <img
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* 본문 */}
        <div className="prose max-w-none">
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">{article.content}</div>
        </div>

        {/* 태그 */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold text-gray-900 mb-3">🏷️ 관련 태그</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="hover:bg-gray-100 cursor-pointer">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* 관련 기사 추천 (향후 구현) */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold text-gray-900 mb-3">📰 관련 기사</h3>
          <p className="text-gray-500 text-sm">관련 기사 기능은 곧 추가될 예정입니다.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Default export for backward compatibility
export default NewsDetailModal
