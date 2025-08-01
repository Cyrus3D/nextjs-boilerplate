"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { NewsCard } from "@/components/news-card"
import { NewsDetailModal } from "@/components/news-detail-modal"
import { searchNewsArticles } from "@/lib/api"
import { NEWS_CATEGORIES } from "@/types/news"
import type { NewsArticle } from "@/types/news"
import { Search, Filter, X } from "lucide-react"

interface NewsCardListProps {
  initialNews: NewsArticle[]
}

export function NewsCardList({ initialNews }: NewsCardListProps) {
  const [news, setNews] = useState<NewsArticle[]>(initialNews)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter news based on search and category
  const filteredNews = useMemo(() => {
    let filtered = news

    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [news, searchQuery, selectedCategory])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setNews(initialNews)
      return
    }

    setIsLoading(true)
    try {
      const results = await searchNewsArticles(query, selectedCategory !== "all" ? selectedCategory : undefined)
      setNews(results)
    } catch (error) {
      console.error("Search failed:", error)
      setNews(initialNews)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setNews(initialNews)
  }

  const breakingNews = filteredNews.filter((article) => article.isBreaking)
  const regularNews = filteredNews.filter((article) => !article.isBreaking)

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="뉴스 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery)
                }
              }}
              className="pl-10"
            />
          </div>
          <Button onClick={() => handleSearch(searchQuery)} disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            검색
          </Button>
          {(searchQuery || selectedCategory !== "all") && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              초기화
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("all")}
          >
            전체
          </Button>
          {NEWS_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          총 {filteredNews.length}개의 뉴스
          {searchQuery && ` (검색: "${searchQuery}")`}
          {selectedCategory !== "all" && ` (카테고리: ${selectedCategory})`}
        </div>
        {breakingNews.length > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            속보 {breakingNews.length}건
          </Badge>
        )}
      </div>

      {/* Breaking News Section */}
      {breakingNews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="animate-pulse">
              속보
            </Badge>
            <h2 className="text-lg font-semibold">긴급 뉴스</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {breakingNews.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onClick={() => setSelectedArticle(article)}
                className="border-red-200 bg-red-50"
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular News Section */}
      {regularNews.length > 0 && (
        <div className="space-y-4">
          {breakingNews.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <h2 className="text-lg font-semibold">일반 뉴스</h2>
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularNews.map((article) => (
              <NewsCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredNews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
              <p className="text-sm">
                다른 검색어를 시도하거나 필터를 변경해보세요.
                <br />
                모든 뉴스를 보려면 초기화 버튼을 클릭하세요.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
            <span className="text-sm text-gray-600">검색 중...</span>
          </div>
        </div>
      )}

      {/* News Detail Modal */}
      {selectedArticle && (
        <NewsDetailModal
          article={selectedArticle}
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  )
}
