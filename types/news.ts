export interface NewsFormData {
  title: string
  summary?: string
  content: string
  imageUrl?: string
  source: string
  originalUrl: string
  publishedAt?: string
  category: string
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  original_language?: string
  is_translated?: boolean
}

export interface NewsData extends NewsFormData {
  id: number
  view_count: number
  created_at: string
  updated_at: string
}

export interface NewsAnalysisResult {
  title?: string
  summary?: string
  content?: string
  imageUrl?: string
  source?: string
  publishedAt?: string
  category?: string
  tags?: string[]
  isActive?: boolean
  isFeatured?: boolean
  original_language?: string
  is_translated?: boolean
}

export interface TranslationResult {
  translatedText: string
  originalLanguage: string
  confidence: number
}

export interface LanguageDetectionResult {
  language: string
  confidence: number
}
