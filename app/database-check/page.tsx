import { DatabaseStatus } from "@/components/database-status"

export default function DatabaseCheckPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">데이터베이스 상태 확인</h1>
          <p className="text-muted-foreground">Supabase 데이터베이스 연결 상태와 테이블 정보를 확인할 수 있습니다.</p>
        </div>

        <DatabaseStatus />

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">환경 변수 설정</h3>
          <p className="text-sm text-blue-700 mb-2">데이터베이스에 연결하려면 다음 환경 변수를 설정해야 합니다:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <code>NEXT_PUBLIC_SUPABASE_URL</code>
            </li>
            <li>
              • <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
