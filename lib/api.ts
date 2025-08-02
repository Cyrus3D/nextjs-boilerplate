import { supabase, safeSupabaseOperation, type BusinessCard, type NewsArticle } from "./supabase"
import { sampleCards } from "@/data/sample-cards"
import { sampleNews } from "@/data/sample-news"

// Business Cards API
export async function getBusinessCards(
  page = 1,
  limit = 12,
  category?: string,
  search?: string,
): Promise<{ cards: BusinessCard[]; total: number; hasMore: boolean }> {
  // If no Supabase connection, return sample data
  if (!supabase) {
    let filteredCards = [...sampleCards]

    if (category && category !== "all") {
      filteredCards = filteredCards.filter((card) => card.category.toLowerCase() === category.toLowerCase())
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredCards = filteredCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchLower) ||
          card.description.toLowerCase().includes(searchLower) ||
          card.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCards = filteredCards.slice(startIndex, endIndex)

    return {
      cards: paginatedCards,
      total: filteredCards.length,
      hasMore: endIndex < filteredCards.length,
    }
  }

  // Build query
  let query = supabase.from("business_cards").select("*", { count: "exact" }).order("created_at", { ascending: false })

  // Apply filters
  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Apply pagination
  const startIndex = (page - 1) * limit
  query = query.range(startIndex, startIndex + limit - 1)

  const result = await safeSupabaseOperation(async () => query)

  if (!result) {
    // Fallback to sample data
    return getBusinessCards(page, limit, category, search)
  }

  return {
    cards: result.data || [],
    total: result.count || 0,
    hasMore: (result.data?.length || 0) === limit,
  }
}

export async function getBusinessCardById(id: string): Promise<BusinessCard | null> {
  if (!supabase) {
    return sampleCards.find((card) => card.id === id) || null
  }

  return await safeSupabaseOperation(async () => {
    return await supabase!.from("business_cards").select("*").eq("id", id).single()
  })
}

