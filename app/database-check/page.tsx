import { DatabaseStatusComponent } from "@/components/database-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Info, Terminal, CheckCircle } from "lucide-react"

export default function DatabaseCheckPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-600" />
          데이터베이스 상태 확인
        </h1>
        <p className="text-gray-600">
          Supabase 데이터베이스의 연결 상태, 테이블 스키마, 데이터 현황을 실시간으로 모니터링합니다.
        </p>
      </div>

      {/* 사용 안내 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            사용 안내
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                주요 기능
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 실시간 데이터베이스 연결 상태 확인</li>
                <li>• 테이블 스키마 검증</li>
                <li>• 데이터 개수 및 통계</li>
                <li>• 데이터베이스 함수 상태</li>
                <li>• 자동 새로고침 지원</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-500" />
                콘솔 로그
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 브라우저 개발자 도구 → Console 탭</li>
                <li>• 종합 검사 시 상세 로그 출력</li>
                <li>• 오류 및 경고 메시지 확인</li>
                <li>• 성능 및 연결 상태 모니터링</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상태 표시기 */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">정상</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">모든 기능이 정상 작동</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">주의</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">일부 기능에 문제 있음</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">오류</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">연결 또는 설정 오류</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">확인 중</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">상태 확인 진행 중</p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 데이터베이스 상태 컴포넌트 */}
      <DatabaseStatusComponent autoRefresh={true} refreshInterval={30000} showDetails={true} />

      {/* 추가 정보 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>환경 변수 확인</CardTitle>
          <CardDescription>데이터베이스 연결에 필요한 환경 변수 설정 상태</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">NEXT_PUBLIC_SUPABASE_URL</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "설정됨" : "없음"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "설정됨" : "없음"}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>설정 방법:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Supabase 프로젝트에서 API 키 복사</li>
                <li>.env.local 파일에 환경 변수 추가</li>
                <li>애플리케이션 재시작</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
