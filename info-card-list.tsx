"use client"

import { useState, useEffect } from "react"
import BusinessCardComponent from "./components/business-card"
import BusinessDetailModal from "./components/business-detail-modal"
import NativeAdCard from "./components/native-ad-card"
import InFeedAd from "./components/in-feed-ad"
import { getBusinessCards, incrementViewCount, checkDatabaseStatus } from "./lib/api"
import { isSupabaseConfigured } from "./lib/supabase"
import type { BusinessCard } from "./types/business-card"
import React from "react"

export default function InfoCardList() {
  const [selectedCard, setSelectedCard] = useState<BusinessCard | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<"database" | "sample">("sample")
  const [dbStatus, setDbStatus] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Starting data fetch...")

        // 데이터베이스 상태 확인
        const status = await checkDatabaseStatus()
        setDbStatus(status)
        console.log("Database status:", status)

        const cards = await getBusinessCards()
        setBusinessCards(cards)

        // 데이터 소스 확인
        if (isSupabaseConfigured() && cards.length > 0 && status.status === "configured") {
          setDataSource("database")
        } else {
          setDataSource("sample")
        }

        console.log("Data fetch completed:", cards.length, "cards")
      } catch (error) {
        console.error("Failed to fetch business cards:", error)
        setBusinessCards([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDetailClick = async (card: BusinessCard) => {
    setSelectedCard(card)
    setIsModalOpen(true)

    // 조회수 증가 (Supabase가 설정된 경우에만)
    if (isSupabaseConfigured()) {
      await incrementViewCount(card.id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCard(null)
  }

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
      {/* 고정 헤더 영역 */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              🔥 핫타이 <span className="text-red-500">HOT THAI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed">태국 생활의 모든 것을 한눈에! 🇹🇭</p>
            <p className="text-base text-gray-700 mb-6">
              <span className="font-semibold text-gray-800">맛집 · 쇼핑 · 서비스 · 숙박 · 관광</span>까지
              <br />
              태국 거주자와 여행자가 꼭 알아야 할 <span className="text-red-500 font-bold">핫한 정보</span>를 제공합니다
            </p>

            {/* 카테고리 태그 */}
            <div className="flex flex-wrap justify-center gap-2 text-sm mb-6">
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full">🍜 맛집 정보</span>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">🏨 숙박 정보</span>
              <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full">🛍️ 쇼핑 정보</span>
              <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full">🎯 서비스 정보</span>
              <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full">🎪 관광 정보</span>
            </div>

            {/* 데이터베이스 상태 표시 (개발 환경에서만) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 space-y-2">
                <div
                  className={`p-2 border rounded text-sm ${
                    dataSource === "database"
                      ? "bg-green-100 border-green-300 text-green-800"
                      : "bg-yellow-100 border-yellow-300 text-yellow-800"
                  }`}
                >
                  {dataSource === "database" ? "✅ 데이터베이스 연결됨" : "⚠️ 샘플 데이터 사용 중"}
                </div>

                {/* 상세 데이터베이스 상태 */}
                {dbStatus && dbStatus.status === "configured" && (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    <div className="font-medium mb-1">테이블 상태:</div>
                    {Object.entries(dbStatus.tables || {}).map(([table, exists]) => (
                      <div key={table} className="flex justify-between">
                        <span>{table}:</span>
                        <span className={exists ? "text-green-600" : "text-red-600"}>{exists ? "✓" : "✗"}</span>
                      </div>
                    ))}
                  </div>
                )}

                {dbStatus && dbStatus.status === "not_configured" && (
                  <div className="p-2 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600">
                    Supabase 환경변수가 설정되지 않았습니다.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="container mx-auto px-4 py-8">
        {businessCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">아직 등록된 핫한 정보가 없습니다.</p>
            <p className="text-gray-400 text-sm mt-2">곧 다양한 태국 정보를 만나보실 수 있습니다!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businessCards.map((card, index) => (
              <React.Fragment key={card.id}>
                <BusinessCardComponent card={card} onDetailClick={handleDetailClick} />

                {/* 3번째 카드 후에 네이티브 광고 삽입 */}
                {index === 2 && (
                  <NativeAdCard
                    adSlot={process.env.NEXT_PUBLIC_ADSENSE_NATIVE_SLOT || "2345678901"}
                    style="card"
                    className="md:col-span-1"
                  />
                )}

                {/* 7번째 카드 후에 인피드 광고 삽입 */}
                {index === 6 && (
                  <InFeedAd
                    adSlot={process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT || "3456789012"}
                    className="md:col-span-1"
                  />
                )}

                {/* 12번째 카드 후에 또 다른 네이티브 광고 */}
                {index === 11 && (
                  <NativeAdCard
                    adSlot={process.env.NEXT_PUBLIC_ADSENSE_NATIVE_SLOT_2 || "4567890123"}
                    style="card"
                    className="md:col-span-1"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* 상세 정보 모달 */}
      <BusinessDetailModal card={selectedCard} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
