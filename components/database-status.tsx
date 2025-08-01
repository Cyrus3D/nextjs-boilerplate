"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Database,
  Table,
  ActivityIcon as Function,
  Settings,
  AlertTriangle,
  Info,
} from "lucide-react"
import { checkDatabaseConnection, getTableCounts } from "@/lib/database-check"
import type { DatabaseStatus } from "@/lib/supabase"

export default function DatabaseStatusComponent() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [tableCounts, setTableCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      const [dbStatus, counts] = await Promise.all([checkDatabaseConnection(), getTableCounts()])
      setStatus(dbStatus)
      setTableCounts(counts)
      setLastChecked(new Date())
    } catch (error) {
      console.error("Failed to check database status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const StatusIcon = ({ condition }: { condition: boolean }) =>
    condition ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />

  const StatusBadge = ({
    condition,
    trueText,
    falseText,
  }: {
    condition: boolean
    trueText: string
    falseText: string
  }) => <Badge variant={condition ? "default" : "destructive"}>{condition ? trueText : falseText}</Badge>

  if (isLoading && !status) {
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
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6" />
          데이터베이스 상태
        </h2>
        <div className="flex items-center gap-2">
          {lastChecked && (
            <span className="text-sm text-gray-500">마지막 확인: {lastChecked.toLocaleTimeString()}</span>
          )}
          <Button onClick={checkStatus} disabled={isLoading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            새로고침
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            전체 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">데이터베이스 연결</span>
              <div className="flex items-center gap-2">
                <StatusIcon condition={status?.connected || false} />
                <StatusBadge condition={status?.connected || false} trueText="연결됨" falseText="연결 실패" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">환경 변수</span>
              <div className="flex items-center gap-2">
                <StatusIcon
                  condition={(status?.environment.supabase_url && status?.environment.supabase_anon_key) || false}
                />
                <StatusBadge
                  condition={(status?.environment.supabase_url && status?.environment.supabase_anon_key) || false}
                  trueText="설정됨"
                  falseText="미설정"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            환경 변수
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
              <StatusBadge condition={status?.environment.supabase_url || false} trueText="설정됨" falseText="미설정" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <StatusBadge
                condition={status?.environment.supabase_anon_key || false}
                trueText="설정됨"
                falseText="미설정"
              />
            </div>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(status?.tables || {}).map(([tableName, exists]) => (
              <div key={tableName} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon condition={exists} />
                  <span className="font-mono text-sm">{tableName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge condition={exists} trueText="존재함" falseText="없음" />
                  {exists && tableCounts[tableName] !== undefined && (
                    <Badge variant="outline">{tableCounts[tableName].toLocaleString()}개</Badge>
                  )}
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
            {Object.entries(status?.functions || {}).map(([funcName, exists]) => (
              <div key={funcName} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon condition={exists} />
                  <span className="font-mono text-sm">{funcName}</span>
                </div>
                <StatusBadge condition={exists} trueText="사용 가능" falseText="없음" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {!status?.connected && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            데이터베이스에 연결할 수 없습니다. 환경 변수가 올바르게 설정되었는지 확인하세요.
          </AlertDescription>
        </Alert>
      )}

      {status?.connected && Object.values(status.tables).some((exists) => !exists) && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            일부 테이블이 존재하지 않습니다. 데이터베이스 스크립트를 실행해야 할 수 있습니다.
          </AlertDescription>
        </Alert>
      )}

      {status?.connected && Object.values(status.functions).some((exists) => !exists) && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            일부 함수가 존재하지 않습니다. 데이터베이스 함수 생성 스크립트를 실행하세요.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
