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
  columnName: string
  dataType: string
  isNullable: boolean
  defaultValue: string | null
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
    const { data, error } = await supabase.from("business_cards").select("count", { count: "exact", head: true })

    if (error && !error.message.includes("relation") && !error.message.includes("does not exist")) {
      throw error
    }

    status.isConnected = true

    // Check tables
    for (const tableName of REQUIRED_TABLES) {
      const tableStatus: TableStatus = {
        name: tableName,
        exists: false,
        recordCount: 0,
      }

      try {
        const { count, error: tableError } = await supabase.from(tableName).select("*", { count: "exact", head: true })

        if (tableError) {
          if (tableError.message.includes("relation") || tableError.message.includes("does not exist")) {
            tableStatus.exists = false
            tableStatus.error = "Table does not exist"
          } else {
            throw tableError
          }
        } else {
          tableStatus.exists = true
          tableStatus.recordCount = count || 0
        }
      } catch (error) {
        tableStatus.error = error instanceof Error ? error.message : "Unknown error"
      }

      status.tables.push(tableStatus)
    }

    // Check functions
    for (const functionName of REQUIRED_FUNCTIONS) {
      const functionStatus: FunctionStatus = {
        name: functionName,
        exists: false,
      }

      try {
        const { data, error } = await supabase.rpc(functionName, { card_id: 1 })

        if (error) {
          if (error.message.includes("function") && error.message.includes("does not exist")) {
            functionStatus.exists = false
            functionStatus.error = "Function does not exist"
          } else {
            // Function exists but might have failed due to invalid parameters
            functionStatus.exists = true
          }
        } else {
          functionStatus.exists = true
        }
      } catch (error) {
        functionStatus.error = error instanceof Error ? error.message : "Unknown error"
      }

      status.functions.push(functionStatus)
    }
  } catch (error) {
    status.error = error instanceof Error ? error.message : "Unknown connection error"
  }

  return status
}

export async function getSchemaInfo(): Promise<SchemaInfo[]> {
  if (!supabase) {
    return []
  }

  const schemaInfo: SchemaInfo[] = []

  for (const tableName of REQUIRED_TABLES) {
    try {
      const { data, error } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable, column_default")
        .eq("table_name", tableName)
        .order("ordinal_position")

      if (error) {
        console.error(`Error getting schema for ${tableName}:`, error)
        continue
      }

      if (data && data.length > 0) {
        const columns: ColumnInfo[] = data.map((col: any) => ({
          columnName: col.column_name,
          dataType: col.data_type,
          isNullable: col.is_nullable === "YES",
          defaultValue: col.column_default,
        }))

        schemaInfo.push({
          tableName,
          columns,
        })
      }
    } catch (error) {
      console.error(`Error getting schema for ${tableName}:`, error)
    }
  }

  return schemaInfo
}
