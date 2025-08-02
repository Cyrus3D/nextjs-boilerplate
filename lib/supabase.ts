import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  line?: string
  kakao?: string
  whatsapp?: string
  telegram?: string
  twitter?: string
  tiktok?: string
  image_url?: string
  tags: string[]
  view_count: number
  exposure_count: number
  is_premium: boolean
  is_promoted: boolean
  is_active: boolean
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
  tags: string[]
  view_count: number
  is_breaking: boolean
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
}

export interface Tag {
  id: string
  name: string
  category?: string
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
  functions: {
    increment_view_count: boolean
    increment_exposure_count: boolean
    increment_news_view_count: boolean
  }
  environment: {
    supabase_url: boolean
    supabase_anon_key: boolean
  }
}

// Safe database operations with error handling
export async function safeSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
): Promise<T | null> {
  try {
    const { data, error } = await operation()
    if (error) {
      console.error("Supabase operation error:", error)
      return null
    }
    return data
  } catch (error) {
    console.error("Supabase operation failed:", error)
    return null
  }
}
