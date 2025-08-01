export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  readTime: number
  viewCount: number
  isBreaking: boolean
  imageUrl?: string
  sourceUrl?: string
}
