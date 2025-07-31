export interface NewsCategory {
  id: number
  name: string
  description?: string
  color_class: string
  created_at: string
  updated_at: string
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
  category?: NewsCategory
  author?: string
  source_url?: string
  image_url?: string
  is_featured: boolean
  is_active: boolean
  published_at: string
  created_at: string
  updated_at: string
  view_count: number
  original_language: string
  is_translated: boolean
  tags?: NewsTag[]
}

export interface NewsFormData {
  title: string
  content: string
  summary?: string
  category_id?: number
  author?: string
  source_url?: string
  image_url?: string
  is_featured: boolean
  is_active: boolean
  published_at?: string
  original_language: string
  is_translated: boolean
  tag_names?: string[]
}

export interface NewsAnalysisResult {
  title: string
  content: string
  summary?: string
  category: string
  tags: string[]
  language: string
  author?: string
}
