import NewsList from "../../components/news-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "태국 뉴스 - 현지 소식과 교민 업체 정보",
  description: "태국 현지 뉴스와 교민 업체 소식을 실시간으로 확인하세요. 최신 정보와 유용한 소식을 제공합니다.",
  keywords: ["태국 뉴스", "현지 소식", "교민 업체", "태국 정보", "한국인 커뮤니티"],
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
