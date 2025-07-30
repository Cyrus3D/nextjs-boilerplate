"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import OptimizedBusinessCard from "./optimized-business-card"
import { BusinessCard as BusinessCardType, Category } from "@/types/business-card"
import { getBusinessCardsPaginated, getCategoriesOptimized, incrementViewCountBatched } from "@/lib/optimized-api"
import BusinessCard from "./business-card"
import { BusinessDetailModal } from "./business-detail-modal"
import { InFeedAd } from "./in-feed-ad"
import { Skeleton } from "@/components/ui/skeleton"

interface InfiniteScrollCardsProps {
  category?: string
  searchTerm?: string
  initialCards?: BusinessCardType[]
  initialCategories?: Category[]
  selectedCategory?: string
  searchQuery?: string
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-full">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  )
}

export default function InfiniteScrollCards({ category, searchTerm, initialCards = [], initialCategories = [], selectedCategory = "전체", searchQuery = "" }: InfiniteScrollCardsProps) {
  const [cards, setCards] = useState<BusinessCardType[]>(initialCards)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedCard, setSelectedCard] = useState<BusinessCardType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Load categories if not provided
  useEffect(() => {
    if (categories.length === 0) {
      getCategoriesOptimized().then(setCategories).catch(console.error)
    }
  }, [categories.length])

  // 데이터 로드 함수
  const loadCards = useCallback(
    async (pageNum: number, reset = false) => {
      if (pageNum === 0) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      try {
        const result = await getBusinessCardsPaginated(pageNum, 12, category, searchTerm)

        if (reset) {
          setCards(result.data)
        } else {
          setCards((prev) => [...prev, ...result.data])
        }

        setHasMore(result.hasMore)
      } catch (error) {
        console.error("카드 로드 오류:", error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [category, searchTerm],
  )

  // Load cards when filters change
  useEffect(() => {
    const loadCards = async () => {
      setLoading(true)
      setError(null)
      setPage(1)

      try {
        const result = await getBusinessCardsPaginated(
          1,
          12,
          selectedCategory === "전체" ? undefined : selectedCategory,
          searchQuery || undefined
        )

        setCards(result.cards)
        setHasMore(result.hasMore)
        setPage(2)
      } catch (error) {
        console.error("Error loading cards:", error)
        setError("카드를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    loadCards()
  }, [selectedCategory, searchQuery])

  // Load more cards
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const result = await getBusinessCardsPaginated(
        page,
        12,
        selectedCategory === "전체" ? undefined : selectedCategory,
        searchQuery || undefined
      )

      setCards(prev => [...prev, ...result.cards])
      setHasMore(result.hasMore)
      setPage(prev => prev + 1)
    } catch (error) {
      console.error("Error loading more cards:", error)
      setError("추가 카드를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, selectedCategory, searchQuery])

  // Infinite scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMore])

  // Handle card detail click
  const handleDetailClick = useCallback((card: BusinessCardType) => {
    setSelectedCard(card)
    // Increment view count
    incrementViewCountBatched(card.id)
  }, [])

  // Memoized card rendering
  const renderedCards = useMemo(() => {
    return cards.map((card, index) => (
      <div key={`${card.id}-${index}`} className="w-full">
        <OptimizedBusinessCard key={card.id} card={card} onDetailClick={handleDetailClick} />
        {/* Insert ad every 8 cards */}
        {(index + 1) % 8 === 0 && <InFeedAd />}
      </div>
    ))
  }, [cards, handleDetailClick])

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )

  if (loading && cards.length === 0) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {cards.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchQuery ? "검색 결과가 없습니다." : "등록된 카드가 없습니다."}
          </div>
          {searchQuery && (
            <div className="text-gray-400 text-sm mt-2">
              다른 검색어를 시도해보세요.
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {renderedCards}
          </div>

          {/* Loading more indicator */}
          {loadingMore && cards.length > 0 && (
            <div className="flex justify-center py-8">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>더 많은 카드를 불러오는 중...</span>
              </div>
            </div>
          )}

          {/* End of results indicator */}
          {!hasMore && cards.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              모든 카드를 불러왔습니다.
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedCard && (
        <BusinessDetailModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  )
}
