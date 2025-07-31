import { supabase } from "./supabase"
import type { BusinessCard, Category } from "@/types/business-card"

// 비즈니스 카드 목록 가져오기
export async function getBusinessCards(): Promise<BusinessCard[]> {
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
      .eq("is_active", true)
      .order("is_premium", { ascending: false })
      .order("is_promoted", { ascending: false })
      .order("exposure_count", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching business cards:", error)
      return []
    }

    return (data || []).map((card) => ({
      id: Number(card.id),
      title: String(card.title || ""),
      description: String(card.description || ""),
      category: String(card.categories?.name || "기타"),
      location: card.location ? String(card.location) : null,
      phone: card.phone ? String(card.phone) : null,
      kakaoId: card.kakao_id ? String(card.kakao_id) : null,
      lineId: card.line_id ? String(card.line_id) : null,
      website: card.website ? String(card.website) : null,
      hours: card.hours ? String(card.hours) : null,
      price: card.price ? String(card.price) : null,
      promotion: card.promotion ? String(card.promotion) : null,
      tags: [], // Tags would need separate query
      image: card.image_url ? String(card.image_url) : null,
      isPromoted: Boolean(card.is_promoted),
      isPremium: Boolean(card.is_premium),
      premiumExpiresAt: card.premium_expires_at ? String(card.premium_expires_at) : null,
      exposureCount: Number(card.exposure_count) || 0,
      lastExposedAt: card.last_exposed_at ? String(card.last_exposed_at) : null,
      exposureWeight: Number(card.exposure_weight) || 1.0,
      facebookUrl: card.facebook_url ? String(card.facebook_url) : null,
      instagramUrl: card.instagram_url ? String(card.instagram_url) : null,
      tiktokUrl: card.tiktok_url ? String(card.tiktok_url) : null,
      threadsUrl: card.threads_url ? String(card.threads_url) : null,
      youtubeUrl: card.youtube_url ? String(card.youtube_url) : null,
    }))
  } catch (error) {
    console.error("Error in getBusinessCards:", error)
    return []
  }
}

// 카테고리별 비즈니스 카드 가져오기
export async function getBusinessCardsByCategory(categoryName: string): Promise<BusinessCard[]> {
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
      .eq("is_active", true)
      .eq("categories.name", String(categoryName))
      .order("is_premium", { ascending: false })
      .order("is_promoted", { ascending: false })
      .order("exposure_count", { ascending: false })

    if (error) {
      console.error("Error fetching cards by category:", error)
      return []
    }

    return (data || []).map((card) => ({
      id: Number(card.id),
      title: String(card.title || ""),
      description: String(card.description || ""),
      category: String(card.categories?.name || "기타"),
      location: card.location ? String(card.location) : null,
      phone: card.phone ? String(card.phone) : null,
      kakaoId: card.kakao_id ? String(card.kakao_id) : null,
      lineId: card.line_id ? String(card.line_id) : null,
      website: card.website ? String(card.website) : null,
      hours: card.hours ? String(card.hours) : null,
      price: card.price ? String(card.price) : null,
      promotion: card.promotion ? String(card.promotion) : null,
      tags: [],
      image: card.image_url ? String(card.image_url) : null,
      isPromoted: Boolean(card.is_promoted),
      isPremium: Boolean(card.is_premium),
      premiumExpiresAt: card.premium_expires_at ? String(card.premium_expires_at) : null,
      exposureCount: Number(card.exposure_count) || 0,
      lastExposedAt: card.last_exposed_at ? String(card.last_exposed_at) : null,
      exposureWeight: Number(card.exposure_weight) || 1.0,
      facebookUrl: card.facebook_url ? String(card.facebook_url) : null,
      instagramUrl: card.instagram_url ? String(card.instagram_url) : null,
      tiktokUrl: card.tiktok_url ? String(card.tiktok_url) : null,
      threadsUrl: card.threads_url ? String(card.threads_url) : null,
      youtubeUrl: card.youtube_url ? String(card.youtube_url) : null,
    }))
  } catch (error) {
    console.error("Error in getBusinessCardsByCategory:", error)
    return []
  }
}

