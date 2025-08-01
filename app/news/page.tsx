import type { Metadata } from "next"
import NewsCardList from "@/components/news-card-list"

export const metadata: Metadata = {
  title: "태국 뉴스 | 핫타이 HOT THAI",
  description:
    "태국 현지 뉴스와 교민 업체 소식을 한 곳에서 확인하세요. 최신 정책, 교통, 비자 정보부터 한인 업체 성공 사례까지.",
  keywords: ["태국뉴스", "현지뉴스", "교민업체", "태국정책", "비자정보", "한인업체소식"],
  openGraph: {
    title: "태국 뉴스 | 핫타이 HOT THAI",
    description: "태국 현지 뉴스와 교민 업체 소식을 한 곳에서 확인하세요.",
    type: "website",
    locale: "ko_KR",
  },
}

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📰 태국 뉴스</h1>
          <p className="text-gray-600">최신 현지 소식과 교민 업체 정보를 한 곳에서 확인하세요</p>
        </div>
        <NewsCardList />
      </div>
    </main>
  )
}
