"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { checkDatabaseStatus, type DatabaseStatus } from "@/lib/supabase"
import { getTableCounts, checkRequiredFunctions } from "@/lib/database-check"
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

export function DatabaseComponent() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [tableCounts, setTableCounts] = useState<{ [key: string]: number }>({})
  const [functions, setFunctions] = useState<{ [key: string]: boolean }>({})
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const [dbStatus, counts, funcs] = await Promise.all([
        checkDatabaseStatus(),
        getTableCounts(),
        checkRequiredFunctions(),
      ])

      setStatus(dbStatus)
      setTableCounts(counts)
      setFunctions(funcs)
    } catch (error) {
      console.error("Error checking database status:", error)
      setStatus({
        isConnected: false,
        tablesExist: false,
        functionsExist: false,
        error: "Failed to check database status",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusIcon = (isOk: boolean) => {
    return isOk ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (isOk: boolean, label: string) => {
    return (
      <Badge variant={isOk ? "default" : "destructive"} className={isOk ? "bg-green-500" : ""}>
        {getStatusIcon(isOk)}
        <span className="ml-1">{label}</span>
      </Badge>
    )
  }

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
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            데이터베이스 상태
          </CardTitle>
          <Button size="sm" variant="outline" onClick={checkStatus} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div>
          <h3 className="font-semibold mb-3">연결 상태</h3>
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(status?.isConnected || false, "데이터베이스 연결")}
            {getStatusBadge(status?.tablesExist || false, "테이블 존재")}
            {getStatusBadge(status?.functionsExist || false, "함수 존재")}
          </div>
          {status?.error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">오류:</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{status.error}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Table Information */}
        <div>
          <h3 className="font-semibold mb-3">테이블 정보</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">비즈니스 카드:</span>
                <Badge variant="outline">{tableCounts.business_cards || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">뉴스 기사:</span>
                <Badge variant="outline">{tableCounts.news_articles || 0}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">카테고리:</span>
                <Badge variant="outline">{tableCounts.categories || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">태그:</span>
                <Badge variant="outline">{tableCounts.tags || 0}</Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Functions Status */}
        <div>
          <h3 className="font-semibold mb-3">데이터베이스 함수</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">increment_view_count:</span>
              {getStatusIcon(functions.increment_view_count || false)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">increment_exposure_count:</span>
              {getStatusIcon(functions.increment_exposure_count || false)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">increment_news_view_count:</span>
              {getStatusIcon(functions.increment_news_view_count || false)}
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <Separator />
        <div>
          <h3 className="font-semibold mb-3">환경 변수</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">NEXT_PUBLIC_SUPABASE_URL:</span>
              {getStatusIcon(!!process.env.NEXT_PUBLIC_SUPABASE_URL)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              {getStatusIcon(!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
