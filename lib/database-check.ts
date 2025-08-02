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
      const [businessCards, newsArticles, categories, tags] = await Promise.allSettled([
        supabase.from("business_cards").select("*", { count: "exact", head: true }),
        supabase.from("news_articles").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("tags").select("*", { count: "exact", head: true }),
      ])

      if (businessCards.status === "fulfilled" && businessCards.value.count !== null) {
        status.tables.business_cards = businessCards.value.count
      }
      if (newsArticles.status === "fulfilled" && newsArticles.value.count !== null) {
        status.tables.news_articles = newsArticles.value.count
      }
      if (categories.status === "fulfilled" && categories.value.count !== null) {
        status.tables.categories = categories.value.count
      }
      if (tags.status === "fulfilled" && tags.value.count !== null) {
        status.tables.tags = tags.value.count
      }

      // Check functions
      const functionChecks = await Promise.allSettled([
        supabase.rpc("increment_view_count", { card_id: "test" }),
        supabase.rpc("increment_exposure_count", { card_id: "test" }),
        supabase.rpc("increment_news_view_count", { article_id: "test" }),
      ])

      // Functions exist if they return an error about the ID not existing, not about function not found
      status.functions.increment_view_count =
        functionChecks[0].status === "fulfilled" ||
        (functionChecks[0].status === "rejected" &&
          !functionChecks[0].reason?.message?.includes("Could not find the function"))

      status.functions.increment_exposure_count =
        functionChecks[1].status === "fulfilled" ||
        (functionChecks[1].status === "rejected" &&
          !functionChecks[1].reason?.message?.includes("Could not find the function"))

      status.functions.increment_news_view_count =
        functionChecks[2].status === "fulfilled" ||
        (functionChecks[2].status === "rejected" &&
          !functionChecks[2].reason?.message?.includes("Could not find the function"))
    }
  } catch (error) {
    console.error("Database status check failed:", error)
  }

  return status
}
