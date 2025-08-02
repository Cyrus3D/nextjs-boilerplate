"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Server,
  Table,
  BarChart3,
  Settings,
} from "lucide-react"
import { getDatabaseStatus, type DatabaseStatus } from "@/lib/supabase"
import {
  checkTableSchemas,
  getDataCounts,
  checkDatabaseFunctions,
  getComprehensiveDatabaseStatus,
} from "@/lib/database-check"

interface DatabaseStatusProps {
  autoRefresh?: boolean
  refreshInterval?: number
  showDetails?: boolean
}

export function DatabaseStatusComponent({
  autoRefresh = false,
  refreshInterval = 30000,
  showDetails = true,
}: DatabaseStatusProps) {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [schemas, setSchemas] = useState<any>(null)
  const [counts, setCounts] = useState<any>(null)
  const [functions, setFunctions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // 상태 새로고침
  const refreshStatus = async () => {
    setLoading(true)
    try {
      const [statusResult, schemasResult, countsResult, functionsResult] = await Promise.all([
        getDatabaseStatus(),
        checkTableSchemas(),
        getDataCounts(),
        checkDatabaseFunctions(),
      ])

      setStatus(statusResult)
      setSchemas(schemasResult)
      setCounts(countsResult)
      setFunctions(functionsResult)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("데이터베이스 상태 확인 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  // 종합 상태 확인
  const runComprehensiveCheck = async () => {
    setLoading(true)
    try {
      const result = await getComprehensiveDatabaseStatus()
      console.log("종합 데이터베이스 상태:", result)

      // 개별 상태 업데이트
      setStatus(result.connection)
      setSchemas(result.schemas)
      setCounts(result.data)
      setFunctions(result.functions)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("종합 상태 확인 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  // 초기 로드 및 자동 새로고침
  useEffect(() => {
    refreshStatus()

    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(refreshStatus, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  // 상태 아이콘 및 색상 결정
  const getStatusIcon = (isHealthy: boolean, hasError = false) => {
    if (hasError) return <XCircle className="w-4 h-4 text-red-500" />
    if (isHealthy) return <CheckCircle className="w-4 h-4 text-green-500" />
    return <AlertCircle className="w-4 h-4 text-yellow-500" />
  }

  const getStatusBadge = (isHealthy: boolean, hasError = false) => {
    if (hasError) return <Badge variant="destructive">오류</Badge>
    if (isHealthy) return <Badge className="bg-green-500">정상</Badge>
    return <Badge variant="secondary">확인 중</Badge>
  }

  if (loading && !status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            데이터베이스 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">상태 확인 중...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isOverallHealthy = status?.isConnected && schemas?.success && (counts?.success ? counts.total > 0 : false)

  return (
    <div className="space-y-4">
      {/* 전체 상태 요약 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              데이터베이스 상태
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(isOverallHealthy, !!status?.error)}
              <Button variant="outline" size="sm" onClick={refreshStatus} disabled={loading}>
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          {lastRefresh && <CardDescription>마지막 확인: {lastRefresh.toLocaleString("ko-KR")}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 연결 상태 */}
            <div className="flex items-center gap-2">
              {getStatusIcon(status?.isConnected || false, !!status?.error)}
              <div>
                <div className="font-medium text-sm">연결</div>
                <div className="text-xs text-gray-500">{status?.isConnected ? "연결됨" : "연결 실패"}</div>
              </div>
            </div>

            {/* 테이블 상태 */}
            <div className="flex items-center gap-2">
              {getStatusIcon(schemas?.success || false)}
              <div>
                <div className="font-medium text-sm">테이블</div>
                <div className="text-xs text-gray-500">{schemas?.success ? "정상" : "문제 있음"}</div>
              </div>
            </div>

            {/* 데이터 상태 */}
            <div className="flex items-center gap-2">
              {getStatusIcon(counts?.success && counts.total > 0)}
              <div>
                <div className="font-medium text-sm">데이터</div>
                <div className="text-xs text-gray-500">{counts?.success ? `${counts.total}개` : "확인 실패"}</div>
              </div>
            </div>

            {/* 함수 상태 */}
            <div className="flex items-center gap-2">
              {getStatusIcon(functions?.success || false)}
              <div>
                <div className="font-medium text-sm">함수</div>
                <div className="text-xs text-gray-500">
                  {functions?.success ? `${functions.available}/${functions.total}` : "확인 실패"}
                </div>
              </div>
            </div>
          </div>

          {/* 오류 메시지 */}
          {status?.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="w-4 h-4" />
                <span className="font-medium">연결 오류</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{status.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 상세 정보 */}
      {showDetails && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* 테이블 스키마 상태 */}
          {schemas && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Table className="w-4 h-4" />
                  테이블 스키마
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(schemas.results || {}).map(([table, exists]) => (
                    <div key={table} className="flex items-center justify-between">
                      <span className="text-sm font-mono">{table}</span>
                      {exists ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>

                {schemas.errors && schemas.errors.length > 0 && (
                  <div className="mt-3 p-2 bg-red-50 rounded text-xs">
                    <div className="font-medium text-red-700 mb-1">오류:</div>
                    {schemas.errors.map((error: string, index: number) => (
                      <div key={index} className="text-red-600">
                        {error}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 데이터 개수 */}
          {counts && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="w-4 h-4" />
                  데이터 개수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(counts.counts || {}).map(([table, count]) => (
                    <div key={table} className="flex items-center justify-between">
                      <span className="text-sm font-mono">{table}</span>
                      <Badge variant="outline" className="text-xs">
                        {count}개
                      </Badge>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                <div className="flex items-center justify-between font-medium">
                  <span className="text-sm">전체</span>
                  <Badge className="bg-blue-500">{counts.total}개</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 데이터베이스 함수 */}
          {functions && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="w-4 h-4" />
                  데이터베이스 함수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(functions.functions || {}).map(([funcName, exists]) => (
                    <div key={funcName} className="flex items-center justify-between">
                      <span className="text-sm font-mono">{funcName}</span>
                      {exists ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600">사용 가능</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs text-yellow-600">없음 (직접 업데이트)</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                  <div className="font-medium text-blue-700 mb-1">참고:</div>
                  <div className="text-blue-600">함수가 없어도 직접 업데이트 방식으로 정상 작동합니다.</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 종합 검사 버튼 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">종합 상태 검사</h3>
              <p className="text-sm text-gray-600">
                모든 데이터베이스 구성 요소를 검사하고 콘솔에 상세 로그를 출력합니다.
              </p>
            </div>
            <Button onClick={runComprehensiveCheck} disabled={loading} className="ml-4">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  검사 중...
                </>
              ) : (
                <>
                  <Server className="w-4 h-4 mr-2" />
                  종합 검사
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
