export interface NewsArticle {
  id: string
  title: string
  content: string
  excerpt: string
  imageUrl: string
  category: string
  author: string
  publishedAt: string
  readTime: number
  viewCount: number
  isBreaking?: boolean
  tags: string[]
  sourceUrl?: string
}

export interface NewsCategory {
  id: string
  name: string
  description: string
  color: string
}
