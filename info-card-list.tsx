"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Newspaper, Building2, Search, Filter, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NewsCard from "@/components/news-card"
import BusinessCard from "@/components/business-card"
import NewsDetailModal from "@/components/news-detail-modal"
import BusinessDetailModal from "@/components/business-detail-modal"
import { getBusinessCardsPaginated, getCategories } from "@/lib/optimized-api"
import { sampleNews } from "@/data/sample-news"
import type { BusinessCard as BusinessCardType } from "@/types/business-card"
import type { NewsItem } from "@/types/news"

const InfoCardList = () => {
  const [activeTab, setActiveTab] = useState<string>("news")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [businessCards, setBusinessCards] = useState<BusinessCardType[]>([])
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<Array<{ id: number; name: string; color_class: string }>>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessCardType | null>(null)

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Load categories
      const categoriesData = await getCategories()
      setCategories(categoriesData)

      // Load business cards
      const businessResult = await getBusinessCardsPaginated(1, 20, selectedCategory, searchTerm)
      setBusinessCards(businessResult.cards)
      setHasMore(businessResult.hasMore)

      // Load news items (using sample data for now)
      setNewsItems(sampleNews.slice(0, 20))
    } catch (error) {
      console.error("Error loading initial data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Load more business cards
  const loadMoreBusinessCards = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const result = await getBusinessCardsPaginated(page + 1, 20, selectedCategory, searchTerm)
      setBusinessCards((prev) => [...prev, ...result.cards])
      setHasMore(result.hasMore)
      setPage((prev) => prev + 1)
    } catch (error) {
      console.error("Error loading more cards:", error)
    } finally {
      setLoading(false)
    }
  }, [page, selectedCategory, searchTerm, loading, hasMore])

  // Handle search and filter changes
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (activeTab === "business") {
        loadBusinessCards()
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm, selectedCategory, activeTab])

  const loadBusinessCards = async () => {
    setLoading(true)
    setPage(1)
    try {
      const result = await getBusinessCardsPaginated(1, 20, selectedCategory, searchTerm)
      setBusinessCards(result.cards)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error("Error loading business cards:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter news items based on search term
  const filteredNews = newsItems.filter(
    (news) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const newsTablesExist = true

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            현지 뉴스 {!newsTablesExist && "(DB 없음)"}
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            한인업체 정보
          </TabsTrigger>
        </TabsList>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={activeTab === "news" ? "뉴스 검색..." : "업체 검색..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {activeTab === "business" && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* News Tab Content */}
        <TabsContent value="news" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">현지 뉴스</h2>
            <Badge variant="secondary" className="text-sm">
              {filteredNews.length}개 기사
            </Badge>
          </div>

          {loading && filteredNews.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">뉴스를 불러오는 중...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredNews.map((news) => (
                  <NewsCard key={news.id} news={news} onDetailClick={setSelectedNews} />
                ))}
              </div>

              {filteredNews.length === 0 && (
                <div className="text-center py-12">
                  <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                  <p className="text-gray-500">다른 검색어를 시도해보세요.</p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Business Tab Content */}
        <TabsContent value="business" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">한인업체 정보</h2>
            <Badge variant="secondary" className="text-sm">
              {businessCards.length}개 업체
            </Badge>
          </div>

          {loading && businessCards.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">업체 정보를 불러오는 중...</span>
            </div>
          ) : (
            <>
              {/* 개선된 그리드 레이아웃 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
                {businessCards.map((card) => (
                  <div key={card.id} className="flex">
                    <BusinessCard card={card} onDetailClick={setSelectedBusiness} />
                  </div>
                ))}
              </div>

              {businessCards.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                  <p className="text-gray-500">다른 검색어나 카테고리를 시도해보세요.</p>
                </div>
              )}

              {hasMore && businessCards.length > 0 && (
                <div className="text-center pt-8">
                  <Button
                    onClick={loadMoreBusinessCards}
                    disabled={loading}
                    variant="outline"
                    className="px-8 bg-transparent hover:bg-blue-50 border-blue-200 text-blue-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        불러오는 중...
                      </>
                    ) : (
                      "더 보기"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {selectedNews && (
        <NewsDetailModal news={selectedNews} isOpen={!!selectedNews} onClose={() => setSelectedNews(null)} />
      )}

      {selectedBusiness && (
        <BusinessDetailModal
          card={selectedBusiness}
          isOpen={!!selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </div>
  )
}

export default InfoCardList
