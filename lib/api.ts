import { supabase, isSupabaseConfigured } from "./supabase"
import type { BusinessCard } from "@/types/business-card"
import type { NewsArticle } from "@/types/news"
import { sampleBusinessCards } from "@/data/sample-cards"
import { sampleNewsArticles } from "@/data/sample-news"

// Business Cards API
export async function getBusinessCards(): Promise<BusinessCard[]> {
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, returning sample data")
    return sampleBusinessCards
  }

  try {
    const { data, error } = await supabase
      .from("business_cards")
      .select(`
        *,
        business_card_tags (
          tags (
            name
          )
        )
      `)
      .eq("is_published", true)
      .order("is_premium", { ascending: false })
      .order("is_promoted", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching business cards:", error)
      return sampleBusinessCards
    }

    return data?.map(mapBusinessCardFromDB) || sampleBusinessCards
  } catch (error) {
    console.error("Error fetching business cards:", error)
    return sampleBusinessCards
  }
}

export async function searchBusinessCards(query: string, category?: string): Promise<BusinessCard[]> {
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, filtering sample data")
    let filtered = sampleBusinessCards

    if (category && category !== "all") {
      filtered = filtered.filter((card) => card.category === category)
    }

    if (query) {
      const searchLower = query.toLowerCase()
      filtered = filtered.filter(
        (card) =>
          card.title.toLowerCase().includes(searchLower) ||
          card.description.toLowerCase().includes(searchLower) ||
          card.location?.toLowerCase().includes(searchLower),
      )
    }

    return filtered
  }

  try {
    let queryBuilder = supabase
      .from("business_cards")
      .select(`
        *,
        business_card_tags (
          tags (
            name
          )
        )
      `)
      .eq("is_published", true)

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
    }

    if (category && category !== "all") {
      queryBuilder = queryBuilder.eq("category", category)
    }

    const { data, error } = await queryBuilder
      .order("is_premium", { ascending: false })
      .order("is_promoted", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error searching business cards:", error)
      return sampleBusinessCards
    }

    return data?.map(mapBusinessCardFromDB) || sampleBusinessCards
  } catch (error) {
    console.error("Error searching business cards:", error)
    return sampleBusinessCards
  }
}

export async function incrementViewCount(cardId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, skipping view count increment")
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

// News Articles API
export async function getNewsArticles(): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, returning sample news data")
    return sampleNewsArticles
  }

  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .order("is_breaking", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching news articles:", error)
      return sampleNewsArticles
    }

    return data?.map(mapNewsArticleFromDB) || sampleNewsArticles
  } catch (error) {
    console.error("Error fetching news articles:", error)
    return sampleNewsArticles
  }
}

export async function searchNewsArticles(query: string, category?: string): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, filtering sample news data")
    let filtered = sampleNewsArticles

    if (category && category !== "all") {
      filtered = filtered.filter((article) => article.category === category)
    }

    if (query) {
      const searchLower = query.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower) ||
          article.summary?.toLowerCase().includes(searchLower),
      )
    }

    return filtered
  }

  try {
    let queryBuilder = supabase.from("news_articles").select("*").eq("is_published", true)

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
    }

    if (category && category !== "all") {
      queryBuilder = queryBuilder.eq("category", category)
    }

    const { data, error } = await queryBuilder
      .order("is_breaking", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error searching news articles:", error)
      return sampleNewsArticles
    }

    return data?.map(mapNewsArticleFromDB) || sampleNewsArticles
  } catch (error) {
    console.error("Error searching news articles:", error)
    return sampleNewsArticles
  }
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, returning sample breaking news")
    return sampleNewsArticles.filter((article) => article.isBreaking).slice(0, 3)
  }

  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .eq("is_breaking", true)
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error("Error fetching breaking news:", error)
      return sampleNewsArticles.filter((article) => article.isBreaking).slice(0, 3)
    }

    return data?.map(mapNewsArticleFromDB) || []
  } catch (error) {
    console.error("Error fetching breaking news:", error)
    return sampleNewsArticles.filter((article) => article.isBreaking).slice(0, 3)
  }
}

export async function incrementNewsViewCount(articleId: number): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, skipping news view count increment")
    return
  }

  try {
    const { error } = await supabase.rpc("increment_news_view_count", {
      article_id: articleId,
    })

    if (error) {
      console.error("Error incrementing news view count:", error)
    }
  } catch (error) {
    console.error("Error incrementing news view count:", error)
  }
}

export async function getStatistics() {
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, returning sample statistics")
    return {
      newsCount: sampleNewsArticles.length,
      businessCount: sampleBusinessCards.length,
      breakingCount: sampleNewsArticles.filter((article) => article.isBreaking).length,
      premiumCount: sampleBusinessCards.filter((card) => card.isPremium).length,
    }
  }

  try {
    const [newsCount, businessCount, breakingCount, premiumCount] = await Promise.all([
      supabase.from("news_articles").select("id", { count: "exact" }).eq("is_published", true),
      supabase.from("business_cards").select("id", { count: "exact" }).eq("is_published", true),
      supabase.from("news_articles").select("id", { count: "exact" }).eq("is_published", true).eq("is_breaking", true),
      supabase.from("business_cards").select("id", { count: "exact" }).eq("is_published", true).eq("is_premium", true),
    ])

    return {
      newsCount: newsCount.count || 0,
      businessCount: businessCount.count || 0,
      breakingCount: breakingCount.count || 0,
      premiumCount: premiumCount.count || 0,
    }
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return {
      newsCount: 0,
      businessCount: 0,
      breakingCount: 0,
      premiumCount: 0,
    }
  }
}

// Helper functions to map database objects to frontend types
function mapBusinessCardFromDB(dbCard: any): BusinessCard {
  return {
    id: dbCard.id,
    title: dbCard.title,
    description: dbCard.description,
    category: dbCard.category,
    location: dbCard.location,
    phone: dbCard.phone,
    website: dbCard.website,
    image: dbCard.image,
    hours: dbCard.hours,
    price: dbCard.price,
    promotion: dbCard.promotion,
    kakaoId: dbCard.kakao_id,
    lineId: dbCard.line_id,
    facebookUrl: dbCard.facebook_url,
    instagramUrl: dbCard.instagram_url,
    youtubeUrl: dbCard.youtube_url,
    tiktokUrl: dbCard.tiktok_url,
    isPremium: dbCard.is_premium,
    isPromoted: dbCard.is_promoted,
    exposureCount: dbCard.exposure_count,
    viewCount: dbCard.view_count,
    tags: dbCard.business_card_tags?.map((bct: any) => bct.tags.name) || [],
    created_at: dbCard.created_at,
    updated_at: dbCard.updated_at,
  }
}

function mapNewsArticleFromDB(dbArticle: any): NewsArticle {
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    content: dbArticle.content,
    summary: dbArticle.summary || dbArticle.excerpt,
    category: dbArticle.category,
    tags: dbArticle.tags || [],
    imageUrl: dbArticle.image_url,
    sourceUrl: dbArticle.source_url,
    author: dbArticle.author || "편집부",
    isPublished: dbArticle.is_published,
    isBreaking: dbArticle.is_breaking,
    viewCount: dbArticle.view_count,
    readTime: dbArticle.read_time || 3,
    language: dbArticle.language || "ko",
    translatedTitle: dbArticle.translated_title,
    translatedContent: dbArticle.translated_content,
    translatedSummary: dbArticle.translated_summary,
    createdAt: dbArticle.created_at,
    updatedAt: dbArticle.updated_at,
    publishedAt: dbArticle.published_at || dbArticle.created_at,
  }
}
