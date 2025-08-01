import { supabase, type DatabaseStatus } from "./supabase"

export async function checkDatabaseConnection(): Promise<DatabaseStatus> {
  const status: DatabaseStatus = {
    connected: false,
    tables: {
      business_cards: false,
      news_articles: false,
      categories: false,
      tags: false,
    },
    functions: {
      increment_view_count: false,
      increment_exposure_count: false,
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
    // Test basic connection
    const { error: connectionError } = await supabase
      .from("business_cards")
      .select("count", { count: "exact", head: true })

    if (!connectionError) {
      status.connected = true

      // Check tables
      const tables = ["business_cards", "news_articles", "categories", "tags"]

      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select("*", { count: "exact", head: true })
          if (!error) {
            status.tables[table as keyof typeof status.tables] = true
          }
        } catch (e) {
          console.warn(`Table ${table} check failed:`, e)
        }
      }

      // Check functions
      try {
        const { error: funcError1 } = await supabase.rpc("increment_view_count", { card_id: "test" })
        if (!funcError1 || funcError1.message.includes("not found")) {
          status.functions.increment_view_count = true
        }
      } catch (e) {
        console.warn("Function increment_view_count check failed:", e)
      }

      try {
        const { error: funcError2 } = await supabase.rpc("increment_exposure_count", { card_id: "test" })
        if (!funcError2 || funcError2.message.includes("not found")) {
          status.functions.increment_exposure_count = true
        }
      } catch (e) {
        console.warn("Function increment_exposure_count check failed:", e)
      }
    }
  } catch (error) {
    console.error("Database connection check failed:", error)
  }

  return status
}

export async function getTableCounts() {
  if (!supabase) {
    return {
      business_cards: 0,
      news_articles: 0,
      categories: 0,
      tags: 0,
    }
  }

  try {
    const [businessCards, newsArticles, categories, tags] = await Promise.all([
      supabase.from("business_cards").select("*", { count: "exact", head: true }),
      supabase.from("news_articles").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("tags").select("*", { count: "exact", head: true }),
    ])

    return {
      business_cards: businessCards.count || 0,
      news_articles: newsArticles.count || 0,
      categories: categories.count || 0,
      tags: tags.count || 0,
    }
  } catch (error) {
    console.error("Failed to get table counts:", error)
    return {
      business_cards: 0,
      news_articles: 0,
      categories: 0,
      tags: 0,
    }
  }
}
