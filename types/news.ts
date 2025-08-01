export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  readTime: number
  isBreaking: boolean
  views: number
  likes: number
  shares: number
  source: string
  sourceUrl: string
}

export interface NewsCategory {
  id: string
  name: string
  color: string
  count: number
}

export interface NewsStats {
  totalArticles: number
  breakingNews: number
  categoryCounts: Record<string, number>
}
