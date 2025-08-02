import { supabase, safeSupabaseOperation } from "./supabase"
import type { BusinessCard, NewsArticle, Category, Tag } from "./supabase"
import { sampleCards } from "@/data/sample-cards"
import { sampleNews } from "@/data/sample-news"

// URL 타입 감지 함수
export function getUrlType(url: string): "business" | "news" | "unknown" {
  const normalizedUrl = url.toLowerCase()

  const newsKeywords = [
    "news",
    "뉴스",
    "기사",
    "보도",
    "언론",
    "미디어",
    "방송",
    "신문",
    "잡지",
    "저널",
    "press",
    "media",
    "breaking",
    "headline",
    "report",
    "story",
  ]

  const businessKeywords = [
    "business",
    "company",
    "shop",
    "store",
    "restaurant",
    "카페",
    "맛집",
    "업체",
    "회사",
    "상점",
    "식당",
    "서비스",
    "salon",
    "clinic",
    "hotel",
    "travel",
  ]

  for (const keyword of newsKeywords) {
    if (normalizedUrl.includes(keyword)) {
      return "news"
    }
  }

  for (const keyword of businessKeywords) {
    if (normalizedUrl.includes(keyword)) {
      return "business"
    }
  }

  return "unknown"
}

// 전화번호 포맷팅 함수
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ""

  const cleaned = phone.replace(/\D/g, "")

  if (cleaned.startsWith("66")) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  } else if (cleaned.startsWith("0")) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }

  return phone
}

