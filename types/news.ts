export interface NewsArticle {
  id: number
  title: string
  content: string
  summary?: string | null
  category: string
  source?: string | null
  author?: string | null
  published_at: string
  image_url?: string | null
  external_url?: string | null
  tags: string[]
  view_count: number
  is_featured: boolean
  is_breaking: boolean
  created_at: string
  updated_at: string
}

export interface NewsCategory {
  id: number
  name: string
  color_class: string
  description?: string | null
}

export interface NewsTag {
  id: number
  name: string
}
