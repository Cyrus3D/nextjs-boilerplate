"use client"

import { useState, useEffect, useMemo, Suspense, lazy } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, TrendingUp, Thermometer, DollarSign, Loader2, Newspaper, Building2 } from "lucide-react"
import BusinessCard from "@/components/business-card"
import NewsCard from "@/components/news-card"
import type { BusinessCard as BusinessCardType, Category } from "@/types/business-card"
import type { NewsArticle, NewsCategory } from "@/types/news"
import {
  getBusinessCardsPaginated,
  getCategories,
  incrementViewCount,
  getCachedData,
  setCachedData,
} from "@/lib/optimized-api"
import { getNewsArticlesPaginated, getNewsCategories, incrementNewsViewCount } from "@/lib/news-api"

// Lazy load components for better performance
const BusinessDetailModal = lazy(() => import("@/components/business-detail-modal"))
const NewsDetailModal = lazy(() => import("@/components/news-detail-modal"))

// Weather and exchange rate interfaces
interface WeatherData {
  temperature: number
  description: string
  humidity: number
  timestamp: number
}

interface ExchangeRateData {
  rate: number
  timestamp: number
  source: string
}

// Skeleton components for loading states
function HeaderSkeleton() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2 bg-white/20" />
          <Skeleton className="h-4 w-96 bg-white/20" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <div className="bg-white/10 rounded-lg p-3 min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-4 h-4" />
              <Skeleton className="h-4 w-16 bg-white/20" />
            </div>
            <Skeleton className="h-3 w-20 bg-white/20" />
          </div>
          <div className="bg-white/10 rounded-lg p-3 min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4" />
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
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-32 w-full rounded-md" />
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

