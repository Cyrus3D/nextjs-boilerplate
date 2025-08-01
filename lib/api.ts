import {
  supabase,
  safeSupabaseOperation,
  type BusinessCard,
  type NewsArticle,
  type Category,
  type Tag,
} from "./supabase"

// Business Cards API
export async function getBusinessCards(limit = 20, offset = 0): Promise<BusinessCard[]> {
  const { data, error } = await safeSupabaseOperation(() =>
    supabase
      .from("business_cards")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1),
  )

  if (error || !data) {
    console.warn("Failed to load business cards from database, using fallback data")
    return getFallbackBusinessCards()
  }

  return data
}

export async function searchBusinessCards(query: string, category?: string): Promise<BusinessCard[]> {
  let queryBuilder = supabase.from("business_cards").select("*").eq("is_active", true)

  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
  }

  if (category) {
    queryBuilder = queryBuilder.eq("category", category)
  }

  const { data, error } = await safeSupabaseOperation(() =>
    queryBuilder.order("created_at", { ascending: false }).limit(50),
  )

  if (error || !data) {
    console.warn("Failed to search business cards, using fallback data")
    return getFallbackBusinessCards().filter(
      (card) =>
        !query ||
        card.title.toLowerCase().includes(query.toLowerCase()) ||
        card.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  return data
}

export async function getBusinessCardById(id: string): Promise<BusinessCard | null> {
  const { data, error } = await safeSupabaseOperation(() =>
    supabase.from("business_cards").select("*").eq("id", id).eq("is_active", true).single(),
  )

  if (error || !data) {
    return null
  }

  // Increment view count
  await incrementViewCount(id, "business_card")

  return data
}

// News Articles API
export async function getNewsArticles(limit = 20, offset = 0): Promise<NewsArticle[]> {
  const { data, error } = await safeSupabaseOperation(() =>
    supabase
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1),
  )

  if (error || !data) {
    console.warn("Failed to load news articles from database, using fallback data")
    return getFallbackNewsArticles()
  }

  return data
}

export async function searchNewsArticles(query: string, category?: string): Promise<NewsArticle[]> {
  let queryBuilder = supabase.from("news_articles").select("*").eq("is_published", true)

  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
  }

  if (category) {
    queryBuilder = queryBuilder.eq("category", category)
  }

  const { data, error } = await safeSupabaseOperation(() =>
    queryBuilder.order("published_at", { ascending: false }).limit(50),
  )

  if (error || !data) {
    console.warn("Failed to search news articles, using fallback data")
    return getFallbackNewsArticles().filter(
      (article) =>
        !query ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase()),
    )
  }

  return data
}

export async function getNewsArticleById(id: string): Promise<NewsArticle | null> {
  const { data, error } = await safeSupabaseOperation(() =>
    supabase.from("news_articles").select("*").eq("id", id).eq("is_published", true).single(),
  )

  if (error || !data) {
    return null
  }

  // Increment view count
  await incrementViewCount(id, "news_article")

  return data
}

// Categories API
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await safeSupabaseOperation(() =>
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
  )

  if (error || !data) {
    return getFallbackCategories()
  }

  return data
}

// Tags API
export async function getTags(): Promise<Tag[]> {
  const { data, error } = await safeSupabaseOperation(() =>
    supabase.from("tags").select("*").eq("is_active", true).order("usage_count", { ascending: false }).limit(50),
  )

  if (error || !data) {
    return getFallbackTags()
  }

  return data
}

// Statistics API
export async function getStatistics() {
  const stats = {
    totalBusinessCards: 0,
    totalNewsArticles: 0,
    totalCategories: 0,
    totalTags: 0,
    premiumBusinessCards: 0,
    breakingNews: 0,
  }

  try {
    // Business cards stats
    const { data: businessCardsData } = await safeSupabaseOperation(() =>
      supabase.from("business_cards").select("is_premium").eq("is_active", true),
    )

    if (businessCardsData) {
      stats.totalBusinessCards = businessCardsData.length
      stats.premiumBusinessCards = businessCardsData.filter((card) => card.is_premium).length
    }

    // News articles stats
    const { data: newsData } = await safeSupabaseOperation(() =>
      supabase.from("news_articles").select("is_breaking").eq("is_published", true),
    )

    if (newsData) {
      stats.totalNewsArticles = newsData.length
      stats.breakingNews = newsData.filter((article) => article.is_breaking).length
    }

    // Categories stats
    const { data: categoriesData } = await safeSupabaseOperation(() =>
      supabase.from("categories").select("id").eq("is_active", true),
    )

    if (categoriesData) {
      stats.totalCategories = categoriesData.length
    }

    // Tags stats
    const { data: tagsData } = await safeSupabaseOperation(() =>
      supabase.from("tags").select("id").eq("is_active", true),
    )

    if (tagsData) {
      stats.totalTags = tagsData.length
    }
  } catch (error) {
    console.error("Error getting statistics:", error)
  }

  return stats
}

// Utility functions
export async function incrementViewCount(id: string, type: "business_card" | "news_article") {
  try {
    if (type === "business_card") {
      await supabase.rpc("increment_view_count", { card_id: id })
    } else {
      await supabase.rpc("increment_news_view_count", { article_id: id })
    }
  } catch (error) {
    console.error("Error incrementing view count:", error)
  }
}

export async function incrementExposureCount(id: string) {
  try {
    await supabase.rpc("increment_exposure_count", { card_id: id })
  } catch (error) {
    console.error("Error incrementing exposure count:", error)
  }
}

// Fallback data functions
function getFallbackBusinessCards(): BusinessCard[] {
  return [
    {
      id: "1",
      title: "방콕 한식당",
      description: "정통 한식을 맛볼 수 있는 방콕 최고의 한식당입니다.",
      category: "음식점",
      tags: ["한식", "방콕", "맛집"],
      phone: "02-123-4567",
      address: "방콕 시내",
      website: "https://example.com",
      is_active: true,
      is_premium: false,
      is_promoted: false,
      view_count: 0,
      exposure_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}

function getFallbackNewsArticles(): NewsArticle[] {
  return [
    {
      id: "1",
      title: "태국 최신 뉴스",
      content: "태국에서 일어나는 최신 소식을 전해드립니다.",
      summary: "태국 최신 소식",
      category: "일반",
      tags: ["태국", "뉴스"],
      is_published: true,
      is_breaking: false,
      view_count: 0,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}

function getFallbackCategories(): Category[] {
  return [
    {
      id: "1",
      name: "음식점",
      description: "한식, 중식, 일식 등 다양한 음식점",
      icon: "🍽️",
      color: "#ff6b6b",
      is_active: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "서비스",
      description: "각종 생활 서비스",
      icon: "🛠️",
      color: "#4ecdc4",
      is_active: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
    },
  ]
}

function getFallbackTags(): Tag[] {
  return [
    {
      id: "1",
      name: "한식",
      description: "한국 음식",
      color: "#ff6b6b",
      is_active: true,
      usage_count: 10,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "방콕",
      description: "방콕 지역",
      color: "#4ecdc4",
      is_active: true,
      usage_count: 15,
      created_at: new Date().toISOString(),
    },
  ]
}
