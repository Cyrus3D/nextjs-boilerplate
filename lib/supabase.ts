import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

export const supabase = isSupabaseConfigured() ? createClient(supabaseUrl!, supabaseAnonKey!) : null

// 클라이언트 사이드에서 사용할 Supabase 클라이언트
export const createSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured. Please check your environment variables.")
    return null
  }

  return createClient(supabaseUrl!, supabaseAnonKey!)
}
