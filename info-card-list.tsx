"use client"
import GoogleAds from "./components/google-ads"
import BusinessCardComponent from "./components/business-card"
import { sampleBusinessCards } from "./data/sample-cards"

const getCategoryColor = (category: string) => {
  const colors = {
    개발: "bg-blue-100 text-blue-800",
    운동: "bg-green-100 text-green-800",
    문화: "bg-purple-100 text-purple-800",
    취미: "bg-orange-100 text-orange-800",
    예술: "bg-pink-100 text-pink-800",
    교육: "bg-indigo-100 text-indigo-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

export default function InfoCardList() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">태국 한인 비즈니스 정보</h1>
          <p className="text-gray-600">태국 거주 한인들을 위한 다양한 비즈니스 정보를 확인해보세요</p>
        </div>

        {/* 구글 광고 배너 */}
        <div className="mb-8">
          <GoogleAds
            adSlot="1234567890"
            style={{
              display: "block",
              width: "100%",
              height: "90px",
            }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleBusinessCards.map((card) => (
            <BusinessCardComponent key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}
