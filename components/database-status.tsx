"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
      console.error("Error checking database status:", error)
      setStatus({
        isConnected: false,
        tables: [],
        functions: [],
        error: "Failed to check database status",
      })
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
          <p className="text-red-600">데이터베이스 상태를 확인할 수 없습니다.</p>
          <Button onClick={checkStatus} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            다시 확인
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
            <Button onClick={checkStatus} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {status.isConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Badge className="bg-green-100 text-green-800">연결됨</Badge>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <Badge className="bg-red-100 text-red-800">연결 실패</Badge>
              </>
            )}
          </div>
          {status.error && <p className="text-red-600 mt-2 text-sm">{status.error}</p>}
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
          <div className="space-y-3">
            {status.tables.map((table) => (
              <div key={table.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {table.exists ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">{table.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={table.exists ? "default" : "destructive"}>{table.exists ? "존재함" : "없음"}</Badge>
                  {table.exists && <Badge variant="outline">{table.recordCount}개 레코드</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Functions Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Function className="h-5 w-5" />
            함수 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {status.functions.map((func) => (
              <div key={func.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {func.exists ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">{func.name}</span>
                </div>
                <Badge variant={func.exists ? "default" : "destructive"}>{func.exists ? "존재함" : "없음"}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
