import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

export const supabase = isSupabaseConfigured() ? createClient(supabaseUrl!, supabaseAnonKey!) : null

// Named export for compatibility
export function createSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Please check your environment variables.")
  }
  return createClient(supabaseUrl!, supabaseAnonKey!)
}

// Default export
export default supabase
