"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ChevronDown, Newspaper } from "lucide-react"
import NewsCard from "./news-card"
import NewsDetailModal from "./news-detail-modal"
import InFeedAd from "./in-feed-ad"
import type { NewsArticle } from "@/types/news"
import { incrementNewsViewCount } from "@/lib/api"

interface NewsCardListProps {
  initialArticles: NewsArticle[]
}

export default function NewsCardList({ initialArticles }: NewsCardListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)
  const [activeTab, setActiveTab] = useState("all")

  // 탭별 기사 필터링
  const filteredArticles = useMemo(() => {
    let filtered = initialArticles

    // 카테고리 필터링
    if (activeTab !== "all") {
      const categoryMap = {
        local: "현지 뉴스",
        business: "교민 업체",
        policy: "정책",
        traffic: "교통",
        visa: "비자",
        economy: "경제",
        culture: "문화",
        sports: "스포츠",
      }

      const targetCategory = categoryMap[activeTab as keyof typeof categoryMap]
      filtered = filtered.filter((article) => article.category === targetCategory)
    }

    // 검색 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // 정렬: 속보 > 최신순 > 조회수순
    return filtered.sort((a, b) => {
      if (a.isBreaking && !b.isBreaking) return -1
      if (!a.isBreaking && b.isBreaking) return 1

      const dateA = new Date(a.publishedAt).getTime()
      const dateB = new Date(b.publishedAt).getTime()
      if (dateA !== dateB) return dateB - dateA

      return b.viewCount - a.viewCount
    })
  }, [initialArticles, searchTerm, activeTab])

  // 기사 개수 계산
  const getCategoryCount = (category: string) => {
    if (category === "all") return initialArticles.length

    const categoryMap = {
      local: "현지 뉴스",
      business: "교민 업체",
      policy: "정책",
      traffic: "교통",
      visa: "비자",
      economy: "경제",
      culture: "문화",
      sports: "스포츠",
    }

    const targetCategory = categoryMap[category as keyof typeof categoryMap]
    return initialArticles.filter((article) => article.category === targetCategory).length
  }

  const handleReadMore = async (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)

    // 조회수 증가
    try {
      await incrementNewsViewCount(article.id.toString())
    } catch (error) {
      console.error("조회수 증가 실패:", error)
    }
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6)
  }

  // 데이터가 없는 경우 처리
  if (!initialArticles || initialArticles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">태국 뉴스</h2>
          <p className="text-gray-600">최신 현지 소식과 교민 업체 정보를 확인하세요</p>
        </div>

        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500 text-lg">아직 등록된 뉴스가 없습니다.</div>
          <div className="text-gray-400 text-sm mt-2">곧 새로운 소식을 전해드리겠습니다.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">태국 뉴스</h2>
        <p className="text-gray-600">최신 현지 소식과 교민 업체 정보를 확인하세요</p>
      </div>

      {/* 카테고리 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-white border">
          <TabsTrigger value="all" className="flex items-center gap-1 text-xs">
            전체
            <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
              {getCategoryCount("all")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-1 text-xs">
            현지
            <span className="bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded-full text-xs">
              {getCategoryCount("local")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-1 text-xs">
            업체
            <span className="bg-green-200 text-green-700 px-1.5 py-0.5 rounded-full text-xs">
              {getCategoryCount("business")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="policy" className="flex items-center gap-1 text-xs">
            정책
            <span className="bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded-full text-xs">
              {getCategoryCount("policy")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="traffic" className="flex items-center gap-1 text-xs">
            교통
            <span className="bg-orange-200 text-orange-700 px-1.5 py-0.5 rounded-full text-xs">
              {getCategoryCount("traffic")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="visa" className="flex items-center gap-1 text-xs">
            비자
            <span className="bg-red-200 text-red-700 px-1.5 py-0.5 rounded-full text-xs">
              {getCategoryCount("visa")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="economy" className="flex items-center gap-1 text-xs">
            경제
            <span className="bg-yellow-200 text-yellow-700 px-1.5 py-0.5 rounded-full text-xs">
              {getCategoryCount("economy")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="culture" className="flex items-center gap-1 text-xs">
            문화
            <span className="bg-pink-200 text-pink-700 px-1.5 py-0.5 rounded-full text-xs">
              {getCategoryCount("culture")}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* 검색 */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="뉴스 검색... (제목, 내용, 태그)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* 검색 결과 요약 */}
          <div className="mb-6">
            <p className="text-gray-600">
              총 <span className="font-semibold text-gray-900">{filteredArticles.length}</span>개의 뉴스
              {searchTerm && (
                <>
                  {" "}
                  (검색: "<span className="font-medium">{searchTerm}</span>")
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    검색 초기화
                  </Button>
                </>
              )}
            </p>
          </div>

          {/* 뉴스 카드 그리드 */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600 mb-4">다른 키워드로 검색해보세요</p>
              <Button variant="outline" onClick={() => setSearchTerm("")} className="bg-white">
                전체 뉴스 보기
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.slice(0, visibleCount).map((article, index) => (
                <div key={article.id}>
                  <NewsCard article={article} onReadMore={handleReadMore} />
                  {/* 6번째마다 광고 삽입 */}
                  {(index + 1) % 6 === 0 && index < visibleCount - 1 && (
                    <div className="col-span-full my-6">
                      <InFeedAd />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 더 보기 버튼 */}
          {visibleCount < filteredArticles.length && (
            <div className="text-center mt-8">
              <Button onClick={handleLoadMore} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2" size="lg">
                더 많은 뉴스 보기 ({visibleCount}/{filteredArticles.length})
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 뉴스 상세 모달 */}
      <NewsDetailModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedArticle(null)
        }}
      />
    </div>
  )
}
