import { supabase, isSupabaseConfigured } from "./supabase"
import { sampleBusinessCards, sampleCategories } from "../data/sample-cards"
import type { BusinessCard, Category } from "../types/business-card"

// Cache for database schema check
let socialMediaColumnsExist: boolean | null = null
let schemaCheckTime = 0
const SCHEMA_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes

// Batch processing for view counts
let viewCountBatch: { [key: string]: number } = {}
let batchTimeout: NodeJS.Timeout | null = null

async function checkSocialMediaColumns(): Promise<boolean> {
  const now = Date.now()

  // Return cached result if still valid
  if (socialMediaColumnsExist !== null && now - schemaCheckTime < SCHEMA_CACHE_DURATION) {
    return socialMediaColumnsExist
  }

  if (!isSupabaseConfigured() || !supabase) {
    socialMediaColumnsExist = false
    schemaCheckTime = now
    return false
  }

  try {
    // Try to query with social media columns
    const { error } = await supabase.from("business_cards").select("facebook_url").limit(1)

    socialMediaColumnsExist = !error
    schemaCheckTime = now

    return socialMediaColumnsExist
  } catch (error) {
    console.warn("Social media columns check failed:", error)
    socialMediaColumnsExist = false
    schemaCheckTime = now
    return false
  }
}

export async function getBusinessCardsPaginated(
  page = 1,
  limit = 20,
  category?: string,
  searchTerm?: string,
): Promise<{ cards: BusinessCard[]; hasMore: boolean; total: number }> {
  const cacheKey = `cards-${page}-${limit}-${category || "all"}-${searchTerm || "none"}`
  const cached = apiCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  if (!isSupabaseConfigured() || !supabase) {
    console.log("Supabase not configured, returning sample data")
    let filteredSampleCards = sampleBusinessCards

    // Apply category filter to sample data
    if (category && category !== "all") {
      filteredSampleCards = sampleBusinessCards.filter((card) => card.category === category)
    }

    // Apply search filter to sample data
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredSampleCards = filteredSampleCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchLower) || card.description.toLowerCase().includes(searchLower),
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCards = filteredSampleCards.slice(startIndex, endIndex)

    const result = {
      cards: paginatedCards,
      hasMore: endIndex < filteredSampleCards.length,
      total: filteredSampleCards.length,
    }

    apiCache.set(cacheKey, { data: result, timestamp: Date.now() })
    return result
  }

  try {
    const hasSocialMedia = await checkSocialMediaColumns()

    // Base fields that should exist in the database
    let selectFields = `
      id,
      title,
      description,
      location,
      phone,
      kakao_id,
      line_id,
      website,
      hours,
      price,
      promotion,
      image_url,
      is_promoted,
      is_premium,
      premium_expires_at,
      exposure_count,
      last_exposed_at,
      exposure_weight,
      view_count,
      created_at,
      updated_at,
      categories (
        id,
        name,
        color_class
      )
    `

    // Add social media fields if they exist
    if (hasSocialMedia) {
      selectFields += `,
        facebook_url,
        instagram_url,
        tiktok_url,
        threads_url,
        youtube_url
      `
    }

    const query = supabase.from("business_cards").select(selectFields, { count: "exact" }).eq("is_active", true)

    // Apply category filter using the categories relationship
    // Apply category filter - 먼저 모든 데이터를 가져온 후 클라이언트에서 필터링
    // 데이터베이스 관계 쿼리가 제대로 작동하지 않을 수 있으므로

    // 카테고리 필터는 제거하고 모든 데이터를 가져옴
    // if (category && category !== "all") {
    //   query = query.eq("categories.name", category)
    // }

    // Apply search filter는 데이터베이스 레벨에서 제거하고 클라이언트에서 처리
    // if (searchTerm) {
    //   query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    // }

    // Apply pagination and sorting - 페이지네이션은 나중에 클라이언트에서 처리
    const { data, error, count } = await query
      .order("is_premium", { ascending: false })
      .order("is_promoted", { ascending: false })
      .order("exposure_count", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      // Return filtered sample data as fallback
      let filteredSampleCards = sampleBusinessCards

      if (category && category !== "all") {
        filteredSampleCards = sampleBusinessCards.filter((card) => card.category === category)
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        filteredSampleCards = filteredSampleCards.filter(
          (card) =>
            card.title.toLowerCase().includes(searchLower) || card.description.toLowerCase().includes(searchLower),
        )
      }

      return {
        cards: filteredSampleCards.slice(0, limit),
        hasMore: false,
        total: filteredSampleCards.length,
      }
    }

    // Transform data to match BusinessCard interface
    const allCards: BusinessCard[] = (data || []).map((card) => ({
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
      tags: [], // Tags would need separate query
      image: card.image_url,
      isPromoted: card.is_promoted || false,
      isPremium: card.is_premium || false,
      premiumExpiresAt: card.premium_expires_at,
      exposureCount: card.exposure_count || 0,
      lastExposedAt: card.last_exposed_at,
      exposureWeight: card.exposure_weight || 1.0,
      // Social media fields (only if columns exist)
      facebookUrl: hasSocialMedia ? card.facebook_url : undefined,
      instagramUrl: hasSocialMedia ? card.instagram_url : undefined,
      tiktokUrl: hasSocialMedia ? card.tiktok_url : undefined,
      threadsUrl: hasSocialMedia ? card.threads_url : undefined,
      youtubeUrl: hasSocialMedia ? card.youtube_url : undefined,
    }))

    // Apply category filter after data transformation
    let filteredCards = allCards
    if (category && category !== "all") {
      filteredCards = allCards.filter((card) => card.category === category)
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredCards = filteredCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchLower) || card.description.toLowerCase().includes(searchLower),
      )
    }

    // Apply pagination to filtered results
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCards = filteredCards.slice(startIndex, endIndex)

    const result = {
      cards: paginatedCards,
      hasMore: endIndex < filteredCards.length,
      total: filteredCards.length,
    }

    // Cache the result
    apiCache.set(cacheKey, { data: result, timestamp: Date.now() })

    return result
  } catch (error) {
    console.error("Error fetching business cards:", error)
    // Return filtered sample data as fallback
    let filteredSampleCards = sampleBusinessCards

    if (category && category !== "all") {
      filteredSampleCards = sampleBusinessCards.filter((card) => card.category === category)
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredSampleCards = filteredSampleCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchLower) || card.description.toLowerCase().includes(searchLower),
      )
    }

    return {
      cards: filteredSampleCards.slice(0, limit),
      hasMore: false,
      total: filteredSampleCards.length,
    }
  }
}

