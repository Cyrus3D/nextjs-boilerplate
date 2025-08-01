import { supabase } from "./supabase"
import type { BusinessCard } from "../types/business-card"
import type { NewsArticle } from "../types/news"

// Business Cards API
export async function getBusinessCards(
  category?: string,
  searchTerm?: string,
  limit = 20,
  offset = 0,
): Promise<BusinessCard[]> {
  try {
    let query = supabase
      .from("business_cards")
      .select("*")
      .order("is_premium", { ascending: false })
      .order("exposure_level", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching business cards:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching business cards:", error)
    return []
  }
}

export async function getBusinessCard(id: number): Promise<BusinessCard | null> {
  try {
    const { data, error } = await supabase.from("business_cards").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching business card:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching business card:", error)
    return null
  }
}

export async function incrementBusinessCardViews(id: number): Promise<void> {
  try {
    await supabase.rpc("increment_view_count", { card_id: id })
  } catch (error) {
    console.error("Error incrementing view count:", error)
  }
}

// News Articles API
export async function getNewsArticles(
  category?: string,
  searchTerm?: string,
  limit = 20,
  offset = 0,
  isBreaking?: boolean,
): Promise<NewsArticle[]> {
  try {
    let query = supabase
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .order("is_breaking", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%`)
    }

    if (isBreaking !== undefined) {
      query = query.eq("is_breaking", isBreaking)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching news articles:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching news articles:", error)
    return []
  }
}

export async function getNewsArticle(id: number): Promise<NewsArticle | null> {
  try {
    const { data, error } = await supabase.from("news_articles").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching news article:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching news article:", error)
    return null
  }
}

export async function incrementNewsViews(id: number): Promise<void> {
  try {
    await supabase.rpc("increment_news_view_count", { article_id: id })
  } catch (error) {
    console.error("Error incrementing news view count:", error)
  }
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  return getNewsArticles(undefined, undefined, 5, 0, true)
}

// Categories API
export async function getCategories(type: "business" | "news"): Promise<Array<{ id: number; name: string }>> {
  try {
    const { data, error } = await supabase.from("categories").select("id, name").eq("type", type).order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Statistics API
export async function getStatistics(): Promise<{
  totalNews: number
  totalBusinesses: number
  totalBreaking: number
  totalPremium: number
}> {
  try {
    const [newsResult, businessResult, breakingResult, premiumResult] = await Promise.all([
      supabase.from("news_articles").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("business_cards").select("id", { count: "exact", head: true }),
      supabase
        .from("news_articles")
        .select("id", { count: "exact", head: true })
        .eq("is_breaking", true)
        .eq("is_published", true),
      supabase.from("business_cards").select("id", { count: "exact", head: true }).eq("is_premium", true),
    ])

    return {
      totalNews: newsResult.count || 0,
      totalBusinesses: businessResult.count || 0,
      totalBreaking: breakingResult.count || 0,
      totalPremium: premiumResult.count || 0,
    }
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return {
      totalNews: 0,
      totalBusinesses: 0,
      totalBreaking: 0,
      totalPremium: 0,
    }
  }
}
