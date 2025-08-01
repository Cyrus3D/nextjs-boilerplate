import { DatabaseStatus } from "@/components/database-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Info, AlertTriangle } from "lucide-react"

export default function DatabaseCheckPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Database className="h-8 w-8" />
            데이터베이스 상태 확인
          </h1>
          <p className="text-gray-600">Supabase 데이터베이스 연결 상태와 테이블 정보를 확인합니다.</p>
        </div>

        {/* Database Status Component */}
        <DatabaseStatus />

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                설정 안내
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">환경 변수 설정</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
                  </p>
                  <p>
                    <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">데이터베이스 스크립트 실행</h4>
                <p className="text-sm text-gray-600">
                  <code>/scripts</code> 폴더의 SQL 파일들을 순서대로 실행하여 테이블과 함수를 생성하세요.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                문제 해결
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">연결 실패 시</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 환경 변수가 올바르게 설정되었는지 확인</li>
                  <li>• Supabase 프로젝트가 활성화되어 있는지 확인</li>
                  <li>• API 키가 유효한지 확인</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">테이블 없음</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• SQL 스크립트를 실행하여 테이블 생성</li>
                  <li>• RLS(Row Level Security) 정책 확인</li>
                  <li>• 권한 설정 확인</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>현재 상태 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">실시간</div>
                <div className="text-sm text-gray-600">상태 모니터링</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">자동</div>
                <div className="text-sm text-gray-600">Fallback 데이터</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">완전</div>
                <div className="text-sm text-gray-600">타입 안전성</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">안전</div>
                <div className="text-sm text-gray-600">오류 처리</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const metadata = {
  title: "데이터베이스 상태 확인 - 태국 한인 정보",
  description: "Supabase 데이터베이스 연결 상태와 테이블 정보를 실시간으로 확인합니다.",
}
