import { supabase } from "./supabase"
import type { BusinessCard } from "@/types/business-card"

export async function getBusinessCards(
  category?: string,
  searchTerm?: string,
  limit = 20,
  offset = 0,
): Promise<BusinessCard[]> {
  try {
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
      .order("created_at", { ascending: false })

    if (category && category !== "전체") {
      query = query.eq("categories.name", category)
    }

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      console.error("비즈니스 카드 조회 오류:", error)
      throw error
    }

    return (data || []).map((card: any) => ({
      id: card.id,
      title: card.title,
      description: card.description,
      category: card.categories?.name || "기타",
      location: card.location,
      phone: card.phone,
      kakaoId: card.kakao_id,
      lineId: card.line_id,
      website: card.website,
      hours: card.hours,
      price: card.price,
      promotion: card.promotion,
      tags: [], // 태그는 별도 조회 필요
      image: card.image_url,
      isPromoted: card.is_promoted || false,
      isPremium: card.is_premium || false,
      premiumExpiresAt: card.premium_expires_at,
      exposureCount: card.exposure_count || 0,
      lastExposedAt: card.last_exposed_at,
      exposureWeight: card.exposure_weight || 1.0,
      // 소셜 미디어 필드 추가
      facebook_url: card.facebook_url,
      instagram_url: card.instagram_url,
      tiktok_url: card.tiktok_url,
      threads_url: card.threads_url,
      youtube_url: card.youtube_url,
    }))
  } catch (error) {
    console.error("getBusinessCards 오류:", error)
    return []
  }
}

export async function getCategories() {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("카테고리 조회 오류:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("getCategories 오류:", error)
    return []
  }
}

export async function incrementViewCount(cardId: number) {
  try {
    // 현재 조회수 가져오기
    const { data: currentCard, error: fetchError } = await supabase
      .from("business_cards")
      .select("view_count")
      .eq("id", cardId)
      .single()

    if (fetchError) {
      console.error("조회수 조회 오류:", fetchError)
      return
    }

    const currentCount = currentCard?.view_count || 0

    // 조회수 증가
    const { error: updateError } = await supabase
      .from("business_cards")
      .update({
        view_count: currentCount + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cardId)

    if (updateError) {
      console.error("조회수 업데이트 오류:", updateError)
      throw updateError
    }

    return { success: true }
  } catch (error) {
    console.error("조회수 증가 중 오류:", error)
    throw error
  }
}
