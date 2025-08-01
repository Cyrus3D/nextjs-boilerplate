"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import NewsCard from "@/components/news-card"
import { NewsDetailModal } from "@/components/news-detail-modal"
import { incrementNewsViewCount } from "@/lib/api"
import type { NewsArticle } from "@/types/news"

interface NewsCardListProps {
  initialArticles: NewsArticle[]
}

const categories = [
  { id: "all", name: "전체", count: 0 },
  { id: "현지", name: "현지", count: 0 },
  { id: "업체", name: "업체", count: 0 },
  { id: "정책", name: "정책", count: 0 },
  { id: "교통", name: "교통", count: 0 },
  { id: "비자", name: "비자", count: 0 },
  { id: "경제", name: "경제", count: 0 },
  { id: "문화", name: "문화", count: 0 },
]

export default function NewsCardList({ initialArticles }: NewsCardListProps) {
  const [articles] = useState<NewsArticle[]>(initialArticles)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate category counts
  const categoriesWithCounts = useMemo(() => {
    const counts = categories.map((cat) => ({
      ...cat,
      count: cat.id === "all" ? articles.length : articles.filter((article) => article.category === cat.id).length,
    }))
    return counts
  }, [articles])

  // Filter articles based on category and search term
  const filteredArticles = useMemo(() => {
    let filtered = articles

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(lowercaseSearch) ||
          article.excerpt.toLowerCase().includes(lowercaseSearch) ||
          article.tags.some((tag) => tag.toLowerCase().includes(lowercaseSearch)),
      )
    }

    return filtered
  }, [articles, selectedCategory, searchTerm])

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
    incrementNewsViewCount(article.id)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="뉴스 제목, 내용, 태그로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categoriesWithCounts.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.name}
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          총 {filteredArticles.length}개의 뉴스
          {searchTerm && ` (검색: "${searchTerm}")`}
          {selectedCategory !== "all" && ` (카테고리: ${selectedCategory})`}
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
            <Filter className="w-3 h-3 mr-1" />
            필터 초기화
          </Button>
        )}
      </div>

      {/* News Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} onClick={() => handleArticleClick(article)} />
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

      {/* News Detail Modal */}
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
