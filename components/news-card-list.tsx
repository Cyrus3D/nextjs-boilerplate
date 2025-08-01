"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { NewsCard } from "@/components/news-card"
import { NewsDetailModal } from "@/components/news-detail-modal"
import { getNewsArticles, searchNewsArticles } from "@/lib/api"
import { debounce } from "@/lib/utils"
import type { NewsArticle } from "@/types/news"
import { Search, Filter, RefreshCw, Zap } from "lucide-react"

const NEWS_CATEGORIES = [
  "all",
  "현지",
  "업체",
  "정책",
  "교통",
  "비자",
  "경제",
  "문화",
  "사회",
  "스포츠",
  "연예",
  "기술",
  "건강",
]

export function NewsCardList() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showBreakingOnly, setShowBreakingOnly] = useState(false)

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string, category: string) => {
        setLoading(true)
        try {
          if (term.trim() || category !== "all") {
            const results = await searchNewsArticles(term, category === "all" ? undefined : category)
            setArticles(results)
          } else {
            const results = await getNewsArticles()
            setArticles(results)
          }
        } catch (error) {
          console.error("Error searching articles:", error)
        } finally {
          setLoading(false)
        }
      }, 300),
    [],
  )

  // Load initial articles
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true)
      try {
        const results = await getNewsArticles()
        setArticles(results)
      } catch (error) {
        console.error("Error loading articles:", error)
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [])

  // Handle search and filter changes
  useEffect(() => {
    debouncedSearch(searchTerm, selectedCategory)
  }, [searchTerm, selectedCategory, debouncedSearch])

  // Filter articles based on breaking news toggle
  const filteredArticles = useMemo(() => {
    if (showBreakingOnly) {
      return articles.filter((article) => article.isBreaking)
    }
    return articles
  }, [articles, showBreakingOnly])

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const handleRefresh = async () => {
    setLoading(true)
    setSearchTerm("")
    setSelectedCategory("all")
    setShowBreakingOnly(false)
    try {
      const results = await getNewsArticles()
      setArticles(results)
    } catch (error) {
      console.error("Error refreshing articles:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
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
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {NEWS_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "전체" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Breaking News Toggle */}
            <Button
              variant={showBreakingOnly ? "default" : "outline"}
              onClick={() => setShowBreakingOnly(!showBreakingOnly)}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              속보만
            </Button>

            {/* Refresh Button */}
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            총 <strong>{filteredArticles.length}</strong>개의 뉴스
          </span>
          {showBreakingOnly && (
            <Badge variant="destructive" className="animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              속보만 표시
            </Badge>
          )}
          {selectedCategory !== "all" && <Badge variant="secondary">{selectedCategory} 카테고리</Badge>}
          {searchTerm && <Badge variant="outline">"{searchTerm}" 검색 결과</Badge>}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-sm">다른 검색어나 카테고리를 시도해보세요.</p>
            </div>
            <Button variant="outline" onClick={handleRefresh}>
              전체 뉴스 보기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} onClick={() => handleArticleClick(article)} />
          ))}
        </div>
      )}

      {/* News Detail Modal */}
      {selectedArticle && (
        <NewsDetailModal
          article={selectedArticle}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedArticle(null)
          }}
        />
      )}
    </div>
  )
}
