export interface NewsArticle {
  id: number
  title: string
  content: string
  excerpt: string
  image?: string | null
  category: "현지 뉴스" | "교민 업체"
  author?: string | null
  publishedAt: string
  source?: string | null
  tags: string[]
  readTime?: number
  isBreaking?: boolean
  viewCount?: number
}

export interface NewsCategory {
  id: string
  name: string
  count: number
}
