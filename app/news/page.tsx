import type { Metadata } from "next"
import NewsCardList from "@/components/news-card-list"
import { getNewsArticles } from "@/lib/api"

export const metadata: Metadata = {
  title: "뉴스 | 핫타이 HOT THAI",
  description: "태국 현지 뉴스와 교민 업체 소식을 확인하세요. 최신 정책, 교통, 비자 정보부터 한인 업체 소식까지.",
  keywords: ["태국뉴스", "현지뉴스", "교민업체", "비자", "정책", "교통"],
}

export default async function NewsPage() {
  // 실제 데이터베이스에서 뉴스 데이터 가져오기
  const newsArticles = await getNewsArticles()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📰 태국 뉴스</h1>
            <p className="text-gray-600">최신 현지 소식과 교민 업체 정보를 한 곳에서 확인하세요</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <NewsCardList initialArticles={newsArticles} />
      </div>
    </div>
  )
}
