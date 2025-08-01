"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Zap } from "lucide-react"
import NewsCard from "./news-card"
import NewsDetailModal from "./news-detail-modal"
import { sampleNews } from "@/data/sample-news"
import type { NewsArticle } from "@/types/news"

export default function NewsCardList() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // 뉴스 필터링 및 정렬
  const filteredAndSortedNews = useMemo(() => {
    let filtered = sampleNews

    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          article.author.toLowerCase().includes(query),
      )
    }

    // 정렬: 속보 우선 → 최신순 → 조회수순
    return filtered.sort((a, b) => {
      // 속보 우선
      if (a.isBreaking && !b.isBreaking) return -1
      if (!a.isBreaking && b.isBreaking) return 1

      // 최신순
      const dateA = new Date(a.publishedAt).getTime()
      const dateB = new Date(b.publishedAt).getTime()
      if (dateA !== dateB) return dateB - dateA

      // 조회수순
      return b.viewCount - a.viewCount
    })
  }, [searchQuery])

  const handleCardClick = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedArticle(null)
  }

  // 통계 계산
  const stats = useMemo(() => {
    const totalNews = sampleNews.length
    const breakingNews = sampleNews.filter((article) => article.isBreaking).length
    const localNews = sampleNews.filter((article) => article.category === "현지 뉴스").length
    const businessNews = sampleNews.filter((article) => article.category === "교민 업체").length

    return { totalNews, breakingNews, localNews, businessNews }
  }, [])

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📰 최신 뉴스</h2>
            <p className="text-gray-600">태국 현지 소식과 교민 업체 정보를 한눈에 확인하세요</p>
          </div>

          {/* 통계 */}
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">전체</span>
                <span className="text-lg font-bold text-blue-600">{stats.totalNews}</span>
              </div>
            </div>
            {stats.breakingNews > 0 && (
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-600">속보</span>
                  <span className="text-lg font-bold text-red-600">{stats.breakingNews}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 검색 섹션 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="뉴스 제목, 내용, 태그, 작성자로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* 카테고리 통계 */}
      <div className="flex gap-3">
        <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
          현지 뉴스 {stats.localNews}개
        </Badge>
        <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
          교민 업체 {stats.businessNews}개
        </Badge>
      </div>

      {/* 검색 결과 표시 */}
      {searchQuery && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-blue-800">
            <span className="font-semibold">"{searchQuery}"</span> 검색 결과: {filteredAndSortedNews.length}개의 기사
          </p>
        </div>
      )}

      {/* 뉴스 그리드 */}
      {filteredAndSortedNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedNews.map((article) => (
            <NewsCard key={article.id} article={article} onClick={() => handleCardClick(article)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-500">다른 키워드로 검색해보세요.</p>
        </div>
      )}

      {/* 뉴스 상세 모달 */}
      <NewsDetailModal article={selectedArticle} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
