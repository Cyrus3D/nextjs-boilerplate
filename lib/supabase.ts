import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Database {
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
          tags: string[]
          hours: string | null
          price: string | null
          promotion: string | null
          kakaoId: string | null
          lineId: string | null
          facebookUrl: string | null
          instagramUrl: string | null
          youtubeUrl: string | null
          tiktokUrl: string | null
          isPremium: boolean
          isPromoted: boolean
          exposureCount: number | null
          viewCount: number
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
          tags?: string[]
          hours?: string | null
          price?: string | null
          promotion?: string | null
          kakaoId?: string | null
          lineId?: string | null
          facebookUrl?: string | null
          instagramUrl?: string | null
          youtubeUrl?: string | null
          tiktokUrl?: string | null
          isPremium?: boolean
          isPromoted?: boolean
          exposureCount?: number | null
          viewCount?: number
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
          tags?: string[]
          hours?: string | null
          price?: string | null
          promotion?: string | null
          kakaoId?: string | null
          lineId?: string | null
          facebookUrl?: string | null
          instagramUrl?: string | null
          youtubeUrl?: string | null
          tiktokUrl?: string | null
          isPremium?: boolean
          isPromoted?: boolean
          exposureCount?: number | null
          viewCount?: number
          created_at?: string
          updated_at?: string
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
          imageUrl: string | null
          sourceUrl: string | null
          publishedAt: string
          isBreaking: boolean
          isPublished: boolean
          viewCount: number
          readTime: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          excerpt: string
          content: string
          author: string
          category: string
          tags?: string[]
          imageUrl?: string | null
          sourceUrl?: string | null
          publishedAt?: string
          isBreaking?: boolean
          isPublished?: boolean
          viewCount?: number
          readTime?: number
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
          imageUrl?: string | null
          sourceUrl?: string | null
          publishedAt?: string
          isBreaking?: boolean
          isPublished?: boolean
          viewCount?: number
          readTime?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
