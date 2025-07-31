"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, ExternalLink, Eye, Globe, Tag } from "lucide-react"
import type { NewsItem } from "@/types/news"
import { incrementNewsViewCount } from "@/lib/admin-news-actions"
import { useEffect } from "react"

interface NewsDetailModalProps {
  news: NewsItem | null
  isOpen: boolean
  onClose: () => void
}

export default function NewsDetailModal({ news, isOpen, onClose }: NewsDetailModalProps) {
  // Increment view count when modal opens
  useEffect(() => {
    if (isOpen && news?.id) {
      incrementNewsViewCount(news.id)
    }
  }, [isOpen, news?.id])

  if (!news) {
    return null
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "날짜 정보 없음"
    }
  }

  const handleSourceClick = () => {
    if (news.source_url) {
      window.open(news.source_url, "_blank", "noopener,noreferrer")
    }
  }

  // 이미지 URL 유효성 검증 함수
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url) return false

    const urlString = String(url).trim()
    if (!urlString || urlString === "null" || urlString === "undefined") return false

    // URL 형식 검증
    try {
      new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`)
      return true
    } catch {
      return false
    }
  }

  // 이미지 URL 정규화 함수
  const normalizeImageUrl = (url: string): string => {
    const urlString = url.trim()
    if (urlString.startsWith("http")) {
      return urlString
    }
    return `https://${urlString}`
  }

  const hasValidImage = isValidImageUrl(news.image_url)
  const normalizedImageUrl = hasValidImage ? normalizeImageUrl(String(news.image_url)) : ""

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold leading-tight mb-3">
                {String(news.title || "제목 없음")}
              </DialogTitle>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(String(news.published_at || news.created_at || ""))}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{String(news.source || "알 수 없음")}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{Number(news.view_count || 0).toLocaleString()} 조회</span>
                </div>

                {news.reading_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Number(news.reading_time)} 분 읽기</span>
                  </div>
                )}
              </div>
            </div>

            {news.source_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSourceClick}
                className="flex items-center gap-2 bg-transparent flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                원문 보기
              </Button>
            )}
          </div>
        </DialogHeader>

        <Separator className="flex-shrink-0" />

        <div className="flex-1 min-h-0 p-6">
          <ScrollArea className="h-full">
            <div className="space-y-6 pr-4">
              {/* Main Image Area */}
              {hasValidImage ? (
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={normalizedImageUrl || "/placeholder.svg"}
                    alt="뉴스 대표 이미지"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.log(`메인 이미지 로드 실패: ${normalizedImageUrl}`)
                      const target = e.target as HTMLImageElement
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDQwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgODBIMTc1LjAwMVY4MC4wMDFIMTc1WiIgZmlsbD0iIzk0OTRBNCIvPgo8cGF0aCBkPSJNMjI1IDgwSDIyNS4wMDFWODAuMDAxSDIyNVoiIGZpbGw9IiM5NDk0QTQiLz4KPHBhdGggZD0iTTE3NSAxMjBIMTc1LjAwMVYxMjAuMDAxSDE3NVoiIGZpbGw9IiM5NDk0QTQiLz4KPHBhdGggZD0iTTIyNSAxMjBIMjI1LjAwMVYxMjAuMDAxSDIyNVoiIGZpbGw9IiM5NDk0QTQiLz4KPHJlY3QgeD0iMTYwIiB5PSI2NSIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNCIgZmlsbD0iI0U1RTdFQiIvPgo8dGV4dCB4PSIyMDAiIHk9IjE1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0OTRBNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj7snbTrr7jsp4Ag66Gc65OcIOyLpO2MqDwvdGV4dD4KPC9zdmc+"
                    }}
                    onLoad={(e) => {
                      console.log(`메인 이미지 로드 성공: ${normalizedImageUrl}`)
                    }}
                  />
                </div>
              ) : (
                // Enhanced image handling with better validation
                <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">이미지 없음</p>
                    <p className="text-xs">대표 이미지가 없습니다</p>

                    {/* Enhanced debug info */}
                    <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded border max-w-md">
                      <strong>🔍 이미지 URL 분석:</strong>
                      <br />
                      <strong>원본 값:</strong> {JSON.stringify(news.image_url)}
                      <br />
                      <strong>타입:</strong> {typeof news.image_url}
                      <br />
                      <strong>문자열 길이:</strong> {String(news.image_url || "").length}
                      <br />
                      <strong>URL 유효성:</strong> {hasValidImage ? "✅ 유효한 URL 형식" : "❌ 유효하지 않은 URL"}
                    </div>
                  </div>
                </div>
              )}

              {/* Debug section - remove in production */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs">
                <h4 className="font-semibold text-yellow-800 mb-2">🔍 이미지 데이터 디버그 정보:</h4>
                <div className="space-y-1 text-yellow-700">
                  <div>
                    <strong>image_url 존재:</strong> {news.image_url ? "✅ 있음" : "❌ 없음"}
                  </div>
                  <div>
                    <strong>image_url 타입:</strong> {typeof news.image_url}
                  </div>
                  <div>
                    <strong>image_url 값:</strong> {JSON.stringify(news.image_url, null, 2)}
                  </div>
                  {Array.isArray(news.image_url) && (
                    <div>
                      <strong>배열 길이:</strong> {news.image_url.length}
                    </div>
                  )}
                  {news.image_url && (
                    <div>
                      <strong>첫 번째 URL:</strong> {Array.isArray(news.image_url) ? news.image_url[0] : news.image_url}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              {news.summary && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">요약</h3>
                  <p className="text-blue-800 leading-relaxed">{String(news.summary)}</p>
                </div>
              )}

              {/* Images */}
              {news.image_url && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">이미지</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(news.image_url)
                      ? news.image_url.map((url, index) => {
                          const imageUrl = String(url).trim()
                          if (!imageUrl) return null

                          return (
                            <div
                              key={index}
                              className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                            >
                              <img
                                src={imageUrl || "/placeholder.svg"}
                                alt={`뉴스 이미지 ${index + 1}`}
                                className="w-full h-auto max-h-64 object-cover hover:scale-105 transition-transform duration-200"
                                loading="lazy"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  console.log(`이미지 로드 실패: ${imageUrl}`)
                                  const target = e.target as HTMLImageElement
                                  target.src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTQ5NEE0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPuydtOuvuOyngCDroZzrk5wg7Ik164qUPC90ZXh0Pgo8L3N2Zz4K"
                                }}
                                onLoad={(e) => {
                                  console.log(`이미지 로드 성공: ${imageUrl}`)
                                }}
                              />
                            </div>
                          )
                        })
                      : (() => {
                          const imageUrl = String(news.image_url).trim()
                          if (!imageUrl) return null

                          return (
                            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                              <img
                                src={imageUrl || "/placeholder.svg"}
                                alt="뉴스 이미지"
                                className="w-full h-auto max-h-64 object-cover hover:scale-105 transition-transform duration-200"
                                loading="lazy"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  console.log(`이미지 로드 실패: ${imageUrl}`)
                                  const target = e.target as HTMLImageElement
                                  target.src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTQ5NEE0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPuydtOuvuOyngCDroZzrk5wg7Ik164qUPC90ZXh0Pgo8L3N2Zz4K"
                                }}
                                onLoad={(e) => {
                                  console.log(`이미지 로드 성공: ${imageUrl}`)
                                }}
                              />
                            </div>
                          )
                        })()}
                  </div>
                  {/* Debug info */}
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>디버그:</strong>{" "}
                    {Array.isArray(news.image_url)
                      ? `배열 ${news.image_url.length}개: ${JSON.stringify(news.image_url)}`
                      : `단일: ${String(news.image_url)}`}
                  </div>
                </div>
              )}

              {/* Content */}
              {news.content && (
                <div className="prose max-w-none">
                  <div
                    className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: String(news.content).replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              )}

              {/* Korean Translation */}
              {news.content_ko && news.content_ko !== news.content && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    한국어 번역
                  </h3>
                  <div
                    className="text-green-800 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: String(news.content_ko).replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              )}

              {/* AI Analysis */}
              {news.ai_analysis && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-3">AI 분석</h3>
                  <div
                    className="text-purple-800 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: String(news.ai_analysis).replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              )}

              {/* Tags */}
              {Array.isArray(news.tags) && news.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  {news.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {String(tag)}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Metadata */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <strong>카테고리:</strong> {String(news.category || "일반")}
                  </div>
                  <div>
                    <strong>언어:</strong> {String(news.language || "알 수 없음")}
                  </div>
                  {news.author && (
                    <div>
                      <strong>작성자:</strong> {String(news.author)}
                    </div>
                  )}
                  {news.location && (
                    <div>
                      <strong>지역:</strong> {String(news.location)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
