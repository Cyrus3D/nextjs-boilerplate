import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { NewsCardList } from "@/components/news-card-list"
import { BusinessCardList } from "@/components/business-card-list"
import { getStatistics, getBreakingNews } from "@/lib/api"
import { Newspaper, Building2, AlertTriangle, Crown, TrendingUp } from "lucide-react"

async function StatisticsCards() {
  const stats = await getStatistics()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">뉴스 기사</CardTitle>
          <Newspaper className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newsCount}</div>
          <p className="text-xs text-muted-foreground">총 뉴스 기사 수</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">업체 정보</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.businessCount}</div>
          <p className="text-xs text-muted-foreground">등록된 업체 수</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">속보</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.breakingCount}</div>
          <p className="text-xs text-muted-foreground">긴급 속보</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">프리미엄</CardTitle>
          <Crown className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.premiumCount}</div>
          <p className="text-xs text-muted-foreground">프리미엄 업체</p>
        </CardContent>
      </Card>
    </div>
  )
}

async function BreakingNewsBanner() {
  const breakingNews = await getBreakingNews()

  if (breakingNews.length === 0) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <span className="font-semibold text-red-700">속보</span>
        <Badge variant="destructive" className="animate-pulse">
          LIVE
        </Badge>
      </div>
      <div className="space-y-2">
        {breakingNews.slice(0, 3).map((news) => (
          <div key={news.id} className="text-sm">
            <span className="font-medium text-red-800">{news.title}</span>
            <span className="text-red-600 ml-2">• {news.category}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">태국 한인 정보 플랫폼</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          태국 거주 한인들을 위한 최신 뉴스와 업체 정보를 한곳에서 확인하세요
        </p>
      </div>

      {/* Statistics Cards */}
      <Suspense fallback={<LoadingSkeleton />}>
        <StatisticsCards />
      </Suspense>

      {/* Breaking News Banner */}
      <Suspense fallback={<div className="h-20 bg-gray-100 rounded-lg animate-pulse" />}>
        <BreakingNewsBanner />
      </Suspense>

      {/* Main Content Tabs */}
      <Tabs defaultValue="news" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="news" className="flex items-center space-x-2">
            <Newspaper className="h-4 w-4" />
            <span>뉴스</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>업체 정보</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">최신 뉴스</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>실시간 업데이트</span>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <div className="h-48 bg-gray-200 rounded-t-lg animate-pulse" />
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <NewsCardList />
          </Suspense>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">업체 정보</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span>프리미엄 업체 우선 표시</span>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <div className="h-48 bg-gray-200 rounded-t-lg animate-pulse" />
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <BusinessCardList />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
