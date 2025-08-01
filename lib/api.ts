import { supabase } from "./supabase"
import type { BusinessCard } from "@/types/business-card"
import type { NewsArticle } from "@/types/news"

// Business Cards API
export async function getBusinessCards(limit = 50): Promise<BusinessCard[]> {
  try {
    const { data, error } = await supabase
      .from("business_cards")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

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

export async function getBusinessCardById(id: string): Promise<BusinessCard | null> {
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

export async function incrementViewCount(id: string): Promise<void> {
  try {
    const { error } = await supabase.rpc("increment_view_count", { card_id: Number.parseInt(id) })

    if (error) {
      console.error("Error incrementing view count:", error)
    }
  } catch (error) {
    console.error("Error incrementing view count:", error)
  }
}

// News Articles API
export async function getNewsArticles(limit = 50): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("isPublished", true)
      .order("publishedAt", { ascending: false })
      .limit(limit)

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

export async function getNewsArticleById(id: string): Promise<NewsArticle | null> {
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

export async function incrementNewsViewCount(id: number): Promise<void> {
  try {
    const { error } = await supabase.rpc("increment_news_view_count", { article_id: id })

    if (error) {
      console.error("Error incrementing news view count:", error)
    }
  } catch (error) {
    console.error("Error incrementing news view count:", error)
  }
}

export async function searchBusinessCards(query: string, category?: string): Promise<BusinessCard[]> {
  try {
    let queryBuilder = supabase.from("business_cards").select("*")

    if (category && category !== "all") {
      queryBuilder = queryBuilder.eq("category", category)
    }

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    const { data, error } = await queryBuilder.order("created_at", { ascending: false }).limit(100)

    if (error) {
      console.error("Error searching business cards:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error searching business cards:", error)
    return []
  }
}

export async function searchNewsArticles(query: string, category?: string): Promise<NewsArticle[]> {
  try {
    let queryBuilder = supabase.from("news_articles").select("*").eq("isPublished", true)

    if (category && category !== "all") {
      queryBuilder = queryBuilder.eq("category", category)
    }

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    }

    const { data, error } = await queryBuilder.order("publishedAt", { ascending: false }).limit(100)

    if (error) {
      console.error("Error searching news articles:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error searching news articles:", error)
    return []
  }
}
