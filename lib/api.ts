import { supabase } from "./supabase"

export interface BusinessCard {
  id: number
  title: string
  description: string
  category_id: number
  categories?: {
    id: number
    name: string
    color_class: string
  }
  location?: string | null
  phone?: string | null
  kakao_id?: string | null
  line_id?: string | null
  website?: string | null
  hours?: string | null
  price?: string | null
  promotion?: string | null
  image_url?: string | null
  facebook_url?: string | null
  instagram_url?: string | null
  tiktok_url?: string | null
  threads_url?: string | null
  youtube_url?: string | null
  is_promoted: boolean
  is_active: boolean
  is_premium: boolean
  premium_expires_at?: string | null
  exposure_count: number
  last_exposed_at?: string | null
  exposure_weight: number
  view_count: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  color_class: string
  created_at: string
}

export interface Tag {
  id: number
  name: string
  created_at: string
}

// 비즈니스 카드 목록 가져오기
export async function getBusinessCards(
  options: {
    limit?: number
    offset?: number
    category?: string
    search?: string
    sortBy?: "created_at" | "updated_at" | "title" | "exposure_count"
    sortOrder?: "asc" | "desc"
  } = {},
) {
  try {
    const { limit = 20, offset = 0, category, search, sortBy = "created_at", sortOrder = "desc" } = options

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

    // 카테고리 필터
    if (category && category !== "all") {
      query = query.eq("category_id", Number(category))
    }

    // 검색 필터
    if (search && search.trim()) {
      const searchTerm = String(search).trim()
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }

    // 정렬
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    // 페이지네이션
    if (limit > 0) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching business cards:", error)
      return { data: [], error: error.message }
    }

    // 안전한 데이터 변환
    const safeData = (data || []).map((card) => ({
      id: Number(card.id),
      title: String(card.title || ""),
      description: String(card.description || ""),
      category_id: Number(card.category_id),
      categories: card.categories || null,
      location: card.location ? String(card.location) : null,
      phone: card.phone ? String(card.phone) : null,
      kakao_id: card.kakao_id ? String(card.kakao_id) : null,
      line_id: card.line_id ? String(card.line_id) : null,
      website: card.website ? String(card.website) : null,
      hours: card.hours ? String(card.hours) : null,
      price: card.price ? String(card.price) : null,
      promotion: card.promotion ? String(card.promotion) : null,
      image_url: card.image_url ? String(card.image_url) : null,
      facebook_url: card.facebook_url ? String(card.facebook_url) : null,
      instagram_url: card.instagram_url ? String(card.instagram_url) : null,
      tiktok_url: card.tiktok_url ? String(card.tiktok_url) : null,
      threads_url: card.threads_url ? String(card.threads_url) : null,
      youtube_url: card.youtube_url ? String(card.youtube_url) : null,
      is_promoted: Boolean(card.is_promoted),
      is_active: Boolean(card.is_active),
      is_premium: Boolean(card.is_premium),
      premium_expires_at: card.premium_expires_at ? String(card.premium_expires_at) : null,
      exposure_count: Number(card.exposure_count) || 0,
      last_exposed_at: card.last_exposed_at ? String(card.last_exposed_at) : null,
      exposure_weight: Number(card.exposure_weight) || 1.0,
      view_count: Number(card.view_count) || 0,
      created_at: String(card.created_at),
      updated_at: String(card.updated_at),
    }))

    return { data: safeData, error: null }
  } catch (error) {
    console.error("Error in getBusinessCards:", error)
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// 카테고리 목록 가져오기
export async function getCategories() {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return { data: [], error: error.message }
    }

    const safeData = (data || []).map((category) => ({
      id: Number(category.id),
      name: String(category.name),
      color_class: String(category.color_class || "bg-gray-100 text-gray-800"),
      created_at: String(category.created_at),
    }))

    return { data: safeData, error: null }
  } catch (error) {
    console.error("Error in getCategories:", error)
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// 태그 목록 가져오기
export async function getTags() {
  try {
    const { data, error } = await supabase.from("tags").select("*").order("name")

    if (error) {
      console.error("Error fetching tags:", error)
      return { data: [], error: error.message }
    }

    const safeData = (data || []).map((tag) => ({
      id: Number(tag.id),
      name: String(tag.name),
      created_at: String(tag.created_at),
    }))

    return { data: safeData, error: null }
  } catch (error) {
    console.error("Error in getTags:", error)
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// 비즈니스 카드 조회수 증가
export async function incrementViewCount(cardId: number) {
  try {
    const id = Number(cardId)

    const { error } = await supabase
      .from("business_cards")
      .update({
        view_count: supabase.raw("view_count + 1"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error incrementing view count:", error)
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    console.error("Error in incrementViewCount:", error)
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// 노출 통계 가져오기
export async function getExposureStats() {
  try {
    const { data, error } = await supabase.from("business_cards").select("exposure_count, exposure_weight, is_premium")

    if (error) {
      console.error("Error fetching exposure stats:", error)
      return {
        totalExposures: 0,
        averageExposures: 0,
        migrationNeeded: true,
        error: error.message,
      }
    }

    const cards = data || []
    const totalExposures = cards.reduce((sum, card) => sum + (Number(card.exposure_count) || 0), 0)
    const averageExposures = cards.length > 0 ? Math.round(totalExposures / cards.length) : 0

    return {
      totalExposures,
      averageExposures,
      migrationNeeded: false,
      error: null,
    }
  } catch (error) {
    console.error("Error in getExposureStats:", error)
    return {
      totalExposures: 0,
      averageExposures: 0,
      migrationNeeded: true,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// 프리미엄 카드 만료 확인
export async function checkExpiredPremiumCards() {
  try {
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from("business_cards")
      .update({
        is_premium: false,
        premium_expires_at: null,
        updated_at: now,
      })
      .lt("premium_expires_at", now)
      .eq("is_premium", true)
      .select("id, title")

    if (error) {
      console.error("Error checking expired premium cards:", error)
      return { expiredCount: 0, error: error.message }
    }

    return {
      expiredCount: (data || []).length,
      expiredCards: data || [],
      error: null,
    }
  } catch (error) {
    console.error("Error in checkExpiredPremiumCards:", error)
    return {
      expiredCount: 0,
      expiredCards: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
