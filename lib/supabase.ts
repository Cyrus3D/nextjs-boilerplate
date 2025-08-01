import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
          category: string
          tags: string[]
          image_url: string | null
          source_url: string | null
          author: string | null
          is_published: boolean
          is_breaking: boolean
          view_count: number
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
          category: string
          tags?: string[]
          image_url?: string | null
          source_url?: string | null
          author?: string | null
          is_published?: boolean
          is_breaking?: boolean
          view_count?: number
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
          category?: string
          tags?: string[]
          image_url?: string | null
          source_url?: string | null
          author?: string | null
          is_published?: boolean
          is_breaking?: boolean
          view_count?: number
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
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
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
