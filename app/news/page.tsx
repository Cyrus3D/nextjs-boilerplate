import type { Metadata } from "next"
import NewsCardList from "@/components/news-card-list"

export const metadata: Metadata = {
  title: "뉴스 | 핫타이 HOT THAI",
  description: "태국 현지 뉴스와 교민 업체 소식을 확인하세요",
  keywords: ["태국뉴스", "현지뉴스", "교민업체", "한인사회", "방콕", "파타야"],
}

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <NewsCardList />
      </div>
    </main>
  )
}
