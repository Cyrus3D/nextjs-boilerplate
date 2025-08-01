import { supabase, checkDatabaseStatus, type DatabaseStatus } from "./supabase"

export async function performDatabaseCheck(): Promise<DatabaseStatus> {
  return await checkDatabaseStatus()
}

export async function testDatabaseConnection(): Promise<boolean> {
  if (!supabase) return false

  try {
    const { data, error } = await supabase.from("business_cards").select("count").limit(1)
    return !error
  } catch {
    return false
  }
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
    console.error("Error getting table counts:", error)
    return {
      business_cards: 0,
      news_articles: 0,
      categories: 0,
      tags: 0,
    }
  }
}

export async function checkRequiredFunctions(): Promise<{ [key: string]: boolean }> {
  if (!supabase) {
    return {
      increment_view_count: false,
      increment_exposure_count: false,
      increment_news_view_count: false,
    }
  }

  const functions = {
    increment_view_count: false,
    increment_exposure_count: false,
    increment_news_view_count: false,
  }

  try {
    // Test each function by calling it with a test ID
    const testId = "test"

    // Test increment_view_count
    try {
      await supabase.rpc("increment_view_count", { card_id: testId })
      functions.increment_view_count = true
    } catch {
      functions.increment_view_count = false
    }

    // Test increment_exposure_count
    try {
      await supabase.rpc("increment_exposure_count", { card_id: testId })
      functions.increment_exposure_count = true
    } catch {
      functions.increment_exposure_count = false
    }

    // Test increment_news_view_count
    try {
      await supabase.rpc("increment_news_view_count", { article_id: testId })
      functions.increment_news_view_count = true
    } catch {
      functions.increment_news_view_count = false
    }
  } catch (error) {
    console.error("Error checking functions:", error)
  }

  return functions
}
