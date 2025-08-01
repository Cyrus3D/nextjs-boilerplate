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
  imageUrl?: string
  tags: string[]
  source?: string
  externalUrl?: string
}

export interface NewsCategory {
  id: string
  name: string
  count: number
}
