"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Database, Settings, Table } from "lucide-react"
import { checkDatabaseStatus, getTableSchema, type DatabaseStatus, type SchemaInfo } from "@/lib/database-check"
import { formatDateTime } from "@/lib/utils"

export default function DatabaseComponent() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [schemas, setSchemas] = useState<Record<string, SchemaInfo>>({})

  const checkStatus = async () => {
    setLoading(true)
    try {
      const newStatus = await checkDatabaseStatus()
      setStatus(newStatus)

      // Load schemas for existing tables
      const schemaPromises = newStatus.tables
        .filter((table) => table.exists)
        .map(async (table) => {
          const schema = await getTableSchema(table.name)
          return { tableName: table.name, schema }
        })

      const schemaResults = await Promise.all(schemaPromises)
      const newSchemas: Record<string, SchemaInfo> = {}
      schemaResults.forEach(({ tableName, schema }) => {
        if (schema) {
          newSchemas[tableName] = schema
        }
      })
      setSchemas(newSchemas)
    } catch (error) {
      console.error("Error checking database status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>데이터베이스 상태를 확인할 수 없습니다.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">데이터베이스 상태</h1>
          <p className="text-gray-600 mt-2">마지막 확인: {formatDateTime(status.lastChecked)}</p>
        </div>
        <Button onClick={checkStatus} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          새로고침
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">설정 상태</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {status.isConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-2xl font-bold">{status.isConfigured ? "설정됨" : "미설정"}</span>
            </div>
            <p className="text-xs text-muted-foreground">Supabase 환경변수 설정 상태</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">연결 상태</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {status.isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-2xl font-bold">{status.isConnected ? "연결됨" : "연결 실패"}</span>
            </div>
            <p className="text-xs text-muted-foreground">데이터베이스 연결 상태</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">테이블 상태</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {status.tables.filter((t) => t.exists).length}/{status.tables.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">존재하는 테이블 수</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {status.error && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            <strong>오류:</strong> {status.error}
            <div className="mt-2 text-sm">
              <strong>권장사항:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>NEXT_PUBLIC_SUPABASE_URL 환경변수가 설정되어 있는지 확인하세요</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY 환경변수가 설정되어 있는지 확인하세요</li>
                <li>Supabase 프로젝트가 활성화되어 있는지 확인하세요</li>
                <li>데이터베이스 스키마가 올바르게 생성되어 있는지 확인하세요</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Information */}
      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">테이블</TabsTrigger>
          <TabsTrigger value="functions">함수</TabsTrigger>
          <TabsTrigger value="schema">스키마</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {status.tables.map((table) => (
              <Card key={table.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{table.name}</CardTitle>
                    {table.exists ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        존재함
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        없음
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {table.exists ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">레코드 수:</span>
                        <span className="font-medium">{table.recordCount.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-red-600">{table.error || "테이블이 존재하지 않습니다"}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="functions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {status.functions.map((func) => (
              <Card key={func.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{func.name}</CardTitle>
                    {func.exists ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        존재함
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        없음
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!func.exists && func.error && <div className="text-sm text-red-600">{func.error}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          {Object.entries(schemas).map(([tableName, schema]) => (
            <Card key={tableName}>
              <CardHeader>
                <CardTitle>{tableName} 스키마</CardTitle>
                <CardDescription>테이블 구조 정보</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">컬럼명</th>
                        <th className="text-left p-2">타입</th>
                        <th className="text-left p-2">Null 허용</th>
                        <th className="text-left p-2">기본값</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schema.columns.map((column) => (
                        <tr key={column.name} className="border-b">
                          <td className="p-2 font-medium">{column.name}</td>
                          <td className="p-2">{column.type}</td>
                          <td className="p-2">
                            {column.nullable ? (
                              <Badge variant="outline">Yes</Badge>
                            ) : (
                              <Badge variant="secondary">No</Badge>
                            )}
                          </td>
                          <td className="p-2 text-gray-600">{column.defaultValue || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
