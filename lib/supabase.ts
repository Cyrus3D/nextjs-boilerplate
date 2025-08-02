import { createClient } from "@supabase/supabase-js"

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase 클라이언트 생성 (싱글톤 패턴)
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// 타입 정의
export interface BusinessCard {
  id: string
  title: string
  description: string
  category: string
  phone?: string
  address?: string
  website?: string
  kakao_id?: string
  line_id?: string
  facebook?: string
  instagram?: string
  youtube?: string
  tags: string[]
  view_count: number
  exposure_count: number
  is_premium: boolean
  is_promoted: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NewsArticle {
  id: string
  title: string
  content: string
  summary?: string
  category: string
  source_url?: string
  tags: string[]
  view_count: number
  is_breaking: boolean
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
}

export interface Tag {
  id: string
  name: string
  category?: string
  usage_count: number
  is_active: boolean
  created_at: string
}

// 데이터베이스 연결 상태 확인
export async function checkDatabaseConnection(): Promise<boolean> {
  if (!supabase) {
    console.warn("Supabase 클라이언트가 설정되지 않았습니다.")
    return false
  }

  try {
    const { data, error } = await supabase.from("business_cards").select("count").limit(1)

    if (error) {
      console.error("데이터베이스 연결 확인 실패:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("데이터베이스 연결 테스트 중 오류:", error)
    return false
  }
}

// 안전한 Supabase 작업 래퍼
export async function safeSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
): Promise<T | null> {
  if (!supabase) {
    console.warn("Supabase 클라이언트가 설정되지 않았습니다.")
    return null
  }

  try {
    const { data, error } = await operation()

    if (error) {
      console.error("Supabase 작업 오류:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Supabase 작업 중 예외 발생:", error)
    return null
  }
}

// 데이터베이스 상태 정보
export interface DatabaseStatus {
  isConnected: boolean
  hasData: boolean
  tablesExist: boolean
  lastChecked: string
  error?: string
}

export async function getDatabaseStatus(): Promise<DatabaseStatus> {
  const lastChecked = new Date().toISOString()

  if (!supabase) {
    return {
      isConnected: false,
      hasData: false,
      tablesExist: false,
      lastChecked,
      error: "Supabase 클라이언트가 설정되지 않았습니다.",
    }
  }

  try {
    // 테이블 존재 여부 확인
    const { data: businessCards, error: businessError } = await supabase.from("business_cards").select("count").limit(1)

    const { data: newsArticles, error: newsError } = await supabase.from("news_articles").select("count").limit(1)

    const tablesExist = !businessError && !newsError
    const isConnected = tablesExist

    // 데이터 존재 여부 확인
    let hasData = false
    if (tablesExist) {
      const { count: businessCount } = await supabase.from("business_cards").select("*", { count: "exact", head: true })

      const { count: newsCount } = await supabase.from("news_articles").select("*", { count: "exact", head: true })

      hasData = (businessCount || 0) > 0 || (newsCount || 0) > 0
    }

    return {
      isConnected,
      hasData,
      tablesExist,
      lastChecked,
      error: businessError?.message || newsError?.message,
    }
  } catch (error) {
    return {
      isConnected: false,
      hasData: false,
      tablesExist: false,
      lastChecked,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}
