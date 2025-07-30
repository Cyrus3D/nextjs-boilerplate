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
}

export interface NewsCategory {
  id: string
  name: string
  color: string
}
