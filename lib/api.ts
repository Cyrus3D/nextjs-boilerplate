import { supabase, isSupabaseConfigured } from "./supabase"
import type { BusinessCard } from "../types/business-card"
import { sampleBusinessCards } from "../data/sample-cards"
import { sortCardsForFairExposure, updateExposureStats } from "./card-rotation"

export async function getBusinessCards(): Promise<BusinessCard[]> {
  // Supabase가 설정되지 않은 경우 샘플 데이터 반환
  if (!isSupabaseConfigured() || !supabase) {
    console.warn("Supabase not configured, using sample data")
    return sampleBusinessCards
  }

  try {
    console.log("Attempting to fetch from Supabase...")

    // 먼저 간단한 쿼리로 테이블 존재 여부 확인
    const { data: simpleData, error: simpleError } = await supabase.from("business_cards").select("*").limit(1)

    if (simpleError) {
      console.error("Basic table query failed:", simpleError)
      console.warn("Tables may not exist yet. Using sample data.")
      return sampleBusinessCards
    }

    // Check if premium and exposure columns exist
    const hasNewColumns =
      simpleData && simpleData.length > 0 && "is_premium" in simpleData[0] && "exposure_count" in simpleData[0]

    // 테이블이 존재하면 전체 데이터 조회
    const { data, error } = await supabase
      .from("business_cards")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase query error:", error)
      console.warn("Falling back to sample data due to query error")
      return sampleBusinessCards
    }

    if (!data || data.length === 0) {
      console.warn("No data found in database, using sample data")
      return sampleBusinessCards
    }

    console.log("Successfully fetched data from Supabase:", data.length, "records")

    // 카테고리와 태그 정보를 별도로 조회하여 매핑
    const cardsWithDetails = await Promise.all(
      data.map(async (card) => {
        let categoryName = "기타"
        let tags: string[] = []

        // 카테고리 정보 조회 (테이블이 존재하는 경우)
        if (card.category_id) {
          try {
            const { data: categoryData } = await supabase
              .from("categories")
              .select("name")
              .eq("id", card.category_id)
              .single()

            if (categoryData) {
              categoryName = categoryData.name
            }
          } catch (error) {
            console.warn("Category table not found or accessible")
          }
        }

        // 태그 정보 조회 (테이블이 존재하는 경우)
        try {
          const { data: tagData } = await supabase
            .from("business_card_tags")
            .select(`
              tags (
                name
              )
            `)
            .eq("business_card_id", card.id)

          if (tagData) {
            tags = tagData.map((item: any) => item.tags?.name).filter(Boolean)
          }
        } catch (error) {
          console.warn("Tags table not found or accessible")
        }

        return {
          id: card.id,
          title: card.title,
          description: card.description,
          category: categoryName,
          location: card.location,
          phone: card.phone,
          kakaoId: card.kakao_id,
          lineId: card.line_id,
          website: card.website,
          mapUrl: card.map_url,
          hours: card.hours,
          price: card.price,
          promotion: card.promotion,
          tags: tags,
          image: card.image_url,
          rating: card.rating,
          isPromoted: card.is_promoted,
          // 프리미엄 및 노출 관련 필드 (새 컬럼이 있는 경우에만)
          isPremium: hasNewColumns ? card.is_premium || false : false,
          premiumExpiresAt: hasNewColumns ? card.premium_expires_at : undefined,
          exposureCount: hasNewColumns ? card.exposure_count || 0 : 0,
          lastExposedAt: hasNewColumns ? card.last_exposed_at : undefined,
          exposureWeight: hasNewColumns ? card.exposure_weight || 1.0 : 1.0,
        }
      }),
    )

    // 공평한 노출을 위한 카드 정렬 (새 컬럼이 있는 경우에만)
    const sortedCards = hasNewColumns ? sortCardsForFairExposure(cardsWithDetails) : cardsWithDetails

    // 노출 통계 업데이트 (새 컬럼이 있고 상위 12개 카드만)
    if (hasNewColumns) {
      const exposedCardIds = sortedCards.slice(0, 12).map((card) => card.id)
      if (exposedCardIds.length > 0) {
        // 비동기로 실행하여 페이지 로딩 속도에 영향 없도록
        updateExposureStats(exposedCardIds).catch(console.error)
      }
    }

    return sortedCards
  } catch (error) {
    console.error("Failed to fetch from database:", error)
    console.warn("Falling back to sample data due to network/connection error")
    return sampleBusinessCards
  }
}

export async function incrementViewCount(cardId: number) {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn("Supabase not configured, skipping view count increment")
    return
  }

  try {
    // First get the current view count
    const { data: currentData, error: fetchError } = await supabase
      .from("business_cards")
      .select("view_count")
      .eq("id", cardId)
      .single()

    if (fetchError) {
      console.error("Error fetching current view count:", fetchError)
      return
    }

    // Increment the view count
    const newViewCount = (currentData?.view_count || 0) + 1

    const { error } = await supabase.from("business_cards").update({ view_count: newViewCount }).eq("id", cardId)

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

// 데이터베이스 상태 확인 함수
export async function checkDatabaseStatus() {
  if (!isSupabaseConfigured() || !supabase) {
    return { status: "not_configured" }
  }

  try {
    // 각 테이블 존재 여부 확인
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

// 노출 통계 조회
export async function getExposureStats() {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  try {
    // First check if the exposure columns exist
    const { data: tableInfo, error: tableError } = await supabase.from("business_cards").select("*").limit(1)

    if (tableError) {
      console.error("Error checking table structure:", tableError)
      return null
    }

    // Check if exposure_count column exists
    const hasExposureColumns =
      tableInfo && tableInfo.length > 0 && "exposure_count" in tableInfo[0] && "last_exposed_at" in tableInfo[0]

    if (!hasExposureColumns) {
      console.warn("Exposure tracking columns not found. Please run the database migration.")
      return {
        totalExposures: 0,
        averageExposures: 0,
        lastUpdated: new Date().toISOString(),
        migrationNeeded: true,
      }
    }

    const { data, error } = await supabase
      .from("business_cards")
      .select("exposure_count, last_exposed_at")
      .eq("is_active", true)

    if (error) {
      console.error("Error fetching exposure stats:", error)
      return null
    }

    const totalExposures = data.reduce((sum, card) => sum + (card.exposure_count || 0), 0)
    const averageExposures = data.length > 0 ? totalExposures / data.length : 0
    const lastUpdated = new Date().toISOString()

    return {
      totalExposures,
      averageExposures: Math.round(averageExposures * 100) / 100,
      lastUpdated,
      migrationNeeded: false,
    }
  } catch (error) {
    console.error("Failed to fetch exposure stats:", error)
    return {
      totalExposures: 0,
      averageExposures: 0,
      lastUpdated: new Date().toISOString(),
      migrationNeeded: true,
    }
  }
}
