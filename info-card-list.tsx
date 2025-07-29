"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import BusinessCard from "@/components/business-card"
import BusinessDetailModal from "@/components/business-detail-modal"
import NativeAd from "@/components/native-ad"
import InFeedAd from "@/components/in-feed-ad"
import { getBusinessCards, getCategories, incrementViewCount } from "@/lib/api"
import type { BusinessCard as BusinessCardType, Category } from "@/types/business-card"

// 스켈레톤 컴포넌트들
function WeatherSkeleton() {
  return (
    <div className="flex items-center justify-center space-x-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  )
}

function ExchangeRateSkeleton() {
  return (
    <div className="flex items-center justify-center space-x-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  )
}

export default function InfoCardList() {
  const [businessCards, setBusinessCards] = useState<BusinessCardType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [cardsLoading, setCardsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedCard, setSelectedCard] = useState<BusinessCardType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [weatherData, setWeatherData] = useState({
    temperature: 32,
    condition: "맑음",
    humidity: 65,
    wind: "약함",
    icon: "☀️",
    loading: true,
  })
  const [exchangeRate, setExchangeRate] = useState({
    rate: 37.7,
    change: -0.1,
    trend: "↘️",
    lastUpdate: "2025년 1월 29일 14:30 (KST)",
    loading: true,
  })

  // 캐시된 데이터 확인
  useEffect(() => {
    const cachedWeather = localStorage.getItem("weather-data")
    const cachedExchange = localStorage.getItem("exchange-data")

    if (cachedWeather) {
      const weatherCache = JSON.parse(cachedWeather)
      const isWeatherFresh = Date.now() - weatherCache.timestamp < 6 * 60 * 60 * 1000 // 6시간
      if (isWeatherFresh) {
        setWeatherData({ ...weatherCache.data, loading: false })
      }
    }

    if (cachedExchange) {
      const exchangeCache = JSON.parse(cachedExchange)
      const isExchangeFresh = Date.now() - exchangeCache.timestamp < 12 * 60 * 60 * 1000 // 12시간
      if (isExchangeFresh) {
        setExchangeRate({ ...exchangeCache.data, loading: false })
      }
    }
  }, [])

  // 우선순위별 데이터 로딩
  useEffect(() => {
    const loadCriticalData = async () => {
      try {
        // 1단계: 카테고리 먼저 로드 (빠름)
        const categoriesData = await getCategories()
        setCategories(categoriesData)
        setLoading(false) // UI 먼저 표시

        // 2단계: 비즈니스 카드 로드
        const cardsData = await getBusinessCards()
        setBusinessCards(cardsData)
        setCardsLoading(false)
      } catch (error) {
        console.error("데이터 로드 오류:", error)
        setLoading(false)
        setCardsLoading(false)
      }
    }

    loadCriticalData()
  }, [])

  // 날씨 데이터 로딩 (백그라운드)
  useEffect(() => {
    const fetchWeatherData = async () => {
      // 캐시된 데이터가 있으면 백그라운드에서만 업데이트
      const cachedWeather = localStorage.getItem("weather-data")
      const shouldUpdate = !cachedWeather || Date.now() - JSON.parse(cachedWeather).timestamp > 6 * 60 * 60 * 1000

      if (!shouldUpdate) return

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Bangkok&appid=0e37172b550acf74ed81a76db7f4c89f&units=metric&lang=en`,
        )

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        if (data.cod !== 200) throw new Error(`API Error: ${data.message || "Unknown error"}`)

        const getWeatherIcon = (weatherMain: string) => {
          switch (weatherMain.toLowerCase()) {
            case "clear":
              return "☀️"
            case "clouds":
              return "☁️"
            case "rain":
              return "🌧️"
            case "drizzle":
              return "🌦️"
            case "thunderstorm":
              return "⛈️"
            case "snow":
              return "❄️"
            case "mist":
            case "fog":
            case "haze":
              return "🌫️"
            default:
              return "🌤️"
          }
        }

        const getWeatherCondition = (weatherMain: string) => {
          switch (weatherMain.toLowerCase()) {
            case "clear":
              return "맑음"
            case "clouds":
              return "흐림"
            case "rain":
              return "비"
            case "drizzle":
              return "이슬비"
            case "thunderstorm":
              return "뇌우"
            case "snow":
              return "눈"
            case "mist":
            case "fog":
            case "haze":
              return "안개"
            default:
              return "구름많음"
          }
        }

        const newWeatherData = {
          temperature: Math.round(data.main.temp),
          condition: getWeatherCondition(data.weather[0].main),
          humidity: data.main.humidity,
          wind: data.wind?.speed > 5 ? "강함" : data.wind?.speed > 2 ? "보통" : "약함",
          icon: getWeatherIcon(data.weather[0].main),
          loading: false,
        }

        setWeatherData(newWeatherData)

        // 캐시에 저장
        localStorage.setItem(
          "weather-data",
          JSON.stringify({
            data: newWeatherData,
            timestamp: Date.now(),
          }),
        )
      } catch (error) {
        console.error("날씨 데이터 로드 실패:", error)
        setWeatherData((prev) => ({
          ...prev,
          condition: "정보 없음",
          loading: false,
        }))
      }
    }

    // 초기 로딩 후 백그라운드에서 실행
    setTimeout(fetchWeatherData, 1000)
  }, [])

  // 환율 데이터 로딩 (백그라운드)
  useEffect(() => {
    const fetchExchangeRate = async () => {
      const cachedExchange = localStorage.getItem("exchange-data")
      const shouldUpdate = !cachedExchange || Date.now() - JSON.parse(cachedExchange).timestamp > 12 * 60 * 60 * 1000

      if (!shouldUpdate) return

      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/10ce062894c8596c1f22fb81/pair/THB/KRW`)
        const data = await response.json()

        if (data.result === "success") {
          const newRate = Math.round(data.conversion_rate * 10) / 10
          const change = Math.round((newRate - exchangeRate.rate) * 10) / 10

          const newExchangeData = {
            rate: newRate,
            change: change,
            trend: change > 0 ? "↗️" : change < 0 ? "↘️" : "→",
            lastUpdate: new Date().toLocaleString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZoneName: "short",
            }),
            loading: false,
          }

          setExchangeRate(newExchangeData)

          // 캐시에 저장
          localStorage.setItem(
            "exchange-data",
            JSON.stringify({
              data: newExchangeData,
              timestamp: Date.now(),
            }),
          )
        }
      } catch (error) {
        console.error("환율 데이터 로드 실패:", error)
        setExchangeRate((prev) => ({ ...prev, loading: false }))
      }
    }

    // 초기 로딩 후 백그라운드에서 실행
    setTimeout(fetchExchangeRate, 1500)
  }, [])

  const handleDetailClick = async (card: BusinessCardType) => {
    setSelectedCard(card)
    setIsModalOpen(true)

    try {
      await incrementViewCount(card.id)
    } catch (error) {
      console.error("조회수 증가 오류:", error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCard(null)
  }

  // 메모이제이션으로 필터링 성능 최적화
  const filteredCards = useMemo(() => {
    return businessCards.filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || card.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [businessCards, searchTerm, selectedCategory])

  // 프리미엄 카드 정렬 최적화
  const sortedCards = useMemo(() => {
    return [...filteredCards].sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1
      if (!a.isPremium && b.isPremium) return 1
      return 0
    })
  }, [filteredCards])

  // 초기 로딩 상태 (카테고리 로딩 중)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🔥 핫타이 <span className="text-red-500">HOT THAI</span>
              </h1>
              <p className="text-xl text-gray-600 mb-2">태국 생활의 모든 것을 한눈에! 🇹🇭</p>
              <p className="text-gray-500">
                맛집 · 쇼핑 · 서비스 · 숙박 · 관광까지
                <br />
                태국 거주자와 여행자가 꼭 알아야 할 핫한 정보를 제공합니다
              </p>

              {/* 날씨 및 환율 스켈레톤 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <WeatherSkeleton />
                  <ExchangeRateSkeleton />
                </div>
              </div>
            </div>

            {/* 카테고리 스켈레톤 */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>

            {/* 검색 스켈레톤 */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-full sm:w-48" />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🔥 핫타이 <span className="text-red-500">HOT THAI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-2">태국 생활의 모든 것을 한눈에! 🇹🇭</p>
            <p className="text-gray-500">
              맛집 · 쇼핑 · 서비스 · 숙박 · 관광까지
              <br />
              태국 거주자와 여행자가 꼭 알아야 할 핫한 정보를 제공합니다
            </p>
            {/* 날씨 및 환율 정보 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                {/* 방콕 날씨 */}
                {weatherData.loading ? (
                  <WeatherSkeleton />
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="text-2xl">{weatherData.icon}</div>
                    <div>
                      <p className="text-sm text-gray-600">방콕 오늘 날씨</p>
                      <p className="font-semibold text-blue-800">
                        {weatherData.temperature}°C / {weatherData.condition}
                      </p>
                      <p className="text-xs text-gray-500">
                        습도 {weatherData.humidity}% · 바람 {weatherData.wind}
                      </p>
                    </div>
                  </div>
                )}

                {/* 환율 정보 */}
                {exchangeRate.loading ? (
                  <ExchangeRateSkeleton />
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="text-2xl">💱</div>
                    <div>
                      <p className="text-sm text-gray-600">바트/원 환율</p>
                      <p className="font-semibold text-green-800">1바트 = {exchangeRate.rate}원</p>
                      <p className="text-xs text-gray-500">
                        전일 대비 {exchangeRate.change > 0 ? "+" : ""}
                        {exchangeRate.change}원 {exchangeRate.trend}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 text-center mt-3 border-t pt-2">
                출처: OpenWeatherMap, ExchangeRate-API | 업데이트: {exchangeRate.lastUpdate}
                <span className="ml-2 text-blue-600">● 날씨 하루 4회, 환율 하루 2회 업데이트</span>
                {weatherData.condition === "정보 없음" && (
                  <span className="ml-2 text-red-500">● 날씨 정보 일시적 오류</span>
                )}
              </div>
            </div>
          </div>

          {/* 카테고리 태그 */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge className="bg-red-100 text-red-800">🍜 맛집 정보</Badge>
            <Badge className="bg-blue-100 text-blue-800">🏨 숙박 정보</Badge>
            <Badge className="bg-green-100 text-green-800">🛍️ 쇼핑 정보</Badge>
            <Badge className="bg-purple-100 text-purple-800">🎯 서비스 정보</Badge>
            <Badge className="bg-orange-100 text-orange-800">🎪 관광 정보</Badge>
          </div>

          {/* 검색 및 필터 */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="핫타이에서 원하는 정보를 검색해보세요... (예: 맛집, 마사지, 호텔)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
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
          </div>
        </div>
      </header>

      {/* 네이티브 광고 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <NativeAd />
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cardsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : sortedCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">아직 등록된 핫한 정보가 없습니다.</p>
            <p className="text-gray-400 text-sm mt-2">곧 다양한 태국 정보를 만나보실 수 있습니다!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCards.map((card, index) => (
              <div key={card.id}>
                <BusinessCard card={card} onDetailClick={handleDetailClick} />
                {/* 인피드 광고 삽입 (매 8번째 카드마다) */}
                {(index + 1) % 8 === 0 && <InFeedAd />}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 상세 모달 */}
      <BusinessDetailModal card={selectedCard} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