export default function InfoCardList() {
  // Tab state
  const [activeTab, setActiveTab] = useState<string>("business")

  // Business cards state
  const [businessCards, setBusinessCards] = useState<BusinessCardType[]>([])
  const [businessCategories, setBusinessCategories] = useState<Category[]>([])
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState<string>("all")
  const [businessSearchTerm, setBusinessSearchTerm] = useState<string>("")
  const [selectedBusinessCard, setSelectedBusinessCard] = useState<BusinessCardType | null>(null)
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false)

  // News state
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [newsCategories, setNewsCategories] = useState<NewsCategory[]>([])
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>("all")
  const [newsSearchTerm, setNewsSearchTerm] = useState<string>("")
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticle | null>(null)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isBusinessCategoriesLoading, setIsBusinessCategoriesLoading] = useState(true)
  const [isBusinessCardsLoading, setIsBusinessCardsLoading] = useState(true)
  const [isNewsCategoriesLoading, setIsNewsCategoriesLoading] = useState(true)
  const [isNewsLoading, setIsNewsLoading] = useState(true)

  // Weather and exchange rate states
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateData | null>(null)
  const [isWeatherLoading, setIsWeatherLoading] = useState(true)
  const [isExchangeLoading, setIsExchangeLoading] = useState(true)

  // Pagination states
  const [businessCurrentPage, setBusinessCurrentPage] = useState(1)
  const [businessHasMore, setBusinessHasMore] = useState(true)
  const [businessTotal, setBusinessTotal] = useState(0)

  const [newsCurrentPage, setNewsCurrentPage] = useState(1)
  const [newsHasMore, setNewsHasMore] = useState(true)
  const [newsTotal, setNewsTotal] = useState(0)

  // Fetch weather data
  const fetchWeather = async () => {
    try {
      const cached = getCachedData<WeatherData>("weather-bangkok")
      if (cached) {
        setWeather(cached)
        setIsWeatherLoading(false)
        return
      }

      const apiKey = "0e37172b550acf74ed81a76db7f4c89f"
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Bangkok,TH&appid=${apiKey}&units=metric&lang=ko`,
      )

      if (!response.ok) throw new Error("Weather API failed")

      const data = await response.json()
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        timestamp: Date.now(),
      }

      setWeather(weatherData)
      setCachedData("weather-bangkok", weatherData)
    } catch (error) {
      console.error("Weather fetch error:", error)
      const fallbackWeather: WeatherData = {
        temperature: 32,
        description: "맑음",
        humidity: 65,
        timestamp: Date.now(),
      }
      setWeather(fallbackWeather)
    } finally {
      setIsWeatherLoading(false)
    }
  }

  // Fetch exchange rate data
  const fetchExchangeRate = async () => {
    try {
      const cached = getCachedData<ExchangeRateData>("exchange-rate-thb-krw")
      if (cached) {
        setExchangeRate(cached)
        setIsExchangeLoading(false)
        return
      }

      const response = await fetch("https://api.exchangerate-api.com/v4/latest/THB")
      if (!response.ok) throw new Error("Exchange rate API failed")

      const data = await response.json()
      const exchangeData: ExchangeRateData = {
        rate: Math.round(data.rates.KRW * 100) / 100,
        timestamp: Date.now(),
        source: "ExchangeRate-API",
      }

      setExchangeRate(exchangeData)
      setCachedData("exchange-rate-thb-krw", exchangeData)
    } catch (error) {
      console.error("Exchange rate fetch error:", error)
      const fallbackRate: ExchangeRateData = {
        rate: 37.5,
        timestamp: Date.now(),
        source: "Fallback",
      }
      setExchangeRate(fallbackRate)
    } finally {
      setIsExchangeLoading(false)
    }
  }

  // Fetch business categories
  const fetchBusinessCategories = async () => {
    try {
      setIsBusinessCategoriesLoading(true)
      const fetchedCategories = await getCategories()
      setBusinessCategories(fetchedCategories)
    } catch (error) {
      console.error("Error fetching business categories:", error)
      setBusinessCategories([
        { id: 1, name: "음식점", color_class: "bg-red-100 text-red-800" },
        { id: 2, name: "서비스", color_class: "bg-blue-100 text-blue-800" },
        { id: 3, name: "쇼핑", color_class: "bg-green-100 text-green-800" },
      ])
    } finally {
      setIsBusinessCategoriesLoading(false)
    }
  }

  // Fetch news categories
  const fetchNewsCategories = async () => {
    try {
      setIsNewsCategoriesLoading(true)
      const fetchedCategories = await getNewsCategories()
      setNewsCategories(fetchedCategories)
    } catch (error) {
      console.error("Error fetching news categories:", error)
      setNewsCategories([
        { id: 1, name: "정책", color_class: "bg-blue-100 text-blue-800" },
        { id: 2, name: "교통", color_class: "bg-green-100 text-green-800" },
        { id: 3, name: "커뮤니티", color_class: "bg-purple-100 text-purple-800" },
      ])
    } finally {
      setIsNewsCategoriesLoading(false)
    }
  }

  // Fetch business cards
  const fetchBusinessCards = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setIsBusinessCardsLoading(true)
      }

      let categoryFilter: string | undefined = undefined
      if (selectedBusinessCategory !== "all") {
        const selectedCategoryObj = businessCategories.find((cat) => cat.name === selectedBusinessCategory)
        categoryFilter = selectedCategoryObj?.name
      }

      const result = await getBusinessCardsPaginated(page, 20, categoryFilter, businessSearchTerm || undefined)

      if (reset) {
        setBusinessCards(result.cards)
      } else {
        setBusinessCards((prev) => [...prev, ...result.cards])
      }

      setBusinessHasMore(result.hasMore)
      setBusinessTotal(result.total)
      setBusinessCurrentPage(page)
    } catch (error) {
      console.error("Error fetching business cards:", error)
      if (reset) {
        setBusinessCards([])
      }
    } finally {
      setIsBusinessCardsLoading(false)
    }
  }

  // Fetch news articles
  const fetchNewsArticles = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setIsNewsLoading(true)
      }

      let categoryFilter: string | undefined = undefined
      if (selectedNewsCategory !== "all") {
        const selectedCategoryObj = newsCategories.find((cat) => cat.name === selectedNewsCategory)
        categoryFilter = selectedCategoryObj?.name
      }

      const result = await getNewsArticlesPaginated(page, 20, categoryFilter, newsSearchTerm || undefined)

      if (reset) {
        setNewsArticles(result.articles)
      } else {
        setNewsArticles((prev) => [...prev, ...result.articles])
      }

      setNewsHasMore(result.hasMore)
      setNewsTotal(result.total)
      setNewsCurrentPage(page)
    } catch (error) {
      console.error("Error fetching news articles:", error)
      if (reset) {
        setNewsArticles([])
      }
    } finally {
      setIsNewsLoading(false)
    }
  }

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      // Load categories first
      await Promise.all([fetchBusinessCategories(), fetchNewsCategories()])

      // Load initial content based on active tab
      if (activeTab === "business") {
        await fetchBusinessCards(1, true)
      } else {
        await fetchNewsArticles(1, true)
      }

      // Load weather and exchange rate in background
      setTimeout(() => {
        fetchWeather()
        fetchExchangeRate()
      }, 100)

      setIsLoading(false)
    }

    loadInitialData()
  }, [])

  // Handle tab change
  useEffect(() => {
    if (activeTab === "business" && businessCards.length === 0) {
      fetchBusinessCards(1, true)
    } else if (activeTab === "news" && newsArticles.length === 0) {
      fetchNewsArticles(1, true)
    }
  }, [activeTab])

  // Handle business category and search changes
  useEffect(() => {
    if (activeTab !== "business") return

    const timeoutId = setTimeout(() => {
      setBusinessCurrentPage(1)
      fetchBusinessCards(1, true)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [selectedBusinessCategory, businessSearchTerm, businessCategories, activeTab])

  // Handle news category and search changes
  useEffect(() => {
    if (activeTab !== "news") return

    const timeoutId = setTimeout(() => {
      setNewsCurrentPage(1)
      fetchNewsArticles(1, true)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [selectedNewsCategory, newsSearchTerm, newsCategories, activeTab])

  // Handle business card detail click
  const handleBusinessDetailClick = (card: BusinessCardType) => {
    setSelectedBusinessCard(card)
    setIsBusinessModalOpen(true)
    incrementViewCount(card.id)
  }

  // Handle news article detail click
  const handleNewsDetailClick = (article: NewsArticle) => {
    setSelectedNewsArticle(article)
    setIsNewsModalOpen(true)
    incrementNewsViewCount(article.id)
  }

  // Handle load more for business cards
  const handleBusinessLoadMore = () => {
    if (businessHasMore && !isBusinessCardsLoading) {
      fetchBusinessCards(businessCurrentPage + 1, false)
    }
  }

  // Handle load more for news
  const handleNewsLoadMore = () => {
    if (newsHasMore && !isNewsLoading) {
      fetchNewsArticles(newsCurrentPage + 1, false)
    }
  }

  // Memoized sorted business cards
  const sortedBusinessCards = useMemo(() => {
    return [...businessCards].sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1
      if (!a.isPremium && b.isPremium) return 1
      if (a.isPromoted && !b.isPromoted) return -1
      if (!a.isPromoted && b.isPromoted) return 1
      if (a.exposureCount !== b.exposureCount) {
        return (b.exposureCount || 0) - (a.exposureCount || 0)
      }
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    })
  }, [businessCards])

  // Memoized sorted news articles
  const sortedNewsArticles = useMemo(() => {
    return [...newsArticles].sort((a, b) => {
      if (a.is_breaking && !b.is_breaking) return -1
      if (!a.is_breaking && b.is_breaking) return 1
      if (a.is_featured && !b.is_featured) return -1
      if (!a.is_featured && b.is_featured) return 1
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    })
  }, [newsArticles])

  // Format time for display
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header with Weather and Exchange Rate */}
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">🔥 핫타이 HOT THAI</h1>
              <p className="text-orange-100">태국 현지 뉴스와 한인 업체 정보를 한 곳에서 찾아보세요</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              {/* Weather Info */}
              <div className="bg-white/10 rounded-lg p-3 min-w-[140px]">
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer className="w-4 h-4" />
                  <span className="font-medium">방콕 날씨</span>
                </div>
                {isWeatherLoading ? (
                  <div className="text-orange-100">로딩 중...</div>
                ) : weather ? (
                  <div className="text-orange-100">
                    {weather.temperature}°C, {weather.description}
                  </div>
                ) : (
                  <div className="text-orange-100">정보 없음</div>
                )}
              </div>

              {/* Exchange Rate Info */}
              <div className="bg-white/10 rounded-lg p-3 min-w-[140px]">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">환율 (THB→KRW)</span>
                </div>
                {isExchangeLoading ? (
                  <div className="text-orange-100">로딩 중...</div>
                ) : exchangeRate ? (
                  <div className="text-orange-100">
                    1 THB = {exchangeRate.rate} KRW
                    <div className="text-xs opacity-75 mt-1">
                      {exchangeRate.source} • {formatTime(exchangeRate.timestamp)}
                    </div>
                  </div>
                ) : (
                  <div className="text-orange-100">정보 없음</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            현지 뉴스
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            교민 업체
          </TabsTrigger>
        </TabsList>

        {/* News Tab Content */}
        <TabsContent value="news" className="space-y-6">
          {/* News Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="뉴스 제목, 내용으로 검색..."
                value={newsSearchTerm}
                onChange={(e) => setNewsSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedNewsCategory}
              onValueChange={(value) => {
                setSelectedNewsCategory(value)
                setNewsCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="뉴스 카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {isNewsCategoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    로딩 중...
                  </SelectItem>
                ) : (
                  newsCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* News Results Summary */}
          {!isLoading && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                총 {newsTotal}개의 뉴스
                {newsSearchTerm && ` (검색: "${newsSearchTerm}")`}
                {selectedNewsCategory !== "all" && ` (카테고리: ${selectedNewsCategory})`}
              </span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>최신순 정렬</span>
                {(newsSearchTerm || selectedNewsCategory !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNewsSearchTerm("")
                      setSelectedNewsCategory("all")
                    }}
                    className="text-xs"
                  >
                    필터 초기화
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* News Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isNewsLoading && newsArticles.length === 0 ? (
              Array.from({ length: 8 }).map((_, index) => <CardSkeleton key={index} />)
            ) : sortedNewsArticles.length > 0 ? (
              sortedNewsArticles.map((article, index) => (
                <div key={article.id} className="h-full">
                  <NewsCard article={article} onDetailClick={handleNewsDetailClick} />
                  {(index + 1) % 8 === 0 && (
                    <div className="col-span-full my-4">
                      <Card className="p-4 bg-gray-50 border-dashed">
                        <div className="text-center text-gray-500 text-sm">광고 영역</div>
                      </Card>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">뉴스가 없습니다</p>
                  <p className="text-sm">다른 키워드나 카테고리로 검색해보세요</p>
                </div>
              </div>
            )}
          </div>

          {/* News Load More Button */}
          {newsHasMore && !isNewsLoading && sortedNewsArticles.length > 0 && (
            <div className="text-center">
              <Button onClick={handleNewsLoadMore} variant="outline" size="lg" className="min-w-[200px] bg-transparent">
                더 보기 ({sortedNewsArticles.length}/{newsTotal})
              </Button>
            </div>
          )}

          {/* News Loading indicator */}
          {isNewsLoading && newsArticles.length > 0 && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-2">로딩 중...</p>
            </div>
          )}
        </TabsContent>

        {/* Business Tab Content */}
        <TabsContent value="business" className="space-y-6">
          {/* Business Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="업체명, 설명으로 검색..."
                value={businessSearchTerm}
                onChange={(e) => setBusinessSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedBusinessCategory}
              onValueChange={(value) => {
                setSelectedBusinessCategory(value)
                setBusinessCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="업체 카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {isBusinessCategoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    로딩 중...
                  </SelectItem>
                ) : (
                  businessCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Business Results Summary */}
          {!isLoading && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                총 {businessTotal}개의 업체 정보
                {businessSearchTerm && ` (검색: "${businessSearchTerm}")`}
                {selectedBusinessCategory !== "all" && ` (카테고리: ${selectedBusinessCategory})`}
              </span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>인기순 정렬</span>
                {(businessSearchTerm || selectedBusinessCategory !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setBusinessSearchTerm("")
                      setSelectedBusinessCategory("all")
                    }}
                    className="text-xs"
                  >
                    필터 초기화
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Business Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isBusinessCardsLoading && businessCards.length === 0 ? (
              Array.from({ length: 8 }).map((_, index) => <CardSkeleton key={index} />)
            ) : sortedBusinessCards.length > 0 ? (
              sortedBusinessCards.map((card, index) => (
                <div key={card.id} className="h-full">
                  <BusinessCard card={card} onDetailClick={handleBusinessDetailClick} />
                  {(index + 1) % 8 === 0 && (
                    <div className="col-span-full my-4">
                      <Card className="p-4 bg-gray-50 border-dashed">
                        <div className="text-center text-gray-500 text-sm">광고 영역</div>
                      </Card>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">검색 결과가 없습니다</p>
                  <p className="text-sm">다른 키워드나 카테고리로 검색해보세요</p>
                </div>
              </div>
            )}
          </div>

          {/* Business Load More Button */}
          {businessHasMore && !isBusinessCardsLoading && sortedBusinessCards.length > 0 && (
            <div className="text-center">
              <Button
                onClick={handleBusinessLoadMore}
                variant="outline"
                size="lg"
                className="min-w-[200px] bg-transparent"
              >
                더 보기 ({sortedBusinessCards.length}/{businessTotal})
              </Button>
            </div>
          )}

          {/* Business Loading indicator */}
          {isBusinessCardsLoading && businessCards.length > 0 && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-2">로딩 중...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Business Detail Modal */}
      <Suspense fallback={<div>Loading modal...</div>}>
        <BusinessDetailModal
          card={selectedBusinessCard}
          isOpen={isBusinessModalOpen}
          onClose={() => {
            setIsBusinessModalOpen(false)
            setSelectedBusinessCard(null)
          }}
        />
      </Suspense>

      {/* News Detail Modal */}
      <Suspense fallback={<div>Loading modal...</div>}>
        <NewsDetailModal
          article={selectedNewsArticle}
          isOpen={isNewsModalOpen}
          onClose={() => {
            setIsNewsModalOpen(false)
            setSelectedNewsArticle(null)
          }}
        />
      </Suspense>
    </div>
  )
}
