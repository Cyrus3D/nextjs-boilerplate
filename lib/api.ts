import { supabase, isSupabaseConfigured } from "./supabase"
import { sampleBusinessCards } from "../data/sample-cards"
import type { BusinessCard, Category } from "../types/business-card"
import type { NewsArticle } from "../types/news"

// Business card functions
export async function getBusinessCards(limit?: number): Promise<BusinessCard[]> {
  if (!isSupabaseConfigured() || !supabase) {
    console.log("Supabase not configured, returning sample data")
    return sampleBusinessCards.slice(0, limit)
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
      console.error("Supabase error:", error)
      return sampleBusinessCards.slice(0, limit)
    }

    const cards = (data || []).map((card) => ({
      id: card.id,
      title: card.title,
      description: card.description,
      category: card.categories?.name || "Unknown",
      location: card.location,
      phone: card.phone,
      kakaoId: card.kakao_id,
      lineId: card.line_id,
      website: card.website,
      hours: card.hours,
      price: card.price,
      promotion: card.promotion,
      tags: [], // Tags would need separate query
      image: card.image_url,
      isPromoted: card.is_promoted || false,
      isPremium: card.is_premium || false,
      premiumExpiresAt: card.premium_expires_at,
      exposureCount: card.exposure_count || 0,
      lastExposedAt: card.last_exposed_at,
      exposureWeight: card.exposure_weight || 1.0,
      facebookUrl: card.facebook_url,
      instagramUrl: card.instagram_url,
      tiktokUrl: card.tiktok_url,
      threadsUrl: card.threads_url,
      youtubeUrl: card.youtube_url,
      created_at: card.created_at,
    }))

    return cards
  } catch (error) {
    console.error("Error fetching business cards:", error)
    return sampleBusinessCards.slice(0, limit)
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [
      { id: 1, name: "음식점", color_class: "bg-red-100 text-red-800" },
      { id: 2, name: "서비스", color_class: "bg-blue-100 text-blue-800" },
      { id: 3, name: "쇼핑", color_class: "bg-green-100 text-green-800" },
    ]
  }

  try {
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
  if (!isSupabaseConfigured() || !supabase) {
    return
  }

  try {
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

// News functions
export async function getNewsArticles(limit?: number): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured() || !supabase) {
    console.log("Supabase not configured, returning empty array")
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

    return (
      data?.map((article) => ({
        id: article.id.toString(),
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        tags: article.tags || [],
        publishedAt: article.published_at,
        imageUrl: article.image_url,
        sourceUrl: article.source_url,
        viewCount: article.view_count || 0,
        readTime: article.read_time || 5,
        isBreaking: article.is_breaking || false,
        isPremium: false,
        status: "published",
      })) || []
    )
  } catch (error) {
    console.error("Error in getNewsArticles:", error)
    return []
  }
}

export async function getNewsArticlesByCategory(category: string, limit?: number): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    let query = supabase
      .from("news_articles")
      .select("*")
      .eq("category", category)
      .eq("is_published", true)
      .order("published_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching news articles by category:", error)
      return []
    }

    return (
      data?.map((article) => ({
        id: article.id.toString(),
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        tags: article.tags || [],
        publishedAt: article.published_at,
        imageUrl: article.image_url,
        sourceUrl: article.source_url,
        viewCount: article.view_count || 0,
        readTime: article.read_time || 5,
        isBreaking: article.is_breaking || false,
        isPremium: false,
        status: "published",
      })) || []
    )
  } catch (error) {
    console.error("Error in getNewsArticlesByCategory:", error)
    return []
  }
}

export async function incrementNewsViewCount(articleId: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    return
  }

  try {
    const { error } = await supabase.rpc("increment_news_view_count", {
      article_id: Number.parseInt(articleId),
    })

    if (error) {
      console.error("Error incrementing news view count:", error)
    }
  } catch (error) {
    console.error("Error in incrementNewsViewCount:", error)
  }
}

export async function searchBusinessCards(query: string): Promise<BusinessCard[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return sampleBusinessCards.filter(
      (card) =>
        card.title.toLowerCase().includes(query.toLowerCase()) ||
        card.description.toLowerCase().includes(query.toLowerCase()) ||
        card.category.toLowerCase().includes(query.toLowerCase()),
    )
  }

  try {
    const { data, error } = await supabase
      .from("business_cards")
      .select(`
        *,
        categories (
          id,
          name,
          color_class
        )
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error searching business cards:", error)
      return []
    }

    return (
      data?.map((card) => ({
        id: card.id,
        title: card.title,
        description: card.description,
        category: card.categories?.name || "Unknown",
        location: card.location,
        phone: card.phone,
        kakaoId: card.kakao_id,
        lineId: card.line_id,
        website: card.website,
        hours: card.hours,
        price: card.price,
        promotion: card.promotion,
        tags: [],
        image: card.image_url,
        isPromoted: card.is_promoted || false,
        isPremium: card.is_premium || false,
        premiumExpiresAt: card.premium_expires_at,
        exposureCount: card.exposure_count || 0,
        lastExposedAt: card.last_exposed_at,
        exposureWeight: card.exposure_weight || 1.0,
        facebookUrl: card.facebook_url,
        instagramUrl: card.instagram_url,
        tiktokUrl: card.tiktok_url,
        threadsUrl: card.threads_url,
        youtubeUrl: card.youtube_url,
        created_at: card.created_at,
      })) || []
    )
  } catch (error) {
    console.error("Error in searchBusinessCards:", error)
    return []
  }
}

export async function searchNewsArticles(query: string): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .eq("is_published", true)
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error searching news articles:", error)
      return []
    }

    return (
      data?.map((article) => ({
        id: article.id.toString(),
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        tags: article.tags || [],
        publishedAt: article.published_at,
        imageUrl: article.image_url,
        sourceUrl: article.source_url,
        viewCount: article.view_count || 0,
        readTime: article.read_time || 5,
        isBreaking: article.is_breaking || false,
        isPremium: false,
        status: "published",
      })) || []
    )
  } catch (error) {
    console.error("Error in searchNewsArticles:", error)
    return []
  }
}
