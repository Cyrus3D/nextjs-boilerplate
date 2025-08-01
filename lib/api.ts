import { supabase } from "./supabase"
import type { BusinessCard } from "@/types/business-card"
import type { NewsArticle } from "@/types/news"

// Business Cards API
export async function getBusinessCards(): Promise<BusinessCard[]> {
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
    throw error
  }

  return data?.map(mapBusinessCardFromDB) || []
}

export async function searchBusinessCards(query: string, category?: string): Promise<BusinessCard[]> {
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
    throw error
  }

  return data?.map(mapBusinessCardFromDB) || []
}

export async function incrementViewCount(cardId: string): Promise<void> {
  const { error } = await supabase.rpc("increment_view_count", {
    card_id: Number.parseInt(cardId),
  })

  if (error) {
    console.error("Error incrementing view count:", error)
  }
}

// News Articles API
export async function getNewsArticles(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("is_published", true)
    .order("is_breaking", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Error fetching news articles:", error)
    throw error
  }

  return data?.map(mapNewsArticleFromDB) || []
}

export async function searchNewsArticles(query: string, category?: string): Promise<NewsArticle[]> {
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
    throw error
  }

  return data?.map(mapNewsArticleFromDB) || []
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("is_published", true)
    .eq("is_breaking", true)
    .order("created_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("Error fetching breaking news:", error)
    throw error
  }

  return data?.map(mapNewsArticleFromDB) || []
}

export async function incrementNewsViewCount(articleId: number): Promise<void> {
  const { error } = await supabase.rpc("increment_news_view_count", {
    article_id: articleId,
  })

  if (error) {
    console.error("Error incrementing news view count:", error)
  }
}

export async function getStatistics() {
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
    summary: dbArticle.summary,
    category: dbArticle.category,
    tags: dbArticle.tags || [],
    imageUrl: dbArticle.image_url,
    sourceUrl: dbArticle.source_url,
    author: dbArticle.author,
    isPublished: dbArticle.is_published,
    isBreaking: dbArticle.is_breaking,
    viewCount: dbArticle.view_count,
    language: dbArticle.language,
    translatedTitle: dbArticle.translated_title,
    translatedContent: dbArticle.translated_content,
    translatedSummary: dbArticle.translated_summary,
    createdAt: dbArticle.created_at,
    updatedAt: dbArticle.updated_at,
    publishedAt: dbArticle.published_at,
  }
}
