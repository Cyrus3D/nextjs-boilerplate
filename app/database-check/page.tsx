import DatabaseStatusComponent from "@/components/database-status"

export default function DatabaseCheckPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">데이터베이스 상태 확인</h1>
          <p className="text-gray-600">데이터베이스 연결 상태, 테이블 및 함수의 존재 여부를 확인합니다.</p>
        </div>

        <DatabaseStatusComponent />
      </div>
    </div>
  )
}
