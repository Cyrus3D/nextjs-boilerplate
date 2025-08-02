import { Suspense } from "react"
import NewsCardList from "@/components/news-card-list"
import { getNewsArticles } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

function NewsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

async function NewsContent() {
  const articles = await getNewsArticles()

  return <NewsCardList initialArticles={articles} />
}

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<NewsLoadingSkeleton />}>
        <NewsContent />
      </Suspense>
    </div>
  )
}

export const metadata = {
  title: "태국 뉴스 - 최신 현지 소식과 교민 업체 정보",
  description: "태국 현지 뉴스, 교민 업체 소식, 정책 정보 등 다양한 소식을 확인하세요.",
  keywords: "태국뉴스, 현지소식, 교민업체, 태국정책, 비자정보",
}
