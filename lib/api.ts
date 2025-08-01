import { createClient } from "@supabase/supabase-js"
import type { BusinessCard } from "@/types/business-card"
import type { NewsArticle } from "@/types/news"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// Business card functions
export async function getBusinessCards(limit?: number): Promise<BusinessCard[]> {
  try {
    let query = supabase
      .from("business_cards")
      .select(`
        *,
        business_card_tags (
          tags (
            id,
            name
          )
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

    return (
      data?.map((card) => ({
        ...card,
        tags: card.business_card_tags?.map((bt: any) => bt.tags.name) || [],
      })) || []
    )
  } catch (error) {
    console.error("Error in getBusinessCards:", error)
    return []
  }
}

export async function getBusinessCardsByCategory(category: string, limit?: number): Promise<BusinessCard[]> {
  try {
    let query = supabase
      .from("business_cards")
      .select(`
        *,
        business_card_tags (
          tags (
            id,
            name
          )
        )
      `)
      .eq("category", category)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching business cards by category:", error)
      return []
    }

    return (
      data?.map((card) => ({
        ...card,
        tags: card.business_card_tags?.map((bt: any) => bt.tags.name) || [],
      })) || []
    )
  } catch (error) {
    console.error("Error in getBusinessCardsByCategory:", error)
    return []
  }
}

export async function incrementViewCount(cardId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc("increment_view_count", {
      card_id: Number.parseInt(cardId),
    })

    if (error) {
      console.error("Error incrementing view count:", error)
    }
  } catch (error) {
    console.error("Error in incrementViewCount:", error)
  }
}

// News functions
export async function getNewsArticles(limit?: number): Promise<NewsArticle[]> {
  try {
    let query = supabase
      .from("news_articles")
      .select(`
        *,
        news_article_tags (
          tags (
            id,
            name
          )
        )
      `)
      .eq("status", "published")
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
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        tags: article.news_article_tags?.map((nt: any) => nt.tags.name) || [],
        publishedAt: article.published_at,
        imageUrl: article.image_url,
        sourceUrl: article.source_url,
        viewCount: article.view_count || 0,
        readTime: article.read_time || 5,
        isBreaking: article.is_breaking || false,
        isPremium: article.is_premium || false,
        status: article.status,
      })) || []
    )
  } catch (error) {
    console.error("Error in getNewsArticles:", error)
    return []
  }
}

export async function getNewsArticlesByCategory(category: string, limit?: number): Promise<NewsArticle[]> {
  try {
    let query = supabase
      .from("news_articles")
      .select(`
        *,
        news_article_tags (
          tags (
            id,
            name
          )
        )
      `)
      .eq("category", category)
      .eq("status", "published")
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
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        tags: article.news_article_tags?.map((nt: any) => nt.tags.name) || [],
        publishedAt: article.published_at,
        imageUrl: article.image_url,
        sourceUrl: article.source_url,
        viewCount: article.view_count || 0,
        readTime: article.read_time || 5,
        isBreaking: article.is_breaking || false,
        isPremium: article.is_premium || false,
        status: article.status,
      })) || []
    )
  } catch (error) {
    console.error("Error in getNewsArticlesByCategory:", error)
    return []
  }
}

export async function incrementNewsViewCount(articleId: string): Promise<void> {
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
  try {
    const { data, error } = await supabase
      .from("business_cards")
      .select(`
        *,
        business_card_tags (
          tags (
            id,
            name
          )
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
        ...card,
        tags: card.business_card_tags?.map((bt: any) => bt.tags.name) || [],
      })) || []
    )
  } catch (error) {
    console.error("Error in searchBusinessCards:", error)
    return []
  }
}

export async function searchNewsArticles(query: string): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select(`
        *,
        news_article_tags (
          tags (
            id,
            name
          )
        )
      `)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .eq("status", "published")
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error searching news articles:", error)
      return []
    }

    return (
      data?.map((article) => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        category: article.category,
        tags: article.news_article_tags?.map((nt: any) => nt.tags.name) || [],
        publishedAt: article.published_at,
        imageUrl: article.image_url,
        sourceUrl: article.source_url,
        viewCount: article.view_count || 0,
        readTime: article.read_time || 5,
        isBreaking: article.is_breaking || false,
        isPremium: article.is_premium || false,
        status: article.status,
      })) || []
    )
  } catch (error) {
    console.error("Error in searchNewsArticles:", error)
    return []
  }
}
