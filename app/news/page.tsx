import type { Metadata } from "next"
import NewsCardList from "@/components/news-card-list"

export const metadata: Metadata = {
  title: "뉴스 | 핫타이 HOT THAI",
  description: "태국 현지 뉴스와 교민 업체 소식을 한 곳에서 확인하세요. 최신 정보와 유용한 소식을 빠르게 전해드립니다.",
  keywords: ["태국뉴스", "현지뉴스", "교민업체", "태국소식", "한인뉴스", "방콕뉴스", "파타야뉴스"],
  openGraph: {
    title: "뉴스 | 핫타이 HOT THAI",
    description: "태국 현지 뉴스와 교민 업체 소식을 한 곳에서 확인하세요.",
    type: "website",
    locale: "ko_KR",
  },
}

export default function NewsPage() {
  return (
    <main>
      <NewsCardList />
    </main>
  )
}
