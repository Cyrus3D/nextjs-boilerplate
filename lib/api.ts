import { supabase } from "./supabase"
import type { BusinessCard } from "../types/business-card"
import type { NewsArticle } from "../types/news"

export async function getBusinessCards(limit?: number): Promise<BusinessCard[]> {
  if (!supabase) {
    console.error("Supabase client not available")
    return []
  }

  try {
    let query = supabase
      .from("business_cards")
      .select(`
        *,
        categories (
          id,
          name,
          color_class
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching business cards:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getBusinessCards:", error)
    return []
  }
}

export async function getNewsArticles(limit?: number): Promise<NewsArticle[]> {
  if (!supabase) {
    console.error("Supabase client not available")
    return []
  }

  try {
    let query = supabase
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching news articles:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getNewsArticles:", error)
    return []
  }
}

export async function getNewsArticlesByCategory(category: string, limit?: number): Promise<NewsArticle[]> {
  if (!supabase) {
    console.error("Supabase client not available")
    return []
  }

  try {
    let query = supabase
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .eq("category", category)
      .order("published_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching news articles by category:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getNewsArticlesByCategory:", error)
    return []
  }
}

export async function incrementNewsViewCount(id: string): Promise<void> {
  if (!supabase) {
    console.error("Supabase client not available")
    return
  }

  try {
    const { error } = await supabase.rpc("increment_news_view_count", { news_id: id })

    if (error) {
      console.error("Error incrementing news view count:", error)
    }
  } catch (error) {
    console.error("Error in incrementNewsViewCount:", error)
  }
}

export async function getBusinessCardsByCategory(categoryId: number, limit?: number): Promise<BusinessCard[]> {
  if (!supabase) {
    console.error("Supabase client not available")
    return []
  }

  try {
    let query = supabase
      .from("business_cards")
      .select(`
        *,
        categories (
          id,
          name,
          color_class
        )
      `)
      .eq("is_active", true)
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching business cards by category:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getBusinessCardsByCategory:", error)
    return []
  }
}

export async function incrementViewCount(id: number): Promise<void> {
  if (!supabase) {
    console.error("Supabase client not available")
    return
  }

  try {
    const { error } = await supabase.rpc("increment_view_count", { card_id: id })

    if (error) {
      console.error("Error incrementing view count:", error)
    }
  } catch (error) {
    console.error("Error in incrementViewCount:", error)
  }
}

export async function getCategories() {
  if (!supabase) {
    console.error("Supabase client not available")
    return []
  }

  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getCategories:", error)
    return []
  }
}
