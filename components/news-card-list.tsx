"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, Newspaper } from "lucide-react"
import NewsCard from "./news-card"
import NewsDetailModal from "./news-detail-modal"
import InFeedAd from "./in-feed-ad"
import { sampleNewsArticles } from "@/data/sample-news"
import type { NewsArticle } from "@/types/news"

export default function NewsCardList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)

  // 필터링된 뉴스 기사
  const filteredArticles = useMemo(() => {
    let filtered = sampleNewsArticles

    // 검색 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // 정렬: 속보 > 최신순 > 조회수순
    return filtered.sort((a, b) => {
      if (a.isBreaking && !b.isBreaking) return -1
      if (!a.isBreaking && b.isBreaking) return 1

      const dateA = new Date(a.publishedAt).getTime()
      const dateB = new Date(b.publishedAt).getTime()
      if (dateA !== dateB) return dateB - dateA

      return b.viewCount - a.viewCount
    })
  }, [searchTerm])

  const handleReadMore = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6)
  }

  return (
    <div className="space-y-6">
      {/* 검색 */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="뉴스 검색... (제목, 내용, 태그)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-blue-300 focus:ring-blue-200"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">태국 현지 소식과 교민 업체 정보를 확인하세요</p>
      </div>

      {/* 검색 결과 요약 */}
      <div className="mb-6">
        <p className="text-gray-600">
          총 <span className="font-semibold text-gray-900">{filteredArticles.length}</span>개의 뉴스
          {searchTerm && (
            <>
              {" "}
              (검색: "<span className="font-medium">{searchTerm}</span>")
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="ml-2 text-xs text-blue-600 hover:text-blue-800"
              >
                검색 초기화
              </Button>
            </>
          )}
        </p>
      </div>

      {/* 뉴스 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.slice(0, visibleCount).map((article, index) => (
          <div key={article.id}>
            <NewsCard article={article} onReadMore={handleReadMore} />
            {/* 6번째마다 광고 삽입 */}
            {(index + 1) % 6 === 0 && index < visibleCount - 1 && (
              <div className="col-span-full my-6">
                <InFeedAd />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      {visibleCount < filteredArticles.length && (
        <div className="text-center">
          <Button onClick={handleLoadMore} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2" size="lg">
            더 많은 뉴스 보기 ({visibleCount}/{filteredArticles.length})
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* 검색 결과 없음 */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600 mb-4">다른 키워드로 검색해보세요</p>
          <Button variant="outline" onClick={() => setSearchTerm("")} className="bg-white">
            전체 뉴스 보기
          </Button>
        </div>
      )}

      {/* 뉴스 상세 모달 */}
      <NewsDetailModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedArticle(null)
        }}
      />
    </div>
  )
}
