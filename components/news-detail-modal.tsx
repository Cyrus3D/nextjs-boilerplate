"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, User, Calendar, ExternalLink, Share2, Bookmark, X } from "lucide-react"
import type { NewsArticle } from "@/types/news"

interface NewsDetailModalProps {
  article: NewsArticle | null
  isOpen: boolean
  onClose: () => void
}

export default function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
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
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 클립보드에 복사되었습니다!")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0 gap-0">
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* 헤더 이미지 */}
          <div className="aspect-video relative overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            {/* 배지들 */}
            <div className="absolute top-6 left-6 flex gap-2">
              <Badge className={getCategoryColor(article.category)} variant="secondary">
                {article.category}
              </Badge>
              {article.isBreaking && <Badge className="bg-red-600 text-white animate-pulse border-0">속보</Badge>}
            </div>
            {/* 닫기 버튼 */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-6 right-6 h-10 w-10 p-0 bg-white/90 hover:bg-white shadow-lg"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-6">
              <DialogHeader className="space-y-6 mb-8">
                {/* 액션 버튼들 */}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={handleShare} className="h-9 bg-transparent">
                    <Share2 className="w-4 h-4 mr-2" />
                    공유하기
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 bg-transparent">
                    <Bookmark className="w-4 h-4 mr-2" />
                    북마크
                  </Button>
                  {article.sourceUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(article.sourceUrl, "_blank")}
                      className="h-9"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      원문 보기
                    </Button>
                  )}
                </div>

                {/* 제목 */}
                <DialogTitle className="text-3xl font-bold leading-tight text-left text-gray-900">
                  {article.title}
                </DialogTitle>

                {/* 메타 정보 */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}분 읽기</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{article.viewCount.toLocaleString()} 조회</span>
                  </div>
                  {article.source && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">출처:</span>
                      <span className="font-medium">{article.source}</span>
                    </div>
                  )}
                </div>
              </DialogHeader>

              {/* 본문 콘텐츠 */}
              <div className="space-y-8">
                {/* 요약 */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                  <h3 className="font-semibold text-blue-900 mb-3 text-lg">📝 요약</h3>
                  <p className="text-blue-800 leading-relaxed text-base">{article.excerpt}</p>
                </div>

                {/* 본문 */}
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base">{article.content}</div>
                </div>

                {/* 태그 섹션 */}
                <div className="pt-8 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">🏷️ 관련 태그</h3>
                  <div className="flex flex-wrap gap-3">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="hover:bg-gray-100 cursor-pointer px-3 py-1 text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 관련 기사 섹션 (향후 구현) */}
                <div className="pt-8 border-t border-gray-200 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">📰 관련 기사</h3>
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-gray-500">관련 기사 기능은 곧 추가될 예정입니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
