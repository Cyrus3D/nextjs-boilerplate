export interface NewsItem {
  id: number
  title: string
  content: string
  summary?: string | null
  source_url?: string | null
  image_url?: string | null
  category: string
  tags: string[]
  is_featured: boolean
  is_active: boolean
  original_language: string
  is_translated: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface NewsFormData {
  title: string
  content: string
  summary?: string
  source_url?: string
  image_url?: string
  category: string
  tags: string[]
  is_featured: boolean
  is_active: boolean
}

export interface NewsAnalysisResult {
  title: string
  content: string
  summary: string
  category: string
  tags: string[]
  language: string
  isTranslated: boolean
}

export const NEWS_CATEGORIES = [
  "general",
  "business",
  "technology",
  "health",
  "entertainment",
  "sports",
  "politics",
  "travel",
  "food",
  "lifestyle",
] as const

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]
