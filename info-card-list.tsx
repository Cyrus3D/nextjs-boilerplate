"use client"

import { useState } from "react"
import GoogleAds from "./components/google-ads"
import BusinessCardComponent from "./components/business-card"
import BusinessDetailModal from "./components/business-detail-modal"
import { sampleBusinessCards } from "./data/sample-cards"
import type { BusinessCard } from "./types/business-card"

export default function InfoCardList() {
  const [selectedCard, setSelectedCard] = useState<BusinessCard | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDetailClick = (card: BusinessCard) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCard(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 고정 헤더 영역 */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">태국 한인 비즈니스 정보</h1>
            <p className="text-gray-600">태국 거주 한인들을 위한 다양한 비즈니스 정보를 확인해보세요</p>
          </div>

          {/* 구글 광고 배너 */}
          <GoogleAds
            adSlot="1234567890"
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleBusinessCards.map((card) => (
            <BusinessCardComponent key={card.id} card={card} onDetailClick={handleDetailClick} />
          ))}
        </div>
      </div>

      {/* 상세 정보 모달 */}
      <BusinessDetailModal card={selectedCard} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
