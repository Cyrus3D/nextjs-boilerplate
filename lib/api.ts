import { createClient } from "@supabase/supabase-js"
import type { BusinessCard, Category } from "@/types/business-card"
import type { NewsArticle } from "@/types/news"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

// Cache for storing API responses
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }
  return null
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// News Articles API Functions
export async function getNewsArticles(limit = 50): Promise<NewsArticle[]> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning empty array")
      return []
    }

    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .order("is_breaking", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching news articles:", error)
      return []
    }

    return data.map((article: any) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content,
      category: article.category || "일반",
      tags: article.tags || [],
      author: article.author || "관리자",
      publishedAt: article.published_at,
      imageUrl: article.image_url,
      sourceUrl: article.source_url,
      readTime: article.read_time || 5,
      isBreaking: article.is_breaking || false,
      viewCount: article.view_count || 0,
      isPremium: false, // Default value since not in schema
    }))
  } catch (error) {
    console.error("Error fetching news articles:", error)
    return []
  }
}

export async function getNewsArticlesByCategory(category: string, limit = 20): Promise<NewsArticle[]> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning empty array")
      return []
    }

    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .eq("category", category)
      .order("published_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching news articles by category:", error)
      return []
    }

    return data.map((article: any) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content,
      category: article.category || "일반",
      tags: article.tags || [],
      author: article.author || "관리자",
      publishedAt: article.published_at,
      imageUrl: article.image_url,
      sourceUrl: article.source_url,
      readTime: article.read_time || 5,
      isBreaking: article.is_breaking || false,
      viewCount: article.view_count || 0,
      isPremium: false,
    }))
  } catch (error) {
    console.error("Error fetching news articles by category:", error)
    return []
  }
}

export async function incrementNewsViewCount(articleId: string | number): Promise<void> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, cannot increment view count")
      return
    }

    const { error } = await supabase.rpc("increment_news_view_count", {
      article_id: Number.parseInt(articleId.toString()),
    })

    if (error) {
      console.error("Error incrementing news view count:", error)
    }
  } catch (error) {
    console.error("Error incrementing news view count:", error)
  }
}

// Business Cards API Functions
export async function getBusinessCards(limit = 50): Promise<BusinessCard[]> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning empty array")
      return []
    }

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

export async function getBusinessCardsPaginated(
  page = 1,
  limit = 20,
  category?: string,
  search?: string,
): Promise<{ cards: BusinessCard[]; total: number; hasMore: boolean }> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning empty result")
      return { cards: [], total: 0, hasMore: false }
    }

    let query = supabase.from("business_cards").select("*", { count: "exact" })

    // Apply filters
    if (category) {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to)

    if (error) {
      console.error("Error fetching paginated business cards:", error)
      return { cards: [], total: 0, hasMore: false }
    }

    const total = count || 0
    const hasMore = to < total - 1

    return {
      cards: data || [],
      total,
      hasMore,
    }
  } catch (error) {
    console.error("Error fetching paginated business cards:", error)
    return { cards: [], total: 0, hasMore: false }
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning default categories")
      return [
        { id: 1, name: "음식점", color_class: "bg-red-100 text-red-800" },
        { id: 2, name: "서비스", color_class: "bg-blue-100 text-blue-800" },
        { id: 3, name: "쇼핑", color_class: "bg-green-100 text-green-800" },
      ]
    }

    const { data, error } = await supabase.from("categories").select("*").order("name")

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

export async function incrementViewCount(cardId: string): Promise<void> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, cannot increment view count")
      return
    }

    const { error } = await supabase.rpc("increment_view_count", {
      card_id: Number.parseInt(cardId),
    })

    if (error) {
      console.error("Error incrementing view count:", error)
    }
  } catch (error) {
    console.error("Error incrementing view count:", error)
  }
}

// Utility function to get business card by ID
export async function getBusinessCardById(id: string): Promise<BusinessCard | null> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning null")
      return null
    }

    const { data, error } = await supabase.from("business_cards").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching business card by ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching business card by ID:", error)
    return null
  }
}

// Utility function to get news article by ID
export async function getNewsArticleById(id: string): Promise<NewsArticle | null> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning null")
      return null
    }

    const { data, error } = await supabase.from("news_articles").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching news article by ID:", error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt || "",
      content: data.content,
      category: data.category || "일반",
      tags: data.tags || [],
      author: data.author || "관리자",
      publishedAt: data.published_at,
      imageUrl: data.image_url,
      sourceUrl: data.source_url,
      readTime: data.read_time || 5,
      isBreaking: data.is_breaking || false,
      viewCount: data.view_count || 0,
      isPremium: false,
    }
  } catch (error) {
    console.error("Error fetching news article by ID:", error)
    return null
  }
}
