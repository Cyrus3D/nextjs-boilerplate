import type { Metadata } from "next"
import NewsList from "@/components/news-list"

export const metadata: Metadata = {
  title: "태국 뉴스 | 현지 소식과 교민 업체 정보",
  description: "태국 현지 뉴스와 교민 업체 소식을 실시간으로 확인하세요. 관광, 정책, 비즈니스 정보를 한눈에!",
  keywords: ["태국뉴스", "교민소식", "현지뉴스", "태국정보", "한국인"],
  openGraph: {
    title: "태국 뉴스 | 현지 소식과 교민 업체 정보",
    description: "태국 현지 뉴스와 교민 업체 소식을 실시간으로 확인하세요.",
    type: "website",
  },
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <NewsList />
      </div>
    </div>
  )
}
