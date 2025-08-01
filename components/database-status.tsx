"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Database,
  Table,
  ActivityIcon as Function,
  Info,
} from "lucide-react"
import { checkDatabaseStatus, getTableInfo, getSchemaInfo } from "@/lib/database-check"

export function DatabaseStatusComponent() {
  const [status, setStatus] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [tableInfo, setTableInfo] = useState<any[]>([])
  const [schemaInfo, setSchemaInfo] = useState<any>(null)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const dbStatus = await checkDatabaseStatus()
      setStatus(dbStatus)

      if (dbStatus.isConnected) {
        // Get table information
        const tables = ["business_cards", "categories", "tags", "business_card_tags", "news_articles"]
        const tableInfoPromises = tables.map((table) => getTableInfo(table))
        const tableResults = await Promise.all(tableInfoPromises)
        setTableInfo(tableResults)

        // Get schema information
        const schema = await getSchemaInfo()
        setSchemaInfo(schema)
      }
    } catch (error) {
      console.error("Database status check failed:", error)
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

  const getStatusBadge = (isOk: boolean) => {
    return <Badge variant={isOk ? "default" : "destructive"}>{isOk ? "정상" : "오류"}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              데이터베이스 상태 확인
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!status) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>데이터베이스 상태를 확인할 수 없습니다.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            데이터베이스 연결 상태
          </CardTitle>
          <Button onClick={checkStatus} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">환경 변수 설정</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.isConfigured)}
                {getStatusBadge(status.isConfigured)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">데이터베이스 연결</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.isConnected)}
                {getStatusBadge(status.isConnected)}
              </div>
            </div>
          </div>

          {status.error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{status.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tables Status */}
      {status.isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5" />
              테이블 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(status.tables).map(([tableName, exists]) => {
                const info = tableInfo.find((t) => t?.name === tableName)
                return (
                  <div key={tableName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{tableName}</div>
                      {info && (
                        <div className="text-xs text-gray-500">
                          {info.exists ? `${info.count || 0}개 레코드` : "테이블 없음"}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(exists)}
                      {getStatusBadge(exists)}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Functions Status */}
      {status.isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Function className="h-5 w-5" />
              데이터베이스 함수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(status.functions).map(([funcName, exists]) => (
                <div key={funcName} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="font-medium text-sm">{funcName}</div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(exists)}
                    {getStatusBadge(exists)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schema Information */}
      {schemaInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              스키마 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">전체 테이블 목록</h4>
              <div className="flex flex-wrap gap-2">
                {schemaInfo.tables?.map((table: string) => (
                  <Badge key={table} variant="outline">
                    {table}
                  </Badge>
                ))}
              </div>
            </div>

            {schemaInfo.businessCardColumns && (
              <div>
                <h4 className="font-medium mb-2">business_cards 테이블 컬럼</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                  {schemaInfo.businessCardColumns.map((col: any) => (
                    <div key={col.column_name} className="p-2 border rounded">
                      <div className="font-medium">{col.column_name}</div>
                      <div className="text-xs text-gray-500">
                        {col.data_type} {col.is_nullable === "YES" ? "(nullable)" : "(required)"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Configuration Help */}
      {!status.isConfigured && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              설정 방법
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>Supabase 데이터베이스를 연결하려면 다음 환경 변수를 설정하세요:</p>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-xs">
                <div>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
              </div>
              <p className="text-gray-600">환경 변수가 설정되지 않은 경우 샘플 데이터가 사용됩니다.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
