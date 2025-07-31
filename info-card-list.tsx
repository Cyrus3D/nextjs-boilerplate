"use client"

import { useState, useEffect, useMemo, Suspense, lazy } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, Thermometer, DollarSign, Loader2, Building2, Newspaper } from "lucide-react"
import BusinessCard from "@/components/business-card"
import NewsCard from "@/components/news-card"
import type { BusinessCard as BusinessCardType, Category } from "@/types/business-card"
import type { NewsItem } from "@/types/news"
import {
  getBusinessCardsPaginated,
  getCategories,
  incrementViewCount,
  getCachedData,
  setCachedData,
} from "@/lib/optimized-api"
import {
  getNewsPaginated,
  getNewsCategories,
  checkNewsTablesExist,
  incrementNewsViewCount,
} from "@/lib/admin-news-actions"

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

  // Business cards state - Initialize as empty array
  const [cards, setCards] = useState<BusinessCardType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCard, setSelectedCard] = useState<BusinessCardType | null>(null)
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false)

  // News state - Initialize as empty array
  const [news, setNews] = useState<NewsItem[]>([])
  const [newsCategories, setNewsCategories] = useState<any[]>([])
  const [newsSearchTerm, setNewsSearchTerm] = useState<string>("")
  const [newsCategory, setNewsCategory] = useState<string>("all")
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  const [newsTablesExist, setNewsTablesExist] = useState(true)

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [isCardsLoading, setIsCardsLoading] = useState(true)
  const [isNewsLoading, setIsNewsLoading] = useState(true)

  // Weather and exchange rate states
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateData | null>(null)
  const [isWeatherLoading, setIsWeatherLoading] = useState(true)
  const [isExchangeLoading, setIsExchangeLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

  // News pagination state
  const [newsCurrentPage, setNewsCurrentPage] = useState(1)
  const [newsHasMore, setNewsHasMore] = useState(true)
  const [newsTotal, setNewsTotal] = useState(0)

  // Fetch weather data
  const fetchWeather = async () => {
    try {
      // Check cache first
      const cached = getCachedData<WeatherData>("weather-bangkok")
      if (cached) {
        setWeather(cached)
        setIsWeatherLoading(false)
        return
      }

      const apiKey = "0e37172b550acf74ed81a76db7f4c89f" // OpenWeather API key
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
      // Set fallback weather data
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
      // Check cache first
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
      // Set fallback exchange rate
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

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true)
      const fetchedCategories = await getCategories()
      // Ensure categories is always an array
      setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Set fallback categories
      setCategories([
        { id: 1, name: "음식점", color_class: "bg-red-100 text-red-800" },
        { id: 2, name: "서비스", color_class: "bg-blue-100 text-blue-800" },
        { id: 3, name: "쇼핑", color_class: "bg-green-100 text-green-800" },
      ])
    } finally {
      setIsCategoriesLoading(false)
    }
  }

  // Fetch business cards
  const fetchCards = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setIsCardsLoading(true)
      }

      // 카테고리 필터링을 위해 카테고리 ID를 찾습니다
      let categoryFilter: string | undefined = undefined
      if (selectedCategory !== "all") {
        const selectedCategoryObj = categories.find((cat) => cat.name === selectedCategory)
        categoryFilter = selectedCategoryObj?.name
      }

      const result = await getBusinessCardsPaginated(page, 20, categoryFilter, searchTerm || undefined)

      // Ensure result.cards is always an array
      const resultCards = Array.isArray(result.cards) ? result.cards : []

      if (reset) {
        setCards(resultCards)
      } else {
        setCards((prev) => {
          const prevCards = Array.isArray(prev) ? prev : []
          return [...prevCards, ...resultCards]
        })
      }

      setHasMore(Boolean(result.hasMore))
      setTotal(Number(result.total) || 0)
      setCurrentPage(Number(page))
    } catch (error) {
      console.error("Error fetching cards:", error)
      if (reset) {
        setCards([])
      }
    } finally {
      setIsCardsLoading(false)
      setIsLoading(false)
    }
  }

  // Fetch news from database
  const fetchNews = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setIsNewsLoading(true)
      }

      // Check if news tables exist first
      const tablesExist = await checkNewsTablesExist()
      setNewsTablesExist(tablesExist)

      if (!tablesExist) {
        setNews([])
        setNewsTotal(0)
        setNewsHasMore(false)
        return
      }

      // Prepare filters
      const filters: any = {}
      if (newsCategory !== "all") {
        filters.category = newsCategory
      }
      if (newsSearchTerm) {
        filters.search = newsSearchTerm
      }

      const result = await getNewsPaginated(page, 12, filters)

      // Transform database news to match NewsItem interface
      const transformedNews: NewsItem[] = result.news.map((dbNews: any) => ({
        id: dbNews.id,
        title: dbNews.title || "",
        summary: dbNews.summary || "",
        content: dbNews.content || "",
        content_ko: dbNews.content_ko || dbNews.content,
        source: dbNews.author || "알 수 없음",
        source_url: dbNews.source_url || "",
        author: dbNews.author || "",
        published_at: dbNews.published_at || dbNews.created_at,
        created_at: dbNews.created_at,
        updated_at: dbNews.updated_at,
        category: dbNews.category?.name || "일반",
        tags: dbNews.tags?.map((tag: any) => tag.name) || [],
        language: dbNews.original_language || "ko",
        location: "태국",
        ai_analysis: dbNews.ai_analysis || "",
        reading_time: Math.ceil((dbNews.content?.length || 0) / 200), // Estimate reading time
        view_count: dbNews.view_count || 0,
        is_featured: dbNews.is_featured || false,
        is_active: dbNews.is_active !== false,
      }))

      if (reset) {
        setNews(transformedNews)
      } else {
        setNews((prev) => {
          const prevNews = Array.isArray(prev) ? prev : []
          return [...prevNews, ...transformedNews]
        })
      }

      setNewsHasMore(Boolean(result.hasMore))
      setNewsTotal(Number(result.total) || 0)
      setNewsCurrentPage(Number(page))
    } catch (error) {
      console.error("Error fetching news:", error)
      setNewsTablesExist(false)
      if (reset) {
        setNews([])
      }
    } finally {
      setIsNewsLoading(false)
    }
  }

  // Fetch news categories
  const fetchNewsCategories = async () => {
    try {
      const tablesExist = await checkNewsTablesExist()
      if (!tablesExist) {
        setNewsCategories([])
        return
      }

      const categories = await getNewsCategories()
      setNewsCategories(Array.isArray(categories) ? categories : [])
    } catch (error) {
      console.error("Error fetching news categories:", error)
      setNewsCategories([])
    }
  }

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      // Load categories first (highest priority)
      await fetchCategories()

      // Load business cards second (high priority)
      await fetchCards(1, true)

      // Load news data from database
      await Promise.all([fetchNews(1, true), fetchNewsCategories()])

      // Load weather and exchange rate in background (lower priority)
      setTimeout(() => {
        fetchWeather()
        fetchExchangeRate()
      }, 100)
    }

    loadInitialData()
  }, [])

  // Handle category and search changes for business cards
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1) // 페이지를 1로 리셋
      fetchCards(1, true)
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [selectedCategory, searchTerm, categories]) // categories 의존성 추가

  // Handle news search and category changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNewsCurrentPage(1) // 페이지를 1로 리셋
      fetchNews(1, true)
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [newsSearchTerm, newsCategory])

  // Handle card detail click
  const handleBusinessDetailClick = (card: BusinessCardType) => {
    setSelectedCard(card)
    setIsBusinessModalOpen(true)
    incrementViewCount(card.id)
  }

  // Handle news detail click
  const handleNewsDetailClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem)
    setIsNewsModalOpen(true)
    // Increment news view count
    if (newsItem.id) {
      incrementNewsViewCount(newsItem.id)
    }
  }

  // Handle load more for business cards
  const handleLoadMore = () => {
    if (hasMore && !isCardsLoading) {
      fetchCards(currentPage + 1, false)
    }
  }

  // Handle load more for news
  const handleNewsLoadMore = () => {
    if (newsHasMore && !isNewsLoading) {
      fetchNews(newsCurrentPage + 1, false)
    }
  }

  // Memoized filtered and sorted cards
  const sortedCards = useMemo(() => {
    const cardsArray = Array.isArray(cards) ? cards : []
    return [...cardsArray].sort((a, b) => {
      // Premium cards first
      if (a.isPremium && !b.isPremium) return -1
      if (!a.isPremium && b.isPremium) return 1

      // Then by promoted status
      if (a.isPromoted && !b.isPromoted) return -1
      if (!a.isPromoted && b.isPromoted) return 1

      // Then by exposure count
      if (a.exposureCount !== b.exposureCount) {
        return (b.exposureCount || 0) - (a.exposureCount || 0)
      }

      // Finally by creation date
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    })
  }, [cards])

  // Sorted news (already filtered by database query)
  const sortedNews = useMemo(() => {
    const newsArray = Array.isArray(news) ? news : []
    return [...newsArray].sort((a, b) => {
      // Featured news first
      if (a.is_featured && !b.is_featured) return -1
      if (!a.is_featured && b.is_featured) return 1

      // Then by published date
      return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime()
    })
  }, [news])

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
              <p className="text-orange-100">태국에서 필요한 모든 한인 업체 정보와 현지 뉴스를 한 곳에서 찾아보세요</p>
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            한인업체 정보
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            현지 뉴스 {!newsTablesExist && "(DB 없음)"}
          </TabsTrigger>
        </TabsList>

        {/* Business Tab Content */}
        <TabsContent value="business" className="space-y-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="업체명, 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value)
                setCurrentPage(1) // 페이지 리셋
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {isCategoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    로딩 중...
                  </SelectItem>
                ) : (
                  Array.isArray(categories) &&
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          {!isLoading && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                총 {total}개의 업체 정보
                {searchTerm && ` (검색: "${searchTerm}")`}
                {selectedCategory !== "all" && ` (카테고리: ${selectedCategory})`}
              </span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>인기순 정렬</span>
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
          )}

          {/* Business Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isCardsLoading && (!Array.isArray(sortedCards) || sortedCards.length === 0) ? (
              // Initial loading skeletons
              Array.from({ length: 8 }).map((_, index) => <CardSkeleton key={index} />)
            ) : Array.isArray(sortedCards) && sortedCards.length > 0 ? (
              sortedCards.map((card, index) => (
                <div key={card.id} className="h-full">
                  <BusinessCard card={card} onDetailClick={handleBusinessDetailClick} />
                  {/* Insert ads every 8 cards */}
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
              // No results
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">검색 결과가 없습니다</p>
                  <p className="text-sm">다른 키워드나 카테고리로 검색해보세요</p>
                </div>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && !isCardsLoading && Array.isArray(sortedCards) && sortedCards.length > 0 && (
            <div className="text-center">
              <Button onClick={handleLoadMore} variant="outline" size="lg" className="min-w-[200px] bg-transparent">
                더 보기 ({sortedCards.length}/{total})
              </Button>
            </div>
          )}

          {/* Loading indicator for pagination */}
          {isCardsLoading && Array.isArray(cards) && cards.length > 0 && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-2">로딩 중...</p>
            </div>
          )}
        </TabsContent>

        {/* News Tab Content */}
        <TabsContent value="news" className="space-y-6">
          {newsTablesExist ? (
            <>
              {/* News Search and Filter */}
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

                <Select value={newsCategory} onValueChange={setNewsCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 카테고리</SelectItem>
                    {Array.isArray(newsCategories) &&
                      newsCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* News Results Summary */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  총 {newsTotal}개의 뉴스
                  {newsSearchTerm && ` (검색: "${newsSearchTerm}")`}
                  {newsCategory !== "all" && ` (카테고리: ${newsCategory})`}
                </span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>최신순 정렬</span>
                  {(newsSearchTerm || newsCategory !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewsSearchTerm("")
                        setNewsCategory("all")
                      }}
                      className="text-xs"
                    >
                      필터 초기화
                    </Button>
                  )}
                </div>
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isNewsLoading && (!Array.isArray(sortedNews) || sortedNews.length === 0) ? (
                  // Initial loading skeletons
                  Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={index} />)
                ) : Array.isArray(sortedNews) && sortedNews.length > 0 ? (
                  sortedNews.map((newsItem, index) => (
                    <div key={newsItem.id} className="h-full">
                      <NewsCard news={newsItem} onDetailClick={handleNewsDetailClick} />
                      {/* Insert ads every 6 news items */}
                      {(index + 1) % 6 === 0 && (
                        <div className="col-span-full my-4">
                          <Card className="p-4 bg-gray-50 border-dashed">
                            <div className="text-center text-gray-500 text-sm">광고 영역</div>
                          </Card>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  // No news results
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">
                        {newsSearchTerm || newsCategory !== "all" ? "검색 결과가 없습니다" : "뉴스가 없습니다"}
                      </p>
                      <p className="text-sm">
                        {newsSearchTerm || newsCategory !== "all"
                          ? "다른 키워드나 카테고리로 검색해보세요"
                          : "관리자 페이지에서 뉴스를 추가해주세요"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Load More Button for News */}
              {newsHasMore && !isNewsLoading && Array.isArray(sortedNews) && sortedNews.length > 0 && (
                <div className="text-center">
                  <Button
                    onClick={handleNewsLoadMore}
                    variant="outline"
                    size="lg"
                    className="min-w-[200px] bg-transparent"
                  >
                    더 보기 ({sortedNews.length}/{newsTotal})
                  </Button>
                </div>
              )}

              {/* Loading indicator for news pagination */}
              {isNewsLoading && Array.isArray(news) && news.length > 0 && (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">뉴스 로딩 중...</p>
                </div>
              )}
            </>
          ) : (
            // News tables don't exist
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">뉴스 데이터베이스가 설정되지 않았습니다</p>
                <p className="text-sm">관리자에게 문의하여 뉴스 테이블을 생성해주세요</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Business Detail Modal */}
      <Suspense fallback={<div>Loading modal...</div>}>
        <BusinessDetailModal
          card={selectedCard}
          isOpen={isBusinessModalOpen}
          onClose={() => {
            setIsBusinessModalOpen(false)
            setSelectedCard(null)
          }}
        />
      </Suspense>

      {/* News Detail Modal */}
      <Suspense fallback={<div>Loading modal...</div>}>
        <NewsDetailModal
          news={selectedNews}
          isOpen={isNewsModalOpen}
          onClose={() => {
            setIsNewsModalOpen(false)
            setSelectedNews(null)
          }}
        />
      </Suspense>
    </div>
  )
}
