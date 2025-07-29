"use client"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BusinessCard from "@/components/business-card"
import BusinessDetailModal from "@/components/business-detail-modal"
import NativeAd from "@/components/native-ad"
import InFeedAd from "@/components/in-feed-ad"
import { getBusinessCards, getCategories, incrementViewCount } from "@/lib/api"
import type { BusinessCard as BusinessCardType, Category } from "@/types/business-card"

export default function InfoCardList() {
  const [businessCards, setBusinessCards] = useState<BusinessCardType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
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
    loading: false,
  })
  const [exchangeRate, setExchangeRate] = useState({
    rate: 37.7,
    change: -0.1,
    trend: "↘️",
    lastUpdate: "2025년 1월 29일 14:30 (KST)",
    loading: false,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cardsData, categoriesData] = await Promise.all([getBusinessCards(), getCategories()])
        setBusinessCards(cardsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("데이터 로드 오류:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // 날씨 및 환율 데이터 주기적 업데이트
  useEffect(() => {
    const fetchWeatherData = async () => {
      setWeatherData((prev) => ({ ...prev, loading: true }))
      try {
        // 실제 OpenWeatherMap API 호출
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Bangkok&appid=0e37172b550acf74ed81a76db7f4c89f&units=metric&lang=en`,
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Weather API Response:", data) // 디버깅용

        if (data.cod !== 200) {
          throw new Error(`API Error: ${data.message || "Unknown error"}`)
        }

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

        setWeatherData({
          temperature: Math.round(data.main.temp),
          condition: getWeatherCondition(data.weather[0].main),
          humidity: data.main.humidity,
          wind: data.wind?.speed > 5 ? "강함" : data.wind?.speed > 2 ? "보통" : "약함",
          icon: getWeatherIcon(data.weather[0].main),
          loading: false,
        })
      } catch (error) {
        console.error("날씨 데이터 로드 실패:", error)
        // 오류 시 기본값으로 설정
        setWeatherData({
          temperature: 32,
          condition: "정보 없음",
          humidity: 65,
          wind: "정보 없음",
          icon: "🌤️",
          loading: false,
        })
      }
    }

    const fetchExchangeRate = async () => {
      setExchangeRate((prev) => ({ ...prev, loading: true }))
      try {
        // 실제 Exchange Rate API 호출
        const response = await fetch(`https://v6.exchangerate-api.com/v6/10ce062894c8596c1f22fb81/pair/THB/KRW`)
        const data = await response.json()

        if (data.result === "success") {
          const newRate = Math.round(data.conversion_rate * 10) / 10
          const change = Math.round((newRate - exchangeRate.rate) * 10) / 10

          setExchangeRate({
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
          })
        } else {
          throw new Error("API 응답 오류")
        }
      } catch (error) {
        console.error("환율 데이터 로드 실패:", error)
        // 오류 시 기본값 유지
        setExchangeRate((prev) => ({ ...prev, loading: false }))
      }
    }

    // 초기 데이터 로드
    fetchWeatherData()
    fetchExchangeRate()

    // 날씨는 6시간마다 (하루 4회), 환율은 12시간마다 (하루 2회)
    const weatherInterval = setInterval(fetchWeatherData, 6 * 60 * 60 * 1000) // 6시간마다
    const exchangeInterval = setInterval(fetchExchangeRate, 12 * 60 * 60 * 1000) // 12시간마다

    return () => {
      clearInterval(weatherInterval)
      clearInterval(exchangeInterval)
    }
  }, [])

  const handleDetailClick = async (card: BusinessCardType) => {
    setSelectedCard(card)
    setIsModalOpen(true)

    // 조회수 증가
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

  // 필터링된 카드들
  const filteredCards = businessCards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || card.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // 프리미엄 카드를 먼저 정렬
  const sortedCards = [...filteredCards].sort((a, b) => {
    if (a.isPremium && !b.isPremium) return -1
    if (!a.isPremium && b.isPremium) return 1
    return 0
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">핫한 정보를 불러오는 중...</p>
        </div>
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
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-2xl">
                    {weatherData.loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    ) : (
                      weatherData.icon
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">방콕 오늘 날씨</p>
                    {weatherData.loading ? (
                      <p className="font-semibold text-blue-800">로딩중...</p>
                    ) : (
                      <p className="font-semibold text-blue-800">
                        {weatherData.temperature}°C / {weatherData.condition}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      습도 {weatherData.humidity}% · 바람 {weatherData.wind}
                    </p>
                  </div>
                </div>

                {/* 환율 정보 */}
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-2xl">
                    {exchangeRate.loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                    ) : (
                      "💱"
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">바트/원 환율</p>
                    {exchangeRate.loading ? (
                      <p className="font-semibold text-green-800">로딩중...</p>
                    ) : (
                      <p className="font-semibold text-green-800">1바트 = {exchangeRate.rate}원</p>
                    )}
                    <p className="text-xs text-gray-500">
                      전일 대비 {exchangeRate.change > 0 ? "+" : ""}
                      {exchangeRate.change}원 {exchangeRate.trend}
                    </p>
                  </div>
                </div>
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
        {sortedCards.length === 0 ? (
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
