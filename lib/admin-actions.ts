"use server"

import { supabase } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"

// 실제 데이터베이스 스키마에 맞게 수정된 인터페이스 (소셜 미디어 필드 추가)
export interface BusinessCardData {
  title: string
  description: string
  category_id: number
  location?: string | null
  phone?: string | null
  kakao_id?: string | null
  line_id?: string | null
  website?: string | null
  hours?: string | null
  price?: string | null
  promotion?: string | null
  image_url?: string | null
  is_promoted?: boolean
  is_active?: boolean
  is_premium?: boolean
  premium_expires_at?: string | null
  exposure_count?: number
  last_exposed_at?: string | null
  exposure_weight?: number
  view_count?: number
  // 소셜 미디어 필드 추가
  facebook_url?: string | null
  instagram_url?: string | null
  tiktok_url?: string | null
  threads_url?: string | null
  youtube_url?: string | null
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

// AI를 사용한 비즈니스 카드 데이터 파싱 (소셜 미디어 필드 추가)
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
        "hours": "운영시간",
        "price": "가격 정보",
        "promotion": "프로모션/할인 정보",
        "facebook_url": "페이스북 URL",
        "instagram_url": "인스타그램 URL",
        "tiktok_url": "틱톡 URL",
        "threads_url": "쓰레드 URL",
        "youtube_url": "유튜브 URL"
      }

      JSON만 반환하고 다른 텍스트는 포함하지 마세요.`,
      temperature: 0.3,
    })

    // JSON 파싱 시도
    const cleanedResult = result.replace(/```json\n?|\n?```/g, "").trim()
    const parsedData = JSON.parse(cleanedResult)

    // 기본값 설정 (소셜 미디어 필드 포함)
    const businessData: Partial<BusinessCardData> = {
      title: parsedData.title || "제목 없음",
      description: parsedData.description || "설명 없음",
      location: parsedData.location || null,
      phone: parsedData.phone || null,
      kakao_id: parsedData.kakao_id || null,
      line_id: parsedData.line_id || null,
      website: parsedData.website || null,
      hours: parsedData.hours || null,
      price: parsedData.price || null,
      promotion: parsedData.promotion || null,
      facebook_url: parsedData.facebook_url || null,
      instagram_url: parsedData.instagram_url || null,
      tiktok_url: parsedData.tiktok_url || null,
      threads_url: parsedData.threads_url || null,
      youtube_url: parsedData.youtube_url || null,
      is_active: true,
      is_promoted: false,
      is_premium: false,
      exposure_count: 0,
      exposure_weight: 1.0,
    }

    return businessData
  } catch (error) {
    console.error("AI 파싱 오류:", error)
    throw new Error(`AI 분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// 비즈니스 카드 생성 (소셜 미디어 필드 포함)
