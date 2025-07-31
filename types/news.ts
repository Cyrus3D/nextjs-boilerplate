export interface NewsItem {
  id: number
  title: string
  summary?: string
  content: string
  category?: {
    id: number
    name: string
    color_class?: string
  }
  tags?: Array<{
    id: number
    name: string
  }>
  author?: string
  source_url?: string
  image_url?: string
  published_at: string
  view_count: number
  is_featured?: boolean
  is_active?: boolean
  original_language?: string
  is_translated?: boolean
}

export interface NewsCategory {
  id: number
  name: string
  color_class?: string
  is_active: boolean
}

export interface NewsTag {
  id: number
  name: string
}

export interface NewsAnalysisResult {
  title: string
  summary: string
  content: string
  category: string
  tags: string[]
  author?: string
  language: string
}