// Get categories from the categories table
export async function getCategories(): Promise<Category[]> {
  const cacheKey = "categories"
  const cached = apiCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  if (!isSupabaseConfigured() || !supabase) {
    console.log("Supabase not configured, returning sample categories")
    apiCache.set(cacheKey, { data: sampleCategories, timestamp: Date.now() })
    return sampleCategories
  }

  try {
    const { data, error } = await supabase.from("categories").select("id, name, color_class").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      // Return sample categories as fallback
      apiCache.set(cacheKey, { data: sampleCategories, timestamp: Date.now() })
      return sampleCategories
    }

    const categories = data || sampleCategories

    // Cache the result
    apiCache.set(cacheKey, { data: categories, timestamp: Date.now() })

    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return sample categories as fallback
    apiCache.set(cacheKey, { data: sampleCategories, timestamp: Date.now() })
    return sampleCategories
  }
}

// Batch update view counts (for performance)
export function incrementViewCount(cardId: number) {
  const cardIdStr = cardId.toString()
  viewCountBatch[cardIdStr] = (viewCountBatch[cardIdStr] || 0) + 1

  if (batchTimeout) {
    clearTimeout(batchTimeout)
  }

  batchTimeout = setTimeout(async () => {
    await flushViewCounts()
  }, 5000) // Batch updates every 5 seconds
}

