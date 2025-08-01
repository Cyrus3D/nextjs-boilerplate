import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface DatabaseResult<T> {
  data: T | null
  error: string | null
  success: boolean
}

export async function safeSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
): Promise<DatabaseResult<T>> {
  try {
    const { data, error } = await operation()

    if (error) {
      console.error("Supabase operation failed:", error.message)
      return {
        data: null,
        error: error.message,
        success: false,
      }
    }

    return {
      data,
      error: null,
      success: true,
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
    console.error("Supabase operation failed:", errorMessage)
    return {
      data: null,
      error: errorMessage,
      success: false,
    }
  }
}

export interface BusinessCard {
  id: number
  title: string
  description: string
  category: string
  phone?: string
  address?: string
  website?: string
  facebook?: string
  line?: string
  instagram?: string
  youtube?: string
  tiktok?: string
  twitter?: string
  image_url?: string
  is_active: boolean
  is_premium: boolean
  is_promoted: boolean
  view_count: number
  exposure_count: number
  created_at: string
  updated_at: string
  tags?: string[]
}

export interface NewsArticle {
  id: number
  title: string
  content: string
  summary?: string
  category: string
  source_url?: string
  image_url?: string
  is_published: boolean
  is_breaking: boolean
  view_count: number
  published_at?: string
  created_at: string
  updated_at: string
  tags?: string[]
  language?: string
  translated_title?: string
  translated_content?: string
  translated_summary?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  icon?: string
  color?: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Tag {
  id: number
  name: string
  description?: string
  color?: string
  is_active: boolean
  usage_count: number
  created_at: string
}
