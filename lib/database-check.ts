import { supabase } from "./supabase"

export interface DatabaseStatus {
  isConnected: boolean
  tables: {
    name: string
    exists: boolean
    recordCount: number
  }[]
  functions: {
    name: string
    exists: boolean
  }[]
  error?: string
}

export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    isConnected: false,
    tables: [],
    functions: [],
  }

  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("business_cards")
      .select("count(*)")
      .limit(1)

    if (connectionError) {
      status.error = connectionError.message
      return status
    }

    status.isConnected = true

    // Check tables
    const tablesToCheck = [
      "business_cards",
      "news_articles",
      "categories",
      "tags",
      "business_card_tags",
      "news_article_tags",
    ]

    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase.from(tableName).select("*", { count: "exact", head: true })

        status.tables.push({
          name: tableName,
          exists: !error,
          recordCount: error ? 0 : data?.length || 0,
        })
      } catch {
        status.tables.push({
          name: tableName,
          exists: false,
          recordCount: 0,
        })
      }
    }

    // Check functions
    const functionsToCheck = [
      "increment_view_count",
      "increment_exposure_count",
      "get_popular_tags",
      "search_business_cards",
    ]

    for (const functionName of functionsToCheck) {
      try {
        // Try to call the function to see if it exists
        const { error } = await supabase.rpc(functionName, {})

        status.functions.push({
          name: functionName,
          exists: !error || !error.message.includes("does not exist"),
        })
      } catch {
        status.functions.push({
          name: functionName,
          exists: false,
        })
      }
    }
  } catch (error) {
    status.error = error instanceof Error ? error.message : "Unknown error"
  }

  return status
}

export async function getTableSchema(tableName: string) {
  try {
    const { data, error } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable")
      .eq("table_name", tableName)

    if (error) {
      console.error(`Error getting schema for ${tableName}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Exception getting schema for ${tableName}:`, error)
    return null
  }
}
