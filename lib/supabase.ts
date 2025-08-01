import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      business_cards: {
        Row: {
          id: number
          title: string
          description: string
          category: string
          location?: string
          phone?: string
          kakao_id?: string
          line_id?: string
          website?: string
          hours?: string
          price?: string
          promotion?: string
          image_url?: string
          is_promoted: boolean
          is_premium: boolean
          premium_expires_at?: string
          exposure_count: number
          last_exposed_at?: string
          exposure_weight: number
          facebook_url?: string
          instagram_url?: string
          tiktok_url?: string
          threads_url?: string
          youtube_url?: string
          view_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          category: string
          location?: string
          phone?: string
          kakao_id?: string
          line_id?: string
          website?: string
          hours?: string
          price?: string
          promotion?: string
          image_url?: string
          is_promoted?: boolean
          is_premium?: boolean
          premium_expires_at?: string
          exposure_count?: number
          last_exposed_at?: string
          exposure_weight?: number
          facebook_url?: string
          instagram_url?: string
          tiktok_url?: string
          threads_url?: string
          youtube_url?: string
          view_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          category?: string
          location?: string
          phone?: string
          kakao_id?: string
          line_id?: string
          website?: string
          hours?: string
          price?: string
          promotion?: string
          image_url?: string
          is_promoted?: boolean
          is_premium?: boolean
          premium_expires_at?: string
          exposure_count?: number
          last_exposed_at?: string
          exposure_weight?: number
          facebook_url?: string
          instagram_url?: string
          tiktok_url?: string
          threads_url?: string
          youtube_url?: string
          view_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      news_articles: {
        Row: {
          id: number
          title: string
          content: string
          summary?: string
          category: string
          author?: string
          source_url?: string
          image_url?: string
          is_published: boolean
          is_breaking: boolean
          view_count: number
          read_time: number
          tags: string[]
          language: string
          translated_title?: string
          translated_content?: string
          translated_summary?: string
          created_at: string
          updated_at: string
          published_at?: string
        }
        Insert: {
          id?: number
          title: string
          content: string
          summary?: string
          category: string
          author?: string
          source_url?: string
          image_url?: string
          is_published?: boolean
          is_breaking?: boolean
          view_count?: number
          read_time?: number
          tags?: string[]
          language?: string
          translated_title?: string
          translated_content?: string
          translated_summary?: string
          created_at?: string
          updated_at?: string
          published_at?: string
        }
        Update: {
          id?: number
          title?: string
          content?: string
          summary?: string
          category?: string
          author?: string
          source_url?: string
          image_url?: string
          is_published?: boolean
          is_breaking?: boolean
          view_count?: number
          read_time?: number
          tags?: string[]
          language?: string
          translated_title?: string
          translated_content?: string
          translated_summary?: string
          created_at?: string
          updated_at?: string
          published_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          description?: string
          type: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string
          type: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          type?: string
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          type: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          type: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: string
          created_at?: string
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
