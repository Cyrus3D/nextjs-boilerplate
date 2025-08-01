import { supabase, isSupabaseConfigured } from "./supabase"

export interface DatabaseStatus {
  isConfigured: boolean
  isConnected: boolean
  lastChecked: string
  tables: {
    [key: string]: {
      exists: boolean
      rowCount?: number
      error?: string
    }
  }
  functions: {
    [key: string]: {
      exists: boolean
      error?: string
    }
  }
}

export interface TableTestResults {
  businessCards: {
    success: boolean
    count?: number
    error?: string
  }
  newsArticles: {
    success: boolean
    count?: number
    error?: string
  }
  categories: {
    success: boolean
    count?: number
    error?: string
  }
}

export interface TableSchema {
  [tableName: string]: {
    columns: Array<{
      column_name: string
      data_type: string
      is_nullable: string
      column_default: string | null
    }>
    error?: string
  }
}

export async function checkDatabaseConnection(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    isConfigured: isSupabaseConfigured(),
    isConnected: false,
    lastChecked: new Date().toISOString(),
    tables: {},
    functions: {},
  }

  if (!status.isConfigured) {
    return status
  }

  try {
    // Test basic connection
    const { data, error } = await supabase!.from("business_cards").select("count", { count: "exact", head: true })

    if (error && !error.message.includes('relation "business_cards" does not exist')) {
      throw error
    }

    status.isConnected = true

    // Check each table
    const tables = ["business_cards", "news_articles", "categories", "tags", "business_card_tags"]

    for (const tableName of tables) {
      try {
        const { count, error: tableError } = await supabase!.from(tableName).select("*", { count: "exact", head: true })

        if (tableError) {
          status.tables[tableName] = {
            exists: false,
            error: tableError.message,
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
          error: err instanceof Error ? err.message : "Unknown error",
        }
      }
    }

    // Check functions
    const functions = ["increment_view_count", "increment_news_view_count"]

    for (const functionName of functions) {
      try {
        const { error: funcError } = await supabase!.rpc(functionName, {
          [functionName === "increment_view_count" ? "card_id" : "article_id"]: -1,
        })

        if (funcError && funcError.message.includes("function") && funcError.message.includes("does not exist")) {
          status.functions[functionName] = {
            exists: false,
            error: "Function does not exist",
          }
        } else {
          status.functions[functionName] = {
            exists: true,
          }
        }
      } catch (err) {
        status.functions[functionName] = {
          exists: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }
      }
    }
  } catch (error) {
    status.isConnected = false
    console.error("Database connection failed:", error)
  }

  return status
}

export async function testTableQueries(): Promise<TableTestResults> {
  const results: TableTestResults = {
    businessCards: { success: false },
    newsArticles: { success: false },
    categories: { success: false },
  }

  if (!isSupabaseConfigured()) {
    return {
      businessCards: { success: false, error: "Supabase not configured" },
      newsArticles: { success: false, error: "Supabase not configured" },
      categories: { success: false, error: "Supabase not configured" },
    }
  }

  try {
    // Test business_cards query
    const { error: businessError, count: businessCount } = await supabase!
      .from("business_cards")
      .select("*", { count: "exact" })
      .limit(1)

    if (businessError) {
      results.businessCards = {
        success: false,
        error: businessError.message,
      }
    } else {
      results.businessCards = {
        success: true,
        count: businessCount || 0,
      }
    }
  } catch (err) {
    results.businessCards = {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    }
  }

  try {
    // Test news_articles query
    const { error: newsError, count: newsCount } = await supabase!
      .from("news_articles")
      .select("*", { count: "exact" })
      .limit(1)

    if (newsError) {
      results.newsArticles = {
        success: false,
        error: newsError.message,
      }
    } else {
      results.newsArticles = {
        success: true,
        count: newsCount || 0,
      }
    }
  } catch (err) {
    results.newsArticles = {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    }
  }

  try {
    // Test categories query
    const { error: categoriesError, count: categoriesCount } = await supabase!
      .from("categories")
      .select("*", { count: "exact" })
      .limit(1)

    if (categoriesError) {
      results.categories = {
        success: false,
        error: categoriesError.message,
      }
    } else {
      results.categories = {
        success: true,
        count: categoriesCount || 0,
      }
    }
  } catch (err) {
    results.categories = {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    }
  }

  return results
}

export async function getTableSchemas(): Promise<TableSchema> {
  const schemas: TableSchema = {}
  const tables = ["business_cards", "news_articles", "categories", "tags", "business_card_tags"]

  if (!isSupabaseConfigured()) {
    for (const tableName of tables) {
      schemas[tableName] = {
        columns: [],
        error: "Supabase not configured",
      }
    }
    return schemas
  }

  for (const tableName of tables) {
    try {
      const { data, error } = await supabase!
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable, column_default")
        .eq("table_name", tableName)
        .eq("table_schema", "public")
        .order("ordinal_position")

      if (error) {
        schemas[tableName] = {
          columns: [],
          error: error.message,
        }
      } else {
        schemas[tableName] = {
          columns: data || [],
        }
      }
    } catch (err) {
      schemas[tableName] = {
        columns: [],
        error: err instanceof Error ? err.message : "Schema information not available",
      }
    }
  }

  return schemas
}
