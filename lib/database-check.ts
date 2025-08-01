import { supabase, safeSupabaseOperation } from "./supabase"

export interface DatabaseStatus {
  connected: boolean
  error?: string
  tables: {
    business_cards: number
    news_articles: number
    categories: number
    tags: number
  }
  functions: {
    increment_view_count: boolean
    increment_exposure_count: boolean
    increment_news_view_count: boolean
  }
}

export async function checkDatabaseConnection(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    connected: false,
    tables: {
      business_cards: 0,
      news_articles: 0,
      categories: 0,
      tags: 0,
    },
    functions: {
      increment_view_count: false,
      increment_exposure_count: false,
      increment_news_view_count: false,
    },
  }

  try {
    // Test basic connection
    const { data, error } = await supabase.from("business_cards").select("count", { count: "exact", head: true })

    if (error) {
      status.error = error.message
      return status
    }

    status.connected = true

    // Get table counts
    const businessCardsResult = await safeSupabaseOperation(() =>
      supabase.from("business_cards").select("*", { count: "exact", head: true }),
    )
    if (businessCardsResult.success) {
      status.tables.business_cards = businessCardsResult.data?.length || 0
    }

    const newsResult = await safeSupabaseOperation(() =>
      supabase.from("news_articles").select("*", { count: "exact", head: true }),
    )
    if (newsResult.success) {
      status.tables.news_articles = newsResult.data?.length || 0
    }

    const categoriesResult = await safeSupabaseOperation(() =>
      supabase.from("categories").select("*", { count: "exact", head: true }),
    )
    if (categoriesResult.success) {
      status.tables.categories = categoriesResult.data?.length || 0
    }

    const tagsResult = await safeSupabaseOperation(() =>
      supabase.from("tags").select("*", { count: "exact", head: true }),
    )
    if (tagsResult.success) {
      status.tables.tags = tagsResult.data?.length || 0
    }

    // Check functions (simplified - just assume they exist if tables exist)
    status.functions.increment_view_count = status.tables.business_cards > 0
    status.functions.increment_exposure_count = status.tables.business_cards > 0
    status.functions.increment_news_view_count = status.tables.news_articles > 0
  } catch (err) {
    status.error = err instanceof Error ? err.message : "Unknown error"
  }

  return status
}

export async function getTableInfo(tableName: string) {
  const result = await safeSupabaseOperation(() => supabase.from(tableName).select("*").limit(1))

  return result
}

export async function getSchemaInfo() {
  try {
    const { data, error } = await supabase.rpc("get_schema_info")
    if (error) throw error
    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Failed to get schema info",
    }
  }
}
