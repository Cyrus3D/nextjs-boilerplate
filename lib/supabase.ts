import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Types
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
  image_url?: string
  tags: string[]
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
  tags?: string[]
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
  is_active: boolean
  usage_count: number
  created_at: string
}

export interface DatabaseStatus {
  connected: boolean
  tables: {
    business_cards: boolean
    news_articles: boolean
    categories: boolean
    tags: boolean
  }
  functions: {
    increment_view_count: boolean
    increment_exposure_count: boolean
  }
  environment: {
    supabase_url: boolean
    supabase_anon_key: boolean
  }
}

// Safe operation wrapper
export async function safeSupabaseOperation<T>(operation: () => Promise<{ data: T; error: any }>): Promise<T | null> {
  if (!supabase) {
    console.warn("Supabase client not initialized")
    return null
  }

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
