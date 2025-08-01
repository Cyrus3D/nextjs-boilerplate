import type { Metadata } from "next"
import InfoCardList from "@/components/info-card-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, ArrowRight, Clock, Eye } from "lucide-react"
import { sampleNewsArticles } from "@/data/sample-news"

export const metadata: Metadata = {
  title: "핫타이 HOT THAI | 태국 한인 업체 정보",
  description:
    "태국에서 필요한 모든 한인 업체 정보를 한 곳에서 찾아보세요. 음식점, 서비스, 쇼핑 등 다양한 카테고리의 업체 정보를 제공합니다.",
  keywords: ["태국", "한인업체", "방콕", "파타야", "푸켓", "한식당", "서비스", "쇼핑"],
  openGraph: {
    title: "핫타이 HOT THAI | 태국 한인 업체 정보",
    description: "태국에서 필요한 모든 한인 업체 정보를 한 곳에서 찾아보세요.",
    type: "website",
    locale: "ko_KR",
  },
}

function NewsPreviewCard({ article }: { article: any }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "방금 전"
    if (diffInHours < 24) return `${diffInHours}시간 전`
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "현지 뉴스":
        return "bg-blue-100 text-blue-800"
      case "교민 업체":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge className={getCategoryColor(article.category)} variant="secondary">
            {article.category}
          </Badge>
          {article.isBreaking && <Badge className="bg-red-600 text-white animate-pulse">속보</Badge>}
        </div>
        <CardTitle className="text-lg line-clamp-2 leading-tight">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}분</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{article.viewCount.toLocaleString()}</span>
            </div>
          </div>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  // Get latest 3 news articles for preview
  const latestNews = sampleNewsArticles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* News Preview Section */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">최신 뉴스</h2>
          </div>
          <Link href="/news">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              전체 뉴스 보기
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {latestNews.map((article) => (
            <Link key={article.id} href="/news">
              <NewsPreviewCard article={article} />
            </Link>
          ))}
        </div>
      </section>

      {/* Main Business Cards Section */}
      <InfoCardList />
    </main>
  )
}
