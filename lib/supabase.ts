import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      business_cards: {
        Row: {
          id: number
          title: string
          description: string
          category: string
          phone?: string
          kakao_id?: string
          line_id?: string
          website_url?: string
          image_url?: string
          is_premium: boolean
          exposure_level: number
          view_count: number
          created_at: string
          updated_at: string
          tags?: string[]
          facebook_url?: string
          instagram_url?: string
          youtube_url?: string
          twitter_url?: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          category: string
          phone?: string
          kakao_id?: string
          line_id?: string
          website_url?: string
          image_url?: string
          is_premium?: boolean
          exposure_level?: number
          view_count?: number
          created_at?: string
          updated_at?: string
          tags?: string[]
          facebook_url?: string
          instagram_url?: string
          youtube_url?: string
          twitter_url?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          category?: string
          phone?: string
          kakao_id?: string
          line_id?: string
          website_url?: string
          image_url?: string
          is_premium?: boolean
          exposure_level?: number
          view_count?: number
          created_at?: string
          updated_at?: string
          tags?: string[]
          facebook_url?: string
          instagram_url?: string
          youtube_url?: string
          twitter_url?: string
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
          created_at: string
          updated_at: string
          published_at?: string
          tags?: string[]
          language: string
          translated_title?: string
          translated_content?: string
          translated_summary?: string
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
          created_at?: string
          updated_at?: string
          published_at?: string
          tags?: string[]
          language?: string
          translated_title?: string
          translated_content?: string
          translated_summary?: string
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
          created_at?: string
          updated_at?: string
          published_at?: string
          tags?: string[]
          language?: string
          translated_title?: string
          translated_content?: string
          translated_summary?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          description?: string
          type: "business" | "news"
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string
          type: "business" | "news"
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          type?: "business" | "news"
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          type: "business" | "news"
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          type: "business" | "news"
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: "business" | "news"
          created_at?: string
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
        Returns: void
      }
      increment_news_view_count: {
        Args: {
          article_id: number
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
