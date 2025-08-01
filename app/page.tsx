"use client"

import { useState, useEffect, useMemo, Suspense, lazy } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Thermometer, DollarSign, Newspaper, Building2, Badge, Users, MapPin } from "lucide-react"
import NewsCardList from "@/components/news-card-list"
import InfiniteScrollCards from "@/components/infinite-scroll-cards"
import type { BusinessCard as BusinessCardType, Category } from "@/types/business-card"
import {
  getBusinessCardsPaginated,
  getCategories,
  incrementViewCount,
  getCachedData,
  setCachedData,
} from "@/lib/optimized-api"

// Lazy load components for better performance
const BusinessDetailModal = lazy(() => import("@/components/business-detail-modal"))

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
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
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
      </div>
    </Card>
  )
}

export default function HomePage() {
  // State management
  const [cards, setCards] = useState<BusinessCardType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCard, setSelectedCard] = useState<BusinessCardType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("news")

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [isCardsLoading, setIsCardsLoading] = useState(true)

  // Weather and exchange rate states
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateData | null>(null)
  const [isWeatherLoading, setIsWeatherLoading] = useState(true)
  const [isExchangeLoading, setIsExchangeLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

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
      setCategories(fetchedCategories)
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

      if (reset) {
        setCards(result.cards)
      } else {
        setCards((prev) => [...prev, ...result.cards])
      }

      setHasMore(result.hasMore)
      setTotal(result.total)
      setCurrentPage(page)
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

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      // Load categories first (highest priority)
      await fetchCategories()

      // Load business cards second (high priority)
      await fetchCards(1, true)

      // Load weather and exchange rate in background (lower priority)
      setTimeout(() => {
        fetchWeather()
        fetchExchangeRate()
      }, 100)
    }

    loadInitialData()
  }, [])

  // Handle category and search changes
  useEffect(() => {
    if (activeTab === "business") {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1) // 페이지를 1로 리셋
        fetchCards(1, true)
      }, 300) // Debounce search

      return () => clearTimeout(timeoutId)
    }
  }, [selectedCategory, searchTerm, categories, activeTab]) // categories 의존성 추가

  // Handle card detail click
  const handleDetailClick = (card: BusinessCardType) => {
    setSelectedCard(card)
    setIsModalOpen(true)
    incrementViewCount(card.id)
  }

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !isCardsLoading) {
      fetchCards(currentPage + 1, false)
    }
  }

  // Memoized filtered and sorted cards
  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => {
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

  // Format time for display
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 정보 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">🇹🇭 태국 한인 정보</h1>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                실시간 업데이트
              </Badge>
            </div>

            {/* 날씨 및 환율 정보 */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Thermometer className="w-4 h-4" />
                {isWeatherLoading ? (
                  <span>로딩 중...</span>
                ) : weather ? (
                  <span>
                    {weather.temperature}°C, {weather.description}
                  </span>
                ) : (
                  <span>정보 없음</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {isExchangeLoading ? (
                  <span>로딩 중...</span>
                ) : exchangeRate ? (
                  <span>1 THB = {exchangeRate.rate} KRW</span>
                ) : (
                  <span>정보 없음</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>태국 시간: {new Date().toLocaleTimeString("ko-KR", { timeZone: "Asia/Bangkok" })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* 탭 네비게이션 */}
          <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="news"
                className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Newspaper className="w-5 h-5" />
                <span className="font-medium">뉴스</span>
                <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 text-xs">
                  6
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="business"
                className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200 data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Building2 className="w-5 h-5" />
                <span className="font-medium">업체 정보</span>
                <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 text-xs">
                  500+
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 탭 콘텐츠 */}
          <TabsContent value="news" className="mt-6">
            <NewsCardList />
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <div className="space-y-6">
              {/* 업체 정보 헤더 */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">🏢 업체 정보</h2>
                    <p className="text-gray-600">태국 전역의 한인 업체 정보를 확인하세요</p>
                  </div>

                  {/* 통계 */}
                  <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-600">전체</span>
                        <span className="text-lg font-bold text-green-600">500+</span>
                      </div>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">프리미엄</span>
                        <span className="text-lg font-bold text-blue-600">50+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 업체 카드 리스트 */}
              <InfiniteScrollCards cards={sortedCards} isLoading={isCardsLoading} handleLoadMore={handleLoadMore} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Business Detail Modal */}
      <Suspense fallback={<div>Loading modal...</div>}>
        <BusinessDetailModal
          card={selectedCard}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCard(null)
          }}
        />
      </Suspense>
    </div>
  )
}
