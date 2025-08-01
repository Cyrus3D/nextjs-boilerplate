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
  viewCount: number
  likeCount: number
  shareCount: number
  source: string
  sourceUrl?: string
}

export interface NewsCategory {
  id: string
  name: string
  color: string
  count: number
}

export interface NewsStats {
  totalArticles: number
  categoryCounts: Record<string, number>
  totalViews: number
  totalLikes: number
}
