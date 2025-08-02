import { supabase, type DatabaseStatus } from "./supabase"

export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    connected: false,
    tables: {
      business_cards: 0,
      news_articles: 0,
      categories: 0,
      tags: 0,
    },
    functions: {
      increment_view_count: false,
      increment_exposure_count: false,
      increment_news_view_count: false,
    },
    environment: {
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  }

  if (!supabase) {
    return status
  }

  try {
    // Test connection
    const { error: connectionError } = await supabase.from("business_cards").select("count").limit(1)
    status.connected = !connectionError

    if (status.connected) {
      // Check table counts
      const [businessCards, newsArticles, categories, tags] = await Promise.all([
        supabase.from("business_cards").select("*", { count: "exact", head: true }),
        supabase.from("news_articles").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("tags").select("*", { count: "exact", head: true }),
      ])

      status.tables.business_cards = businessCards.count || 0
      status.tables.news_articles = newsArticles.count || 0
      status.tables.categories = categories.count || 0
      status.tables.tags = tags.count || 0

      // Check functions (these will fail gracefully if functions don't exist)
      try {
        await supabase.rpc("increment_view_count", { card_id: "test" })
        status.functions.increment_view_count = true
      } catch {
        status.functions.increment_view_count = false
      }

      try {
        await supabase.rpc("increment_exposure_count", { card_id: "test" })
        status.functions.increment_exposure_count = true
      } catch {
        status.functions.increment_exposure_count = false
      }

      try {
        await supabase.rpc("increment_news_view_count", { article_id: "test" })
        status.functions.increment_news_view_count = true
      } catch {
        status.functions.increment_news_view_count = false
      }
    }
  } catch (error) {
    console.error("Database check failed:", error)
  }

  return status
}