// Business Cards API
export async function getBusinessCards(limit?: number): Promise<BusinessCard[]> {
  console.log("🔍 비즈니스 카드 목록을 가져오는 중...")

  if (!supabase) {
    console.warn("⚠️ Supabase 클라이언트가 초기화되지 않았습니다. 샘플 데이터를 사용합니다.")
    return limit ? sampleCards.slice(0, limit) : sampleCards
  }

  try {
    console.log("📡 데이터베이스에서 비즈니스 카드를 조회 중...")

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
      .order("exposure_weight", { ascending: false })
      .order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("❌ 데이터베이스 비즈니스 카드 조회 오류:", error.message)
      console.log("🔄 샘플 데이터로 fallback합니다.")
      return limit ? sampleCards.slice(0, limit) : sampleCards
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ 데이터베이스에 비즈니스 카드가 없습니다. 샘플 데이터를 사용합니다.")
      return limit ? sampleCards.slice(0, limit) : sampleCards
    }

    console.log(`✅ 데이터베이스에서 ${data.length}개의 비즈니스 카드를 성공적으로 가져왔습니다.`)

    // 데이터베이스 결과를 BusinessCard 형태로 변환
    const cards: BusinessCard[] = data.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      description: item.description,
      category: item.categories?.name || "기타",
      phone: item.phone || undefined,
      address: item.location || undefined,
      website: item.website || undefined,
      facebook: item.facebook_url || undefined,
      instagram: item.instagram_url || undefined,
      youtube: item.youtube_url || undefined,
      line: item.line_id || undefined,
      kakao: item.kakao_id || undefined,
      whatsapp: item.whatsapp || undefined,
      telegram: item.telegram || undefined,
      twitter: item.twitter || undefined,
      tiktok: item.tiktok_url || undefined,
      image_url: item.image_url || undefined,
      tags: [], // TODO: 태그 관계 추가 필요
      is_premium: item.is_premium || false,
      is_promoted: item.is_promoted || false,
      view_count: item.view_count || 0,
      exposure_count: item.exposure_count || 0,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    return cards
  } catch (error) {
    console.error("❌ 비즈니스 카드 조회 중 예상치 못한 오류:", error)
    console.log("🔄 샘플 데이터로 fallback합니다.")
    return limit ? sampleCards.slice(0, limit) : sampleCards
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
  if (!supabase) {
    console.warn("⚠️ Supabase 클라이언트가 없어 조회수를 증가시킬 수 없습니다.")
    return
  }

  try {
    // 직접 업데이트로 조회수 증가
    const { error } = await supabase.rpc("increment_view_count", { card_id: Number.parseInt(id) })

    if (error) {
      console.warn("⚠️ 조회수 증가 실패 (함수 없음), 직접 업데이트 시도:", error.message)

      // 함수가 없는 경우 직접 업데이트
      const { error: updateError } = await supabase
        .from("business_cards")
        .update({
          view_count: supabase.sql`view_count + 1`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", Number.parseInt(id))

      if (updateError) {
        console.error("❌ 조회수 직접 업데이트 실패:", updateError.message)
      } else {
        console.log(`✅ 카드 ID ${id}의 조회수가 증가했습니다.`)
      }
    } else {
      console.log(`✅ 카드 ID ${id}의 조회수가 증가했습니다.`)
    }
  } catch (error) {
    console.error("❌ 조회수 증가 중 오류:", error)
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
export async function getNewsArticles(limit?: number): Promise<NewsArticle[]> {
  console.log("🔍 뉴스 기사 목록을 가져오는 중...")

  if (!supabase) {
    console.warn("⚠️ Supabase 클라이언트가 초기화되지 않았습니다. 샘플 데이터를 사용합니다.")
    return limit ? sampleNews.slice(0, limit) : sampleNews
  }

  try {
    console.log("📡 데이터베이스에서 뉴스 기사를 조회 중...")

    let query = supabase
      .from("news_articles")
      .select(`
        id,
        title,
        excerpt,
        content,
        category,
        tags,
        author,
        published_at,
        read_time,
        is_breaking,
        is_published,
        image_url,
        source_url,
        original_language,
        translated,
        view_count,
        created_at,
        updated_at
      `)
      .eq("is_published", true)
      .order("published_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("❌ 데이터베이스 뉴스 조회 오류:", error.message)
      console.log("🔄 샘플 데이터로 fallback합니다.")
      return limit ? sampleNews.slice(0, limit) : sampleNews
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ 데이터베이스에 뉴스가 없습니다. 샘플 데이터를 사용합니다.")
      return limit ? sampleNews.slice(0, limit) : sampleNews
    }

    console.log(`✅ 데이터베이스에서 ${data.length}개의 뉴스를 성공적으로 가져왔습니다.`)

    // 데이터베이스 결과를 NewsArticle 형태로 변환
    const articles: NewsArticle[] = data.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      content: item.content,
      summary: item.excerpt || undefined,
      category: item.category,
      source_url: item.source_url || undefined,
      image_url: item.image_url || undefined,
      tags: Array.isArray(item.tags) ? item.tags : [],
      view_count: item.view_count || 0,
      is_breaking: item.is_breaking || false,
      is_published: item.is_published !== false,
      published_at: item.published_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    return articles
  } catch (error) {
    console.error("❌ 뉴스 조회 중 예상치 못한 오류:", error)
    console.log("🔄 샘플 데이터로 fallback합니다.")
    return limit ? sampleNews.slice(0, limit) : sampleNews
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
  if (!supabase) {
    console.warn("⚠️ Supabase 클라이언트가 없어 조회수를 증가시킬 수 없습니다.")
    return
  }

  try {
    // 직접 업데이트로 조회수 증가
    const { error } = await supabase.rpc("increment_news_view_count", { news_id: Number.parseInt(id) })

    if (error) {
      console.warn("⚠️ 뉴스 조회수 증가 실패 (함수 없음), 직접 업데이트 시도:", error.message)

      // 함수가 없는 경우 직접 업데이트
      const { error: updateError } = await supabase
        .from("news_articles")
        .update({
          view_count: supabase.sql`view_count + 1`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", Number.parseInt(id))

      if (updateError) {
        console.error("❌ 뉴스 조회수 직접 업데이트 실패:", updateError.message)
      } else {
        console.log(`✅ 뉴스 ID ${id}의 조회수가 증가했습니다.`)
      }
    } else {
      console.log(`✅ 뉴스 ID ${id}의 조회수가 증가했습니다.`)
    }
  } catch (error) {
    console.error("❌ 뉴스 조회수 증가 중 오류:", error)
  }
}

// Categories API
export async function getCategories(): Promise<Category[]> {
  if (!supabase) {
    console.warn("⚠️ Supabase 클라이언트가 초기화되지 않았습니다.")
    return []
  }

  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("❌ 카테고리 조회 오류:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error("❌ 카테고리 조회 중 예상치 못한 오류:", error)
    return []
  }
}

// Tags API
export async function getTags(): Promise<Tag[]> {
  if (!supabase) {
    console.warn("⚠️ Supabase 클라이언트가 초기화되지 않았습니다.")
    return []
  }

  try {
    const { data, error } = await supabase.from("tags").select("*").order("usage_count", { ascending: false })

    if (error) {
      console.error("❌ 태그 조회 오류:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error("❌ 태그 조회 중 예상치 못한 오류:", error)
    return []
  }
}

// 검색 함수
export async function searchCards(query: string, category?: string): Promise<BusinessCard[]> {
  if (!query.trim()) {
    return getBusinessCards()
  }

  console.log(`🔍 검색어: "${query}", 카테고리: ${category || "전체"}`)

  if (!supabase) {
    console.warn("⚠️ Supabase 클라이언트가 없어 샘플 데이터에서 검색합니다.")
    const filtered = sampleCards.filter((card) => {
      const matchQuery =
        card.title.toLowerCase().includes(query.toLowerCase()) ||
        card.description.toLowerCase().includes(query.toLowerCase())
      const matchCategory = !category || card.category === category
      return matchQuery && matchCategory
    })
    return filtered
  }

  try {
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

    // 텍스트 검색 조건 추가
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)

    // 카테고리 필터 추가
    if (category) {
      queryBuilder = queryBuilder.eq("categories.name", category)
    }

    const { data, error } = await queryBuilder.order("exposure_weight", { ascending: false })

    if (error) {
      console.error("❌ 검색 오류:", error.message)
      return []
    }

    console.log(`✅ ${data.length}개의 검색 결과를 찾았습니다.`)

    // 결과를 BusinessCard 형태로 변환
    const cards: BusinessCard[] = data.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      description: item.description,
      category: item.categories?.name || "기타",
      phone: item.phone || undefined,
      address: item.location || undefined,
      website: item.website || undefined,
      facebook: item.facebook_url || undefined,
      instagram: item.instagram_url || undefined,
      youtube: item.youtube_url || undefined,
      line: item.line_id || undefined,
      kakao: item.kakao_id || undefined,
      whatsapp: item.whatsapp || undefined,
      telegram: item.telegram || undefined,
      twitter: item.twitter || undefined,
      tiktok: item.tiktok_url || undefined,
      image_url: item.image_url || undefined,
      tags: [],
      is_premium: item.is_premium || false,
      is_promoted: item.is_promoted || false,
      view_count: item.view_count || 0,
      exposure_count: item.exposure_count || 0,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    return cards
  } catch (error) {
    console.error("❌ 검색 중 예상치 못한 오류:", error)
    return []
  }
}

// 뉴스 검색 함수
export async function searchNews(query: string, category?: string, limit?: number): Promise<NewsArticle[]> {
  if (!query.trim()) {
    return getNewsArticles(limit)
  }

  console.log(`🔍 뉴스 검색어: "${query}", 카테고리: ${category || "전체"}`)

  if (!supabase) {
    console.warn("⚠️ Supabase 클라이언트가 없어 샘플 데이터에서 검색합니다.")
    const filtered = sampleNews.filter((article) => {
      const matchQuery =
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase())
      const matchCategory = !category || article.category === category
      return matchQuery && matchCategory
    })
    return limit ? filtered.slice(0, limit) : filtered
  }

  try {
    let queryBuilder = supabase.from("news_articles").select("*").eq("is_published", true)

    // 텍스트 검색 조건 추가
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)

    // 카테고리 필터 추가
    if (category) {
      queryBuilder = queryBuilder.eq("category", category)
    }

    queryBuilder = queryBuilder.order("published_at", { ascending: false })

    if (limit) {
      queryBuilder = queryBuilder.limit(limit)
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error("❌ 뉴스 검색 오류:", error.message)
      return []
    }

    console.log(`✅ ${data.length}개의 뉴스 검색 결과를 찾았습니다.`)

    // 결과를 NewsArticle 형태로 변환
    const articles: NewsArticle[] = data.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      content: item.content,
      summary: item.excerpt || undefined,
      category: item.category,
      source_url: item.source_url || undefined,
      image_url: item.image_url || undefined,
      tags: Array.isArray(item.tags) ? item.tags : [],
      view_count: item.view_count || 0,
      is_breaking: item.is_breaking || false,
      is_published: item.is_published !== false,
      published_at: item.published_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    return articles
  } catch (error) {
    console.error("❌ 뉴스 검색 중 예상치 못한 오류:", error)
    return []
  }
}
