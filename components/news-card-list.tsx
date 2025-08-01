"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, TrendingUp, Clock, Eye } from "lucide-react"
import NewsCard from "@/components/news-card"
import NewsDetailModal from "@/components/news-detail-modal"
import { sampleNews } from "@/data/sample-news"
import type { NewsArticle } from "@/types/news"

export default function NewsCardList() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("latest")

  // Filter and sort news
  const filteredAndSortedNews = useMemo(() => {
    let filtered = sampleNews

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    // Sort articles
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case "popular":
          return b.viewCount - a.viewCount
        case "readTime":
          return a.readTime - b.readTime
        default:
          return 0
      }
    })

    return sorted
  }, [searchTerm, selectedCategory, sortBy])

  const handleReadMore = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedArticle(null)
  }

  const breakingNews = sampleNews.filter((article) => article.isBreaking)
  const localNewsCount = sampleNews.filter((article) => article.category === "local").length
  const businessNewsCount = sampleNews.filter((article) => article.category === "business").length

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📰 최신 뉴스</h2>
            <p className="text-gray-600">태국 현지 소식과 교민 업체 정보를 실시간으로 확인하세요</p>
          </div>

          {/* Statistics */}
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">현지 뉴스</span>
                <span className="text-lg font-bold text-blue-600">{localNewsCount}</span>
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">교민 업체</span>
                <span className="text-lg font-bold text-green-600">{businessNewsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breaking News Banner */}
      {breakingNews.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-red-500 text-white animate-pulse">속보</Badge>
            <span className="font-semibold text-red-800">긴급 뉴스</span>
          </div>
          <div className="space-y-2">
            {breakingNews.map((article) => (
              <button
                key={article.id}
                onClick={() => handleReadMore(article)}
                className="block w-full text-left p-2 hover:bg-red-100 rounded transition-colors"
              >
                <p className="font-medium text-red-900 hover:text-red-700">{article.title}</p>
                <p className="text-sm text-red-600 mt-1">{article.excerpt.substring(0, 100)}...</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="뉴스 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="local">현지 뉴스</SelectItem>
              <SelectItem value="business">교민 업체</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Options */}
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

        {/* Active Filters */}
        {(searchTerm || selectedCategory !== "all") && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">활성 필터:</span>
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                검색: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedCategory === "local" ? "현지 뉴스" : "교민 업체"}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          총 <span className="font-semibold text-gray-900">{filteredAndSortedNews.length}</span>개의 뉴스
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>마지막 업데이트: {new Date().toLocaleTimeString("ko-KR")}</span>
        </div>
      </div>

      {/* News Grid */}
      {filteredAndSortedNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedNews.map((article) => (
            <NewsCard key={article.id} article={article} onReadMore={handleReadMore} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600 mb-4">다른 검색어나 필터를 시도해보세요.</p>
          <Button
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("all")
            }}
            variant="outline"
          >
            필터 초기화
          </Button>
        </div>
      )}

      {/* News Detail Modal */}
      <NewsDetailModal article={selectedArticle} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
