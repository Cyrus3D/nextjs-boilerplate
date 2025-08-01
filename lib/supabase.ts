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
  created_at: string
}

export interface Tag {
  id: string
  name: string
  description?: string
  color?: string
  is_active: boolean
  created_at: string
}

// Safe Supabase operation wrapper
export async function safeSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
): Promise<T | null> {
  try {
    const { data, error } = await operation()

    if (error) {
      console.error("Supabase operation failed:", error.message)
      return null
    }

    return data
  } catch (error) {
    console.error("Supabase operation failed:", error)
    return null
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
