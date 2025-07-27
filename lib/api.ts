import { supabase, isSupabaseConfigured } from "./supabase"
import type { BusinessCard } from "../types/business-card"
import { sampleBusinessCards } from "../data/sample-cards"

export async function getBusinessCards(): Promise<BusinessCard[]> {
  // Supabase가 설정되지 않은 경우 샘플 데이터 반환
  if (!isSupabaseConfigured() || !supabase) {
    console.warn("Supabase not configured, using sample data")
    return sampleBusinessCards
  }

  try {
    const { data, error } = await supabase
      .from("business_cards")
      .select(`
        *,
        categories (
          name,
          color_class
        ),
        business_card_tags (
          tags (
            name
          )
        )
      `)
      .eq("is_active", true)
      .order("is_promoted", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching business cards:", error)
      return sampleBusinessCards
    }

    return data.map((card) => ({
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
      tags: card.business_card_tags?.map((tag: any) => tag.tags.name) || [],
      image: card.image_url,
      rating: card.rating,
      isPromoted: card.is_promoted,
    }))
  } catch (error) {
    console.error("Failed to fetch from database:", error)
    return sampleBusinessCards
  }
}

export async function incrementViewCount(cardId: number) {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn("Supabase not configured, skipping view count increment")
    return
  }

  try {
    const { error } = await supabase
      .from("business_cards")
      .update({ view_count: supabase.raw("view_count + 1") })
      .eq("id", cardId)

    if (error) {
      console.error("Error incrementing view count:", error)
    }
  } catch (error) {
    console.error("Failed to increment view count:", error)
  }
}

export async function getCategories() {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn("Supabase not configured, returning empty categories")
    return []
  }

  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}
