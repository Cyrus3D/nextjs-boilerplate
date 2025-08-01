export interface NewsArticle {
  id: number
  title: string
  content: string
  summary?: string | null
  category: string
  tags: string[]
  imageUrl?: string | null
  sourceUrl?: string | null
  author?: string | null
  isPublished: boolean
  isBreaking: boolean
  viewCount: number
  readTime?: number
  language?: string
  translatedTitle?: string | null
  translatedContent?: string | null
  translatedSummary?: string | null
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
}

export interface NewsArticleFormData {
  title: string
  content: string
  summary?: string
  category: string
  author?: string
  source_url?: string
  image_url?: string
  is_published?: boolean
  is_breaking?: boolean
  view_count?: number
  created_at?: string
  updated_at?: string
  published_at?: string
  tags?: string[]
  language?: string
  translated_title?: string
  translated_content?: string
  translated_summary?: string
}

export interface NewsFilters {
  category?: string
  search?: string
  isBreaking?: boolean
  author?: string
  dateFrom?: string
  dateTo?: string
}

export const NEWS_CATEGORIES = [
  { id: 1, name: "현지", description: "Local news", type: "news", created_at: "2023-01-01T00:00:00Z" },
  { id: 2, name: "업체", description: "Company news", type: "news", created_at: "2023-01-01T00:00:00Z" },
  { id: 3, name: "정책", description: "Policy news", type: "news", created_at: "2023-01-01T00:00:00Z" },
  { id: 4, name: "교통", description: "Traffic news", type: "news", created_at: "2023-01-01T00:00:00Z" },
  { id: 5, name: "비자", description: "Visa news", type: "news", created_at: "2023-01-01T00:00:00Z" },
  { id: 6, name: "경제", description: "Economic news", type: "news", created_at: "2023-01-01T00:00:00Z" },
  { id: 7, name: "문화", description: "Cultural news", type: "news", created_at: "2023-01-01T00:00:00Z" },
  { id: 8, name: "사회", description: "Social news", type: "news", created_at: "2023-01-01T00:00:00Z" },
  { id: 9, name: "스포츠", description: "Sports news", type: "news", created_at: "2023-01-01T00:00:00Z" },
  { id: 10, name: "연예", description: "Entertainment news", type: "news", created_at: "2023-01-01T00:00:00Z" },
  { id: 11, name: "기술", description: "Technology news", type: "news", created_at: "2023-01-01T00:00:00Z" },
  { id: 12, name: "건강", description: "Health news", type: "news", created_at: "2023-01-01T00:00:00Z" },
] as const

export type NewsCategoryType = (typeof NEWS_CATEGORIES)[number]

export interface NewsCategory {
  id: number
  name: string
  description?: string | null
  color_class?: string | null
  created_at: string
}

export interface NewsTag {
  id: number
  name: string
  created_at: string
}

export interface NewsSearchParams {
  query?: string
  category?: string
  isBreaking?: boolean
  limit?: number
  offset?: number
}

export interface NewsStatistics {
  totalArticles: number
  breakingNews: number
  categoryCounts: Record<string, number>
  recentViews: number
}
