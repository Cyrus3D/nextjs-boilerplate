import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>()

// Batch processing for view counts
const viewCountBatch = new Map<number, number>()
let batchTimeout: NodeJS.Timeout | null = null

export interface BusinessCard {
  id: number
  title: string
  description: string
  category_id: number
  location?: string
  phone?: string
  kakao_id?: string
  line_id?: string
  website?: string
  hours?: string
  price?: string
  promotion?: string
  image_url?: string
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  threads_url?: string
  youtube_url?: string
  is_promoted: boolean
  is_active: boolean
  is_premium: boolean
  premium_expires_at?: string
  exposure_count: number
  last_exposed_at?: string
  exposure_weight: number
  view_count: number
  created_at: string
  updated_at: string
  categories?: {
    id: number
    name: string
    color_class: string
  }
}

export interface Category {
  id: number
  name: string
  color_class: string
  created_at: string
}

export interface PaginationResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Cache utilities
export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (!cached) return null

  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key)
    return null
  }

  return cached.data as T
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  })
}

export function clearApiCache(): void {
  cache.clear()
}

// Database status check
export async function checkDatabaseStatus() {
  try {
    const { data, error } = await supabase.from("business_cards").select("count(*)").limit(1)

    if (error) throw error

    return {
      status: "connected",
      cardCount: data?.[0]?.count || 0,
    }
  } catch (error) {
    console.error("Database status check failed:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Get categories with caching
export async function getCategories(): Promise<Category[]> {
  const cacheKey = "categories"
  const cached = getCachedData<Category[]>(cacheKey)

  if (cached) {
    return cached
  }

  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) throw error

    const categories = data || []
    setCachedData(cacheKey, categories)
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Get exposure statistics
export async function getExposureStats() {
  const cacheKey = "exposure_stats"
  const cached = getCachedData<any>(cacheKey)

  if (cached) {
    return cached
  }

  try {
    const { data, error } = await supabase
      .from("business_cards")
      .select("exposure_count, view_count, is_premium, is_promoted")

    if (error) throw error

    const stats = {
      totalExposures: data?.reduce((sum, card) => sum + (card.exposure_count || 0), 0) || 0,
      totalViews: data?.reduce((sum, card) => sum + (card.view_count || 0), 0) || 0,
      premiumCards: data?.filter((card) => card.is_premium).length || 0,
      promotedCards: data?.filter((card) => card.is_promoted).length || 0,
      totalCards: data?.length || 0,
    }

    setCachedData(cacheKey, stats)
    return stats
  } catch (error) {
    console.error("Error fetching exposure stats:", error)
    return {
      totalExposures: 0,
      totalViews: 0,
      premiumCards: 0,
      promotedCards: 0,
      totalCards: 0,
    }
  }
}

// Batch increment view count
export function incrementViewCount(cardId: number): void {
  const currentCount = viewCountBatch.get(cardId) || 0
  viewCountBatch.set(cardId, currentCount + 1)

  // Clear existing timeout
  if (batchTimeout) {
    clearTimeout(batchTimeout)
  }

  // Set new timeout to process batch
  batchTimeout = setTimeout(async () => {
    await processBatchViewCounts()
  }, 1000) // Process batch after 1 second
}

async function processBatchViewCounts(): Promise<void> {
  if (viewCountBatch.size === 0) return

  const updates = Array.from(viewCountBatch.entries())
  viewCountBatch.clear()

  try {
    for (const [cardId, incrementBy] of updates) {
      await supabase.rpc("increment_view_count", {
        card_id: cardId,
        increment_by: incrementBy,
      })
    }

    // Clear relevant cache entries
    cache.forEach((_, key) => {
      if (key.includes("business_cards") || key.includes("stats")) {
        cache.delete(key)
      }
    })
  } catch (error) {
    console.error("Error processing batch view counts:", error)
  }
}

// Get paginated business cards with advanced filtering
export async function getBusinessCardsPaginated(
  page = 1,
  limit = 20,
  filters: {
    category?: string
    search?: string
    location?: string
    isPremium?: boolean
    isPromoted?: boolean
    isActive?: boolean
  } = {},
): Promise<PaginationResult<BusinessCard>> {
  const cacheKey = `business_cards_paginated_${page}_${limit}_${JSON.stringify(filters)}`
  const cached = getCachedData<PaginationResult<BusinessCard>>(cacheKey)

  if (cached) {
    return cached
  }

  try {
    let query = supabase
      .from("business_cards")
      .select(
        `
        *,
        categories (
          id,
          name,
          color_class
        )
      `,
        { count: "exact" },
      )
      .eq("is_active", filters.isActive ?? true)
      .order("exposure_weight", { ascending: false })
      .order("created_at", { ascending: false })

    // Apply filters
    if (filters.category && filters.category !== "all") {
      query = query.eq("category_id", Number.parseInt(filters.category))
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`)
    }

    if (filters.isPremium !== undefined) {
      query = query.eq("is_premium", filters.isPremium)
    }

    if (filters.isPromoted !== undefined) {
      query = query.eq("is_promoted", filters.isPromoted)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    const result: PaginationResult<BusinessCard> = {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }

    setCachedData(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error fetching paginated business cards:", error)
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }
}

// Get business cards by category
export async function getBusinessCardsByCategory(categoryId: number, limit = 20): Promise<BusinessCard[]> {
  const cacheKey = `business_cards_category_${categoryId}_${limit}`
  const cached = getCachedData<BusinessCard[]>(cacheKey)

  if (cached) {
    return cached
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
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .order("exposure_weight", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    const cards = data || []
    setCachedData(cacheKey, cards)
    return cards
  } catch (error) {
    console.error("Error fetching cards by category:", error)
    return []
  }
}

// Search business cards
export async function searchBusinessCards(query: string, limit = 20): Promise<BusinessCard[]> {
  if (!query.trim()) return []

  const cacheKey = `search_${query}_${limit}`
  const cached = getCachedData<BusinessCard[]>(cacheKey)

  if (cached) {
    return cached
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
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
      .eq("is_active", true)
      .order("exposure_weight", { ascending: false })
      .limit(limit)

    if (error) throw error

    const cards = data || []
    setCachedData(cacheKey, cards)
    return cards
  } catch (error) {
    console.error("Error searching business cards:", error)
    return []
  }
}

// Get premium cards
export async function getPremiumCards(limit = 10): Promise<BusinessCard[]> {
  const cacheKey = `premium_cards_${limit}`
  const cached = getCachedData<BusinessCard[]>(cacheKey)

  if (cached) {
    return cached
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
      .eq("is_premium", true)
      .eq("is_active", true)
      .or("premium_expires_at.is.null,premium_expires_at.gt.now()")
      .order("exposure_weight", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    const cards = data || []
    setCachedData(cacheKey, cards)
    return cards
  } catch (error) {
    console.error("Error fetching premium cards:", error)
    return []
  }
}

// Get promoted cards
export async function getPromotedCards(limit = 10): Promise<BusinessCard[]> {
  const cacheKey = `promoted_cards_${limit}`
  const cached = getCachedData<BusinessCard[]>(cacheKey)

  if (cached) {
    return cached
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
      .eq("is_promoted", true)
      .eq("is_active", true)
      .order("exposure_weight", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    const cards = data || []
    setCachedData(cacheKey, cards)
    return cards
  } catch (error) {
    console.error("Error fetching promoted cards:", error)
    return []
  }
}

// Legacy compatibility function
export async function getBusinessCards(): Promise<BusinessCard[]> {
  const result = await getBusinessCardsPaginated(1, 50)
  return result.data
}
