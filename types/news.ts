export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  category: "politics" | "economy" | "society" | "international" | "breaking"
  tags: string[]
  author: string
  publishedAt: string
  imageUrl?: string
  readTime: number
  isBreaking?: boolean
  views: number
  likes: number
  source: string
  sourceUrl?: string
}

export interface NewsCategory {
  id: string
  name: string
  count: number
  color: string
}

export interface NewsStats {
  totalArticles: number
  categoryCounts: Record<string, number>
  todayArticles: number
  breakingNews: number
}
