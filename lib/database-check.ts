import { supabase, safeSupabaseOperation } from "./supabase"

export interface DatabaseStatus {
  connected: boolean
  tablesExist: boolean
  recordCounts: {
    business_cards: number
    news_articles: number
    categories: number
    tags: number
  }
  functionsExist: {
    increment_view_count: boolean
    increment_exposure_count: boolean
    increment_news_view_count: boolean
  }
  lastChecked: string
}

export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    connected: false,
    tablesExist: false,
    recordCounts: {
      business_cards: 0,
      news_articles: 0,
      categories: 0,
      tags: 0,
    },
    functionsExist: {
      increment_view_count: false,
      increment_exposure_count: false,
      increment_news_view_count: false,
    },
    lastChecked: new Date().toISOString(),
  }

  if (!supabase) {
    return status
  }

  // Check connection
  try {
    const { error } = await supabase.from("business_cards").select("id").limit(1)
    status.connected = !error
    status.tablesExist = !error
  } catch {
    return status
  }

  if (!status.connected) {
    return status
  }

  // Check record counts
  const tables = ["business_cards", "news_articles", "categories", "tags"] as const

  for (const table of tables) {
    const result = await safeSupabaseOperation(async () => {
      return await supabase!.from(table).select("id", { count: "exact", head: true })
    })

    if (result) {
      // @ts-ignore - count is available in the result
      status.recordCounts[table] = result.count || 0
    }
  }

  // Check if functions exist
  const functions = ["increment_view_count", "increment_exposure_count", "increment_news_view_count"] as const

  for (const funcName of functions) {
    try {
      // Try to call the function with invalid parameters to see if it exists
      await supabase.rpc(funcName, { card_id: "test" })
    } catch (error: any) {
      // If function exists but fails due to invalid params, that's expected
      // If function doesn't exist, we'll get a different error
      const errorMessage = error?.message || ""
      status.functionsExist[funcName] =
        !errorMessage.includes("could not find function") && !errorMessage.includes("schema cache")
    }
  }

  return status
}

export async function testDatabaseOperations() {
  const results = {
    selectBusinessCards: false,
    selectNewsArticles: false,
    selectCategories: false,
    selectTags: false,
    insertTest: false,
    updateTest: false,
    deleteTest: false,
  }

  if (!supabase) {
    return results
  }

  // Test SELECT operations
  try {
    const { error: businessError } = await supabase.from("business_cards").select("id").limit(1)
    results.selectBusinessCards = !businessError
  } catch {}

  try {
    const { error: newsError } = await supabase.from("news_articles").select("id").limit(1)
    results.selectNewsArticles = !newsError
  } catch {}

  try {
    const { error: categoriesError } = await supabase.from("categories").select("id").limit(1)
    results.selectCategories = !categoriesError
  } catch {}

  try {
    const { error: tagsError } = await supabase.from("tags").select("id").limit(1)
    results.selectTags = !tagsError
  } catch {}

  // Test INSERT/UPDATE/DELETE (with rollback)
  try {
    const testId = `test-${Date.now()}`

    // Insert test
    const { error: insertError } = await supabase.from("business_cards").insert({
      id: testId,
      title: "Test Card",
      description: "Test Description",
      category: "Test",
      tags: ["test"],
      is_premium: false,
      is_promoted: false,
      view_count: 0,
      exposure_count: 0,
    })
    results.insertTest = !insertError

    if (results.insertTest) {
      // Update test
      const { error: updateError } = await supabase
        .from("business_cards")
        .update({ title: "Updated Test Card" })
        .eq("id", testId)
      results.updateTest = !updateError

      // Delete test (cleanup)
      const { error: deleteError } = await supabase.from("business_cards").delete().eq("id", testId)
      results.deleteTest = !deleteError
    }
  } catch {}

  return results
}
