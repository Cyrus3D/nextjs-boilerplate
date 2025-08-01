import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { NewsCardList } from "@/components/news-card-list"
import { BusinessCardList } from "@/components/business-card-list"
import { getNewsArticles, getBusinessCards } from "@/lib/api"
import { Newspaper, Building2, TrendingUp, Users } from "lucide-react"

async function HomePage() {
  // Fetch data in parallel
  const [newsArticles, businessCards] = await Promise.all([getNewsArticles(20), getBusinessCards(20)])

  const breakingNews = newsArticles.filter((article) => article.isBreaking)
  const recentNews = newsArticles.slice(0, 6)
  const premiumBusinesses = businessCards.filter((card) => card.isPremium)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HT</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HOT THAI</h1>
                <p className="text-sm text-gray-600">태국 생활 정보 플랫폼</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{newsArticles.length}</div>
                <div className="text-xs text-gray-600">뉴스</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{businessCards.length}</div>
                <div className="text-xs text-gray-600">업체</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{breakingNews.length}</div>
                <div className="text-xs text-gray-600">속보</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Newspaper className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">{newsArticles.length}</div>
                  <div className="text-xs text-gray-600">최신 뉴스</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{businessCards.length}</div>
                  <div className="text-xs text-gray-600">등록 업체</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold">{breakingNews.length}</div>
                  <div className="text-xs text-gray-600">속보</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{premiumBusinesses.length}</div>
                  <div className="text-xs text-gray-600">프리미엄</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breaking News Banner */}
        {breakingNews.length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Badge variant="destructive" className="animate-pulse">
                  속보
                </Badge>
                <CardTitle className="text-lg">긴급 뉴스</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {breakingNews.slice(0, 3).map((article) => (
                  <div key={article.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-red-800">{article.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Newspaper className="h-5 w-5" />
                  <span>최신 뉴스</span>
                </CardTitle>
                <CardDescription>태국 현지 소식과 교민 관련 뉴스를 실시간으로 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<NewsListSkeleton />}>
                  <NewsCardList initialNews={newsArticles} />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>업체 정보</span>
                </CardTitle>
                <CardDescription>태국 현지 한국 업체들의 정보를 확인하고 연락하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<BusinessListSkeleton />}>
                  <BusinessCardList initialCards={businessCards} />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2024 HOT THAI. All rights reserved.</p>
            <p className="text-sm">태국 생활 정보 플랫폼</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NewsListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function BusinessListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default HomePage
