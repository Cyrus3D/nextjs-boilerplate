"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, TrendingUp, Clock, Newspaper } from "lucide-react"
import NewsCard from "@/components/news-card"
import NewsDetailModal from "@/components/news-detail-modal"
import { sampleNewsArticles } from "@/data/sample-news"
import type { NewsArticle } from "@/types/news"

export default function NewsCardList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("latest")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 필터링 및 정렬된 뉴스 기사
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = sampleNewsArticles

    // 카테고리 필터
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    // 검색 필터
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // 정렬
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          // 속보 우선, 그 다음 최신순
          if (a.isBreaking && !b.isBreaking) return -1
          if (!a.isBreaking && b.isBreaking) return 1
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case "popular":
          return b.viewCount - a.viewCount
        case "readTime":
          return a.readTime - b.readTime
        default:
          return 0
      }
    })
  }, [searchTerm, selectedCategory, sortBy])

  const handleDetailClick = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedArticle(null)
  }

  // 통계 계산
  const stats = useMemo(() => {
    const total = sampleNewsArticles.length
    const breaking = sampleNewsArticles.filter((article) => article.isBreaking).length
    const today = sampleNewsArticles.filter((article) => {
      const today = new Date()
      const articleDate = new Date(article.publishedAt)
      return articleDate.toDateString() === today.toDateString()
    }).length
    const categories = {
      local: sampleNewsArticles.filter((article) => article.category === "현지 뉴스").length,
      business: sampleNewsArticles.filter((article) => article.category === "교민 업체").length,
    }

    return { total, breaking, today, categories }
  }, [])

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Newspaper className="h-6 w-6 text-blue-600" />
              뉴스
            </h2>
            <p className="text-gray-600">태국 현지 뉴스와 교민 업체 소식을 확인하세요</p>
          </div>

          {/* 통계 */}
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">전체</span>
                <span className="text-lg font-bold text-blue-600">{stats.total}</span>
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-600">속보</span>
                <span className="text-lg font-bold text-red-600">{stats.breaking}</span>
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">오늘</span>
                <span className="text-lg font-bold text-green-600">{stats.today}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 검색 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="제목, 내용, 태그로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 카테고리 필터 */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              <SelectItem value="현지 뉴스">현지 뉴스 ({stats.categories.local})</SelectItem>
              <SelectItem value="교민 업체">교민 업체 ({stats.categories.business})</SelectItem>
            </SelectContent>
          </Select>

          {/* 정렬 */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="readTime">읽기 시간순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 결과 요약 */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          총 {filteredAndSortedArticles.length}개의 뉴스
          {searchTerm && ` (검색: "${searchTerm}")`}
          {selectedCategory !== "all" && ` (카테고리: ${selectedCategory})`}
        </span>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span>
            {sortBy === "latest" && "최신순"}
            {sortBy === "popular" && "인기순"}
            {sortBy === "readTime" && "읽기 시간순"}
          </span>
          {(searchTerm || selectedCategory !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
              className="text-xs"
            >
              필터 초기화
            </Button>
          )}
        </div>
      </div>

      {/* 뉴스 카드 그리드 */}
      {filteredAndSortedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedArticles.map((article) => (
            <NewsCard key={article.id} article={article} onDetailClick={handleDetailClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">검색 결과가 없습니다</p>
            <p className="text-sm">다른 키워드나 카테고리로 검색해보세요</p>
          </div>
        </div>
      )}

      {/* 뉴스 상세 모달 */}
      <NewsDetailModal article={selectedArticle} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
