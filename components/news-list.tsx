"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewsCard from "./news-card"
import InFeedAd from "./in-feed-ad"
import { NewsDetailModal } from "./news-detail-modal"
import type { NewsArticle } from "../types/news"
import { incrementNewsViewCount } from "../lib/api"

interface NewsListProps {
  initialArticles: NewsArticle[]
}

export default function NewsList({ initialArticles }: NewsListProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // 탭별 기사 필터링
  const filteredArticles = useMemo(() => {
    if (activeTab === "all") {
      return initialArticles
    }

    const categoryMap = {
      local: "현지 뉴스",
      business: "교민 업체",
    }

    const targetCategory = categoryMap[activeTab as keyof typeof categoryMap]
    return initialArticles.filter((article) => article.category === targetCategory)
  }, [initialArticles, activeTab])

  // 기사 개수 계산
  const getCategoryCount = (category: string) => {
    if (category === "all") return initialArticles.length

    const categoryMap = {
      local: "현지 뉴스",
      business: "교민 업체",
    }

    const targetCategory = categoryMap[category as keyof typeof categoryMap]
    return initialArticles.filter((article) => article.category === targetCategory).length
  }

  const handleDetailClick = async (article: NewsArticle) => {
    setSelectedArticle(article)
    // 조회수 증가
    try {
      await incrementNewsViewCount(article.id.toString())
    } catch (error) {
      console.error("조회수 증가 실패:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">태국 뉴스</h1>
        <p className="text-gray-600">최신 현지 소식과 교민 업체 정보를 확인하세요</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            전체
            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {getCategoryCount("all")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-2">
            현지 뉴스
            <span className="bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-xs">
              {getCategoryCount("local")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            교민 업체
            <span className="bg-green-200 text-green-700 px-2 py-0.5 rounded-full text-xs">
              {getCategoryCount("business")}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">해당 카테고리에 뉴스가 없습니다.</div>
              <div className="text-gray-400 text-sm mt-2">곧 새로운 소식을 전해드리겠습니다.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <div key={article.id} className="w-full">
                  <NewsCard article={article} onDetailClick={handleDetailClick} />
                  {/* 광고 삽입 (매 6개 기사마다) */}
                  {(index + 1) % 6 === 0 && (
                    <InFeedAd adSlot={process.env.NEXT_PUBLIC_ADSENSE_INFEED_SLOT || "1234567890"} className="my-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 상세 모달 */}
      <NewsDetailModal article={selectedArticle} isOpen={!!selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  )
}
