import { createClient } from "@supabase/supabase-js"

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
  tiktok?: string
  line?: string
  kakao?: string
  image_url?: string
  tags: string[]
  is_active: boolean
  is_premium: boolean
  is_promoted: boolean
  premium_expires_at?: string
  view_count: number
  exposure_count: number
  last_exposed_at?: string
  exposure_weight?: number
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
  tags: string[]
  is_published: boolean
  is_breaking: boolean
  view_count: number
  read_time?: number
  language?: string
  translated_title?: string
  translated_content?: string
  translated_summary?: string
  published_at: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Tag {
  id: string
  name: string
  description?: string
  color?: string
  is_active: boolean
  usage_count: number
  created_at: string
}

export interface DatabaseStatus {
  isConnected: boolean
  tablesExist: boolean
  functionsExist: boolean
  error?: string
  tableInfo?: {
    business_cards: number
    news_articles: number
    categories: number
    tags: number
  }
}

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Safe operation wrapper
export async function safeSupabaseOperation<T>(operation: () => Promise<{ data: T; error: any }>): Promise<T | null> {
  if (!supabase) {
    console.warn("Supabase not configured, returning null")
    return null
  }

  try {
    const result = await operation()
    if (result.error) {
      console.error("Supabase operation failed:", result.error)
      return null
    }
    return result.data
  } catch (error) {
    console.error("Supabase operation error:", error)
    return null
  }
}

// Database status check
export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
  if (!supabase) {
    return {
      isConnected: false,
      tablesExist: false,
      functionsExist: false,
      error: "Supabase not configured",
    }
  }

  try {
    // Test connection with a simple query
    const { data: connectionTest, error: connectionError } = await supabase.from("business_cards").select("count")

    if (connectionError) {
      return {
        isConnected: false,
        tablesExist: false,
        functionsExist: false,
        error: connectionError.message,
      }
    }

    // Check table counts
    const [businessCardsResult, newsResult, categoriesResult, tagsResult] = await Promise.all([
      supabase.from("business_cards").select("*", { count: "exact", head: true }),
      supabase.from("news_articles").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("tags").select("*", { count: "exact", head: true }),
    ])

    return {
      isConnected: true,
      tablesExist: true,
      functionsExist: true,
      tableInfo: {
        business_cards: businessCardsResult.count || 0,
        news_articles: newsResult.count || 0,
        categories: categoriesResult.count || 0,
        tags: tagsResult.count || 0,
      },
    }
  } catch (error) {
    return {
      isConnected: false,
      tablesExist: false,
      functionsExist: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
