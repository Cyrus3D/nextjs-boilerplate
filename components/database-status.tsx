"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Database,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Settings,
  Activity,
} from "lucide-react"
import { checkDatabaseStatus, testDatabaseOperations, type DatabaseStatus } from "@/lib/database-check"
import { getSupabaseStatus } from "@/lib/supabase"

export default function DatabaseStatusComponent() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [operations, setOperations] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const supabaseStatus = getSupabaseStatus()

  const checkStatus = async () => {
    setRefreshing(true)
    try {
      const [dbStatus, dbOperations] = await Promise.all([checkDatabaseStatus(), testDatabaseOperations()])
      setStatus(dbStatus)
      setOperations(dbOperations)
    } catch (error) {
      console.error("Failed to check database status:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const StatusIcon = ({ condition }: { condition: boolean }) =>
    condition ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            데이터베이스 상태 확인 중...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Environment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            환경 설정 상태
            <Button variant="outline" size="sm" onClick={checkStatus} disabled={refreshing}>
              {refreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              새로고침
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span>Supabase URL</span>
              <div className="flex items-center gap-2">
                <StatusIcon condition={supabaseStatus.hasUrl} />
                <Badge variant={supabaseStatus.hasUrl ? "default" : "destructive"}>
                  {supabaseStatus.hasUrl ? "설정됨" : "미설정"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Supabase Key</span>
              <div className="flex items-center gap-2">
                <StatusIcon condition={supabaseStatus.hasKey} />
                <Badge variant={supabaseStatus.hasKey ? "default" : "destructive"}>
                  {supabaseStatus.hasKey ? "설정됨" : "미설정"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>클라이언트 초기화</span>
              <div className="flex items-center gap-2">
                <StatusIcon condition={supabaseStatus.client} />
                <Badge variant={supabaseStatus.client ? "default" : "destructive"}>
                  {supabaseStatus.client ? "성공" : "실패"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>전체 설정</span>
              <div className="flex items-center gap-2">
                <StatusIcon condition={supabaseStatus.isConfigured} />
                <Badge variant={supabaseStatus.isConfigured ? "default" : "destructive"}>
                  {supabaseStatus.isConfigured ? "완료" : "미완료"}
                </Badge>
              </div>
            </div>
          </div>

          {!supabaseStatus.isConfigured && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                환경 변수를 설정해주세요: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Database Connection Status */}
      {status && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              데이터베이스 연결 상태
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span>데이터베이스 연결</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={status.connected} />
                  <Badge variant={status.connected ? "default" : "destructive"}>
                    {status.connected ? "연결됨" : "연결 실패"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>테이블 존재</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={status.tablesExist} />
                  <Badge variant={status.tablesExist ? "default" : "destructive"}>
                    {status.tablesExist ? "존재함" : "없음"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">테이블별 레코드 수</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {status.recordCounts.business_cards.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">비즈니스 카드</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {status.recordCounts.news_articles.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">뉴스 기사</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {status.recordCounts.categories.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">카테고리</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{status.recordCounts.tags.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">태그</div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">데이터베이스 함수 상태</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">increment_view_count</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon condition={status.functionsExist.increment_view_count} />
                    <Badge variant={status.functionsExist.increment_view_count ? "default" : "secondary"}>
                      {status.functionsExist.increment_view_count ? "존재함" : "없음"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">increment_exposure_count</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon condition={status.functionsExist.increment_exposure_count} />
                    <Badge variant={status.functionsExist.increment_exposure_count ? "default" : "secondary"}>
                      {status.functionsExist.increment_exposure_count ? "존재함" : "없음"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">increment_news_view_count</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon condition={status.functionsExist.increment_news_view_count} />
                    <Badge variant={status.functionsExist.increment_news_view_count ? "default" : "secondary"}>
                      {status.functionsExist.increment_news_view_count ? "존재함" : "없음"}
                    </Badge>
                  </div>
                </div>
              </div>

              {!Object.values(status.functionsExist).every(Boolean) && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    일부 데이터베이스 함수가 없습니다. scripts/ 폴더의 SQL 파일을 실행하여 생성하거나, 현재 fallback
                    방식으로 정상 작동합니다.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="text-xs text-gray-500">
              마지막 확인: {new Date(status.lastChecked).toLocaleString("ko-KR")}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Database Operations Test */}
      {operations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              데이터베이스 작업 테스트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span>비즈니스 카드 조회</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={operations.selectBusinessCards} />
                  <Badge variant={operations.selectBusinessCards ? "default" : "destructive"}>
                    {operations.selectBusinessCards ? "성공" : "실패"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>뉴스 기사 조회</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={operations.selectNewsArticles} />
                  <Badge variant={operations.selectNewsArticles ? "default" : "destructive"}>
                    {operations.selectNewsArticles ? "성공" : "실패"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>카테고리 조회</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={operations.selectCategories} />
                  <Badge variant={operations.selectCategories ? "default" : "destructive"}>
                    {operations.selectCategories ? "성공" : "실패"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>태그 조회</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={operations.selectTags} />
                  <Badge variant={operations.selectTags ? "default" : "destructive"}>
                    {operations.selectTags ? "성공" : "실패"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>데이터 삽입</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={operations.insertTest} />
                  <Badge variant={operations.insertTest ? "default" : "destructive"}>
                    {operations.insertTest ? "성공" : "실패"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>데이터 업데이트</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={operations.updateTest} />
                  <Badge variant={operations.updateTest ? "default" : "destructive"}>
                    {operations.updateTest ? "성공" : "실패"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>데이터 삭제</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={operations.deleteTest} />
                  <Badge variant={operations.deleteTest ? "default" : "destructive"}>
                    {operations.deleteTest ? "성공" : "실패"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help and Resources */}
      <Card>
        <CardHeader>
          <CardTitle>도움말 및 리소스</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start bg-transparent" asChild>
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Supabase 대시보드
              </a>
            </Button>

            <Button variant="outline" className="justify-start bg-transparent" asChild>
              <a href="/admin" target="_blank" rel="noopener noreferrer">
                <Settings className="h-4 w-4 mr-2" />
                관리자 패널
              </a>
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>문제 해결 가이드:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• 환경 변수가 설정되지 않은 경우: .env.local 파일에 Supabase 설정 추가</li>
                <li>• 테이블이 없는 경우: scripts/ 폴더의 SQL 파일들을 순서대로 실행</li>
                <li>• 함수가 없는 경우: 현재 fallback 방식으로 정상 작동하므로 문제없음</li>
                <li>• 연결 실패 시: Supabase 프로젝트 상태 및 네트워크 연결 확인</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
