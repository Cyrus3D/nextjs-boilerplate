export interface NewsItem {
  id: number
  title: string
  summary?: string
  content: string
  category?: {
    id: number
    name: string
    color_class?: string
  } | null
  tags?: Array<{
    id: number
    name: string
  }>
  author?: string | null
  source_url?: string | null
  image_url?: string | null
  published_at: string
  view_count: number
  is_featured?: boolean
  is_active?: boolean
  original_language?: string
  is_translated?: boolean
  created_at?: string
  updated_at?: string
}

export interface NewsCategory {
  id: number
  name: string
  color_class?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface NewsTag {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export interface NewsAnalysisResult {
  title: string
  summary: string
  content: string
  category: string
  tags: string[]
  author?: string | null
  language: string
}

export interface NewsFormData {
  title: string
  content: string
  summary?: string
  category_id?: number
  author?: string
  source_url?: string
  image_url?: string
  is_featured?: boolean
  is_active?: boolean
  published_at?: string
  original_language?: string
  is_translated?: boolean
  tag_names?: string[]
}
