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
  summary: string
  content: string
  author?: string | null
  source_url?: string | null
  image_url?: string | null
  category_id?: number | null
  published_at: string
  created_at: string
  updated_at: string
  view_count: number
  is_featured: boolean
  is_active: boolean
  original_language: string
  is_translated: boolean
  category?: NewsCategory | null
  tags?: NewsTag[]
}

export interface NewsArticleTag {
  id: number
  article_id: number
  tag_id: number
  created_at: string
}

export interface NewsAnalysisResult {
  success: boolean
  message: string
  data: NewsArticle | null
}

export interface ScrapedContent {
  title: string
  content: string
  description: string
  image: string
  url: string
}

export interface AIAnalysisResult {
  title: string
  summary: string
  content: string
  category: string
  tags: string[]
  author?: string | null
  language: string
}
