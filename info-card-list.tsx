"use client"

import { useState, useEffect } from "react"
import GoogleAds from "./components/google-ads"
import BusinessCardComponent from "./components/business-card"
import BusinessDetailModal from "./components/business-detail-modal"
import { getBusinessCards, incrementViewCount } from "./lib/api"
import { isSupabaseConfigured } from "./lib/supabase"
import type { BusinessCard } from "./types/business-card"
import AdsenseBanner from "./components/adsense-banner"
import React from "react"

export default function InfoCardList() {
  const [selectedCard, setSelectedCard] = useState<BusinessCard | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<"database" | "sample">("sample")

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Starting data fetch...")
        const cards = await getBusinessCards()
        setBusinessCards(cards)

        // 데이터 소스 확인
        if (isSupabaseConfigured() && cards.length > 0) {
          setDataSource("database")
        } else {
          setDataSource("sample")
        }

        console.log("Data fetch completed:", cards.length, "cards")
      } catch (error) {
        console.error("Failed to fetch business cards:", error)
        // 에러 발생 시에도 샘플 데이터 표시
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 고정 헤더 영역 */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">태국 한인 비즈니스 정보</h1>
            <p className="text-gray-600">태국 거주 한인들을 위한 다양한 비즈니스 정보를 확인해보세요</p>

            {/* 데이터 소스 상태 표시 */}
            {process.env.NODE_ENV === "development" && (
              <div
                className={`mt-2 p-2 border rounded text-sm ${
                  dataSource === "database"
                    ? "bg-green-100 border-green-300 text-green-800"
                    : "bg-yellow-100 border-yellow-300 text-yellow-800"
                }`}
              >
                {dataSource === "database"
                  ? "✅ 데이터베이스 연결됨"
                  : "⚠️ 샘플 데이터 사용 중 (데이터베이스 미연결 또는 데이터 없음)"}
              </div>
            )}
          </div>

          {/* 구글 광고 배너 */}
          <GoogleAds
            adSlot={process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT || "1234567890"}
            style={{
              display: "block",
              width: "100%",
              height: "90px",
            }}
          />
        </div>
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="container mx-auto px-4 py-8">
        {businessCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">등록된 비즈니스 정보가 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businessCards.map((card, index) => (
              <React.Fragment key={card.id}>
                <BusinessCardComponent card={card} onDetailClick={handleDetailClick} />
                {/* 6번째 카드 후에 광고 삽입 */}
                {index === 5 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <AdsenseBanner
                      slot={process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT}
                      format="horizontal"
                      className="my-4"
                    />
                  </div>
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
