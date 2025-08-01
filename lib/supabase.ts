import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

export const supabase = isSupabaseConfigured() ? createClient(supabaseUrl!, supabaseAnonKey!) : null

// Database Types
export interface Database {
  public: {
    Tables: {
      business_cards: {
        Row: {
          id: number
          title: string
          description: string
          category_id: number
          location: string | null
          phone: string | null
          kakao_id: string | null
          line_id: string | null
          website: string | null
          hours: string | null
          price: string | null
          promotion: string | null
          image_url: string | null
          is_promoted: boolean
          is_active: boolean
          is_premium: boolean
          premium_expires_at: string | null
          exposure_count: number
          last_exposed_at: string | null
          exposure_weight: number
          view_count: number
          facebook_url: string | null
          instagram_url: string | null
          tiktok_url: string | null
          threads_url: string | null
          youtube_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          category_id: number
          location?: string | null
          phone?: string | null
          kakao_id?: string | null
          line_id?: string | null
          website?: string | null
          hours?: string | null
          price?: string | null
          promotion?: string | null
          image_url?: string | null
          is_promoted?: boolean
          is_active?: boolean
          is_premium?: boolean
          premium_expires_at?: string | null
          exposure_count?: number
          last_exposed_at?: string | null
          exposure_weight?: number
          view_count?: number
          facebook_url?: string | null
          instagram_url?: string | null
          tiktok_url?: string | null
          threads_url?: string | null
          youtube_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          category_id?: number
          location?: string | null
          phone?: string | null
          kakao_id?: string | null
          line_id?: string | null
          website?: string | null
          hours?: string | null
          price?: string | null
          promotion?: string | null
          image_url?: string | null
          is_promoted?: boolean
          is_active?: boolean
          is_premium?: boolean
          premium_expires_at?: string | null
          exposure_count?: number
          last_exposed_at?: string | null
          exposure_weight?: number
          view_count?: number
          facebook_url?: string | null
          instagram_url?: string | null
          tiktok_url?: string | null
          threads_url?: string | null
          youtube_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          color_class: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          color_class: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          color_class?: string
          created_at?: string
        }
      }
      news_articles: {
        Row: {
          id: number
          title: string
          excerpt: string
          content: string
          author: string
          category: string
          tags: string[]
          image_url: string | null
          source_url: string | null
          published_at: string
          is_breaking: boolean
          is_published: boolean
          view_count: number
          read_time: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          excerpt: string
          content: string
          author?: string
          category?: string
          tags?: string[]
          image_url?: string | null
          source_url?: string | null
          published_at?: string
          is_breaking?: boolean
          is_published?: boolean
          view_count?: number
          read_time?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          excerpt?: string
          content?: string
          author?: string
          category?: string
          tags?: string[]
          image_url?: string | null
          source_url?: string | null
          published_at?: string
          is_breaking?: boolean
          is_published?: boolean
          view_count?: number
          read_time?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_view_count: {
        Args: {
          card_id: number
        }
        Returns: undefined
      }
      increment_news_view_count: {
        Args: {
          article_id: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type BusinessCardRow = Database["public"]["Tables"]["business_cards"]["Row"]
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"]
export type NewsArticleRow = Database["public"]["Tables"]["news_articles"]["Row"]
