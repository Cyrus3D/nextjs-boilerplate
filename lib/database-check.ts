import { supabase, isSupabaseConfigured } from "./supabase"

export interface DatabaseStatus {
  isConfigured: boolean
  isConnected: boolean
  lastChecked: Date
  tables: TableStatus[]
  functions: FunctionStatus[]
  error?: string
}

export interface TableStatus {
  name: string
  exists: boolean
  recordCount: number
  error?: string
}

export interface FunctionStatus {
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
  defaultValue: string | null
}

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

  try {
    // Test basic connection
    const { data, error } = await supabase!.from("business_cards").select("count", { count: "exact", head: true })

    if (error) {
      status.error = `Connection failed: ${error.message}`
      return status
    }

    status.isConnected = true

    // Check tables
    const tableNames = ["business_cards", "news_articles", "categories", "tags", "business_card_tags"]

    for (const tableName of tableNames) {
      const tableStatus = await checkTableStatus(tableName)
      status.tables.push(tableStatus)
    }

    // Check functions
    const functionNames = ["increment_view_count", "increment_news_view_count"]

    for (const functionName of functionNames) {
      const functionStatus = await checkFunctionStatus(functionName)
      status.functions.push(functionStatus)
    }
  } catch (error) {
    status.error = `Database check failed: ${error}`
  }

  return status
}

async function checkTableStatus(tableName: string): Promise<TableStatus> {
  try {
    const { count, error } = await supabase!.from(tableName).select("*", { count: "exact", head: true })

    if (error) {
      return {
        name: tableName,
        exists: false,
        recordCount: 0,
        error: error.message,
      }
    }

    return {
      name: tableName,
      exists: true,
      recordCount: count || 0,
    }
  } catch (error) {
    return {
      name: tableName,
      exists: false,
      recordCount: 0,
      error: String(error),
    }
  }
}

async function checkFunctionStatus(functionName: string): Promise<FunctionStatus> {
  try {
    // Try to get function information from pg_proc
    const { data, error } = await supabase!.rpc("check_function_exists", { function_name: functionName })

    if (error) {
      // If the check function doesn't exist, assume the function doesn't exist
      return {
        name: functionName,
        exists: false,
        error: error.message,
      }
    }

    return {
      name: functionName,
      exists: !!data,
    }
  } catch (error) {
    return {
      name: functionName,
      exists: false,
      error: String(error),
    }
  }
}

export async function getSchemaInfo(): Promise<SchemaInfo[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const { data, error } = await supabase!.rpc("get_table_schema")

    if (error) {
      console.error("Failed to get schema info:", error)
      return []
    }

    // Group columns by table name
    const schemaMap = new Map<string, ColumnInfo[]>()

    data?.forEach((row: any) => {
      if (!schemaMap.has(row.table_name)) {
        schemaMap.set(row.table_name, [])
      }

      schemaMap.get(row.table_name)!.push({
        name: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === "YES",
        defaultValue: row.column_default,
      })
    })

    return Array.from(schemaMap.entries()).map(([tableName, columns]) => ({
      tableName,
      columns,
    }))
  } catch (error) {
    console.error("Failed to get schema info:", error)
    return []
  }
}
