import { supabase, isSupabaseConfigured } from "./supabase"
import { sampleBusinessCards, sampleCategories } from "../data/sample-cards"
import { updateExposureStats } from "./card-rotation"
import type { BusinessCard, Category } from "../types/business-card"

export async function getBusinessCards(): Promise<BusinessCard[]> {
  if (!isSupabaseConfigured() || !supabase) {
    console.log("Supabase not configured, returning sample data")
    return sampleBusinessCards
  }

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
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return sampleBusinessCards
    }

    const cards = (data || []).map((card) => ({
      id: card.id,
      title: card.title,
      description: card.description,
      category: card.categories?.name || "Unknown",
      location: card.location,
      phone: card.phone,
      kakaoId: card.kakao_id,
      lineId: card.line_id,
      website: card.website,
      hours: card.hours,
      price: card.price,
      promotion: card.promotion,
      tags: [], // Tags would need separate query
      image: card.image_url,
      isPromoted: card.is_promoted || false,
      isPremium: card.is_premium || false,
      premiumExpiresAt: card.premium_expires_at,
      exposureCount: card.exposure_count || 0,
      lastExposedAt: card.last_exposed_at,
      exposureWeight: card.exposure_weight || 1.0,
    }))

    // Update exposure stats for displayed cards
    const cardIds = cards.slice(0, 12).map((card) => card.id)
    await updateExposureStats(cardIds)

    return cards
  } catch (error) {
    console.error("Error fetching business cards:", error)
    return sampleBusinessCards
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return sampleCategories
  }

  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return sampleCategories
    }

    return data || sampleCategories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return sampleCategories
  }
}

export async function getBusinessCardsByCategory(categoryName: string): Promise<BusinessCard[]> {
  const allCards = await getBusinessCards()
  return allCards.filter((card) => card.category === categoryName)
}

export async function searchBusinessCards(query: string): Promise<BusinessCard[]> {
  const allCards = await getBusinessCards()
  const lowercaseQuery = query.toLowerCase()

  return allCards.filter(
    (card) =>
      card.title.toLowerCase().includes(lowercaseQuery) ||
      card.description.toLowerCase().includes(lowercaseQuery) ||
      card.category.toLowerCase().includes(lowercaseQuery) ||
      card.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export async function getPremiumCards(): Promise<BusinessCard[]> {
  const allCards = await getBusinessCards()
  return allCards.filter((card) => card.isPremium)
}

export async function getPromotedCards(): Promise<BusinessCard[]> {
  const allCards = await getBusinessCards()
  return allCards.filter((card) => card.isPromoted)
}

export async function incrementViewCount(cardId: number): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    return
  }

  try {
    const { error } = await supabase
      .from("business_cards")
      .update({
        view_count: supabase.raw("view_count + 1"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", cardId)

    if (error) {
      console.error("Error incrementing view count:", error)
    }
  } catch (error) {
    console.error("Error incrementing view count:", error)
  }
}

export async function checkDatabaseStatus() {
  if (!isSupabaseConfigured() || !supabase) {
    return { status: "not_configured" }
  }

  try {
    const tables = ["business_cards", "categories", "tags", "business_card_tags"]
    const tableStatus: Record<string, boolean> = {}

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select("*").limit(1)
        tableStatus[table] = !error
      } catch {
        tableStatus[table] = false
      }
    }

    return {
      status: "configured",
      tables: tableStatus,
      allTablesExist: Object.values(tableStatus).every(Boolean),
    }
  } catch (error) {
    return { status: "error", error }
  }
}

export async function getExposureStats() {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      totalExposures: 0,
      averageExposures: 0,
      lastUpdated: new Date().toISOString(),
    }
  }

  try {
    const { data, error } = await supabase.from("business_cards").select("exposure_count").eq("is_active", true)

    if (error) {
      console.error("Error fetching exposure stats:", error)
      return {
        totalExposures: 0,
        averageExposures: 0,
        lastUpdated: new Date().toISOString(),
      }
    }

    const totalExposures = data.reduce((sum, card) => sum + (card.exposure_count || 0), 0)
    const averageExposures = data.length > 0 ? totalExposures / data.length : 0

    return {
      totalExposures,
      averageExposures: Math.round(averageExposures * 100) / 100,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error calculating exposure stats:", error)
    return {
      totalExposures: 0,
      averageExposures: 0,
      lastUpdated: new Date().toISOString(),
    }
  }
}
