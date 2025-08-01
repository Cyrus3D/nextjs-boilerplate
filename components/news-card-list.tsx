"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import NewsCard from "./news-card"
import NewsDetailModal from "./news-detail-modal"
import { incrementNewsViewCount } from "@/lib/api"
import type { NewsArticle } from "@/types/news"

interface NewsCardListProps {
  initialArticles: NewsArticle[]
}

const categories = [
  { name: "전체", value: "" },
  { name: "현지", value: "현지 뉴스" },
  { name: "업체", value: "교민 업체" },
  { name: "정책", value: "정책" },
  { name: "교통", value: "교통" },
  { name: "비자", value: "비자" },
  { name: "경제", value: "경제" },
  { name: "문화", value: "문화" },
]

export default function NewsCardList({ initialArticles }: NewsCardListProps) {
  const [articles] = useState<NewsArticle[]>(initialArticles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter and search articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        searchTerm === "" ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "" || article.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [articles, searchTerm, selectedCategory])

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    articles.forEach((article) => {
      counts[article.category] = (counts[article.category] || 0) + 1
    })
    return counts
  }, [articles])

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
    incrementNewsViewCount(article.id)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedArticle(null)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="뉴스 제목, 내용으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const count = category.value === "" ? articles.length : categoryCounts[category.value] || 0
          const isActive = selectedCategory === category.value

          return (
            <Button
              key={category.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center gap-2 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}
            >
              <Filter className="w-3 h-3" />
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs">
                {count}
              </Badge>
            </Button>
          )
        })}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          총 {filteredArticles.length}개의 뉴스
          {searchTerm && ` (검색: "${searchTerm}")`}
          {selectedCategory && ` (카테고리: ${categories.find((c) => c.value === selectedCategory)?.name})`}
        </span>
        {(searchTerm || selectedCategory) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("")
            }}
            className="text-xs"
          >
            필터 초기화
          </Button>
        )}
      </div>

      {/* News Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <div key={article.id}>
              <NewsCard article={article} onClick={() => handleArticleClick(article)} />
              {/* Insert ads every 9 articles */}
              {(index + 1) % 9 === 0 && (
                <div className="col-span-full my-4 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                  <div className="text-center text-gray-500 text-sm">광고 영역</div>
                </div>
              )}
            </div>
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
      <NewsDetailModal article={selectedArticle} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
