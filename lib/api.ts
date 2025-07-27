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
    console.log("Attempting to fetch from Supabase...")

    // 먼저 간단한 쿼리로 테이블 존재 여부 확인
    const { data: simpleData, error: simpleError } = await supabase.from("business_cards").select("*").limit(1)

    if (simpleError) {
      console.error("Basic table query failed:", simpleError)
      console.warn("Tables may not exist yet. Using sample data.")
      return sampleBusinessCards
    }

    // 테이블이 존재하면 전체 데이터 조회 (관계 없이)
    const { data, error } = await supabase
      .from("business_cards")
      .select("*")
      .eq("is_active", true)
      .order("is_promoted", { ascending: false })
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
          mapUrl: card.map_url, // 데이터베이스 필드 추가
          hours: card.hours,
          price: card.price,
          promotion: card.promotion,
          tags: tags,
          image: card.image_url,
          rating: card.rating,
          isPromoted: card.is_promoted,
        }
      }),
    )

    return cardsWithDetails
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
