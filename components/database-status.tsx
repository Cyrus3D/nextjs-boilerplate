"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, Database, CheckCircle, XCircle, AlertTriangle, Settings, ExternalLink } from "lucide-react"
import { checkDatabaseStatus } from "@/lib/database-check"
import type { DatabaseStatus } from "@/lib/supabase"

export default function DatabaseStatusComponent() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      const result = await checkDatabaseStatus()
      setStatus(result)
      setLastChecked(new Date())
    } catch (error) {
      console.error("Failed to check database status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusIcon = (isOk: boolean) => {
    return isOk ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />
  }

  const getStatusBadge = (isOk: boolean, label: string) => {
    return (
      <Badge variant={isOk ? "default" : "destructive"} className={isOk ? "bg-green-600" : ""}>
        {isOk ? "✓" : "✗"} {label}
      </Badge>
    )
  }

  if (isLoading && !status) {
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
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              데이터베이스 상태
            </CardTitle>
            <Button variant="outline" size="sm" onClick={checkStatus} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </div>
          {lastChecked && <p className="text-sm text-gray-500">마지막 확인: {lastChecked.toLocaleString("ko-KR")}</p>}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Environment Variables */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              환경 변수
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">SUPABASE_URL</span>
                {getStatusIcon(status?.environment.supabase_url || false)}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">SUPABASE_ANON_KEY</span>
                {getStatusIcon(status?.environment.supabase_anon_key || false)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Connection Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3">연결 상태</h3>
            <div className="flex items-center gap-3">
              {getStatusBadge(status?.connected || false, status?.connected ? "연결됨" : "연결 실패")}
              {!status?.connected && (
                <Alert className="flex-1">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>데이터베이스에 연결할 수 없습니다. 환경 변수를 확인하세요.</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {status?.connected && (
            <>
              <Separator />

              {/* Tables */}
              <div>
                <h3 className="text-lg font-semibold mb-3">테이블 상태</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{status.tables.business_cards}</div>
                    <div className="text-sm text-gray-600">비즈니스 카드</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{status.tables.news_articles}</div>
                    <div className="text-sm text-gray-600">뉴스 기사</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{status.tables.categories}</div>
                    <div className="text-sm text-gray-600">카테고리</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{status.tables.tags}</div>
                    <div className="text-sm text-gray-600">태그</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Functions */}
              <div>
                <h3 className="text-lg font-semibold mb-3">데이터베이스 함수</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">increment_view_count</span>
                    {getStatusIcon(status.functions.increment_view_count)}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">increment_exposure_count</span>
                    {getStatusIcon(status.functions.increment_exposure_count)}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">increment_news_view_count</span>
                    {getStatusIcon(status.functions.increment_news_view_count)}
                  </div>
                </div>

                {(!status.functions.increment_view_count ||
                  !status.functions.increment_exposure_count ||
                  !status.functions.increment_news_view_count) && (
                  <Alert className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      일부 데이터베이스 함수가 없습니다. SQL 스크립트를 실행하여 함수를 생성하세요.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </>
          )}

          {/* Help Section */}
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3">문제 해결</h3>
            <div className="space-y-2 text-sm">
              <p>• 환경 변수가 설정되지 않은 경우: .env.local 파일을 확인하세요</p>
              <p>• 연결이 실패하는 경우: Supabase 프로젝트 설정을 확인하세요</p>
              <p>• 함수가 없는 경우: scripts/ 폴더의 SQL 파일들을 실행하세요</p>
              <p>• 테이블이 비어있는 경우: 샘플 데이터 스크립트를 실행하세요</p>
            </div>
            <div className="mt-3">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Supabase 대시보드 열기
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
