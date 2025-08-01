"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Database, Settings, FileText } from "lucide-react"
import { checkDatabaseStatus, getSchemaInfo, type DatabaseStatus, type SchemaInfo } from "@/lib/database-check"

export default function DatabaseStatusComponent() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [schemaInfo, setSchemaInfo] = useState<SchemaInfo[]>([])
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const [dbStatus, schema] = await Promise.all([checkDatabaseStatus(), getSchemaInfo()])
      setStatus(dbStatus)
      setSchemaInfo(schema)
    } catch (error) {
      console.error("Error checking database status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusIcon = (exists: boolean, error?: string) => {
    if (error) return <XCircle className="h-4 w-4 text-red-500" />
    if (exists) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  const getStatusBadge = (exists: boolean, error?: string) => {
    if (error) return <Badge variant="destructive">오류</Badge>
    if (exists)
      return (
        <Badge variant="default" className="bg-green-500">
          정상
        </Badge>
      )
    return <Badge variant="secondary">없음</Badge>
  }

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
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">데이터베이스 상태를 확인할 수 없습니다.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              데이터베이스 연결 상태
            </CardTitle>
            <CardDescription>마지막 확인: {status.lastChecked.toLocaleString("ko-KR")}</CardDescription>
          </div>
          <Button onClick={checkStatus} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.isConfigured)}
              <span className="font-medium">환경변수 설정:</span>
              {getStatusBadge(status.isConfigured)}
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.isConnected)}
              <span className="font-medium">데이터베이스 연결:</span>
              {getStatusBadge(status.isConnected)}
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.tables.every((t) => t.exists))}
              <span className="font-medium">전체 상태:</span>
              {status.isConnected && status.tables.every((t) => t.exists) ? (
                <Badge variant="default" className="bg-green-500">
                  정상
                </Badge>
              ) : (
                <Badge variant="destructive">문제있음</Badge>
              )}
            </div>
          </div>
          {status.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{status.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tables">테이블</TabsTrigger>
          <TabsTrigger value="functions">함수</TabsTrigger>
          <TabsTrigger value="schema">스키마</TabsTrigger>
        </TabsList>

        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                테이블 상태
              </CardTitle>
              <CardDescription>필수 테이블들의 존재 여부와 레코드 수를 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>테이블명</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>레코드 수</TableHead>
                    <TableHead>오류</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {status.tables.map((table) => (
                    <TableRow key={table.name}>
                      <TableCell className="font-medium">{table.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(table.exists, table.error)}
                          {getStatusBadge(table.exists, table.error)}
                        </div>
                      </TableCell>
                      <TableCell>{table.exists ? table.recordCount.toLocaleString() : "-"}</TableCell>
                      <TableCell className="text-red-500 text-sm">{table.error || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="functions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                함수 상태
              </CardTitle>
              <CardDescription>필수 데이터베이스 함수들의 존재 여부를 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>함수명</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>오류</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {status.functions.map((func) => (
                    <TableRow key={func.name}>
                      <TableCell className="font-medium">{func.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(func.exists, func.error)}
                          {getStatusBadge(func.exists, func.error)}
                        </div>
                      </TableCell>
                      <TableCell className="text-red-500 text-sm">{func.error || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>스키마 정보</CardTitle>
              <CardDescription>테이블 구조와 컬럼 정보를 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {schemaInfo.length === 0 ? (
                <p className="text-muted-foreground">스키마 정보를 가져올 수 없습니다.</p>
              ) : (
                <div className="space-y-6">
                  {schemaInfo.map((table) => (
                    <div key={table.tableName}>
                      <h4 className="font-semibold mb-2">{table.tableName}</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>컬럼명</TableHead>
                            <TableHead>데이터 타입</TableHead>
                            <TableHead>NULL 허용</TableHead>
                            <TableHead>기본값</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {table.columns.map((column) => (
                            <TableRow key={column.columnName}>
                              <TableCell className="font-medium">{column.columnName}</TableCell>
                              <TableCell>{column.dataType}</TableCell>
                              <TableCell>
                                <Badge variant={column.isNullable ? "secondary" : "outline"}>
                                  {column.isNullable ? "YES" : "NO"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {column.defaultValue || "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      {(!status.isConfigured || !status.isConnected || status.tables.some((t) => !t.exists)) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">권장사항</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {!status.isConfigured && (
                <li>• 환경변수 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.</li>
              )}
              {status.isConfigured && !status.isConnected && (
                <li>• Supabase 프로젝트 설정과 네트워크 연결을 확인하세요.</li>
              )}
              {status.tables.some((t) => !t.exists) && (
                <li>• scripts/ 폴더의 SQL 스크립트를 실행하여 데이터베이스 스키마를 생성하세요.</li>
              )}
              {status.functions.some((f) => !f.exists) && (
                <li>• 필수 함수들을 생성하기 위해 관련 SQL 스크립트를 실행하세요.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
