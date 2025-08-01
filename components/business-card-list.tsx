"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp } from "lucide-react"
import BusinessCard from "@/components/business-card"
import BusinessDetailModal from "@/components/business-detail-modal"
import { incrementViewCount } from "@/lib/api"
import type { BusinessCard as BusinessCardType } from "@/types/business-card"

interface BusinessCardListProps {
  initialCards: BusinessCardType[]
}

export default function BusinessCardList({ initialCards }: BusinessCardListProps) {
  const [cards] = useState<BusinessCardType[]>(initialCards)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCard, setSelectedCard] = useState<BusinessCardType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get unique categories from cards
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(cards.map((card) => card.category)))
    return uniqueCategories.sort()
  }, [cards])

  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    let filtered = cards

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((card) => card.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (card) =>
          card.title.toLowerCase().includes(lowercaseSearch) ||
          card.description.toLowerCase().includes(lowercaseSearch) ||
          card.category.toLowerCase().includes(lowercaseSearch) ||
          card.tags.some((tag) => tag.toLowerCase().includes(lowercaseSearch)),
      )
    }

    // Sort by priority
    return filtered.sort((a, b) => {
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
  }, [cards, selectedCategory, searchTerm])

  const handleDetailClick = (card: BusinessCardType) => {
    setSelectedCard(card)
    setIsModalOpen(true)
    incrementViewCount(card.id.toString())
  }

  return (
    <div className="space-y-6">
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

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 카테고리</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          총 {filteredAndSortedCards.length}개의 업체 정보
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

      {/* Business Cards Grid */}
      {filteredAndSortedCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedCards.map((card) => (
            <div key={card.id} className="h-full">
              <BusinessCard card={card} onDetailClick={handleDetailClick} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">검색 결과가 없습니다</p>
            <p className="text-sm">다른 키워드나 카테고리로 검색해보세요</p>
          </div>
        </div>
      )}

      {/* Business Detail Modal */}
      <BusinessDetailModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCard(null)
        }}
      />
    </div>
  )
}
