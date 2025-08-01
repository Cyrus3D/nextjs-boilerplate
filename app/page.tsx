import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { NewsCardList } from "@/components/news-card-list"
import { BusinessCardList } from "@/components/business-card-list"
import { getStatistics, getBreakingNews } from "@/lib/api"
import { Newspaper, Building2, Zap, Crown, TrendingUp, Users, Eye, Calendar } from "lucide-react"

async function StatisticsCards() {
  const stats = await getStatistics()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 뉴스</CardTitle>
          <Newspaper className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.totalNews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">발행된 기사 수</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 업체</CardTitle>
          <Building2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.totalBusinesses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">등록된 업체 수</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">속보</CardTitle>
          <Zap className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.totalBreaking.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">긴급 뉴스</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">프리미엄</CardTitle>
          <Crown className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.totalPremium.toLocaleString()}</div>
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
    <div className="mb-8">
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              속보
            </Badge>
            <CardTitle className="text-lg">긴급 뉴스</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {breakingNews.slice(0, 3).map((article) => (
              <div key={article.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">{article.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{article.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.publishedAt).toLocaleDateString("ko-KR")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.viewCount.toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                {article.imageUrl && (
                  <img
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatisticsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function BreakingNewsSkeleton() {
  return (
    <div className="mb-8">
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4 mb-2" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </div>
                <Skeleton className="w-16 h-16 rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">태국 한인 정보 플랫폼</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          태국 거주 한인들을 위한 최신 뉴스와 업체 정보를 한곳에서 확인하세요
        </p>
      </div>

      {/* Statistics Cards */}
      <Suspense fallback={<StatisticsSkeleton />}>
        <StatisticsCards />
      </Suspense>

      {/* Breaking News Banner */}
      <Suspense fallback={<BreakingNewsSkeleton />}>
        <BreakingNewsBanner />
      </Suspense>

      {/* Main Content Tabs */}
      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            뉴스
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            업체 정보
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">최신 뉴스</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              실시간 업데이트
            </div>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <CardHeader>
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
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
            <h2 className="text-2xl font-bold text-gray-900">업체 정보</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              검증된 업체
            </div>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <CardHeader>
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
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
