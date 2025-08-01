import type { Metadata } from "next"
import NewsCardList from "@/components/news-card-list"

export const metadata: Metadata = {
  title: "태국 뉴스 | 핫타이 HOT THAI",
  description: "태국 현지 뉴스와 교민 업체 소식을 한 곳에서 확인하세요. 최신 정보를 빠르게 전달합니다.",
  keywords: ["태국 뉴스", "현지 소식", "교민 업체", "태국 정보", "한인 뉴스"],
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
      <NewsCardList />
    </main>
  )
}