// 검색으로 비즈니스 카드 가져오기
export async function searchBusinessCards(query: string): Promise<BusinessCard[]> {
  try {
    const searchQuery = String(query).trim()
    if (!searchQuery) return []

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
      .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .order("is_premium", { ascending: false })
      .order("is_promoted", { ascending: false })
      .order("exposure_count", { ascending: false })

    if (error) {
      console.error("Error searching business cards:", error)
      return []
    }

    return (data || []).map((card) => ({
      id: Number(card.id),
      title: String(card.title || ""),
      description: String(card.description || ""),
      category: String(card.categories?.name || "기타"),
      location: card.location ? String(card.location) : null,
      phone: card.phone ? String(card.phone) : null,
      kakaoId: card.kakao_id ? String(card.kakao_id) : null,
      lineId: card.line_id ? String(card.line_id) : null,
      website: card.website ? String(card.website) : null,
      hours: card.hours ? String(card.hours) : null,
      price: card.price ? String(card.price) : null,
      promotion: card.promotion ? String(card.promotion) : null,
      tags: [],
      image: card.image_url ? String(card.image_url) : null,
      isPromoted: Boolean(card.is_promoted),
      isPremium: Boolean(card.is_premium),
      premiumExpiresAt: card.premium_expires_at ? String(card.premium_expires_at) : null,
      exposureCount: Number(card.exposure_count) || 0,
      lastExposedAt: card.last_exposed_at ? String(card.last_exposed_at) : null,
      exposureWeight: Number(card.exposure_weight) || 1.0,
      facebookUrl: card.facebook_url ? String(card.facebook_url) : null,
      instagramUrl: card.instagram_url ? String(card.instagram_url) : null,
      tiktokUrl: card.tiktok_url ? String(card.tiktok_url) : null,
      threadsUrl: card.threads_url ? String(card.threads_url) : null,
      youtubeUrl: card.youtube_url ? String(card.youtube_url) : null,
    }))
  } catch (error) {
    console.error("Error in searchBusinessCards:", error)
    return []
  }
}

// 카테고리 목록 가져오기
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    return (data || []).map((category) => ({
      id: Number(category.id),
      name: String(category.name),
      color_class: String(category.color_class || "bg-gray-100 text-gray-800"),
    }))
  } catch (error) {
    console.error("Error in getCategories:", error)
    return []
  }
}

// 프리미엄 카드 가져오기
export async function getPremiumCards(): Promise<BusinessCard[]> {
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
      .eq("is_active", true)
      .eq("is_premium", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching premium cards:", error)
      return []
    }

    return (data || []).map((card) => ({
      id: Number(card.id),
      title: String(card.title || ""),
      description: String(card.description || ""),
      category: String(card.categories?.name || "기타"),
      location: card.location ? String(card.location) : null,
      phone: card.phone ? String(card.phone) : null,
      kakaoId: card.kakao_id ? String(card.kakao_id) : null,
      lineId: card.line_id ? String(card.line_id) : null,
      website: card.website ? String(card.website) : null,
      hours: card.hours ? String(card.hours) : null,
      price: card.price ? String(card.price) : null,
      promotion: card.promotion ? String(card.promotion) : null,
      tags: [],
      image: card.image_url ? String(card.image_url) : null,
      isPromoted: Boolean(card.is_promoted),
      isPremium: Boolean(card.is_premium),
      premiumExpiresAt: card.premium_expires_at ? String(card.premium_expires_at) : null,
      exposureCount: Number(card.exposure_count) || 0,
      lastExposedAt: card.last_exposed_at ? String(card.last_exposed_at) : null,
      exposureWeight: Number(card.exposure_weight) || 1.0,
      facebookUrl: card.facebook_url ? String(card.facebook_url) : null,
      instagramUrl: card.instagram_url ? String(card.instagram_url) : null,
      tiktokUrl: card.tiktok_url ? String(card.tiktok_url) : null,
      threadsUrl: card.threads_url ? String(card.threads_url) : null,
      youtubeUrl: card.youtube_url ? String(card.youtube_url) : null,
    }))
  } catch (error) {
    console.error("Error in getPremiumCards:", error)
    return []
  }
}

// 조회수 증가
export async function incrementViewCount(cardId: number): Promise<void> {
  try {
    const id = Number(cardId)
    const { data: currentCard } = await supabase.from("business_cards").select("view_count").eq("id", id).single()

    if (currentCard) {
      const newViewCount = Number(currentCard.view_count || 0) + 1
      await supabase.from("business_cards").update({ view_count: newViewCount }).eq("id", id)
    }
  } catch (error) {
    console.error("Error incrementing view count:", error)
  }
}

// 노출 카운트 증가
export async function incrementExposureCount(cardId: number): Promise<void> {
  try {
    const id = Number(cardId)
    const { data: currentCard } = await supabase.from("business_cards").select("exposure_count").eq("id", id).single()

    if (currentCard) {
      const newExposureCount = Number(currentCard.exposure_count || 0) + 1
      await supabase
        .from("business_cards")
        .update({
          exposure_count: newExposureCount,
          last_exposed_at: new Date().toISOString(),
        })
        .eq("id", id)
    }
  } catch (error) {
    console.error("Error incrementing exposure count:", error)
  }
}
