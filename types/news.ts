export interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  category: string
  tags: string[]
  imageUrl: string
  originalUrl: string
  source: string
  publishedAt: string
  viewCount: number
  sentiment?: "positive" | "negative" | "neutral"
  importance?: number
  createdAt?: string
  updatedAt?: string
}

export interface NewsCategory {
  id: string
  name: string
  description?: string
}

export interface NewsTag {
  id: string
  name: string
}
