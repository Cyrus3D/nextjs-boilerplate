export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  category: "현지 뉴스" | "교민 업체"
  tags: string[]
  author: string
  publishedAt: string
  readTime: number
  viewCount: number
  isBreaking: boolean
  externalUrl?: string
  source?: string
}

export interface NewsStats {
  total: number
  today: number
  breaking: number
  local: number
  business: number
  totalViews: number
}
