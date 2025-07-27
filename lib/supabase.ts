import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase가 제대로 설정되었는지 확인하는 함수
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Supabase 클라이언트를 조건부로 생성
export const supabase = isSupabaseConfigured() ? createSupabaseClient(supabaseUrl!, supabaseAnonKey!) : null

// createClient 함수도 직접 export
export const createClient = () => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Please check your environment variables.")
  }
  return createSupabaseClient(supabaseUrl!, supabaseAnonKey!)
}

// 타입 정의
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string
          color_class: string
          created_at: string
        }
      }
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
          map_url: string | null
          hours: string | null
          price: string | null
          promotion: string | null
          image_url: string | null
          rating: number | null
          is_promoted: boolean
          is_active: boolean
          is_premium: boolean
          premium_expires_at: string | null
          exposure_boost: number
          exposure_expires_at: string | null
          view_count: number
          created_at: string
          updated_at: string
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          created_at: string
        }
      }
      business_card_tags: {
        Row: {
          id: number
          business_card_id: number
          tag_id: number
          created_at: string
        }
      }
    }
  }
}
