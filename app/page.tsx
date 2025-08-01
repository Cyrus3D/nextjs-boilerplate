import InfoCardList from "../info-card-list"
import NewsList from "../components/news-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* 기존 비즈니스 카드 섹션 */}
      <InfoCardList />

      {/* 뉴스 섹션 */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">최신 뉴스</h2>
            <p className="text-gray-600 mb-4">태국 현지 소식과 교민 업체 정보</p>
            <Link href="/news">
              <Button variant="outline">모든 뉴스 보기</Button>
            </Link>
          </div>
          <div className="max-w-6xl mx-auto">
            <NewsList />
          </div>
        </div>
      </section>
    </div>
  )
}
