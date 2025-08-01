"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, Filter } from "lucide-react"
import BusinessCard from "./business-card"
import BusinessDetailModal from "./business-detail-modal"
import type { BusinessCard as BusinessCardType } from "@/types/business-card"
import { incrementViewCount } from "@/lib/api"

interface BusinessCardListProps {
  initialCards: BusinessCardType[]
}

export default function BusinessCardList({ initialCards }: BusinessCardListProps) {
  const [cards] = useState<BusinessCardType[]>(initialCards)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCard, setSelectedCard] = useState<BusinessCardType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)

  // 카테고리 목록 추출
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(cards.map((card) => card.category)))
    return uniqueCategories.map((category) => ({
      name: category,
      count: cards.filter((card) => card.category === category).length,
    }))
  }, [cards])

  // 필터링된 카드
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch =
        searchTerm === "" ||
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || card.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [cards, searchTerm, selectedCategory])

  // 정렬: 프리미엄 > 프로모션 > 노출수 > 생성일
  const sortedCards = useMemo(() => {
    return [...filteredCards].sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1
      if (!a.isPremium && b.isPremium) return 1

      if (a.isPromoted && !b.isPromoted) return -1
      if (!a.isPromoted && b.isPromoted) return 1

      if (a.exposureCount !== b.exposureCount) {
        return (b.exposureCount || 0) - (a.exposureCount || 0)
      }

      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    })
  }, [filteredCards])

  const handleDetailClick = async (card: BusinessCardType) => {
    setSelectedCard(card)
    setIsModalOpen(true)

    // 조회수 증가
    try {
      await incrementViewCount(card.id.toString())
    } catch (error) {
      console.error("조회수 증가 실패:", error)
    }
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCard(null)
  }

  // 데이터가 없는 경우 처리
  if (!cards || cards.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">업체 정보</h2>
          <p className="text-gray-600">태국 교민 업체 정보를 확인하세요</p>
        </div>

        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">아직 등록된 업체가 없습니다.</p>
            <p className="text-sm">곧 새로운 업체 정보를 추가하겠습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">업체 정보</h2>
        <p className="text-gray-600">태국 교민 업체 정보를 확인하세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="업체명, 설명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 카테고리 ({cards.length})</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                {category.name} ({category.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 결과 요약 */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          총 {sortedCards.length}개의 업체 정보
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

      {/* 업체 카드 그리드 */}
      {sortedCards.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">검색 결과가 없습니다</p>
            <p className="text-sm">다른 키워드나 카테고리로 검색해보세요</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCards.slice(0, visibleCount).map((card, index) => (
            <div key={card.id}>
              <BusinessCard card={card} onDetailClick={handleDetailClick} />
              {/* 8번째마다 광고 삽입 */}
              {(index + 1) % 8 === 0 && index < visibleCount - 1 && (
                <div className="col-span-full my-4 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                  <div className="text-center text-gray-500 text-sm">광고 영역</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 더 보기 버튼 */}
      {visibleCount < sortedCards.length && (
        <div className="text-center mt-8">
          <Button onClick={handleLoadMore} variant="outline" size="lg" className="min-w-[200px] bg-white">
            더 보기 ({visibleCount}/{sortedCards.length})
            <Filter className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* 업체 상세 모달 */}
      <BusinessDetailModal card={selectedCard} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