export async function createBusinessCard(data: BusinessCardData) {
  console.log("createBusinessCard 호출됨:", data)

  if (!supabase) {
    console.error("Supabase 클라이언트가 없습니다")
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  // 필수 필드 검증
  if (!data.title || !data.description || !data.category_id) {
    throw new Error("제목, 설명, 카테고리는 필수 입력 항목입니다.")
  }

  try {
    // 데이터베이스에 삽입할 데이터 준비 (소셜 미디어 필드 포함)
    const insertData = {
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      location: data.location || null,
      phone: data.phone || null,
      kakao_id: data.kakao_id || null,
      line_id: data.line_id || null,
      website: data.website || null,
      hours: data.hours || null,
      price: data.price || null,
      promotion: data.promotion || null,
      image_url: data.image_url || null,
      facebook_url: data.facebook_url || null,
      instagram_url: data.instagram_url || null,
      tiktok_url: data.tiktok_url || null,
      threads_url: data.threads_url || null,
      youtube_url: data.youtube_url || null,
      is_promoted: data.is_promoted || false,
      is_active: data.is_active !== false,
      is_premium: data.is_premium || false,
      premium_expires_at: data.premium_expires_at || null,
      exposure_count: data.exposure_count || 0,
      last_exposed_at: data.last_exposed_at || null,
      exposure_weight: data.exposure_weight || 1.0,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("삽입할 데이터:", insertData)

    const { data: result, error } = await supabase.from("business_cards").insert([insertData]).select().single()

    if (error) {
      console.error("Supabase 삽입 오류:", error)
      throw new Error(`카드 생성 실패: ${error.message}`)
    }

    console.log("카드 생성 성공:", result)

    // 페이지 재검증
    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("카드 생성 오류:", error)
    throw error
  }
}

// 비즈니스 카드 업데이트 - 소셜 미디어 필드 포함
export async function updateBusinessCard(id: number, data: Partial<BusinessCardData>) {
  console.log("updateBusinessCard 호출됨:", { id, data })

  if (!supabase) {
    console.error("Supabase 클라이언트가 없습니다")
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  if (!id || id <= 0) {
    throw new Error("유효하지 않은 카드 ID입니다.")
  }

  try {
    // 업데이트할 데이터 준비 - 빈 문자열을 null로 변환
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // 각 필드를 안전하게 처리 (소셜 미디어 필드 포함)
    if (data.title !== undefined) updateData.title = data.title || null
    if (data.description !== undefined) updateData.description = data.description || null
    if (data.category_id !== undefined) updateData.category_id = data.category_id
    if (data.location !== undefined) updateData.location = data.location || null
    if (data.phone !== undefined) updateData.phone = data.phone || null
    if (data.kakao_id !== undefined) updateData.kakao_id = data.kakao_id || null
    if (data.line_id !== undefined) updateData.line_id = data.line_id || null
    if (data.website !== undefined) updateData.website = data.website || null
    if (data.hours !== undefined) updateData.hours = data.hours || null
    if (data.price !== undefined) updateData.price = data.price || null
    if (data.promotion !== undefined) updateData.promotion = data.promotion || null
    if (data.image_url !== undefined) updateData.image_url = data.image_url || null
    if (data.facebook_url !== undefined) updateData.facebook_url = data.facebook_url || null
    if (data.instagram_url !== undefined) updateData.instagram_url = data.instagram_url || null
    if (data.tiktok_url !== undefined) updateData.tiktok_url = data.tiktok_url || null
    if (data.threads_url !== undefined) updateData.threads_url = data.threads_url || null
    if (data.youtube_url !== undefined) updateData.youtube_url = data.youtube_url || null
    if (data.is_promoted !== undefined) updateData.is_promoted = Boolean(data.is_promoted)
    if (data.is_active !== undefined) updateData.is_active = Boolean(data.is_active)
    if (data.is_premium !== undefined) updateData.is_premium = Boolean(data.is_premium)
    if (data.premium_expires_at !== undefined) updateData.premium_expires_at = data.premium_expires_at
    if (data.exposure_count !== undefined) updateData.exposure_count = Number(data.exposure_count) || 0
    if (data.last_exposed_at !== undefined) updateData.last_exposed_at = data.last_exposed_at
    if (data.exposure_weight !== undefined) updateData.exposure_weight = Number(data.exposure_weight) || 1.0
    if (data.view_count !== undefined) updateData.view_count = Number(data.view_count) || 0

    console.log("업데이트할 데이터:", updateData)

    const { data: result, error } = await supabase
      .from("business_cards")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        categories (
          id,
          name,
          color_class
        )
      `)
      .single()

    if (error) {
      console.error("Supabase 업데이트 오류:", error)
      throw new Error(`카드 업데이트 실패: ${error.message}`)
    }

    if (!result) {
      throw new Error("업데이트된 카드를 찾을 수 없습니다.")
    }

    console.log("카드 업데이트 성공:", result)

    // 페이지 재검증
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

// 노출 카운트 업데이트
export async function updateExposureCount(id: number, count: number) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const updateData: any = {
      exposure_count: count,
      last_exposed_at: count > 0 ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabase
      .from("business_cards")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`노출 카운트 업데이트 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("노출 카운트 업데이트 오류:", error)
    throw error
  }
}

// 노출 가중치 업데이트
export async function updateExposureWeight(id: number, weight: number) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const updateData: any = {
      exposure_weight: weight,
      updated_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabase
      .from("business_cards")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`노출 가중치 업데이트 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("노출 가중치 업데이트 오류:", error)
    throw error
  }
}

// 데이터베이스 연결 테스트 함수
export async function testDatabaseConnection() {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { data, error } = await supabase.from("categories").select("count").limit(1)

    if (error) {
      throw new Error(`데이터베이스 연결 실패: ${error.message}`)
    }

    return { success: true, message: "데이터베이스 연결 성공" }
  } catch (error) {
    console.error("데이터베이스 연결 테스트 오류:", error)
    throw error
  }
}
