export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  category: "현지 뉴스" | "교민 업체"
  author: string
  publishedAt: string
  readTime: number
  viewCount: number
  isBreaking: boolean
  tags: string[]
  imageUrl?: string
  sourceUrl?: string
}

export interface NewsStats {
  total: number
  breaking: number
  today: number
  categories: {
    local: number
    business: number
  }
}
