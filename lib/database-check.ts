import { supabase, isSupabaseConfigured } from "./supabase"

export interface DatabaseStatus {
  isConfigured: boolean
  isConnected: boolean
  lastChecked: Date
  tables: TableInfo[]
  functions: FunctionInfo[]
  error?: string
}

export interface TableInfo {
  name: string
  exists: boolean
  recordCount: number
  error?: string
}

export interface FunctionInfo {
  name: string
  exists: boolean
  error?: string
}

export interface SchemaInfo {
  tableName: string
  columns: ColumnInfo[]
}

export interface ColumnInfo {
  name: string
  type: string
  nullable: boolean
  defaultValue?: string
}

const REQUIRED_TABLES = ["business_cards", "news_articles", "categories", "tags", "business_card_tags"]

const REQUIRED_FUNCTIONS = ["increment_view_count", "increment_news_view_count"]

export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    isConfigured: isSupabaseConfigured(),
    isConnected: false,
    lastChecked: new Date(),
    tables: [],
    functions: [],
  }

  if (!status.isConfigured) {
    status.error = "Supabase environment variables not configured"
    return status
  }

  if (!supabase) {
    status.error = "Supabase client not initialized"
    return status
  }

  try {
    // Test basic connection
    const { error: connectionError } = await supabase.from("business_cards").select("id").limit(1)

    if (connectionError && !connectionError.message.includes("does not exist")) {
      status.error = `Connection failed: ${connectionError.message}`
      return status
    }

    status.isConnected = true

    // Check tables
    for (const tableName of REQUIRED_TABLES) {
      const tableInfo: TableInfo = {
        name: tableName,
        exists: false,
        recordCount: 0,
      }

      try {
        const { count, error } = await supabase.from(tableName).select("*", { count: "exact", head: true })

        if (error) {
          tableInfo.error = error.message
          tableInfo.exists = !error.message.includes("does not exist")
        } else {
          tableInfo.exists = true
          tableInfo.recordCount = count || 0
        }
      } catch (err) {
        tableInfo.error = err instanceof Error ? err.message : "Unknown error"
      }

      status.tables.push(tableInfo)
    }

    // Check functions
    for (const functionName of REQUIRED_FUNCTIONS) {
      const functionInfo: FunctionInfo = {
        name: functionName,
        exists: false,
      }

      try {
        // Try to call the function with invalid parameters to test existence
        const { error } = await supabase.rpc(functionName, {})

        if (error) {
          // If error is about missing parameters, function exists
          functionInfo.exists =
            !error.message.includes("does not exist") &&
            !error.message.includes("function") &&
            !error.message.includes("not found")
          if (!functionInfo.exists) {
            functionInfo.error = error.message
          }
        } else {
          functionInfo.exists = true
        }
      } catch (err) {
        functionInfo.error = err instanceof Error ? err.message : "Unknown error"
      }

      status.functions.push(functionInfo)
    }
  } catch (error) {
    status.error = error instanceof Error ? error.message : "Unknown error"
  }

  return status
}

export async function getTableSchema(tableName: string): Promise<SchemaInfo | null> {
  if (!supabase) return null

  try {
    // Get table schema information
    const { data, error } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type, is_nullable, column_default")
      .eq("table_name", tableName)
      .order("ordinal_position")

    if (error) {
      console.error(`Error fetching schema for ${tableName}:`, error)
      return null
    }

    const columns: ColumnInfo[] =
      data?.map((col: any) => ({
        name: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable === "YES",
        defaultValue: col.column_default,
      })) || []

    return {
      tableName,
      columns,
    }
  } catch (error) {
    console.error(`Error fetching schema for ${tableName}:`, error)
    return null
  }
}
