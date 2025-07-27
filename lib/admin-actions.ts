"use server"

import { supabase } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"

export interface BusinessCardData {
  title: string
  description: string
  category_id: number
  location?: string | null
  phone?: string | null
  kakao_id?: string | null
  line_id?: string | null
  website?: string | null
  map_url?: string | null
  hours?: string | null
  price?: string | null
  promotion?: string | null
  image_url?: string | null
  rating?: number | null
  is_promoted?: boolean
  is_active?: boolean
  is_premium?: boolean
  premium_expires_at?: string | null
  exposure_boost?: number
  exposure_expires_at?: string | null
  view_count?: number
}

export interface AIStatusResult {
  isActive: boolean
  hasOpenAIKey: boolean
  canGenerateText: boolean
  lastChecked: string
  error?: string
}

// AI 상태 확인 함수
export async function checkAIStatus(): Promise<AIStatusResult> {
  const lastChecked = new Date().toISOString()

  try {
    // 1. OpenAI API 키 확인
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY

    if (!hasOpenAIKey) {
      return {
        isActive: false,
        hasOpenAIKey: false,
        canGenerateText: false,
        lastChecked,
        error: "OpenAI API 키가 설정되지 않았습니다.",
      }
    }

    // 2. 실제 AI 호출 테스트
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: "Hello, respond with 'AI is working'",
      temperature: 0,
    })

    const canGenerateText = text.toLowerCase().includes("working")

    return {
      isActive: canGenerateText,
      hasOpenAIKey: true,
      canGenerateText,
      lastChecked,
      error: canGenerateText ? undefined : "AI 텍스트 생성 테스트 실패",
    }
  } catch (error) {
    return {
      isActive: false,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      canGenerateText: false,
      lastChecked,
      error: `AI 상태 확인 중 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
    }
  }
}

// AI를 사용한 비즈니스 카드 데이터 파싱
export async function parseBusinessCardData(text: string): Promise<Partial<BusinessCardData>> {
  if (!text.trim()) {
    throw new Error("분석할 텍스트가 없습니다.")
  }

  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 텍스트에서 비즈니스 정보를 추출하여 JSON 형태로 반환해주세요. 
      정보가 없는 필드는 null로 설정하세요.

      텍스트: "${text}"

      다음 형식으로 반환해주세요:
      {
        "title": "비즈니스 이름",
        "description": "상세 설명",
        "location": "위치/주소",
        "phone": "전화번호",
        "kakao_id": "카카오톡 ID",
        "line_id": "라인 ID", 
        "website": "웹사이트 URL",
        "map_url": "지도 URL",
        "hours": "운영시간",
        "price": "가격 정보",
        "promotion": "프로모션/할인 정보",
        "rating": 평점(숫자)
      }

      JSON만 반환하고 다른 텍스트는 포함하지 마세요.`,
      temperature: 0.3,
    })

    // JSON 파싱 시도
    const cleanedResult = result.replace(/```json\n?|\n?```/g, "").trim()
    const parsedData = JSON.parse(cleanedResult)

    // 기본값 설정
    const businessData: Partial<BusinessCardData> = {
      title: parsedData.title || "제목 없음",
      description: parsedData.description || "설명 없음",
      location: parsedData.location || null,
      phone: parsedData.phone || null,
      kakao_id: parsedData.kakao_id || null,
      line_id: parsedData.line_id || null,
      website: parsedData.website || null,
      map_url: parsedData.map_url || null,
      hours: parsedData.hours || null,
      price: parsedData.price || null,
      promotion: parsedData.promotion || null,
      rating: parsedData.rating ? Number(parsedData.rating) : null,
      is_active: true,
      is_promoted: false,
      is_premium: false,
      exposure_boost: 0,
    }

    return businessData
  } catch (error) {
    console.error("AI 파싱 오류:", error)
    throw new Error(`AI 분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// 비즈니스 카드 생성
export async function createBusinessCard(data: BusinessCardData) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { data: result, error } = await supabase
      .from("business_cards")
      .insert([
        {
          ...data,
          view_count: 0,
          exposure_count: 0,
          exposure_weight: 1.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`카드 생성 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("카드 생성 오류:", error)
    throw error
  }
}

// 비즈니스 카드 업데이트
export async function updateBusinessCard(id: number, data: Partial<BusinessCardData>) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { data: result, error } = await supabase
      .from("business_cards")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`카드 업데이트 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("카드 업데이트 오류:", error)
    throw error
  }
}

// 비즈니스 카드 삭제
export async function deleteBusinessCard(id: number) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { error } = await supabase.from("business_cards").delete().eq("id", id)

    if (error) {
      throw new Error(`카드 삭제 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("카드 삭제 오류:", error)
    throw error
  }
}

// 다중 비즈니스 카드 삭제
export async function deleteMultipleBusinessCards(ids: number[]) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  if (!ids.length) {
    throw new Error("삭제할 카드가 선택되지 않았습니다.")
  }

  try {
    const { error } = await supabase.from("business_cards").delete().in("id", ids)

    if (error) {
      throw new Error(`카드 삭제 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return { success: true, deletedCount: ids.length }
  } catch (error) {
    console.error("다중 카드 삭제 오류:", error)
    throw error
  }
}

// 카테고리 목록 가져오기
export async function getCategories() {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      throw new Error(`카테고리 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("카테고리 조회 오류:", error)
    throw error
  }
}

// 태그 목록 가져오기
export async function getTags() {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { data, error } = await supabase.from("tags").select("*").order("name")

    if (error) {
      throw new Error(`태그 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("태그 조회 오류:", error)
    throw error
  }
}

// 비즈니스 카드 목록 가져오기 (관리자용)
export async function getBusinessCardsForAdmin() {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
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
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`카드 목록 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("카드 목록 조회 오류:", error)
    throw error
  }
}

// 프리미엄 설정 업데이트
export async function updatePremiumStatus(id: number, isPremium: boolean, expiresAt?: string) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const updateData: any = {
      is_premium: isPremium,
      updated_at: new Date().toISOString(),
    }

    if (isPremium && expiresAt) {
      updateData.premium_expires_at = expiresAt
    } else if (!isPremium) {
      updateData.premium_expires_at = null
    }

    const { data: result, error } = await supabase
      .from("business_cards")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`프리미엄 상태 업데이트 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("프리미엄 상태 업데이트 오류:", error)
    throw error
  }
}

// 노출 부스트 설정
export async function updateExposureBoost(id: number, boostLevel: number, expiresAt?: string) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const updateData: any = {
      exposure_boost: boostLevel,
      updated_at: new Date().toISOString(),
    }

    if (boostLevel > 0 && expiresAt) {
      updateData.exposure_expires_at = expiresAt
    } else if (boostLevel === 0) {
      updateData.exposure_expires_at = null
    }

    const { data: result, error } = await supabase
      .from("business_cards")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`노출 부스트 업데이트 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("노출 부스트 업데이트 오류:", error)
    throw error
  }
}
