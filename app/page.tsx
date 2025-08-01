import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { NewsCardList } from "@/components/news-card-list"
import { BusinessCardList } from "@/components/business-card-list"
import { getStatistics, getBreakingNews } from "@/lib/api"
import { Newspaper, Building2, AlertTriangle, Crown } from "lucide-react"

async function StatisticsCards() {
  const stats = await getStatistics()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">뉴스</CardTitle>
          <Newspaper className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalNews}</div>
          <p className="text-xs text-muted-foreground">총 뉴스 기사</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">업체</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
          <p className="text-xs text-muted-foreground">등록된 업체</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">속보</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBreaking}</div>
          <p className="text-xs text-muted-foreground">긴급 뉴스</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">프리미엄</CardTitle>
          <Crown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPremium}</div>
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
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="destructive" className="animate-pulse">
          속보
        </Badge>
        <span className="text-sm font-medium text-red-800">긴급 뉴스</span>
      </div>
      <div className="space-y-2">
        {breakingNews.slice(0, 3).map((news) => (
          <div key={news.id} className="text-sm text-red-700 hover:text-red-900 cursor-pointer">
            • {news.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">태국 한인 정보 플랫폼</h1>
        <p className="text-gray-600">태국 현지 뉴스와 한인 업체 정보를 한 곳에서 확인하세요</p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        <StatisticsCards />
      </Suspense>

      <Suspense
        fallback={
          <div className="mb-6 p-4 bg-gray-50 border rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        }
      >
        <BreakingNewsBanner />
      </Suspense>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            뉴스
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            업체 정보
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="mt-6">
          <Suspense
            fallback={
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <NewsCardList />
          </Suspense>
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="h-5 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                        <div className="flex gap-2">
                          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
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
