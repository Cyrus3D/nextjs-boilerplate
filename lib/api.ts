import { supabase, safeSupabaseOperation } from "./supabase"
import { sampleCards } from "@/data/sample-cards"
import { sampleNews } from "@/data/sample-news"
import type { BusinessCard } from "@/types/business-card"
import type { NewsArticle } from "@/types/news"

// Business Cards API
export async function getBusinessCards(
  page = 1,
  limit = 20,
  category?: string,
  search?: string,
): Promise<{ cards: BusinessCard[]; total: number; hasMore: boolean }> {
  return safeSupabaseOperation(
    async () => {
      if (!supabase) throw new Error("Supabase not configured")

      let query = supabase.from("business_cards").select(
        `
        *,
        categories(name),
        business_card_tags(
          tags(name)
        )
      `,
        { count: "exact" },
      )

      // Apply filters
      if (category && category !== "all") {
        query = query.eq("categories.name", category)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,business_name.ilike.%${search}%`)
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      const cards =
        data?.map((card) => ({
          ...card,
          category: card.categories?.name || "uncategorized",
          tags: card.business_card_tags?.map((bt: any) => bt.tags.name) || [],
        })) || []

      return {
        cards,
        total: count || 0,
        hasMore: (count || 0) > page * limit,
      }
    },
    {
      cards: sampleCards.slice((page - 1) * limit, page * limit),
      total: sampleCards.length,
      hasMore: sampleCards.length > page * limit,
    },
  )
}

export async function getBusinessCard(id: number): Promise<BusinessCard | null> {
  return safeSupabaseOperation(
    async () => {
      if (!supabase) throw new Error("Supabase not configured")

      const { data, error } = await supabase
        .from("business_cards")
        .select(`
        *,
        categories(name),
        business_card_tags(
          tags(name)
        )
      `)
        .eq("id", id)
        .single()

      if (error) throw error

      if (!data) return null

      return {
        ...data,
        category: data.categories?.name || "uncategorized",
        tags: data.business_card_tags?.map((bt: any) => bt.tags.name) || [],
      }
    },
    sampleCards.find((card) => card.id === id) || null,
  )
}

export async function incrementViewCount(cardId: number): Promise<void> {
  return safeSupabaseOperation(async () => {
    if (!supabase) return

    const { error } = await supabase.rpc("increment_view_count", {
      card_id: cardId,
    })

    if (error) throw error
  }, undefined)
}

// News API
export async function getNewsArticles(
  page = 1,
  limit = 20,
  category?: string,
  search?: string,
): Promise<{ articles: NewsArticle[]; total: number; hasMore: boolean }> {
  return safeSupabaseOperation(
    async () => {
      if (!supabase) throw new Error("Supabase not configured")

      let query = supabase.from("news_articles").select("*", { count: "exact" })

      // Apply filters
      if (category && category !== "all") {
        query = query.eq("category", category)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,summary.ilike.%${search}%`)
      }

      // Apply pagination and ordering
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.order("published_at", { ascending: false }).range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        articles: data || [],
        total: count || 0,
        hasMore: (count || 0) > page * limit,
      }
    },
    {
      articles: sampleNews.slice((page - 1) * limit, page * limit),
      total: sampleNews.length,
      hasMore: sampleNews.length > page * limit,
    },
  )
}

export async function getNewsArticle(id: number): Promise<NewsArticle | null> {
  return safeSupabaseOperation(
    async () => {
      if (!supabase) throw new Error("Supabase not configured")

      const { data, error } = await supabase.from("news_articles").select("*").eq("id", id).single()

      if (error) throw error

      return data
    },
    sampleNews.find((article) => article.id === id) || null,
  )
}

export async function incrementNewsViewCount(articleId: number): Promise<void> {
  return safeSupabaseOperation(async () => {
    if (!supabase) return

    const { error } = await supabase.rpc("increment_news_view_count", {
      article_id: articleId,
    })

    if (error) throw error
  }, undefined)
}

// Categories API
export async function getCategories(): Promise<string[]> {
  return safeSupabaseOperation(async () => {
    if (!supabase) throw new Error("Supabase not configured")

    const { data, error } = await supabase.from("categories").select("name").order("name")

    if (error) throw error

    return data?.map((cat) => cat.name) || []
  }, ["음식점", "카페", "쇼핑", "서비스", "의료", "교육", "기타"])
}

// Search API
export async function searchAll(
  query: string,
  limit = 10,
): Promise<{
  businessCards: BusinessCard[]
  newsArticles: NewsArticle[]
}> {
  const [businessResults, newsResults] = await Promise.all([
    getBusinessCards(1, limit, undefined, query),
    getNewsArticles(1, limit, undefined, query),
  ])

  return {
    businessCards: businessResults.cards,
    newsArticles: newsResults.articles,
  }
}
