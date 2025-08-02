"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, Database, CheckCircle, XCircle, AlertCircle, Server, Settings, Users, FileText } from "lucide-react"
import { checkDatabaseConnection, getTableInfo } from "@/lib/database-check"
import type { DatabaseStatus } from "@/lib/supabase"

export default function DatabaseStatusComponent() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [tableInfo, setTableInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const [statusResult, infoResult] = await Promise.all([checkDatabaseConnection(), getTableInfo()])
      setStatus(statusResult)
      setTableInfo(infoResult)
      setLastChecked(new Date())
    } catch (error) {
      console.error("Failed to check database status:", error)
    } finally {
      setLoading(false)
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
      <Badge variant={isOk ? "default" : "destructive"} className="flex items-center gap-1">
        {getStatusIcon(isOk)}
        {label}
      </Badge>
    )
  }

  if (loading && !status) {
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

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              데이터베이스 연결 상태
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={checkStatus}
              disabled={loading}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </div>
          {lastChecked && <p className="text-sm text-gray-500">마지막 확인: {lastChecked.toLocaleString("ko-KR")}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <span className="font-medium">데이터베이스 연결</span>
            {getStatusBadge(status?.connected || false, status?.connected ? "연결됨" : "연결 실패")}
          </div>

          <Separator />

          {/* Environment Variables */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              환경 변수
            </h4>
            <div className="space-y-2 ml-6">
              <div className="flex items-center justify-between">
                <span className="text-sm">SUPABASE_URL</span>
                {getStatusBadge(
                  status?.environment.supabase_url || false,
                  status?.environment.supabase_url ? "설정됨" : "미설정",
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SUPABASE_ANON_KEY</span>
                {getStatusBadge(
                  status?.environment.supabase_anon_key || false,
                  status?.environment.supabase_anon_key ? "설정됨" : "미설정",
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Tables */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Server className="h-4 w-4" />
              테이블 현황
            </h4>
            <div className="grid grid-cols-2 gap-4 ml-6">
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  비즈니스 카드
                </span>
                <Badge variant="outline">{status?.tables.business_cards || 0}개</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  뉴스 기사
                </span>
                <Badge variant="outline">{status?.tables.news_articles || 0}개</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">카테고리</span>
                <Badge variant="outline">{status?.tables.categories || 0}개</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">태그</span>
                <Badge variant="outline">{status?.tables.tags || 0}개</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Functions */}
          <div>
            <h4 className="font-medium mb-2">데이터베이스 함수</h4>
            <div className="space-y-2 ml-6">
              <div className="flex items-center justify-between">
                <span className="text-sm">increment_view_count</span>
                {getStatusBadge(
                  status?.functions.increment_view_count || false,
                  status?.functions.increment_view_count ? "사용 가능" : "사용 불가",
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">increment_exposure_count</span>
                {getStatusBadge(
                  status?.functions.increment_exposure_count || false,
                  status?.functions.increment_exposure_count ? "사용 가능" : "사용 불가",
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">increment_news_view_count</span>
                {getStatusBadge(
                  status?.functions.increment_news_view_count || false,
                  status?.functions.increment_news_view_count ? "사용 가능" : "사용 불가",
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Details */}
      {tableInfo && (
        <Card>
          <CardHeader>
            <CardTitle>테이블 상세 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(tableInfo).map(([tableName, info]: [string, any]) => (
                <div key={tableName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{tableName}</h5>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{info.count}개 레코드</Badge>
                      {info.error ? <Badge variant="destructive">오류</Badge> : <Badge variant="default">정상</Badge>}
                    </div>
                  </div>
                  {info.error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{info.error}</div>}
                  {info.sample && info.sample.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2">샘플 데이터 {info.sample.length}개 확인됨</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            문제 해결 가이드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>연결 실패 시:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>NEXT_PUBLIC_SUPABASE_URL 환경 변수 확인</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY 환경 변수 확인</li>
                <li>Supabase 프로젝트 상태 확인</li>
              </ul>
            </div>
            <div>
              <strong>테이블이 없는 경우:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>scripts/ 폴더의 SQL 스크립트 실행</li>
                <li>Supabase 대시보드에서 테이블 생성 확인</li>
              </ul>
            </div>
            <div>
              <strong>함수가 없는 경우:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>04-create-functions.sql 스크립트 실행</li>
                <li>RLS 정책 설정 확인</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
