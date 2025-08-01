export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  category: "현지 뉴스" | "교민 업체"
  tags: string[]
  imageUrl?: string
  sourceUrl?: string
  source?: string
  readTime: number
  viewCount: number
  isBreaking?: boolean
}

export interface NewsCategory {
  id: string
  name: string
  count: number
}
