"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BusinessCard } from "@/components/business-card"
import { BusinessDetailModal } from "@/components/business-detail-modal"
import { getBusinessCards, searchBusinessCards } from "@/lib/api"
import { debounce } from "@/lib/utils"
import type { BusinessCard as BusinessCardType } from "@/types/business-card"
import { Search, Filter, RefreshCw, Crown } from "lucide-react"

const BUSINESS_CATEGORIES = [
  "all",
  "음식점",
  "카페",
  "쇼핑",
  "서비스",
  "의료",
  "교육",
  "부동산",
  "여행",
  "운송",
  "기타",
]

export function BusinessCardList() {
  const [cards, setCards] = useState<BusinessCardType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCard, setSelectedCard] = useState<BusinessCardType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string, category: string) => {
        setLoading(true)
        try {
          if (term.trim() || category !== "all") {
            const results = await searchBusinessCards(term, category === "all" ? undefined : category)
            setCards(results)
          } else {
            const results = await getBusinessCards()
            setCards(results)
          }
        } catch (error) {
          console.error("Error searching business cards:", error)
        } finally {
          setLoading(false)
        }
      }, 300),
    [],
  )

  // Load initial cards
  useEffect(() => {
    const loadCards = async () => {
      setLoading(true)
      try {
        const results = await getBusinessCards()
        setCards(results)
      } catch (error) {
        console.error("Error loading business cards:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCards()
  }, [])

  // Handle search and filter changes
  useEffect(() => {
    debouncedSearch(searchTerm, selectedCategory)
  }, [searchTerm, selectedCategory, debouncedSearch])

  // Filter cards based on premium toggle
  const filteredCards = useMemo(() => {
    if (showPremiumOnly) {
      return cards.filter((card) => card.isPremium)
    }
    return cards
  }, [cards, showPremiumOnly])

  const handleCardClick = (card: BusinessCardType) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  const handleRefresh = async () => {
    setLoading(true)
    setSearchTerm("")
    setSelectedCategory("all")
    setShowPremiumOnly(false)
    try {
      const results = await getBusinessCards()
      setCards(results)
    } catch (error) {
      console.error("Error refreshing business cards:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="업체 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "전체" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Premium Toggle */}
            <Button
              variant={showPremiumOnly ? "default" : "outline"}
              onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              className="flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              프리미엄만
            </Button>

            {/* Refresh Button */}
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            총 <strong>{filteredCards.length}</strong>개의 업체
          </span>
          {showPremiumOnly && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <Crown className="h-3 w-3 mr-1" />
              프리미엄만 표시
            </Badge>
          )}
          {selectedCategory !== "all" && <Badge variant="secondary">{selectedCategory} 카테고리</Badge>}
          {searchTerm && <Badge variant="outline">"{searchTerm}" 검색 결과</Badge>}
        </div>
      </div>

      {/* Business Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCards.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-sm">다른 검색어나 카테고리를 시도해보세요.</p>
            </div>
            <Button variant="outline" onClick={handleRefresh}>
              전체 업체 보기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <BusinessCard key={card.id} card={card} onClick={() => handleCardClick(card)} />
          ))}
        </div>
      )}

      {/* Business Detail Modal */}
      {selectedCard && (
        <BusinessDetailModal
          card={selectedCard}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCard(null)
          }}
        />
      )}
    </div>
  )
}
