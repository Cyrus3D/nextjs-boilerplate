import { Suspense } from "react"
import DatabaseStatusComponent from "@/components/database-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function DatabaseCheckPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">데이터베이스 상태 확인</h1>
          <p className="text-gray-600">
            Supabase 데이터베이스 연결 상태, 테이블 정보, 함수 존재 여부를 확인할 수 있습니다.
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <DatabaseStatusComponent />
        </Suspense>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5" />
              문제 해결 가이드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">환경 변수 설정</h4>
              <p className="text-sm text-gray-600 mb-2">다음 환경 변수들이 올바르게 설정되어 있는지 확인하세요:</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>
                  • <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
                </li>
                <li>
                  • <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">데이터베이스 스크립트 실행</h4>
              <p className="text-sm text-gray-600">
                테이블이나 함수가 없는 경우, <code className="bg-gray-100 px-1 rounded">scripts/</code> 폴더의 SQL
                스크립트들을 순서대로 실행하세요.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">연결 문제</h4>
              <p className="text-sm text-gray-600">
                데이터베이스 연결에 실패하는 경우, Supabase 프로젝트 설정과 네트워크 연결을 확인하세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
