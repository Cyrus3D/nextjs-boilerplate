import { supabase, isSupabaseConfigured } from "./supabase"

export interface DatabaseStatus {
  isConfigured: boolean
  isConnected: boolean
  tables: {
    business_cards: boolean
    categories: boolean
    tags: boolean
    business_card_tags: boolean
    news_articles: boolean
  }
  functions: {
    increment_view_count: boolean
    increment_news_view_count: boolean
  }
  error?: string
}

export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    isConfigured: isSupabaseConfigured(),
    isConnected: false,
    tables: {
      business_cards: false,
      categories: false,
      tags: false,
      business_card_tags: false,
      news_articles: false,
    },
    functions: {
      increment_view_count: false,
      increment_news_view_count: false,
    },
  }

  if (!status.isConfigured || !supabase) {
    status.error = "Supabase not configured. Please check environment variables."
    return status
  }

  try {
    // Test basic connection
    const { error: connectionError } = await supabase.from("business_cards").select("id").limit(1)

    if (connectionError) {
      status.error = `Connection failed: ${connectionError.message}`
      return status
    }

    status.isConnected = true

    // Check each table
    const tableChecks = await Promise.allSettled([
      supabase.from("business_cards").select("id").limit(1),
      supabase.from("categories").select("id").limit(1),
      supabase.from("tags").select("id").limit(1),
      supabase.from("business_card_tags").select("business_card_id").limit(1),
      supabase.from("news_articles").select("id").limit(1),
    ])

    status.tables.business_cards = tableChecks[0].status === "fulfilled"
    status.tables.categories = tableChecks[1].status === "fulfilled"
    status.tables.tags = tableChecks[2].status === "fulfilled"
    status.tables.business_card_tags = tableChecks[3].status === "fulfilled"
    status.tables.news_articles = tableChecks[4].status === "fulfilled"

    // Check functions
    try {
      await supabase.rpc("increment_view_count", { card_id: 999999 })
      status.functions.increment_view_count = true
    } catch {
      status.functions.increment_view_count = false
    }

    try {
      await supabase.rpc("increment_news_view_count", { article_id: 999999 })
      status.functions.increment_news_view_count = true
    } catch {
      status.functions.increment_news_view_count = false
    }
  } catch (error) {
    status.error = `Database check failed: ${error instanceof Error ? error.message : "Unknown error"}`
  }

  return status
}

export async function getTableInfo(tableName: string) {
  if (!supabase) return null

  try {
    const { data, error } = await supabase.from(tableName).select("*", { count: "exact" }).limit(0)

    if (error) throw error

    return {
      name: tableName,
      count: data?.length || 0,
      exists: true,
    }
  } catch (error) {
    return {
      name: tableName,
      count: 0,
      exists: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getSchemaInfo() {
  if (!supabase) return null

  try {
    // Get table information from information_schema
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_type", "BASE TABLE")

    if (tablesError) throw tablesError

    // Get column information for business_cards table
    const { data: columns, error: columnsError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable, column_default")
      .eq("table_name", "business_cards")
      .eq("table_schema", "public")
      .order("ordinal_position")

    if (columnsError) throw columnsError

    return {
      tables: tables?.map((t) => t.table_name) || [],
      businessCardColumns: columns || [],
    }
  } catch (error) {
    console.error("Schema info error:", error)
    return null
  }
}
