import { DatabaseStatus } from "@/components/database-status"

export default function DatabaseCheckPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">데이터베이스 상태 확인</h1>
          <p className="text-gray-600">Supabase 데이터베이스 연결 상태와 테이블 정보를 확인할 수 있습니다.</p>
        </div>

        <DatabaseStatus />
      </div>
    </div>
  )
}
