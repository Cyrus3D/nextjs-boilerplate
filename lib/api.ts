import { supabase } from "./supabase"
import type { BusinessCard } from "@/types/business-card"
import type { NewsArticle } from "@/types/news"

// News Articles API
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

    return (data || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      category: article.category,
      tags: article.tags || [],
      imageUrl: article.image_url,
      sourceUrl: article.source_url,
      publishedAt: article.published_at,
      isBreaking: article.is_breaking,
      isPublished: article.is_published,
      viewCount: article.view_count,
      readTime: article.read_time,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
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

    return (data || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      category: article.category,
      tags: article.tags || [],
      imageUrl: article.image_url,
      sourceUrl: article.source_url,
      publishedAt: article.published_at,
      isBreaking: article.is_breaking,
      isPublished: article.is_published,
      viewCount: article.view_count,
      readTime: article.read_time,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
    }))
  } catch (error) {
    console.error("Error fetching news articles by category:", error)
    return []
  }
}

export async function getNewsArticleById(id: string): Promise<NewsArticle | null> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning null")
      return null
    }

    const { data, error } = await supabase.from("news_articles").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching news article:", error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      category: data.category,
      tags: data.tags || [],
      imageUrl: data.image_url,
      sourceUrl: data.source_url,
      publishedAt: data.published_at,
      isBreaking: data.is_breaking,
      isPublished: data.is_published,
      viewCount: data.view_count,
      readTime: data.read_time,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error("Error fetching news article:", error)
    return null
  }
}

export async function incrementNewsViewCount(id: number): Promise<void> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, cannot increment view count")
      return
    }

    const { error } = await supabase.rpc("increment_news_view_count", { article_id: id })

    if (error) {
      console.error("Error incrementing news view count:", error)
    }
  } catch (error) {
    console.error("Error incrementing news view count:", error)
  }
}

export async function searchNewsArticles(query: string, category?: string): Promise<NewsArticle[]> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning empty array")
      return []
    }

    let queryBuilder = supabase.from("news_articles").select("*").eq("is_published", true)

    if (category && category !== "all") {
      queryBuilder = queryBuilder.eq("category", category)
    }

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    }

    const { data, error } = await queryBuilder.order("published_at", { ascending: false }).limit(100)

    if (error) {
      console.error("Error searching news articles:", error)
      return []
    }

    return (data || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      category: article.category,
      tags: article.tags || [],
      imageUrl: article.image_url,
      sourceUrl: article.source_url,
      publishedAt: article.published_at,
      isBreaking: article.is_breaking,
      isPublished: article.is_published,
      viewCount: article.view_count,
      readTime: article.read_time,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
    }))
  } catch (error) {
    console.error("Error searching news articles:", error)
    return []
  }
}

// Business Cards API
export async function getBusinessCards(limit = 50): Promise<BusinessCard[]> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning empty array")
      return []
    }

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
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching business cards:", error)
      return []
    }

    return (data || []).map((card: any) => ({
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
    }))
  } catch (error) {
    console.error("Error fetching business cards:", error)
    return []
  }
}

export async function getBusinessCardById(id: string): Promise<BusinessCard | null> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning null")
      return null
    }

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
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching business card:", error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.categories?.name || "Unknown",
      location: data.location,
      phone: data.phone,
      kakaoId: data.kakao_id,
      lineId: data.line_id,
      website: data.website,
      hours: data.hours,
      price: data.price,
      promotion: data.promotion,
      tags: [],
      image: data.image_url,
      isPromoted: data.is_promoted || false,
      isPremium: data.is_premium || false,
      premiumExpiresAt: data.premium_expires_at,
      exposureCount: data.exposure_count || 0,
      lastExposedAt: data.last_exposed_at,
      exposureWeight: data.exposure_weight || 1.0,
      facebookUrl: data.facebook_url,
      instagramUrl: data.instagram_url,
      tiktokUrl: data.tiktok_url,
      threadsUrl: data.threads_url,
      youtubeUrl: data.youtube_url,
      created_at: data.created_at,
    }
  } catch (error) {
    console.error("Error fetching business card:", error)
    return null
  }
}

export async function incrementViewCount(id: string): Promise<void> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, cannot increment view count")
      return
    }

    const { error } = await supabase.rpc("increment_view_count", { card_id: Number.parseInt(id) })

    if (error) {
      console.error("Error incrementing view count:", error)
    }
  } catch (error) {
    console.error("Error incrementing view count:", error)
  }
}

export async function searchBusinessCards(query: string, category?: string): Promise<BusinessCard[]> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured, returning empty array")
      return []
    }

    let queryBuilder = supabase
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

    if (category && category !== "all") {
      queryBuilder = queryBuilder.eq("category_id", category)
    }

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    const { data, error } = await queryBuilder.order("created_at", { ascending: false }).limit(100)

    if (error) {
      console.error("Error searching business cards:", error)
      return []
    }

    return (data || []).map((card: any) => ({
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
    }))
  } catch (error) {
    console.error("Error searching business cards:", error)
    return []
  }
}
