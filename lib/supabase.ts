import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabase)
}

// Safe wrapper for Supabase operations
export async function safeSupabaseOperation<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, using fallback data")
    return fallback
  }

  try {
    return await operation()
  } catch (error) {
    console.error("Supabase operation failed:", error)
    return fallback
  }
}

export type Database = {
  public: {
    Tables: {
      business_cards: {
        Row: {
          id: number
          title: string
          description: string
          category: string
          location: string | null
          phone: string | null
          website: string | null
          image: string | null
          hours: string | null
          price: string | null
          promotion: string | null
          kakao_id: string | null
          line_id: string | null
          facebook_url: string | null
          instagram_url: string | null
          youtube_url: string | null
          tiktok_url: string | null
          is_premium: boolean
          is_promoted: boolean
          is_published: boolean
          exposure_count: number | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          category: string
          location?: string | null
          phone?: string | null
          website?: string | null
          image?: string | null
          hours?: string | null
          price?: string | null
          promotion?: string | null
          kakao_id?: string | null
          line_id?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          youtube_url?: string | null
          tiktok_url?: string | null
          is_premium?: boolean
          is_promoted?: boolean
          is_published?: boolean
          exposure_count?: number | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          category?: string
          location?: string | null
          phone?: string | null
          website?: string | null
          image?: string | null
          hours?: string | null
          price?: string | null
          promotion?: string | null
          kakao_id?: string | null
          line_id?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          youtube_url?: string | null
          tiktok_url?: string | null
          is_premium?: boolean
          is_promoted?: boolean
          is_published?: boolean
          exposure_count?: number | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      news_articles: {
        Row: {
          id: number
          title: string
          content: string
          summary: string | null
          excerpt: string | null
          category: string
          tags: string[]
          image_url: string | null
          source_url: string | null
          author: string | null
          is_published: boolean
          is_breaking: boolean
          view_count: number
          read_time: number | null
          language: string
          translated_title: string | null
          translated_content: string | null
          translated_summary: string | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: number
          title: string
          content: string
          summary?: string | null
          excerpt?: string | null
          category: string
          tags?: string[]
          image_url?: string | null
          source_url?: string | null
          author?: string | null
          is_published?: boolean
          is_breaking?: boolean
          view_count?: number
          read_time?: number | null
          language?: string
          translated_title?: string | null
          translated_content?: string | null
          translated_summary?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          content?: string
          summary?: string | null
          excerpt?: string | null
          category?: string
          tags?: string[]
          image_url?: string | null
          source_url?: string | null
          author?: string | null
          is_published?: boolean
          is_breaking?: boolean
          view_count?: number
          read_time?: number | null
          language?: string
          translated_title?: string | null
          translated_content?: string | null
          translated_summary?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          color_class: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          color_class?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          color_class?: string | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      business_card_tags: {
        Row: {
          business_card_id: number
          tag_id: number
        }
        Insert: {
          business_card_id: number
          tag_id: number
        }
        Update: {
          business_card_id?: number
          tag_id?: number
        }
      }
    }
    Functions: {
      increment_view_count: {
        Args: { card_id: number }
        Returns: void
      }
      increment_news_view_count: {
        Args: { article_id: number }
        Returns: void
      }
    }
  }
}
