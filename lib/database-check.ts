import { supabase, type DatabaseStatus } from "./supabase"

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
    environment: {
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  }

  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("business_cards")
      .select("count", { count: "exact", head: true })

    if (!connectionError) {
      status.connected = true
    }

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
    const functions = ["increment_view_count", "increment_exposure_count", "increment_news_view_count"]

    for (const func of functions) {
      try {
        const { error } = await supabase.rpc(func, { card_id: "test" })
        // If no error or specific function not found error, function exists
        status.functions[func as keyof typeof status.functions] = !error || !error.message.includes("function")
      } catch (error) {
        status.functions[func as keyof typeof status.functions] = false
      }
    }
  } catch (error) {
    console.error("Database check failed:", error)
  }

  return status
}

export async function getTableInfo() {
  const tables = ["business_cards", "news_articles", "categories", "tags"]
  const info: Record<string, any> = {}

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase.from(table).select("*", { count: "exact" }).limit(5)

      info[table] = {
        count: count || 0,
        sample: data || [],
        error: error?.message || null,
      }
    } catch (error) {
      info[table] = {
        count: 0,
        sample: [],
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  return info
}
