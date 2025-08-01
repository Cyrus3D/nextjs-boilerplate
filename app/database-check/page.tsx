import DatabaseStatusComponent from "@/components/database-status"

export default function DatabaseCheckPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">데이터베이스 상태 확인</h1>
        <p className="text-muted-foreground">Supabase 데이터베이스 연결 상태와 테이블 구조를 확인합니다.</p>
      </div>

      <DatabaseStatusComponent />
    </div>
  )
}
