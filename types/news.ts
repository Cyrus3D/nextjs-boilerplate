export interface NewsItem {
  id: number
  title: string
  summary: string
  content: string
  imageUrl: string
  source: string
  originalUrl: string
  publishedAt: string
  category: string
  tags: string[]
  viewCount: number
  isActive?: boolean
  isFeatured?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface NewsCategory {
  id: string
  name: string
  color: string
}

export interface NewsFormData {
  title: string
  summary?: string
  content: string
  imageUrl?: string
  source: string
  originalUrl: string
  publishedAt?: string
  category: string
  tags: string[]
  isActive: boolean
  isFeatured: boolean
}
