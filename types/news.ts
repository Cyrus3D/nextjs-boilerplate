export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  category: "local" | "business"
  tags: string[]
  author: string
  publishedAt: string
  readTime: number
  viewCount: number
  isBreaking: boolean
  imageUrl?: string
  sourceUrl?: string
}

export interface NewsCategory {
  id: string
  name: string
  count: number
}
