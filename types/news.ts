export interface NewsArticle {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  imageUrl?: string
  sourceUrl?: string
  publishedAt: string
  isBreaking: boolean
  isPublished: boolean
  viewCount: number
  readTime: number
  createdAt: string
  updatedAt: string
}

export interface NewsArticleFormData {
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  imageUrl?: string
  sourceUrl?: string
  publishedAt?: string
  isBreaking?: boolean
  isPublished?: boolean
  readTime?: number
}

export interface NewsFilters {
  category?: string
  search?: string
  isBreaking?: boolean
  author?: string
  dateFrom?: string
  dateTo?: string
}

export const NEWS_CATEGORIES = [
  "현지",
  "업체",
  "정책",
  "교통",
  "비자",
  "경제",
  "문화",
  "사회",
  "스포츠",
  "연예",
  "기술",
  "건강",
] as const

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

export interface NewsStats {
  totalArticles: number
  publishedArticles: number
  breakingNews: number
  totalViews: number
  categoryCounts: Record<string, number>
  recentArticles: NewsArticle[]
}
