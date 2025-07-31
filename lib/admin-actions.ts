"use server"

import { createServerClient } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"

// 실제 데이터베이스 스키마에 맞게 수정된 인터페이스
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
  // 소셜 미디어 필드
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

    const canGenerateText = String(text).toLowerCase().includes("working")

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
  if (!String(text).trim()) {
    throw new Error("분석할 텍스트가 없습니다.")
  }

  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 텍스트에서 비즈니스 정보를 추출하여 JSON 형태로 반환해주세요. 
      정보가 없는 필드는 null로 설정하세요.

      텍스트: "${String(text)}"

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
    const cleanedResult = String(result)
      .replace(/```json\n?|\n?```/g, "")
      .trim()
    const parsedData = JSON.parse(cleanedResult)

    // 기본값 설정 및 안전한 타입 변환
    const businessData: Partial<BusinessCardData> = {
      title: String(parsedData.title || "제목 없음"),
      description: String(parsedData.description || "설명 없음"),
      location: parsedData.location ? String(parsedData.location) : null,
      phone: parsedData.phone ? String(parsedData.phone) : null,
      kakao_id: parsedData.kakao_id ? String(parsedData.kakao_id) : null,
      line_id: parsedData.line_id ? String(parsedData.line_id) : null,
      website: parsedData.website ? String(parsedData.website) : null,
      hours: parsedData.hours ? String(parsedData.hours) : null,
      price: parsedData.price ? String(parsedData.price) : null,
      promotion: parsedData.promotion ? String(parsedData.promotion) : null,
      facebook_url: parsedData.facebook_url ? String(parsedData.facebook_url) : null,
      instagram_url: parsedData.instagram_url ? String(parsedData.instagram_url) : null,
      tiktok_url: parsedData.tiktok_url ? String(parsedData.tiktok_url) : null,
      threads_url: parsedData.threads_url ? String(parsedData.threads_url) : null,
      youtube_url: parsedData.youtube_url ? String(parsedData.youtube_url) : null,
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

// 비즈니스 카드 생성
export async function createBusinessCard(data: BusinessCardData) {
  console.log("createBusinessCard 호출됨:", data)

  const supabase = createServerClient()

  // 필수 필드 검증
  if (!String(data.title).trim() || !String(data.description).trim() || !Number(data.category_id)) {
    throw new Error("제목, 설명, 카테고리는 필수 입력 항목입니다.")
  }

  try {
    // 데이터베이스에 삽입할 데이터 준비
    const insertData = {
      title: String(data.title).trim(),
      description: String(data.description).trim(),
      category_id: Number(data.category_id),
      location: data.location ? String(data.location).trim() || null : null,
      phone: data.phone ? String(data.phone).trim() || null : null,
      kakao_id: data.kakao_id ? String(data.kakao_id).trim() || null : null,
      line_id: data.line_id ? String(data.line_id).trim() || null : null,
      website: data.website ? String(data.website).trim() || null : null,
      hours: data.hours ? String(data.hours).trim() || null : null,
      price: data.price ? String(data.price).trim() || null : null,
      promotion: data.promotion ? String(data.promotion).trim() || null : null,
      image_url: data.image_url ? String(data.image_url).trim() || null : null,
      facebook_url: data.facebook_url ? String(data.facebook_url).trim() || null : null,
      instagram_url: data.instagram_url ? String(data.instagram_url).trim() || null : null,
      tiktok_url: data.tiktok_url ? String(data.tiktok_url).trim() || null : null,
      threads_url: data.threads_url ? String(data.threads_url).trim() || null : null,
      youtube_url: data.youtube_url ? String(data.youtube_url).trim() || null : null,
      is_promoted: Boolean(data.is_promoted),
      is_active: data.is_active !== false,
      is_premium: Boolean(data.is_premium),
      premium_expires_at: data.premium_expires_at ? String(data.premium_expires_at) : null,
      exposure_count: Number(data.exposure_count) || 0,
      last_exposed_at: data.last_exposed_at ? String(data.last_exposed_at) : null,
      exposure_weight: Number(data.exposure_weight) || 1.0,
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

// 비즈니스 카드 업데이트
export async function updateBusinessCard(id: number, data: Partial<BusinessCardData>) {
  console.log("updateBusinessCard 호출됨:", { id, data })

  const supabase = createServerClient()
  const cardId = Number(id)

  if (!cardId || cardId <= 0) {
    throw new Error("유효하지 않은 카드 ID입니다.")
  }

  try {
    // 업데이트할 데이터 준비
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // 각 필드를 안전하게 처리
    if (data.title !== undefined) updateData.title = String(data.title).trim() || null
    if (data.description !== undefined) updateData.description = String(data.description).trim() || null
    if (data.category_id !== undefined) updateData.category_id = Number(data.category_id)
    if (data.location !== undefined) updateData.location = data.location ? String(data.location).trim() || null : null
    if (data.phone !== undefined) updateData.phone = data.phone ? String(data.phone).trim() || null : null
    if (data.kakao_id !== undefined) updateData.kakao_id = data.kakao_id ? String(data.kakao_id).trim() || null : null
    if (data.line_id !== undefined) updateData.line_id = data.line_id ? String(data.line_id).trim() || null : null
    if (data.website !== undefined) updateData.website = data.website ? String(data.website).trim() || null : null
    if (data.hours !== undefined) updateData.hours = data.hours ? String(data.hours).trim() || null : null
    if (data.price !== undefined) updateData.price = data.price ? String(data.price).trim() || null : null
    if (data.promotion !== undefined)
      updateData.promotion = data.promotion ? String(data.promotion).trim() || null : null
    if (data.image_url !== undefined)
      updateData.image_url = data.image_url ? String(data.image_url).trim() || null : null
    if (data.facebook_url !== undefined)
      updateData.facebook_url = data.facebook_url ? String(data.facebook_url).trim() || null : null
    if (data.instagram_url !== undefined)
      updateData.instagram_url = data.instagram_url ? String(data.instagram_url).trim() || null : null
    if (data.tiktok_url !== undefined)
      updateData.tiktok_url = data.tiktok_url ? String(data.tiktok_url).trim() || null : null
    if (data.threads_url !== undefined)
      updateData.threads_url = data.threads_url ? String(data.threads_url).trim() || null : null
    if (data.youtube_url !== undefined)
      updateData.youtube_url = data.youtube_url ? String(data.youtube_url).trim() || null : null
    if (data.is_promoted !== undefined) updateData.is_promoted = Boolean(data.is_promoted)
    if (data.is_active !== undefined) updateData.is_active = Boolean(data.is_active)
    if (data.is_premium !== undefined) updateData.is_premium = Boolean(data.is_premium)
    if (data.premium_expires_at !== undefined)
      updateData.premium_expires_at = data.premium_expires_at ? String(data.premium_expires_at) : null
    if (data.exposure_count !== undefined) updateData.exposure_count = Number(data.exposure_count) || 0
    if (data.last_exposed_at !== undefined)
      updateData.last_exposed_at = data.last_exposed_at ? String(data.last_exposed_at) : null
    if (data.exposure_weight !== undefined) updateData.exposure_weight = Number(data.exposure_weight) || 1.0
    if (data.view_count !== undefined) updateData.view_count = Number(data.view_count) || 0

    console.log("업데이트할 데이터:", updateData)

    const { data: result, error } = await supabase
      .from("business_cards")
      .update(updateData)
      .eq("id", cardId)
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
  const supabase = createServerClient()
  const cardId = Number(id)

  try {
    const { error } = await supabase.from("business_cards").delete().eq("id", cardId)

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
  const supabase = createServerClient()
  const cardIds = ids.map((id) => Number(id)).filter((id) => id > 0)

  if (!cardIds.length) {
    throw new Error("삭제할 카드가 선택되지 않았습니다.")
  }

  try {
    const { error } = await supabase.from("business_cards").delete().in("id", cardIds)

    if (error) {
      throw new Error(`카드 삭제 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return { success: true, deletedCount: cardIds.length }
  } catch (error) {
    console.error("다중 카드 삭제 오류:", error)
    throw error
  }
}

// 카테고리 목록 가져오기
export async function getCategories() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      throw new Error(`카테고리 조회 실패: ${error.message}`)
    }

    return (data || []).map((category) => ({
      id: Number(category.id),
      name: String(category.name),
      color_class: String(category.color_class || "bg-gray-100 text-gray-800"),
      created_at: String(category.created_at),
    }))
  } catch (error) {
    console.error("카테고리 조회 오류:", error)
    throw error
  }
}

// 태그 목록 가져오기
export async function getTags() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("tags").select("*").order("name")

    if (error) {
      throw new Error(`태그 조회 실패: ${error.message}`)
    }

    return (data || []).map((tag) => ({
      id: Number(tag.id),
      name: String(tag.name),
      created_at: String(tag.created_at),
    }))
  } catch (error) {
    console.error("태그 조회 오류:", error)
    throw error
  }
}

// 비즈니스 카드 목록 가져오기 (관리자용)
export async function getBusinessCardsForAdmin() {
  const supabase = createServerClient()

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

    return (data || []).map((card) => ({
      id: Number(card.id),
      title: String(card.title || ""),
      description: String(card.description || ""),
      category_id: Number(card.category_id),
      categories: card.categories || null,
      location: card.location ? String(card.location) : null,
      phone: card.phone ? String(card.phone) : null,
      kakao_id: card.kakao_id ? String(card.kakao_id) : null,
      line_id: card.line_id ? String(card.line_id) : null,
      website: card.website ? String(card.website) : null,
      hours: card.hours ? String(card.hours) : null,
      price: card.price ? String(card.price) : null,
      promotion: card.promotion ? String(card.promotion) : null,
      image_url: card.image_url ? String(card.image_url) : null,
      facebook_url: card.facebook_url ? String(card.facebook_url) : null,
      instagram_url: card.instagram_url ? String(card.instagram_url) : null,
      tiktok_url: card.tiktok_url ? String(card.tiktok_url) : null,
      threads_url: card.threads_url ? String(card.threads_url) : null,
      youtube_url: card.youtube_url ? String(card.youtube_url) : null,
      is_promoted: Boolean(card.is_promoted),
      is_active: Boolean(card.is_active),
      is_premium: Boolean(card.is_premium),
      premium_expires_at: card.premium_expires_at ? String(card.premium_expires_at) : null,
      exposure_count: Number(card.exposure_count) || 0,
      last_exposed_at: card.last_exposed_at ? String(card.last_exposed_at) : null,
      exposure_weight: Number(card.exposure_weight) || 1.0,
      view_count: Number(card.view_count) || 0,
      created_at: String(card.created_at),
      updated_at: String(card.updated_at),
    }))
  } catch (error) {
    console.error("카드 목록 조회 오류:", error)
    throw error
  }
}

// 프리미엄 설정 업데이트
export async function updatePremiumStatus(id: number, isPremium: boolean, expiresAt?: string) {
  const supabase = createServerClient()
  const cardId = Number(id)

  try {
    const updateData: any = {
      is_premium: Boolean(isPremium),
      updated_at: new Date().toISOString(),
    }

    if (isPremium && expiresAt) {
      updateData.premium_expires_at = String(expiresAt)
    } else if (!isPremium) {
      updateData.premium_expires_at = null
    }

    const { data: result, error } = await supabase
      .from("business_cards")
      .update(updateData)
      .eq("id", cardId)
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
  const supabase = createServerClient()
  const cardId = Number(id)
  const exposureCount = Number(count) || 0

  try {
    const updateData: any = {
      exposure_count: exposureCount,
      last_exposed_at: exposureCount > 0 ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabase
      .from("business_cards")
      .update(updateData)
      .eq("id", cardId)
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
  const supabase = createServerClient()
  const cardId = Number(id)
  const exposureWeight = Number(weight) || 1.0

  try {
    const updateData: any = {
      exposure_weight: exposureWeight,
      updated_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabase
      .from("business_cards")
      .update(updateData)
      .eq("id", cardId)
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
  const supabase = createServerClient()

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
