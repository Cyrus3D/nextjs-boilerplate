import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Thermometer, DollarSign, Newspaper, Building } from "lucide-react"
import NewsCardList from "@/components/news-card-list"
import BusinessCardList from "@/components/business-card-list"
import { getNewsArticles, getBusinessCards } from "@/lib/api"

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

// Client component for interactive features
function ClientHomePage({
  initialNewsArticles,
  initialBusinessCards,
  weather,
  exchangeRate,
}: {
  initialNewsArticles: any[]
  initialBusinessCards: any[]
  weather: WeatherData | null
  exchangeRate: ExchangeRateData | null
}) {
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
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">🔥 핫타이 HOT THAI</h1>
            <p className="text-orange-100">태국에서 필요한 모든 정보를 한 곳에서 찾아보세요</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            {/* Weather Info */}
            <div className="bg-white/10 rounded-lg p-3 min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4" />
                <span className="font-medium">방콕 날씨</span>
              </div>
              {weather ? (
                <div className="text-orange-100">
                  {weather.temperature}°C, {weather.description}
                </div>
              ) : (
                <div className="text-orange-100">32°C, 맑음</div>
              )}
            </div>

            {/* Exchange Rate Info */}
            <div className="bg-white/10 rounded-lg p-3 min-w-[140px]">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">환율 (THB→KRW)</span>
              </div>
              {exchangeRate ? (
                <div className="text-orange-100">
                  1 THB = {exchangeRate.rate} KRW
                  <div className="text-xs opacity-75 mt-1">
                    {exchangeRate.source} • {formatTime(exchangeRate.timestamp)}
                  </div>
                </div>
              ) : (
                <div className="text-orange-100">1 THB = 37.5 KRW</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 p-1">
          <TabsTrigger
            value="news"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Newspaper className="w-4 h-4" />
            뉴스
          </TabsTrigger>
          <TabsTrigger
            value="business"
            className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <Building className="w-4 h-4" />
            업체 정보
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="mt-6">
          <NewsCardList initialArticles={initialNewsArticles} />
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <BusinessCardList initialCards={initialBusinessCards} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Server component for data fetching
export default async function HomePage() {
  // Fetch data on server
  const [newsArticles, businessCards] = await Promise.all([
    getNewsArticles(50), // Get latest 50 news articles
    getBusinessCards(50), // Get latest 50 business cards
  ])

  // Fetch weather and exchange rate (with fallbacks)
  let weather: WeatherData | null = null
  let exchangeRate: ExchangeRateData | null = null

  try {
    // Weather API call
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Bangkok,TH&appid=0e37172b550acf74ed81a76db7f4c89f&units=metric&lang=ko`,
      { next: { revalidate: 1800 } }, // Cache for 30 minutes
    )
    if (weatherResponse.ok) {
      const weatherData = await weatherResponse.json()
      weather = {
        temperature: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        timestamp: Date.now(),
      }
    }
  } catch (error) {
    console.error("Weather fetch error:", error)
  }

  try {
    // Exchange rate API call
    const exchangeResponse = await fetch(
      "https://api.exchangerate-api.com/v4/latest/THB",
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )
    if (exchangeResponse.ok) {
      const exchangeData = await exchangeResponse.json()
      exchangeRate = {
        rate: Math.round(exchangeData.rates.KRW * 100) / 100,
        timestamp: Date.now(),
        source: "ExchangeRate-API",
      }
    }
  } catch (error) {
    console.error("Exchange rate fetch error:", error)
  }

  return (
    <ClientHomePage
      initialNewsArticles={newsArticles}
      initialBusinessCards={businessCards}
      weather={weather}
      exchangeRate={exchangeRate}
    />
  )
}
