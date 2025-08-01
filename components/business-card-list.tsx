"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BusinessCard } from "@/components/business-card"
import { BusinessDetailModal } from "@/components/business-detail-modal"
import { searchBusinessCards } from "@/lib/api"
import type { BusinessCard as BusinessCardType } from "@/types/business-card"
import { Search, Filter, X, Building2 } from "lucide-react"

interface BusinessCardListProps {
  initialCards: BusinessCardType[]
}

const BUSINESS_CATEGORIES = ["음식점", "서비스", "쇼핑", "의료", "교육", "부동산", "여행", "미용", "운송", "기타"]

export function BusinessCardList({ initialCards }: BusinessCardListProps) {
  const [cards, setCards] = useState<BusinessCardType[]>(initialCards)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedCard, setSelectedCard] = useState<BusinessCardType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter cards based on search and category
  const filteredCards = useMemo(() => {
    let filtered = cards

    if (selectedCategory !== "all") {
      filtered = filtered.filter((card) => card.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (card) =>
          card.title.toLowerCase().includes(query) ||
          card.description.toLowerCase().includes(query) ||
          card.category.toLowerCase().includes(query) ||
          (card.location && card.location.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [cards, searchQuery, selectedCategory])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setCards(initialCards)
      return
    }

    setIsLoading(true)
    try {
      const results = await searchBusinessCards(query, selectedCategory !== "all" ? selectedCategory : undefined)
      setCards(results)
    } catch (error) {
      console.error("Search failed:", error)
      setCards(initialCards)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setCards(initialCards)
  }

  const premiumCards = filteredCards.filter((card) => card.isPremium)
  const regularCards = filteredCards.filter((card) => !card.isPremium)

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="업체명, 설명, 위치로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery)
                }
              }}
              className="pl-10"
            />
          </div>
          <Button onClick={() => handleSearch(searchQuery)} disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            검색
          </Button>
          {(searchQuery || selectedCategory !== "all") && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              초기화
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("all")}
          >
            전체
          </Button>
          {BUSINESS_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          총 {filteredCards.length}개의 업체
          {searchQuery && ` (검색: "${searchQuery}")`}
          {selectedCategory !== "all" && ` (카테고리: ${selectedCategory})`}
        </div>
        {premiumCards.length > 0 && (
          <div className="text-sm text-amber-600 font-medium">프리미엄 {premiumCards.length}개</div>
        )}
      </div>

      {/* Premium Cards Section */}
      {premiumCards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-amber-700">프리미엄 업체</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {premiumCards.map((card) => (
              <BusinessCard
                key={card.id}
                card={card}
                onClick={() => setSelectedCard(card)}
                className="ring-2 ring-amber-200 bg-amber-50"
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Cards Section */}
      {regularCards.length > 0 && (
        <div className="space-y-4">
          {premiumCards.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <h2 className="text-lg font-semibold">일반 업체</h2>
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularCards.map((card) => (
              <BusinessCard key={card.id} card={card} onClick={() => setSelectedCard(card)} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredCards.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
              <p className="text-sm">
                다른 검색어를 시도하거나 필터를 변경해보세요.
                <br />
                모든 업체를 보려면 초기화 버튼을 클릭하세요.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
            <span className="text-sm text-gray-600">검색 중...</span>
          </div>
        </div>
      )}

      {/* Business Detail Modal */}
      {selectedCard && (
        <BusinessDetailModal card={selectedCard} isOpen={!!selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  )
}
