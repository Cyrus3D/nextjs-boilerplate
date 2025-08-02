import { createClient } from "@supabase/supabase-js"

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client (singleton pattern)
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

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
  tags: string[]
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
  author?: string
  source_url?: string
  image_url?: string
  tags: string[]
  is_breaking: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
  category?: string
  usage_count: number
  created_at: string
}

// Database connection check
export async function checkDatabaseConnection(): Promise<boolean> {
  if (!supabase) return false

  try {
    const { error } = await supabase.from("business_cards").select("id").limit(1)
    return !error
  } catch {
    return false
  }
}

// Safe database operation wrapper
export async function safeSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
): Promise<T | null> {
  if (!supabase) {
    console.warn("Supabase client not initialized")
    return null
  }

  try {
    const { data, error } = await operation()

    if (error) {
      console.error("Supabase operation error:", error.message)
      return null
    }

    return data
  } catch (error) {
    console.error("Supabase operation error:", error)
    return null
  }
}

// Environment check
export function getSupabaseStatus() {
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isConfigured: !!(supabaseUrl && supabaseAnonKey),
    client: !!supabase,
  }
}
