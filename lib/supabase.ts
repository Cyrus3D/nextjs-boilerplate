import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface BusinessCard {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  phone?: string
  address?: string
  website?: string
  facebook?: string
  line?: string
  instagram?: string
  youtube?: string
  tiktok?: string
  twitter?: string
  kakao?: string
  whatsapp?: string
  telegram?: string
  image_url?: string
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
  tags: string[]
  source_url?: string
  image_url?: string
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

// Safe Supabase operation wrapper
export async function safeSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const result = await operation()

    if (result.error) {
      console.error("Supabase operation failed:", result.error)
      return { data: null, error: `Supabase operation failed: ${result.error.message}` }
    }

    return { data: result.data, error: null }
  } catch (error) {
    console.error("Supabase operation exception:", error)
    return { data: null, error: `Operation failed: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}

// Database connection test
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("business_cards").select("count(*)").limit(1)

    return !error
  } catch {
    return false
  }
}

// Get database statistics
export async function getDatabaseStats() {
  const stats = {
    businessCards: 0,
    newsArticles: 0,
    categories: 0,
    tags: 0,
    isConnected: false,
  }

  try {
    // Test connection
    stats.isConnected = await testDatabaseConnection()

    if (!stats.isConnected) {
      return stats
    }

    // Get business cards count
    const { data: businessCardsCount } = await supabase
      .from("business_cards")
      .select("*", { count: "exact", head: true })

    if (businessCardsCount) {
      stats.businessCards = businessCardsCount.length || 0
    }

    // Get news articles count
    const { data: newsCount } = await supabase.from("news_articles").select("*", { count: "exact", head: true })

    if (newsCount) {
      stats.newsArticles = newsCount.length || 0
    }

    // Get categories count
    const { data: categoriesCount } = await supabase.from("categories").select("*", { count: "exact", head: true })

    if (categoriesCount) {
      stats.categories = categoriesCount.length || 0
    }

    // Get tags count
    const { data: tagsCount } = await supabase.from("tags").select("*", { count: "exact", head: true })

    if (tagsCount) {
      stats.tags = tagsCount.length || 0
    }
  } catch (error) {
    console.error("Error getting database stats:", error)
  }

  return stats
}
