"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Database,
  Table,
  ActivityIcon as Function,
  Info,
  AlertTriangle,
} from "lucide-react"
import { checkDatabaseStatus, getSchemaInfo, type DatabaseStatus, type SchemaInfo } from "@/lib/database-check"
import { formatDateTime } from "@/lib/utils"

export function DatabaseComponent() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [schema, setSchema] = useState<SchemaInfo[]>([])
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const [dbStatus, schemaInfo] = await Promise.all([checkDatabaseStatus(), getSchemaInfo()])
      setStatus(dbStatus)
      setSchema(schemaInfo)
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
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>데이터베이스 상태 확인 중...</span>
      </div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">데이터베이스 상태</h1>
          <p className="text-muted-foreground">마지막 확인: {formatDateTime(status.lastChecked)}</p>
        </div>
        <Button onClick={checkStatus} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          새로고침
        </Button>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            연결 상태
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <span>환경변수 설정:</span>
            {status.isConfigured ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                설정됨
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                미설정
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span>데이터베이스 연결:</span>
            {status.isConnected ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                연결됨
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                연결 실패
              </Badge>
            )}
          </div>

          {status.error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{status.error}</AlertDescription>
            </Alert>
          )}

          {!status.isConfigured && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>환경변수 설정이 필요합니다:</strong>
                <br />• NEXT_PUBLIC_SUPABASE_URL
                <br />• NEXT_PUBLIC_SUPABASE_ANON_KEY
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">테이블</TabsTrigger>
          <TabsTrigger value="functions">함수</TabsTrigger>
          <TabsTrigger value="schema">스키마</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Table className="h-5 w-5 mr-2" />
                테이블 상태
              </CardTitle>
              <CardDescription>각 테이블의 존재 여부와 레코드 수를 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {status.tables.map((table) => (
                  <div key={table.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {table.exists ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">{table.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {table.exists && <Badge variant="secondary">{table.recordCount}개 레코드</Badge>}
                      {table.error && <Badge variant="destructive">오류</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="functions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Function className="h-5 w-5 mr-2" />
                함수 상태
              </CardTitle>
              <CardDescription>데이터베이스 함수의 존재 여부를 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {status.functions.map((func) => (
                  <div key={func.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {func.exists ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">{func.name}</span>
                    </div>
                    {func.error && <Badge variant="destructive">{func.error}</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          {schema.length > 0 ? (
            schema.map((table) => (
              <Card key={table.tableName}>
                <CardHeader>
                  <CardTitle>{table.tableName}</CardTitle>
                  <CardDescription>{table.columns.length}개 컬럼</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {table.columns.map((column, index) => (
                      <div key={column.name}>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{column.name}</span>
                            <Badge variant="outline">{column.type}</Badge>
                            {!column.nullable && <Badge variant="secondary">NOT NULL</Badge>}
                          </div>
                          {column.defaultValue && (
                            <span className="text-sm text-muted-foreground">기본값: {column.defaultValue}</span>
                          )}
                        </div>
                        {index < table.columns.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">스키마 정보를 가져올 수 없습니다.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
