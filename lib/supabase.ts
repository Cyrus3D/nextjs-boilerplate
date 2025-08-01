import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface BusinessCard {
  id: string
  title: string
  description: string
  category: string
  phone?: string
  address?: string
  website?: string
  facebook?: string
  instagram?: string
  youtube?: string
  twitter?: string
  tiktok?: string
  line?: string
  kakao?: string
  whatsapp?: string
  telegram?: string
  image_url?: string
  tags?: string[]
  is_active: boolean
  is_premium: boolean
  is_promoted: boolean
  view_count: number
  exposure_count: number
  created_at: string
  updated_at: string
}

export interface NewsArticle {
  id: string
  title: string
  content: string
  summary?: string
  category: string
  source_url?: string
  image_url?: string
  author?: string
  is_published: boolean
  is_breaking: boolean
  view_count: number
  published_at: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Tag {
  id: string
  name: string
  description?: string
  color?: string
  usage_count: number
  is_active: boolean
  created_at: string
}

export interface DatabaseStatus {
  connected: boolean
  tables: {
    business_cards: number
    news_articles: number
    categories: number
    tags: number
  }
  functions: string[]
  error?: string
}

// Safe Supabase operation wrapper
export async function safeSupabaseOperation<T>(operation: () => Promise<{ data: T | null; error: any }>): Promise<T> {
  try {
    const { data, error } = await operation()

    if (error) {
      console.error("Supabase operation failed:", error.message)
      throw new Error(`Supabase operation failed: ${error.message}`)
    }

    return data as T
  } catch (error) {
    console.error("Supabase operation error:", error)
    throw error
  }
}

// Type aliases for compatibility
export type BusinessCardType = BusinessCard
export type NewsArticleType = NewsArticle
export type CategoryType = Category
export type TagType = Tag
