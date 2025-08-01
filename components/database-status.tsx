"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { checkDatabaseConnection } from "@/lib/database-check"
import { Database, CheckCircle, XCircle, RefreshCw, Table, ActivityIcon as Function } from "lucide-react"

export function DatabaseStatusComponent() {
  const [status, setStatus] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const checkStatus = async () => {
    setRefreshing(true)
    try {
      const result = await checkDatabaseConnection()
      setStatus(result)
    } catch (error) {
      console.error("Failed to check database status:", error)
      setStatus({
        connected: false,
        tables: { business_cards: 0, news_articles: 0, categories: 0, tags: 0 },
        functions: [],
        error: "Failed to connect to database",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            데이터베이스 상태
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
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
          <Button variant="outline" size="sm" onClick={checkStatus} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {status?.connected ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span className="font-medium">연결 상태: {status?.connected ? "연결됨" : "연결 실패"}</span>
          {status?.connected ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              정상
            </Badge>
          ) : (
            <Badge variant="destructive">오류</Badge>
          )}
        </div>

        {/* Error Message */}
        {status?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              <strong>오류:</strong> {status.error}
            </p>
          </div>
        )}

        {/* Tables Information */}
        {status?.connected && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Table className="h-4 w-4" />
              테이블 정보
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium">Business Cards</div>
                <div className="text-2xl font-bold text-blue-600">{status.tables.business_cards}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium">News Articles</div>
                <div className="text-2xl font-bold text-green-600">{status.tables.news_articles}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium">Categories</div>
                <div className="text-2xl font-bold text-purple-600">{status.tables.categories}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium">Tags</div>
                <div className="text-2xl font-bold text-orange-600">{status.tables.tags}</div>
              </div>
            </div>
          </div>
        )}

        {/* Functions Information */}
        {status?.connected && status.functions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Function className="h-4 w-4" />
              데이터베이스 함수
            </h4>
            <div className="flex flex-wrap gap-2">
              {status.functions.map((func, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {func}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Environment Info */}
        <div className="space-y-2 pt-3 border-t">
          <h4 className="font-medium text-sm">환경 변수</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>SUPABASE_URL:</span>
              <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "설정됨" : "미설정"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>SUPABASE_ANON_KEY:</span>
              <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "설정됨" : "미설정"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
