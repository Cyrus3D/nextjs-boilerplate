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
      const tableStatus = await checkTable(tableName)
      status.tables.push(tableStatus)
    }

    // Check functions
    const functionNames = ["increment_view_count", "increment_news_view_count"]

    for (const functionName of functionNames) {
      const functionStatus = await checkFunction(functionName)
      status.functions.push(functionStatus)
    }
  } catch (error) {
    status.error = `Database check failed: ${error}`
  }

  return status
}

async function checkTable(tableName: string): Promise<TableStatus> {
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

async function checkFunction(functionName: string): Promise<FunctionStatus> {
  try {
    // Try to call the function with dummy parameters to see if it exists
    const { error } = await supabase!.rpc(
      functionName,
      functionName === "increment_view_count" ? { card_id: -1 } : { article_id: -1 },
    )

    // If the function exists but fails due to invalid ID, that's expected
    const exists = !error || !error.message.includes("function") || error.message.includes("does not exist")

    return {
      name: functionName,
      exists,
      error: exists ? undefined : error?.message,
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
    const { data, error } = await supabase!
      .from("information_schema.columns")
      .select("table_name, column_name, data_type, is_nullable, column_default")
      .in("table_name", ["business_cards", "news_articles", "categories", "tags", "business_card_tags"])
      .order("table_name")
      .order("ordinal_position")

    if (error) {
      console.error("Failed to fetch schema info:", error)
      return []
    }

    const schemaMap = new Map<string, ColumnInfo[]>()

    data.forEach((row: any) => {
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
