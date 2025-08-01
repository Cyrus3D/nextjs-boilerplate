"use client"

import { useState, useEffect, useMemo, Suspense, lazy } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, TrendingUp, Newspaper, Building2, Loader2 } from "lucide-react"
import NewsCard from "@/components/news-card"
import InFeedAd from "@/components/in-feed-ad"
import type { NewsArticle } from "@/types/news"
import { sampleNewsArticles } from "@/data/sample-news"

// Lazy load components for better performance
const NewsDetailModal = lazy(() =>
  import("@/components/news-detail-modal").then((module) => ({ default: module.NewsDetailModal })),
)

// Skeleton components for loading states
function HeaderSkeleton() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2 bg-white/20" />
          <Skeleton className="h-4 w-96 bg-white/20" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <div className="bg-white/10 rounded-lg p-3 min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <Newspaper className="w-4 h-4" />
              <Skeleton className="h-4 w-16 bg-white/20" />
            </div>
            <Skeleton className="h-3 w-20 bg-white/20" />
          </div>
          <div className="bg-white/10 rounded-lg p-3 min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4" />
              <Skeleton className="h-4 w-20 bg-white/20" />
            </div>
            <Skeleton className="h-3 w-24 bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <Card className="h-full">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  )
}

export default function NewsCardList() {
  // State management
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("local")

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isArticlesLoading, setIsArticlesLoading] = useState(true)

  // Statistics
  const [stats, setStats] = useState({
    totalArticles: 0,
    todayArticles: 0,
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

  // Fetch articles (simulated)
  const fetchArticles = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setIsArticlesLoading(true)
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Filter articles based on active tab and search term
      let filteredArticles = sampleNewsArticles

      // Filter by category
      if (activeTab === "local") {
        filteredArticles = filteredArticles.filter((article) => article.category === "현지 뉴스")
      } else if (activeTab === "business") {
        filteredArticles = filteredArticles.filter((article) => article.category === "교민 업체")
      }

      // Filter by search term
      if (searchTerm) {
        filteredArticles = filteredArticles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      if (reset) {
        setArticles(filteredArticles)
      } else {
        setArticles((prev) => [...prev, ...filteredArticles])
      }

      setTotal(filteredArticles.length)
      setHasMore(false) // For demo, we don't have pagination
      setCurrentPage(page)

      // Update stats
      setStats({
        totalArticles: sampleNewsArticles.length,
        todayArticles: sampleNewsArticles.filter((article) => {
          const today = new Date()
          const articleDate = new Date(article.publishedAt)
          return articleDate.toDateString() === today.toDateString()
        }).length,
      })
    } catch (error) {
      console.error("Error fetching articles:", error)
      if (reset) {
        setArticles([])
      }
    } finally {
      setIsArticlesLoading(false)
      setIsLoading(false)
    }
  }

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchArticles(1, true)
    }

    loadInitialData()
  }, [])

  // Handle tab and search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1)
      fetchArticles(1, true)
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [activeTab, searchTerm])

  // Handle article detail click
  const handleDetailClick = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
    // Increment view count (실제 구현시 API 호출)
    console.log(`Incrementing view count for article: ${article.id}`)
  }

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !isArticlesLoading) {
      fetchArticles(currentPage + 1, false)
    }
  }

  // Memoized filtered and sorted articles
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      // Breaking news first
      if (a.isBreaking && !b.isBreaking) return -1
      if (!a.isBreaking && b.isBreaking) return 1

      // Then by view count
      if (a.viewCount !== b.viewCount) {
        return b.viewCount - a.viewCount
      }

      // Finally by publication date
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
  }, [articles])

  // Get category counts
  const getCategoryCount = (category: string) => {
    if (category === "local") {
      return sampleNewsArticles.filter((article) => article.category === "현지 뉴스").length
    } else if (category === "business") {
      return sampleNewsArticles.filter((article) => article.category === "교민 업체").length
    }
    return sampleNewsArticles.length
  }

  // Format time for display
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header with News Statistics */}
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">📰 태국 뉴스</h1>
              <p className="text-blue-100">최신 현지 소식과 교민 업체 정보를 한 곳에서 확인하세요</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              {/* Today's Articles */}
              <div className="bg-white/10 rounded-lg p-3 min-w-[140px]">
                <div className="flex items-center gap-2 mb-1">
                  <Newspaper className="w-4 h-4" />
                  <span className="font-medium">오늘의 뉴스</span>
                </div>
                <div className="text-blue-100">{stats.todayArticles}개 기사</div>
              </div>

              {/* Total Articles */}
              <div className="bg-white/10 rounded-lg p-3 min-w-[140px]">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">전체 기사</span>
                </div>
                <div className="text-blue-100">
                  {stats.totalArticles}개 기사
                  <div className="text-xs opacity-75 mt-1">업데이트: {formatTime(Date.now())}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="기사 제목, 내용으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* News Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local" className="flex items-center gap-2">
            현지 뉴스
            <span className="bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-xs">
              {getCategoryCount("local")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            교민 업체
            <span className="bg-green-200 text-green-700 px-2 py-0.5 rounded-full text-xs">
              {getCategoryCount("business")}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Results Summary */}
          {!isLoading && (
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>
                총 {total}개의 기사
                {searchTerm && ` (검색: "${searchTerm}")`}
              </span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>인기순 정렬</span>
                {searchTerm && (
                  <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="text-xs">
                    검색 초기화
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* News Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isArticlesLoading && articles.length === 0 ? (
              // Initial loading skeletons
              Array.from({ length: 8 }).map((_, index) => <CardSkeleton key={index} />)
            ) : sortedArticles.length > 0 ? (
              sortedArticles.map((article, index) => (
                <div key={article.id} className="h-full">
                  <NewsCard article={article} onDetailClick={handleDetailClick} />
                  {/* Insert ads every 8 articles */}
                  {(index + 1) % 8 === 0 && (
                    <div className="col-span-full my-4">
                      <InFeedAd
                        adSlot={process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT || "1234567890"}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              // No results
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">검색 결과가 없습니다</p>
                  <p className="text-sm">다른 키워드로 검색해보세요</p>
                </div>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && !isArticlesLoading && sortedArticles.length > 0 && (
            <div className="text-center mt-8">
              <Button onClick={handleLoadMore} variant="outline" size="lg" className="min-w-[200px] bg-transparent">
                더 보기 ({sortedArticles.length}/{total})
              </Button>
            </div>
          )}

          {/* Loading indicator for pagination */}
          {isArticlesLoading && articles.length > 0 && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-2">로딩 중...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* News Detail Modal */}
      <Suspense fallback={<div>Loading modal...</div>}>
        <NewsDetailModal
          article={selectedArticle}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedArticle(null)
          }}
        />
      </Suspense>
    </div>
  )
}
