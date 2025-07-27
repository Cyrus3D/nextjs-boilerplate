import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase가 제대로 설정되었는지 확인하는 함수
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("https://") && supabaseAnonKey.length > 10)
}

// Supabase 클라이언트를 조건부로 생성
let supabaseClient: SupabaseClient | null = null

if (isSupabaseConfigured()) {
  supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!)
}

export const supabase = supabaseClient

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
          hours: string | null
          price: string | null
          promotion: string | null
          image_url: string | null
          rating: number | null
          is_promoted: boolean
          is_active: boolean
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
    }
  }
}
