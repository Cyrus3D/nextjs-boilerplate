"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { checkDatabaseConnection } from "@/lib/database-check"

export function DatabaseStatusComponent() {
  const [status, setStatus] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const result = await checkDatabaseConnection()
      setStatus(result)
      setLastChecked(new Date())
    } catch (error) {
      console.error("Failed to check database status:", error)
      setStatus({
        connected: false,
        error: "Failed to check database status",
        tables: { business_cards: 0, news_articles: 0, categories: 0, tags: 0 },
        functions: { increment_view_count: false, increment_exposure_count: false, increment_news_view_count: false },
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusIcon = (connected: boolean) => {
    if (loading) return <RefreshCw className="h-4 w-4 animate-spin" />
    return connected ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (connected: boolean) => {
    if (loading) return <Badge variant="secondary">확인 중...</Badge>
    return connected ? (
      <Badge variant="default" className="bg-green-500">
        연결됨
      </Badge>
    ) : (
      <Badge variant="destructive">연결 실패</Badge>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4" />
            데이터베이스 상태
          </CardTitle>
          <Button variant="outline" size="sm" onClick={checkStatus} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status?.connected || false)}
              <span className="text-sm font-medium">
                {status?.connected ? "Supabase 연결됨" : "Supabase 연결 실패"}
              </span>
            </div>
            {getStatusBadge(status?.connected || false)}
          </div>

          {status?.error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">오류: {status.error}</span>
              </div>
            </div>
          )}

          {lastChecked && (
            <div className="mt-2 text-xs text-muted-foreground">마지막 확인: {lastChecked.toLocaleString("ko-KR")}</div>
          )}
        </CardContent>
      </Card>

      {status && (
        <>
          {/* Tables Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">테이블 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Business Cards</span>
                    <Badge variant="outline">{status.tables.business_cards}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">News Articles</span>
                    <Badge variant="outline">{status.tables.news_articles}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Categories</span>
                    <Badge variant="outline">{status.tables.categories}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tags</span>
                    <Badge variant="outline">{status.tables.tags}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Functions Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">함수 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">increment_view_count</span>
                  {status.functions.increment_view_count ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">increment_exposure_count</span>
                  {status.functions.increment_exposure_count ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">increment_news_view_count</span>
                  {status.functions.increment_news_view_count ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
