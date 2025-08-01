"use client"

import { DatabaseStatus } from "@/components/database-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Server, Settings } from "lucide-react"

export default function DatabaseCheckPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Database className="h-8 w-8" />
            데이터베이스 상태 확인
          </h1>
          <p className="text-gray-600">시스템의 데이터베이스 연결 상태와 테이블 정보를 확인합니다.</p>
        </div>

        {/* Database Status */}
        <DatabaseStatus />

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              시스템 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">런타임 환경</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Node.js 버전:</span>
                    <Badge variant="outline">{process.version}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>플랫폼:</span>
                    <Badge variant="outline">{process.platform}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>아키텍처:</span>
                    <Badge variant="outline">{process.arch}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">애플리케이션</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Next.js:</span>
                    <Badge variant="outline">14.x</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>React:</span>
                    <Badge variant="outline">18.x</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>TypeScript:</span>
                    <Badge variant="outline">5.x</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              설정 가이드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">환경 변수 설정</h4>
                <p className="text-sm text-blue-700 mb-2">다음 환경 변수들을 설정해야 합니다:</p>
                <div className="bg-blue-100 rounded p-2 font-mono text-xs">
                  <div>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">데이터베이스 설정</h4>
                <p className="text-sm text-green-700 mb-2">/scripts 폴더의 SQL 파일들을 순서대로 실행하세요:</p>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• 00-create-tables.sql</li>
                  <li>• 01-insert-categories.sql</li>
                  <li>• 02-insert-tags.sql</li>
                  <li>• 03-add-premium-fields.sql</li>
                  <li>• 04-create-functions.sql</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">샘플 데이터</h4>
                <p className="text-sm text-yellow-700">
                  데이터베이스 연결이 실패하면 자동으로 샘플 데이터가 표시됩니다. 실제 데이터를 보려면 데이터베이스를
                  올바르게 설정하세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
