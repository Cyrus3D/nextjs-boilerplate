"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, Database, FileText, Tag, Folder } from "lucide-react"
import { fetchNewsFromDatabase, fetchNewsCategories, fetchNewsTags } from "@/lib/debug-news"

interface NewsArticle {
  id: string
  title: string
  excerpt?: string
  category: string
  tags: string[]
  author: string
  view_count: number
  is_breaking: boolean
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

interface DebugResult {
  success: boolean
  data?: NewsArticle[]
  total?: number
  error?: string
  message?: string
}

export default function DebugNewsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DebugResult | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])

  const handleFetchNews = async () => {
    setLoading(true)
    console.log("🔍 뉴스 데이터베이스 조회를 시작합니다...")

    try {
      // 뉴스 조회
      const newsResult = await fetchNewsFromDatabase()
      setResult(newsResult)

      // 카테고리 조회
      const categoryResult = await fetchNewsCategories()
      if (categoryResult.success && categoryResult.data) {
        setCategories(categoryResult.data)
      }

      // 태그 조회
      const tagResult = await fetchNewsTags()
      if (tagResult.success && tagResult.data) {
        setTags(tagResult.data)
      }

      console.log("✅ 모든 조회가 완료되었습니다.")
    } catch (error) {
      console.error("❌ 조회 중 오류 발생:", error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-600" />
          뉴스 데이터베이스 디버그
        </h1>
        <p className="text-gray-600">news_articles 테이블에서 뉴스 데이터를 조회하고 콘솔에 표시합니다.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            뉴스 데이터 조회
          </CardTitle>
          <CardDescription>데이터베이스에서 뉴스 목록을 가져와 콘솔창과 화면에 표시합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleFetchNews} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                조회 중...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                뉴스 데이터 조회
              </>
            )}
          </Button>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>💡 사용법:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 버튼을 클릭하여 뉴스 데이터를 조회합니다</li>
              <li>• 브라우저의 개발자 도구 → Console 탭에서 상세 로그를 확인하세요</li>
              <li>• 조회 결과는 아래 카드에도 표시됩니다</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* 조회 결과 요약 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <Badge variant="default" className="bg-green-500">
                    성공
                  </Badge>
                ) : (
                  <Badge variant="destructive">실패</Badge>
                )}
                조회 결과
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="space-y-2">
                  <p className="text-green-600 font-medium">✅ {result.message}</p>
                  <p className="text-gray-600">
                    총 <strong>{result.total || 0}</strong>개의 뉴스가 있습니다.
                  </p>
                  <p className="text-gray-600">
                    최신 <strong>{result.data?.length || 0}</strong>개의 뉴스를 조회했습니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-red-600 font-medium">❌ 조회 실패</p>
                  <p className="text-gray-600">오류: {result.error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 뉴스 목록 */}
          {result.success && result.data && result.data.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  뉴스 목록 ({result.data.length}개)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.data.map((article, index) => (
                    <div key={article.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              ID: {article.id}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                            {article.is_breaking && (
                              <Badge variant="destructive" className="text-xs">
                                속보
                              </Badge>
                            )}
                            {!article.is_published && (
                              <Badge variant="outline" className="text-xs">
                                미게시
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg mb-1">
                            {index + 1}. {article.title}
                          </h3>
                          {article.excerpt && <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>👤 {article.author}</span>
                        <span>👀 {article.view_count}회</span>
                        <span>📅 {new Date(article.published_at).toLocaleDateString("ko-KR")}</span>
                      </div>

                      {article.tags && article.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {article.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              🏷️ {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 카테고리 목록 */}
          {categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  뉴스 카테고리 ({categories.length}개)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {categories.map((category) => (
                    <Badge key={category.id} variant="secondary" className="justify-center">
                      📂 {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 태그 목록 */}
          {tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  뉴스 태그 ({tags.length}개)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      🏷️ {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Separator className="my-8" />

      <Card>
        <CardHeader>
          <CardTitle>📋 콘솔 로그 확인 방법</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Chrome/Edge:</strong> F12 → Console 탭
            </p>
            <p>
              <strong>Firefox:</strong> F12 → 콘솔 탭
            </p>
            <p>
              <strong>Safari:</strong> Option + Cmd + C
            </p>
            <p className="text-gray-600 mt-4">콘솔창에서 더 상세한 뉴스 데이터와 통계 정보를 확인할 수 있습니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
