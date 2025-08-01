export interface NewsArticle {
  id: string
  category: string
  title: string
  author: string
  publishedAt: string
  viewCount: number
  readTime: number
  imageUrl?: string
  excerpt: string
  content: string
  tags: string[]
  source?: string
  sourceUrl?: string
  isBreaking?: boolean
}
