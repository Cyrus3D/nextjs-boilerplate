import { supabase } from "./supabase"

export interface DatabaseStatus {
  connected: boolean
  tables: {
    business_cards: number
    news_articles: number
    categories: number
    tags: number
  }
  functions: {
    increment_view_count: boolean
    increment_exposure_count: boolean
  }
  error?: string
}

export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
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
    },
  }

  try {
    // Test connection
    const { error: connectionError } = await supabase.from("business_cards").select("count(*)").limit(1)

    if (connectionError) {
      status.error = connectionError.message
      return status
    }

    status.connected = true

    // Count records in each table
    const tables = ["business_cards", "news_articles", "categories", "tags"]

    for (const table of tables) {
      try {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

        if (!error && count !== null) {
          status.tables[table as keyof typeof status.tables] = count
        }
      } catch (error) {
        console.error(`Error counting ${table}:`, error)
      }
    }

    // Check if functions exist
    try {
      const { data: functions } = await supabase
        .rpc("increment_view_count", { card_id: "test" })
        .then(() => ({ data: true }))
        .catch(() => ({ data: false }))

      status.functions.increment_view_count = !!functions
    } catch {
      status.functions.increment_view_count = false
    }

    try {
      const { data: functions } = await supabase
        .rpc("increment_exposure_count", { card_id: "test" })
        .then(() => ({ data: true }))
        .catch(() => ({ data: false }))

      status.functions.increment_exposure_count = !!functions
    } catch {
      status.functions.increment_exposure_count = false
    }
  } catch (error) {
    status.error = error instanceof Error ? error.message : "Unknown error"
  }

  return status
}

export async function getTableInfo(tableName: string) {
  try {
    const { data, error } = await supabase.from(tableName).select("*").limit(5)

    if (error) {
      return { error: error.message, data: null }
    }

    return { data, error: null }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    }
  }
}
