"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, TrendingUp, Clock, Newspaper, Building2, Globe, ChevronDown } from "lucide-react"
import NewsCard from "./news-card"
import NewsDetailModal from "./news-detail-modal"
import InFeedAd from "./in-feed-ad"
import { sampleNewsArticles } from "@/data/sample-news"
import type { NewsArticle } from "@/types/news"

export default function NewsCardList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)

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
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // 날짜순 정렬 (최신순)
    return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
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

  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case "all":
        return <Globe className="w-4 h-4" />
      case "local":
        return <Newspaper className="w-4 h-4" />
      case "business":
        return <Building2 className="w-4 h-4" />
      default:
        return null
    }
  }

  const getTabCount = (tabId: string) => {
    switch (tabId) {
      case "all":
        return sampleNewsArticles.length
      case "local":
        return sampleNewsArticles.filter((article) => article.category === "현지 뉴스").length
      case "business":
        return sampleNewsArticles.filter((article) => article.category === "교민 업체").length
      default:
        return 0
    }
  }

  const todayNewsCount = sampleNewsArticles.filter((article) => {
    const today = new Date()
    const articleDate = new Date(article.publishedAt)
    return articleDate.toDateString() === today.toDateString()
  }).length

  const breakingNewsCount = sampleNewsArticles.filter((article) => article.isBreaking).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 통계 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">오늘의 뉴스</p>
                    <p className="text-2xl font-bold text-blue-900">{todayNewsCount}</p>
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
                    <p className="text-2xl font-bold text-red-900">{breakingNewsCount}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">전체 기사</p>
                    <p className="text-2xl font-bold text-green-900">{sampleNewsArticles.length}</p>
                  </div>
                  <Newspaper className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">이번 주 조회수</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {sampleNewsArticles.reduce((sum, article) => sum + article.viewCount, 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 검색 및 필터 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="뉴스 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-white">
                <Filter className="w-4 h-4 mr-2" />
                필터
              </Button>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 p-1">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {getTabIcon("all")}
              전체
              <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-600">
                {getTabCount("all")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="local"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {getTabIcon("local")}
              현지 뉴스
              <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-600">
                {getTabCount("local")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {getTabIcon("business")}
              교민 업체
              <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-600">
                {getTabCount("business")}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="mb-4">
              <p className="text-gray-600">
                총 <span className="font-semibold text-gray-900">{filteredArticles.length}</span>개의 뉴스가 있습니다.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="local" className="mt-6">
            <div className="mb-4">
              <p className="text-gray-600">
                현지 뉴스 <span className="font-semibold text-gray-900">{filteredArticles.length}</span>개
              </p>
            </div>
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <div className="mb-4">
              <p className="text-gray-600">
                교민 업체 소식 <span className="font-semibold text-gray-900">{filteredArticles.length}</span>개
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* 뉴스 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredArticles.slice(0, visibleCount).map((article, index) => (
            <div key={article.id}>
              <NewsCard article={article} onReadMore={handleReadMore} />
              {/* 3번째마다 광고 삽입 */}
              {(index + 1) % 3 === 0 && index < visibleCount - 1 && (
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
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
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
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  로딩 중...
                </>
              ) : (
                <>
                  더 많은 뉴스 보기
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
            <p className="text-gray-600 mb-4">다른 검색어를 시도해보세요.</p>
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
