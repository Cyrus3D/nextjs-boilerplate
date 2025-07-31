"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, Globe, Star } from "lucide-react"
import type { NewsItem } from "@/types/news"

interface NewsCardProps {
  news: NewsItem
  onDetailClick: (news: NewsItem) => void
}

export default function NewsCard({ news, onDetailClick }: NewsCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      정책: "bg-blue-100 text-blue-800",
      경제: "bg-green-100 text-green-800",
      사회: "bg-purple-100 text-purple-800",
      문화: "bg-pink-100 text-pink-800",
      교통: "bg-indigo-100 text-indigo-800",
      의료: "bg-red-100 text-red-800",
      생활: "bg-orange-100 text-orange-800",
      일반: "bg-gray-100 text-gray-800",
      정치: "bg-red-100 text-red-800",
      스포츠: "bg-orange-100 text-orange-800",
      기술: "bg-indigo-100 text-indigo-800",
      국제: "bg-yellow-100 text-yellow-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "날짜 정보 없음"
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardHeader className="pb-3" onClick={() => onDetailClick(news)}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Badge className={`${getCategoryColor(String(news.category))} text-xs`}>{String(news.category)}</Badge>
            {news.is_featured && (
              <Badge className="bg-yellow-500 text-white text-xs">
                <Star className="w-3 h-3 mr-1" />
                추천
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Globe className="w-3 h-3" />
            <span>{String(news.language || "ko").toUpperCase()}</span>
          </div>
        </div>

        <h3 className="font-semibold text-lg leading-tight group-hover:text-blue-600 transition-colors mb-2 h-[3rem] overflow-hidden line-clamp-2">
          {String(news.title || "")}
        </h3>

        {/* Image Placeholder */}
        <div className="h-[7.5rem] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-2">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-1">📷</div>
            <div className="text-xs">이미지 영역</div>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed h-[4.5rem] overflow-hidden line-clamp-3">
          {String(news.summary || "")}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Meta Information */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(String(news.published_at || news.created_at))}</span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="truncate">{String(news.source || "알 수 없음")}</span>
          </div>

          {news.reading_time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{Number(news.reading_time)} 분 읽기</span>
            </div>
          )}

          {news.location && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">📍 {String(news.location)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(news.tags) && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {news.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{String(tag)}
              </Badge>
            ))}
            {news.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{news.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* AI Analysis Preview */}
        {news.ai_analysis && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
            <p className="text-purple-800 text-xs font-medium">🤖 AI 분석: {String(news.ai_analysis)}</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{Number(news.view_count || 0).toLocaleString()} 조회</span>
          </div>
          <span>{formatDate(String(news.created_at))}</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onDetailClick(news)}
          className="w-full bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300"
          variant="outline"
        >
          기사 읽기
        </Button>
      </CardContent>
    </Card>
  )
}