async function flushViewCounts() {
  if (Object.keys(viewCountBatch).length === 0) return

  if (!isSupabaseConfigured() || !supabase) {
    console.log("Supabase not configured, skipping view count update")
    return
  }

  try {
    const updates = Object.entries(viewCountBatch).map(async ([cardId, increment]) => {
      // Get current view count
      const { data: currentData, error: fetchError } = await supabase
        .from("business_cards")
        .select("view_count")
        .eq("id", cardId)
        .single()

      if (fetchError) {
        console.error("Error fetching current view count:", fetchError)
        return
      }

      const currentViewCount = currentData?.view_count || 0

      // Update view count
      const { error: updateError } = await supabase
        .from("business_cards")
        .update({
          view_count: currentViewCount + increment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", cardId)

      if (updateError) {
        console.error("Error updating view count:", updateError)
      }
    })

    await Promise.all(updates)
    viewCountBatch = {}
  } catch (error) {
    console.error("Error updating view counts:", error)
  }
}

// Get business cards by category
export async function getBusinessCardsByCategory(categoryName: string): Promise<BusinessCard[]> {
  const result = await getBusinessCardsPaginated(1, 100, categoryName)
  return result.cards
}

// Search business cards
export async function searchBusinessCards(query: string): Promise<BusinessCard[]> {
  const result = await getBusinessCardsPaginated(1, 100, undefined, query)
  return result.cards
}

// Get premium cards
export async function getPremiumCards(): Promise<BusinessCard[]> {
  const result = await getBusinessCardsPaginated(1, 100)
  return result.cards.filter((card) => card.isPremium)
}

// Get promoted cards
export async function getPromotedCards(): Promise<BusinessCard[]> {
  const result = await getBusinessCardsPaginated(1, 100)
  return result.cards.filter((card) => card.isPromoted)
}

// Check database status
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

    // Check social media columns
    const hasSocialMediaColumns = await checkSocialMediaColumns()

    return {
      status: "configured",
      tables: tableStatus,
      allTablesExist: Object.values(tableStatus).every(Boolean),
      hasSocialMediaColumns,
    }
  } catch (error) {
    return { status: "error", error }
  }
}

// Get exposure stats
export async function getExposureStats() {
  const cacheKey = "exposure_stats"
  const cached = apiCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  if (!isSupabaseConfigured() || !supabase) {
    const stats = {
      totalExposures: 0,
      averageExposures: 0,
      lastUpdated: new Date().toISOString(),
    }
    apiCache.set(cacheKey, { data: stats, timestamp: Date.now() })
    return stats
  }

  try {
    const { data, error } = await supabase.from("business_cards").select("exposure_count").eq("is_active", true)

    if (error) {
      console.error("Error fetching exposure stats:", error)
      const stats = {
        totalExposures: 0,
        averageExposures: 0,
        lastUpdated: new Date().toISOString(),
      }
      apiCache.set(cacheKey, { data: stats, timestamp: Date.now() })
      return stats
    }

    const totalExposures = data.reduce((sum, card) => sum + (card.exposure_count || 0), 0)
    const averageExposures = data.length > 0 ? totalExposures / data.length : 0

    const stats = {
      totalExposures,
      averageExposures: Math.round(averageExposures * 100) / 100,
      lastUpdated: new Date().toISOString(),
    }

    apiCache.set(cacheKey, { data: stats, timestamp: Date.now() })
    return stats
  } catch (error) {
    console.error("Error calculating exposure stats:", error)
    const stats = {
      totalExposures: 0,
      averageExposures: 0,
      lastUpdated: new Date().toISOString(),
    }
    apiCache.set(cacheKey, { data: stats, timestamp: Date.now() })
    return stats
  }
}

// Cache functions
export function getCachedData<T>(key: string): T | null {
  const cached = apiCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

export function setCachedData<T>(key: string, data: T): void {
  apiCache.set(key, { data, timestamp: Date.now() })
}

// Clear cache
export function clearApiCache(): void {
  apiCache.clear()
  socialMediaColumnsExist = null
  schemaCheckTime = 0
}

// Legacy compatibility function
export async function getBusinessCards(): Promise<BusinessCard[]> {
  const result = await getBusinessCardsPaginated(1, 100)
  return result.cards
}