export async function searchBusinessCards(query: string): Promise<BusinessCard[]> {
  if (!supabase) {
    const searchLower = query.toLowerCase()
    return sampleCards.filter(
      (card) =>
        card.title.toLowerCase().includes(searchLower) ||
        card.description.toLowerCase().includes(searchLower) ||
        card.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  const result = await safeSupabaseOperation(async () => {
    return await supabase!
      .from("business_cards")
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(20)
  })

  return result?.data || []
}

export async function incrementViewCount(id: string): Promise<void> {
  if (!supabase) return

  // Try using database function first
  const result = await safeSupabaseOperation(async () => {
    return await supabase!.rpc("increment_view_count", { card_id: id })
  })

  // If function doesn't exist, use direct update
  if (!result) {
    const currentCard = await safeSupabaseOperation(async () => {
      return await supabase!.from("business_cards").select("view_count").eq("id", id).single()
    })

    if (currentCard?.data) {
      await safeSupabaseOperation(async () => {
        return await supabase!
          .from("business_cards")
          .update({ view_count: currentCard.data.view_count + 1 })
          .eq("id", id)
      })
    }
  }
}

export async function incrementExposureCount(id: string): Promise<void> {
  if (!supabase) return

  // Try using database function first
  const result = await safeSupabaseOperation(async () => {
    return await supabase!.rpc("increment_exposure_count", { card_id: id })
  })

  // If function doesn't exist, use direct update
  if (!result) {
    const currentCard = await safeSupabaseOperation(async () => {
      return await supabase!.from("business_cards").select("exposure_count").eq("id", id).single()
    })

    if (currentCard?.data) {
      await safeSupabaseOperation(async () => {
        return await supabase!
          .from("business_cards")
          .update({ exposure_count: currentCard.data.exposure_count + 1 })
          .eq("id", id)
      })
    }
  }
}

// News Articles API
export async function getNewsArticles(
  page = 1,
  limit = 10,
  category?: string,
): Promise<{ articles: NewsArticle[]; total: number; hasMore: boolean }> {
  if (!supabase) {
    let filteredNews = [...sampleNews]

    if (category && category !== "all") {
      filteredNews = filteredNews.filter((article) => article.category.toLowerCase() === category.toLowerCase())
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNews = filteredNews.slice(startIndex, endIndex)

    return {
      articles: paginatedNews,
      total: filteredNews.length,
      hasMore: endIndex < filteredNews.length,
    }
  }

  let query = supabase.from("news_articles").select("*", { count: "exact" }).order("created_at", { ascending: false })

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  const startIndex = (page - 1) * limit
  query = query.range(startIndex, startIndex + limit - 1)

  const result = await safeSupabaseOperation(async () => query)

  if (!result) {
    return getNewsArticles(page, limit, category)
  }

  return {
    articles: result.data || [],
    total: result.count || 0,
    hasMore: (result.data?.length || 0) === limit,
  }
}

export async function getNewsArticleById(id: string): Promise<NewsArticle | null> {
  if (!supabase) {
    return sampleNews.find((article) => article.id === id) || null
  }

  return await safeSupabaseOperation(async () => {
    return await supabase!.from("news_articles").select("*").eq("id", id).single()
  })
}

export async function searchNewsArticles(query: string): Promise<NewsArticle[]> {
  if (!supabase) {
    const searchLower = query.toLowerCase()
    return sampleNews.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  const result = await safeSupabaseOperation(async () => {
    return await supabase!
      .from("news_articles")
      .select("*")
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(20)
  })

  return result?.data || []
}

export async function incrementNewsViewCount(id: string): Promise<void> {
  if (!supabase) return

  // Try using database function first
  const result = await safeSupabaseOperation(async () => {
    return await supabase!.rpc("increment_news_view_count", { article_id: id })
  })

  // If function doesn't exist, use direct update
  if (!result) {
    const currentArticle = await safeSupabaseOperation(async () => {
      return await supabase!.from("news_articles").select("view_count").eq("id", id).single()
    })

    if (currentArticle?.data) {
      await safeSupabaseOperation(async () => {
        return await supabase!
          .from("news_articles")
          .update({ view_count: currentArticle.data.view_count + 1 })
          .eq("id", id)
      })
    }
  }
}

// Categories API
export async function getCategories() {
  if (!supabase) {
    return [
      { id: "1", name: "음식점", description: "레스토랑, 카페, 바" },
      { id: "2", name: "숙박", description: "호텔, 게스트하우스, 리조트" },
      { id: "3", name: "쇼핑", description: "상점, 마켓, 쇼핑몰" },
      { id: "4", name: "서비스", description: "마사지, 미용, 수리" },
      { id: "5", name: "의료", description: "병원, 약국, 클리닉" },
      { id: "6", name: "교육", description: "학교, 학원, 과외" },
      { id: "7", name: "여행", description: "투어, 교통, 가이드" },
      { id: "8", name: "부동산", description: "임대, 매매, 중개" },
    ]
  }

  const result = await safeSupabaseOperation(async () => {
    return await supabase!.from("categories").select("*").order("name")
  })

  return result?.data || []
}

// Tags API
export async function getTags() {
  if (!supabase) {
    return [
      "한국음식",
      "태국음식",
      "일본음식",
      "중국음식",
      "양식",
      "카페",
      "바",
      "펍",
      "클럽",
      "노래방",
      "호텔",
      "게스트하우스",
      "콘도",
      "아파트",
      "빌라",
      "쇼핑몰",
      "시장",
      "편의점",
      "약국",
      "병원",
      "마사지",
      "스파",
      "미용실",
      "네일샵",
      "피부관리",
      "학교",
      "학원",
      "과외",
      "언어교환",
      "통역",
      "투어",
      "가이드",
      "렌터카",
      "택시",
      "버스",
      "부동산",
      "임대",
      "매매",
      "중개",
      "법무",
    ]
  }

  const result = await safeSupabaseOperation(async () => {
    return await supabase!.from("tags").select("*").order("usage_count", { ascending: false })
  })

  return result?.data?.map((tag) => tag.name) || []
}
