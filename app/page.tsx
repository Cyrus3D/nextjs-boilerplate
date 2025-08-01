import NewsList from "@/components/news-list"

export default function Page() {
  return (
    <div>
      {/* 기존 비즈니스 카드 섹션 */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">비즈니스 카드</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">태국 현지 비즈니스 카드를 확인하세요</p>
          </div>
          {/* 비즈니스 카드 내용 */}
        </div>
      </section>

      {/* 뉴스 섹션 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">최신 뉴스</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">태국 현지 소식과 교민 업체 정보를 확인하세요</p>
          </div>
          <NewsList />
        </div>
      </section>
    </div>
  )
}
