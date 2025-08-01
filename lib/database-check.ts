import { supabase, isSupabaseConfigured } from "./supabase"

export interface TableStatus {
  exists: boolean
  rowCount?: number
  error?: string
}

export interface FunctionStatus {
  exists: boolean
  error?: string
}

export interface DatabaseStatus {
  isConfigured: boolean
  isConnected: boolean
  lastChecked: string
  tables: Record<string, TableStatus>
  functions: Record<string, FunctionStatus>
}

export interface TableTestResult {
  success: boolean
  count?: number
  error?: string
}

export interface TableTestResults {
  businessCards: TableTestResult
  newsArticles: TableTestResult
  categories: TableTestResult
}

export interface ColumnInfo {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

export interface TableSchemaInfo {
  columns: ColumnInfo[]
  error?: string
}

export type TableSchema = Record<string, TableSchemaInfo>

const REQUIRED_TABLES = ["business_cards", "news_articles", "categories", "tags", "business_card_tags"]

const REQUIRED_FUNCTIONS = ["increment_view_count", "increment_news_view_count"]

export async function checkDatabaseConnection(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    isConfigured: isSupabaseConfigured(),
    isConnected: false,
    lastChecked: new Date().toISOString(),
    tables: {},
    functions: {},
  }

  if (!status.isConfigured || !supabase) {
    return status
  }

  try {
    // Test basic connection
    const { error: connectionError } = await supabase.from("information_schema.tables").select("table_name").limit(1)

    if (connectionError) {
      throw connectionError
    }

    status.isConnected = true

    // Check each required table
    for (const tableName of REQUIRED_TABLES) {
      try {
        const { count, error } = await supabase.from(tableName).select("*", { count: "exact", head: true })

        if (error) {
          status.tables[tableName] = {
            exists: false,
            error: error.message,
          }
        } else {
          status.tables[tableName] = {
            exists: true,
            rowCount: count || 0,
          }
        }
      } catch (error) {
        status.tables[tableName] = {
          exists: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    // Check each required function
    for (const functionName of REQUIRED_FUNCTIONS) {
      try {
        const { data, error } = await supabase
          .from("information_schema.routines")
          .select("routine_name")
          .eq("routine_name", functionName)
          .single()

        if (error || !data) {
          status.functions[functionName] = {
            exists: false,
            error: error?.message || "Function not found",
          }
        } else {
          status.functions[functionName] = {
            exists: true,
          }
        }
      } catch (error) {
        status.functions[functionName] = {
          exists: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }
  } catch (error) {
    console.error("Database connection check failed:", error)
  }

  return status
}

export async function testTableQueries(): Promise<TableTestResults> {
  const results: TableTestResults = {
    businessCards: { success: false },
    newsArticles: { success: false },
    categories: { success: false },
  }

  if (!supabase) {
    const error = "Supabase not configured"
    results.businessCards.error = error
    results.newsArticles.error = error
    results.categories.error = error
    return results
  }

  // Test business_cards query
  try {
    const { count, error } = await supabase.from("business_cards").select("*", { count: "exact", head: true })

    if (error) {
      results.businessCards.error = error.message
    } else {
      results.businessCards.success = true
      results.businessCards.count = count || 0
    }
  } catch (error) {
    results.businessCards.error = error instanceof Error ? error.message : "Unknown error"
  }

  // Test news_articles query
  try {
    const { count, error } = await supabase.from("news_articles").select("*", { count: "exact", head: true })

    if (error) {
      results.newsArticles.error = error.message
    } else {
      results.newsArticles.success = true
      results.newsArticles.count = count || 0
    }
  } catch (error) {
    results.newsArticles.error = error instanceof Error ? error.message : "Unknown error"
  }

  // Test categories query
  try {
    const { count, error } = await supabase.from("categories").select("*", { count: "exact", head: true })

    if (error) {
      results.categories.error = error.message
    } else {
      results.categories.success = true
      results.categories.count = count || 0
    }
  } catch (error) {
    results.categories.error = error instanceof Error ? error.message : "Unknown error"
  }

  return results
}

export async function getTableSchemas(): Promise<TableSchema> {
  const schemas: TableSchema = {}

  if (!supabase) {
    for (const tableName of REQUIRED_TABLES) {
      schemas[tableName] = {
        columns: [],
        error: "Supabase not configured",
      }
    }
    return schemas
  }

  for (const tableName of REQUIRED_TABLES) {
    try {
      const { data, error } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable, column_default")
        .eq("table_name", tableName)
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
    } catch (error) {
      schemas[tableName] = {
        columns: [],
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  return schemas
}
