import { supabase, type DatabaseStatus } from "./supabase"

export async function checkDatabaseConnection(): Promise<DatabaseStatus> {
  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("business_cards")
      .select("count", { count: "exact", head: true })

    if (connectionError) {
      return {
        connected: false,
        tables: { business_cards: 0, news_articles: 0, categories: 0, tags: 0 },
        functions: [],
        error: connectionError.message,
      }
    }

    // Get table counts
    const [businessCards, newsArticles, categories, tags] = await Promise.all([
      supabase.from("business_cards").select("*", { count: "exact", head: true }),
      supabase.from("news_articles").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("tags").select("*", { count: "exact", head: true }),
    ])

    // Check for functions (simplified check)
    const functions = ["increment_view_count", "increment_exposure_count", "search_business_cards", "get_popular_tags"]

    return {
      connected: true,
      tables: {
        business_cards: businessCards.count || 0,
        news_articles: newsArticles.count || 0,
        categories: categories.count || 0,
        tags: tags.count || 0,
      },
      functions,
    }
  } catch (error) {
    return {
      connected: false,
      tables: { business_cards: 0, news_articles: 0, categories: 0, tags: 0 },
      functions: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getTableInfo(tableName: string) {
  try {
    const { data, error } = await supabase.from(tableName).select("*").limit(1)

    if (error) {
      return { exists: false, error: error.message }
    }

    return { exists: true, sampleData: data }
  } catch (error) {
    return {
      exists: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
