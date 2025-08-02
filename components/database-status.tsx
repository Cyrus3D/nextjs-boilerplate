"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, Database, ExternalLink, AlertTriangle } from "lucide-react"
import { checkDatabaseStatus } from "@/lib/database-check"
import type { DatabaseStatus } from "@/lib/supabase"

export default function DatabaseStatusComponent() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      const newStatus = await checkDatabaseStatus()
      setStatus(newStatus)
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

  const StatusIcon = ({ condition }: { condition: boolean }) => {
    return condition ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const StatusBadge = ({
    condition,
    trueText,
    falseText,
  }: { condition: boolean; trueText: string; falseText: string }) => {
    return (
      <Badge variant={condition ? "default" : "destructive"} className={condition ? "bg-green-500" : ""}>
        {condition ? trueText : falseText}
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
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            데이터베이스 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>데이터베이스 상태를 확인할 수 없습니다.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const hasIssues = !status.connected || !status.environment.supabase_url || !status.environment.supabase_anon_key

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
            <h3 className="text-lg font-semibold mb-3">환경 변수</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">SUPABASE_URL</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={status.environment.supabase_url} />
                  <StatusBadge condition={status.environment.supabase_url} trueText="설정됨" falseText="누락" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">SUPABASE_ANON_KEY</span>
                <div className="flex items-center gap-2">
                  <StatusIcon condition={status.environment.supabase_anon_key} />
                  <StatusBadge condition={status.environment.supabase_anon_key} trueText="설정됨" falseText="누락" />
                </div>
              </div>
            </div>
          </div>

          {/* Database Connection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">데이터베이스 연결</h3>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">연결 상태</span>
              <div className="flex items-center gap-2">
                <StatusIcon condition={status.connected} />
                <StatusBadge condition={status.connected} trueText="연결됨" falseText="연결 실패" />
              </div>
            </div>
          </div>

          {/* Tables */}
          {status.connected && (
            <div>
              <h3 className="text-lg font-semibold mb-3">테이블 상태</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{status.tables.business_cards}</div>
                  <div className="text-sm text-gray-600">비즈니스 카드</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{status.tables.news_articles}</div>
                  <div className="text-sm text-gray-600">뉴스 기사</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{status.tables.categories}</div>
                  <div className="text-sm text-gray-600">카테고리</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{status.tables.tags}</div>
                  <div className="text-sm text-gray-600">태그</div>
                </div>
              </div>
            </div>
          )}

          {/* Database Functions */}
          {status.connected && (
            <div>
              <h3 className="text-lg font-semibold mb-3">데이터베이스 함수</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">increment_view_count</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon condition={status.functions.increment_view_count} />
                    <StatusBadge condition={status.functions.increment_view_count} trueText="존재함" falseText="누락" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">increment_exposure_count</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon condition={status.functions.increment_exposure_count} />
                    <StatusBadge
                      condition={status.functions.increment_exposure_count}
                      trueText="존재함"
                      falseText="누락"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">increment_news_view_count</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon condition={status.functions.increment_news_view_count} />
                    <StatusBadge
                      condition={status.functions.increment_news_view_count}
                      trueText="존재함"
                      falseText="누락"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issues and Solutions */}
      {hasIssues && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              문제 해결 가이드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!status.environment.supabase_url && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>NEXT_PUBLIC_SUPABASE_URL</strong> 환경 변수가 설정되지 않았습니다.
                  <br />
                  .env.local 파일에 Supabase 프로젝트 URL을 추가하세요.
                </AlertDescription>
              </Alert>
            )}

            {!status.environment.supabase_anon_key && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> 환경 변수가 설정되지 않았습니다.
                  <br />
                  .env.local 파일에 Supabase anon key를 추가하세요.
                </AlertDescription>
              </Alert>
            )}

            {!status.connected && status.environment.supabase_url && status.environment.supabase_anon_key && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  데이터베이스에 연결할 수 없습니다. Supabase 프로젝트가 활성화되어 있는지 확인하세요.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Supabase 대시보드
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {!hasIssues && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">모든 시스템이 정상적으로 작동하고 있습니다!</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
