"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, TrendingUp, Clock, Newspaper, Building2, ChevronDown } from "lucide-react"
import NewsCard from "./news-card"
import NewsDetailModal from "./news-detail-modal"
import InFeedAd from "./in-feed-ad"
import { sampleNewsArticles } from "@/data/sample-news"
import type { NewsArticle } from "@/types/news"

export default function NewsCardList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("local")
  const [isLoading, setIsLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)

  // 통계 계산
  const stats = useMemo(() => {
    const today = new Date()
    const todayArticles = sampleNewsArticles.filter((article) => {
      const articleDate = new Date(article.publishedAt)
      return articleDate.toDateString() === today.toDateString()
    }).length

    const breakingNews = sampleNewsArticles.filter((article) => article.isBreaking).length
    const totalViews = sampleNewsArticles.reduce((sum, article) => sum + article.viewCount, 0)
    const localNews = sampleNewsArticles.filter((article) => article.category === "현지 뉴스").length
    const businessNews = sampleNewsArticles.filter((article) => article.category === "교민 업체").length

    return {
      today: todayArticles,
      breaking: breakingNews,
      total: sampleNewsArticles.length,
      totalViews,
      local: localNews,
      business: businessNews,
    }
  }, [])

  // 필터링된 뉴스 기사
  const filteredArticles = useMemo(() => {
    let filtered = sampleNewsArticles

    // 탭 필터링
    if (activeTab === "local") {
      filtered = filtered.filter((article) => article.category === "현지 뉴스")
    } else if (activeTab === "business") {
      filtered = filtered.filter((article) => article.category === "교민 업체")
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
  }, [searchTerm, activeTab])

  const handleReadMore = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const handleLoadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6)
      setIsLoading(false)
    }, 1000)
  }

  const getSearchPlaceholder = (tab: string) => {
    switch (tab) {
      case "local":
        return "현지 뉴스 검색... (정책, 교통, 비자 등)"
      case "business":
        return "교민 업체 검색... (업체명, 서비스, 지역 등)"
      default:
        return "뉴스 검색..."
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상시 표시 헤더 통계 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📰 태국 뉴스</h1>
            <p className="text-gray-600">최신 현지 소식과 교민 업체 정보를 한 곳에서 확인하세요</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">오늘의 뉴스</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.today}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-red-50 to-red-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">속보</p>
                    <p className="text-2xl font-bold text-red-900">{stats.breaking}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">현지 뉴스</p>
                    <p className="text-2xl font-bold text-green-900">{stats.local}</p>
                  </div>
                  <Newspaper className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">교민 업체</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.business}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 p-1">
            <TabsTrigger
              value="local"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Newspaper className="w-4 h-4" />
              현지 뉴스
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {stats.local}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Building2 className="w-4 h-4" />
              교민 업체
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {stats.business}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="local" className="mt-6">
            {/* 현지 뉴스 전용 검색 */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={getSearchPlaceholder("local")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                태국 정부 정책, 교통, 비자, 사회 이슈 등 현지 소식을 확인하세요
              </p>
            </div>
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            {/* 교민 업체 전용 검색 */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={getSearchPlaceholder("business")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-green-300 focus:ring-green-200"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                한인 업체 소식, 신규 서비스, 성공 사례, 이벤트 정보를 확인하세요
              </p>
            </div>
          </TabsContent>
        </Tabs>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        {/* 로딩 스켈레톤 */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-40 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 더 보기 버튼 */}
        {visibleCount < filteredArticles.length && (
          <div className="text-center">
            <Button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  로딩 중...
                </>
              ) : (
                <>
                  더 많은 뉴스 보기 ({visibleCount}/{filteredArticles.length})
                  <ChevronDown className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* 검색 결과 없음 */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-4">
              {activeTab === "local" ? "다른 현지 뉴스 키워드를 시도해보세요" : "다른 교민 업체 키워드를 시도해보세요"}
            </p>
            <Button variant="outline" onClick={() => setSearchTerm("")} className="bg-white">
              전체 뉴스 보기
            </Button>
          </div>
        )}
      </div>

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
