"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, RefreshCw, Database, Table, ActivityIcon as Function } from "lucide-react"
import { checkDatabaseStatus, type DatabaseStatus } from "@/lib/database-check"

export default function DatabaseStatusComponent() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const result = await checkDatabaseStatus()
      setStatus(result)
    } catch (error) {
      console.error("Failed to check database status:", error)
    } finally {
      setLoading(false)
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

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            데이터베이스 상태 확인 실패
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">데이터베이스 상태를 확인할 수 없습니다.</p>
          <Button onClick={checkStatus} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            다시 시도
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            데이터베이스 연결 상태
            <Badge variant={status.connected ? "default" : "destructive"}>
              {status.connected ? "연결됨" : "연결 실패"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {status.connected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span>
              {status.connected ? "Supabase 데이터베이스에 성공적으로 연결되었습니다." : `연결 실패: ${status.error}`}
            </span>
          </div>
          <Button onClick={checkStatus} variant="outline" className="mt-4 bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            상태 새로고침
          </Button>
        </CardContent>
      </Card>

      {/* Tables Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            테이블 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Business Cards</span>
                <Badge variant="outline">{status.tables.business_cards}개</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">News Articles</span>
                <Badge variant="outline">{status.tables.news_articles}개</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Categories</span>
                <Badge variant="outline">{status.tables.categories}개</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Tags</span>
                <Badge variant="outline">{status.tables.tags}개</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Functions Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Function className="h-5 w-5" />
            데이터베이스 함수 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">increment_view_count</span>
              <div className="flex items-center gap-2">
                {status.functions.increment_view_count ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={status.functions.increment_view_count ? "default" : "destructive"}>
                  {status.functions.increment_view_count ? "사용 가능" : "사용 불가"}
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-medium">increment_exposure_count</span>
              <div className="flex items-center gap-2">
                {status.functions.increment_exposure_count ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={status.functions.increment_exposure_count ? "default" : "destructive"}>
                  {status.functions.increment_exposure_count ? "사용 가능" : "사용 불가"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle>환경 변수 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL</span>
              <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "설정됨" : "미설정"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "설정됨" : "미설정"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
