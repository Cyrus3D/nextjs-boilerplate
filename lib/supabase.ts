import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Create and export the Supabase client
export const supabase = isSupabaseConfigured() ? createSupabaseClient(supabaseUrl!, supabaseAnonKey!) : null

// Named export for compatibility
export const createClient = () => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Please check your environment variables.")
  }
  return createSupabaseClient(supabaseUrl!, supabaseAnonKey!)
}

// Alternative named export
export const createSupabaseClientInstance = createClient

// Default export
export default supabase
