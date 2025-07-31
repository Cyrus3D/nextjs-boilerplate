export interface NewsArticle {
  id: number
  title: string
  summary: string
  content?: string
  category: string
  publishedAt: string
  source: string
  author?: string
  imageUrl?: string
  url?: string
  tags: string[]
  viewCount: number
  isBreaking: boolean
  isPinned: boolean
}

export interface NewsCategory {
  id: number
  name: string
  color_class: string
}
