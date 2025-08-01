import { supabase, isSupabaseConfigured } from "./supabase"

export interface DatabaseStatus {
  isConfigured: boolean
  isConnected: boolean
  tables: {
    [tableName: string]: {
      exists: boolean
      rowCount: number | null
      error?: string
    }
  }
  functions: {
    [functionName: string]: {
      exists: boolean
      error?: string
    }
  }
  lastChecked: string
}

export async function checkDatabaseConnection(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    isConfigured: isSupabaseConfigured(),
    isConnected: false,
    tables: {},
    functions: {},
    lastChecked: new Date().toISOString(),
  }

  if (!status.isConfigured) {
    console.warn("Supabase is not properly configured")
    return status
  }

  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .limit(1)

    if (connectionError) {
      console.error("Database connection failed:", connectionError)
      return status
    }

    status.isConnected = true

    // Check each required table
    const requiredTables = ["business_cards", "news_articles", "categories", "tags", "business_card_tags"]

    for (const tableName of requiredTables) {
      try {
        // Check if table exists and get row count
        const { data, error, count } = await supabase.from(tableName).select("*", { count: "exact", head: true })

        if (error) {
          status.tables[tableName] = {
            exists: false,
            rowCount: null,
            error: error.message,
          }
        } else {
          status.tables[tableName] = {
            exists: true,
            rowCount: count || 0,
          }
        }
      } catch (err) {
        status.tables[tableName] = {
          exists: false,
          rowCount: null,
          error: err instanceof Error ? err.message : "Unknown error",
        }
      }
    }

    // Check required functions
    const requiredFunctions = ["increment_view_count", "increment_news_view_count"]

    for (const functionName of requiredFunctions) {
      try {
        // Test function exists by calling it with invalid parameters
        const { error } = await supabase.rpc(functionName, {
          [functionName === "increment_view_count" ? "card_id" : "article_id"]: -1,
        })

        // If we get a specific error about the record not existing, the function exists
        if (error && (error.message.includes("not found") || error.message.includes("does not exist"))) {
          status.functions[functionName] = { exists: true }
        } else if (error && error.message.includes("function") && error.message.includes("does not exist")) {
          status.functions[functionName] = {
            exists: false,
            error: error.message,
          }
        } else {
          // Function exists and worked (or had some other error)
          status.functions[functionName] = { exists: true }
        }
      } catch (err) {
        status.functions[functionName] = {
          exists: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }
      }
    }
  } catch (error) {
    console.error("Database check failed:", error)
    status.isConnected = false
  }

  return status
}

export async function testTableQueries(): Promise<{
  businessCards: { success: boolean; count: number; error?: string }
  newsArticles: { success: boolean; count: number; error?: string }
  categories: { success: boolean; count: number; error?: string }
}> {
  const results = {
    businessCards: { success: false, count: 0 },
    newsArticles: { success: false, count: 0 },
    categories: { success: false, count: 0 },
  }

  if (!isSupabaseConfigured()) {
    const error = "Supabase not configured"
    return {
      businessCards: { ...results.businessCards, error },
      newsArticles: { ...results.newsArticles, error },
      categories: { ...results.categories, error },
    }
  }

  // Test business_cards table
  try {
    const { data, error, count } = await supabase.from("business_cards").select("id", { count: "exact" }).limit(5)

    if (error) {
      results.businessCards.error = error.message
    } else {
      results.businessCards.success = true
      results.businessCards.count = count || 0
    }
  } catch (err) {
    results.businessCards.error = err instanceof Error ? err.message : "Unknown error"
  }

  // Test news_articles table
  try {
    const { data, error, count } = await supabase.from("news_articles").select("id", { count: "exact" }).limit(5)

    if (error) {
      results.newsArticles.error = error.message
    } else {
      results.newsArticles.success = true
      results.newsArticles.count = count || 0
    }
  } catch (err) {
    results.newsArticles.error = err instanceof Error ? err.message : "Unknown error"
  }

  // Test categories table
  try {
    const { data, error, count } = await supabase.from("categories").select("id", { count: "exact" }).limit(5)

    if (error) {
      results.categories.error = error.message
    } else {
      results.categories.success = true
      results.categories.count = count || 0
    }
  } catch (err) {
    results.categories.error = err instanceof Error ? err.message : "Unknown error"
  }

  return results
}

export async function getTableSchemas(): Promise<{
  [tableName: string]: {
    columns: Array<{
      column_name: string
      data_type: string
      is_nullable: string
      column_default: string | null
    }>
    error?: string
  }
}> {
  const schemas: { [tableName: string]: any } = {}

  if (!isSupabaseConfigured()) {
    return schemas
  }

  const tables = ["business_cards", "news_articles", "categories", "tags", "business_card_tags"]

  for (const tableName of tables) {
    try {
      const { data, error } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable, column_default")
        .eq("table_name", tableName)
        .eq("table_schema", "public")
        .order("ordinal_position")

      if (error) {
        schemas[tableName] = { columns: [], error: error.message }
      } else {
        schemas[tableName] = { columns: data || [] }
      }
    } catch (err) {
      schemas[tableName] = {
        columns: [],
        error: err instanceof Error ? err.message : "Unknown error",
      }
    }
  }

  return schemas
}
