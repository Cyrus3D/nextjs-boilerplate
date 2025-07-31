export interface NewsItem {
  id: number
  title: string
  summary: string
  content: string
  content_ko?: string
  source: string
  source_url?: string
  author?: string
  published_at: string
  created_at: string
  updated_at: string
  category: string
  tags: string[]
  language: string
  location?: string
  ai_analysis?: string
  reading_time?: number
  view_count: number
  is_featured: boolean
  is_active: boolean
}

export interface NewsCategory {
  id: number
  name: string
  color_class: string
  created_at: string
}

export interface NewsTag {
  id: number
  name: string
  created_at: string
}

export interface NewsArticle {
  id: number
  title: string
  content: string
  summary?: string
  category_id?: number
  author?: string
  source_url?: string
  image_url?: string
  is_featured: boolean
  is_active: boolean
  published_at: string
  original_language: string
  is_translated: boolean
  view_count: number
  created_at: string
  updated_at: string
  category?: {
    id: number
    name: string
    color_class: string
  }
  tags?: {
    id: number
    name: string
  }[]
}

export interface AIAnalysisResult {
  title: string
  summary: string
  content: string
  category: string
  tags: string[]
  author: string | null
  language: string
}
