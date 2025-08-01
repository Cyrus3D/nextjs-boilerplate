"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, Database, CheckCircle, XCircle, AlertTriangle, Table, Settings } from "lucide-react"
import { checkDatabaseStatus, getSchemaInfo } from "@/lib/database-check"

export function DatabaseStatusComponent() {
  const [status, setStatus] = useState<any | null>(null)
  const [schemaInfo, setSchemaInfo] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const [dbStatus, schema] = await Promise.all([checkDatabaseStatus(), getSchemaInfo()])
      setStatus(dbStatus)
      setSchemaInfo(schema)
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
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>데이터베이스 상태 확인 중...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>상태를 확인하고 있습니다...</span>
          </div>
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

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <CardTitle>데이터베이스 연결 상태</CardTitle>
            </div>
            <Button onClick={checkStatus} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
          </div>
          <CardDescription>마지막 확인: {status.lastChecked.toLocaleString("ko-KR")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">환경변수 설정:</span>
              {status.isConfigured ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
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
              <span className="font-medium">데이터베이스 연결:</span>
              {status.isConnected ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
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
          </div>

          {status.error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{status.error}</AlertDescription>
            </Alert>
          )}

          {!status.isConfigured && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                환경변수를 설정해주세요:
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
          <TabsTrigger value="tables">테이블 상태</TabsTrigger>
          <TabsTrigger value="functions">함수 상태</TabsTrigger>
          <TabsTrigger value="schema">스키마 정보</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Table className="h-5 w-5" />
                <span>테이블 상태</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {status.tables.map((table) => (
                  <div key={table.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium">{table.name}</div>
                      {table.exists ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
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
                    <div className="text-sm text-gray-600">
                      {table.exists ? `${table.recordCount}개 레코드` : table.error}
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
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>함수 상태</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {status.functions.map((func) => (
                  <div key={func.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium">{func.name}</div>
                      {func.exists ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
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
                    {func.error && <div className="text-sm text-red-600">{func.error}</div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          {schemaInfo.length > 0 ? (
            schemaInfo.map((schema) => (
              <Card key={schema.tableName}>
                <CardHeader>
                  <CardTitle>{schema.tableName}</CardTitle>
                  <CardDescription>{schema.columns.length}개 컬럼</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {schema.columns.map((column, index) => (
                      <div key={column.name}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{column.name}</span>
                            <Badge variant="outline">{column.type}</Badge>
                            {!column.nullable && <Badge variant="secondary">NOT NULL</Badge>}
                          </div>
                          {column.defaultValue && (
                            <span className="text-sm text-gray-600">기본값: {column.defaultValue}</span>
                          )}
                        </div>
                        {index < schema.columns.length - 1 && <Separator className="mt-2" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600">스키마 정보를 가져올 수 없습니다.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
