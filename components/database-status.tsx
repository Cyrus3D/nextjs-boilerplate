"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { checkDatabaseConnection, testTableQueries, getTableSchemas } from "@/lib/database-check"
import type { DatabaseStatus, TableTestResults, TableSchema } from "@/lib/database-check"
import {
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Table,
  ActivityIcon as Function,
  Info,
} from "lucide-react"

export function DatabaseComponent() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [tableTests, setTableTests] = useState<TableTestResults | null>(null)
  const [schemas, setSchemas] = useState<TableSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const checkStatus = async () => {
    setRefreshing(true)
    try {
      const [dbStatus, tableResults, schemaResults] = await Promise.all([
        checkDatabaseConnection(),
        testTableQueries(),
        getTableSchemas(),
      ])

      setStatus(dbStatus)
      setTableTests(tableResults)
      setSchemas(schemaResults)
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            데이터베이스 상태 확인 중...
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

  if (!status) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>데이터베이스 상태를 확인할 수 없습니다.</AlertDescription>
      </Alert>
    )
  }

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (success: boolean, label?: string) => {
    return <Badge variant={success ? "default" : "destructive"}>{success ? label || "정상" : "오류"}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          <h2 className="text-2xl font-bold">데이터베이스 연결 상태</h2>
        </div>
        <Button onClick={checkStatus} disabled={refreshing} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          새로고침
        </Button>
      </div>

      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">설정 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.isConfigured)}
              {getStatusBadge(status.isConfigured, status.isConfigured ? "설정됨" : "미설정")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">연결 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.isConnected)}
              {getStatusBadge(status.isConnected, status.isConnected ? "연결됨" : "연결 실패")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">마지막 확인</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">{new Date(status.lastChecked).toLocaleString("ko-KR")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status */}
      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            테이블 상태
          </TabsTrigger>
          <TabsTrigger value="functions" className="flex items-center gap-2">
            <Function className="h-4 w-4" />
            함수 상태
          </TabsTrigger>
          <TabsTrigger value="schemas" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            스키마 정보
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(status.tables).map(([tableName, tableStatus]) => (
              <Card key={tableName}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {getStatusIcon(tableStatus.exists)}
                    {tableName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">상태:</span>
                      {getStatusBadge(tableStatus.exists)}
                    </div>
                    {tableStatus.exists && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">행 수:</span>
                        <span className="text-sm font-medium">{tableStatus.rowCount?.toLocaleString() || "0"}</span>
                      </div>
                    )}
                    {tableStatus.error && <div className="text-xs text-red-600 mt-2">{tableStatus.error}</div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table Query Tests */}
          {tableTests && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">쿼리 테스트 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tableTests.businessCards.success)}
                      <span className="font-medium">Business Cards</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {tableTests.businessCards.success
                        ? `${tableTests.businessCards.count}개 레코드`
                        : tableTests.businessCards.error}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tableTests.newsArticles.success)}
                      <span className="font-medium">News Articles</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {tableTests.newsArticles.success
                        ? `${tableTests.newsArticles.count}개 레코드`
                        : tableTests.newsArticles.error}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tableTests.categories.success)}
                      <span className="font-medium">Categories</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {tableTests.categories.success
                        ? `${tableTests.categories.count}개 레코드`
                        : tableTests.categories.error}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="functions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(status.functions).map(([functionName, functionStatus]) => (
              <Card key={functionName}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {getStatusIcon(functionStatus.exists)}
                    {functionName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">상태:</span>
                      {getStatusBadge(functionStatus.exists)}
                    </div>
                    {functionStatus.error && <div className="text-xs text-red-600 mt-2">{functionStatus.error}</div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schemas" className="space-y-4">
          {schemas &&
            Object.entries(schemas).map(([tableName, schema]) => (
              <Card key={tableName}>
                <CardHeader>
                  <CardTitle className="text-lg">{tableName}</CardTitle>
                </CardHeader>
                <CardContent>
                  {schema.error ? (
                    <div className="text-red-600 text-sm">{schema.error}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">컬럼명</th>
                            <th className="text-left p-2">데이터 타입</th>
                            <th className="text-left p-2">NULL 허용</th>
                            <th className="text-left p-2">기본값</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schema.columns.map((column, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2 font-medium">{column.column_name}</td>
                              <td className="p-2">{column.data_type}</td>
                              <td className="p-2">{column.is_nullable}</td>
                              <td className="p-2">{column.column_default || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      {(!status.isConfigured || !status.isConnected) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">데이터베이스 연결 문제가 발견되었습니다:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {!status.isConfigured && (
                  <li>환경 변수 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요.</li>
                )}
                {status.isConfigured && !status.isConnected && (
                  <li>Supabase 프로젝트가 활성화되어 있고 네트워크 연결이 정상인지 확인하세요.</li>
                )}
                <li>scripts/ 폴더의 SQL 파일들을 실행하여 필요한 테이블과 함수를 생성하세요.</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
