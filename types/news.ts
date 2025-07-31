export interface NewsItem {
  id: number
  title: string
  summary: string
  content: string
  imageUrl: string
  source: string
  originalUrl: string
  publishedAt: string
  category: string
  tags: string[]
  viewCount: number
  isActive?: boolean
  isFeatured?: boolean
  createdAt?: string
  updatedAt?: string
  originalLanguage?: string
  isTranslated?: boolean
}

export interface NewsCategory {
  id: string
  name: string
  color: string
}

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
}

export interface TranslationOptions {
  enableTranslation: boolean
  sourceLanguage?: "auto" | "ko" | "en" | "th"
  targetLanguage: "ko"
}

export interface NewsAnalysisResult extends NewsFormData {
  originalLanguage: string
  isTranslated: boolean
  translationStatus?: "success" | "failed" | "not_needed"
}
