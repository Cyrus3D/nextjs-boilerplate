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
  isPublished?: boolean
  imageUrl?: string
  sourceUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface NewsCategory {
  id: number
  name: string
  color_class: string
  created_at?: string
}

export interface NewsTag {
  id: number
  name: string
  created_at?: string
}

export interface NewsArticleData {
  title: string
  excerpt?: string
  content: string
  category: string
  tags: string[]
  author: string
  published_at?: string
  read_time?: number
  is_breaking?: boolean
  is_published?: boolean
  image_url?: string
  source_url?: string
}
