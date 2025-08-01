"use server"

import { supabase } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"

// 기존 비즈니스 카드 인터페이스
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
  facebook_url?: string | null
  instagram_url?: string | null
  tiktok_url?: string | null
  threads_url?: string | null
  youtube_url?: string | null
}

// 뉴스 관련 인터페이스 추가
export interface NewsArticleData {
  title: string
  excerpt?: string
  content: string
  category: string
  tags: string[]
  author: string
  published_at?: string
  read_time?: number
  is_breaking?: boolean
  is_published?: boolean
  image_url?: string
  source_url?: string
}

export interface NewsCategory {
  id: number
  name: string
  color_class: string
}

export interface NewsTag {
  id: number
  name: string
}

export interface NewsArticle extends NewsArticleData {
  id: number
  view_count: number
  created_at: string
  updated_at: string
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

// 뉴스 관련 함수들
export async function createNewsArticle(data: NewsArticleData) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  if (!data.title || !data.content) {
    throw new Error("제목과 내용은 필수 입력 항목입니다.")
  }

  try {
    const insertData = {
      title: data.title,
      excerpt: data.excerpt || data.content.substring(0, 200) + "...",
      content: data.content,
      category: data.category || "일반",
      tags: data.tags || [],
      author: data.author || "Admin",
      published_at: data.published_at || new Date().toISOString(),
      read_time: data.read_time || Math.ceil(data.content.length / 200),
      is_breaking: data.is_breaking || false,
      is_published: data.is_published !== false,
      image_url: data.image_url || null,
      source_url: data.source_url || null,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabase.from("news_articles").insert([insertData]).select().single()

    if (error) {
      throw new Error(`뉴스 생성 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/news")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("뉴스 생성 오류:", error)
    throw error
  }
}

export async function updateNewsArticle(id: number, data: Partial<NewsArticleData>) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  if (!id || id <= 0) {
    throw new Error("유효하지 않은 뉴스 ID입니다.")
  }

  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (data.title !== undefined) updateData.title = data.title
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt
    if (data.content !== undefined) updateData.content = data.content
    if (data.category !== undefined) updateData.category = data.category
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.author !== undefined) updateData.author = data.author
    if (data.published_at !== undefined) updateData.published_at = data.published_at
    if (data.read_time !== undefined) updateData.read_time = data.read_time
    if (data.is_breaking !== undefined) updateData.is_breaking = data.is_breaking
    if (data.is_published !== undefined) updateData.is_published = data.is_published
    if (data.image_url !== undefined) updateData.image_url = data.image_url || null
    if (data.source_url !== undefined) updateData.source_url = data.source_url || null

    const { data: result, error } = await supabase
      .from("news_articles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`뉴스 업데이트 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/news")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("뉴스 업데이트 오류:", error)
    throw error
  }
}

export async function deleteNewsArticle(id: number) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { error } = await supabase.from("news_articles").delete().eq("id", id)

    if (error) {
      throw new Error(`뉴스 삭제 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/news")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("뉴스 삭제 오류:", error)
    throw error
  }
}

export async function deleteMultipleNewsArticles(ids: number[]) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  if (!ids.length) {
    throw new Error("삭제할 뉴스가 선택되지 않았습니다.")
  }

  try {
    const { error } = await supabase.from("news_articles").delete().in("id", ids)

    if (error) {
      throw new Error(`뉴스 삭제 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/news")
    revalidatePath("/")

    return { success: true, deletedCount: ids.length }
  } catch (error) {
    console.error("다중 뉴스 삭제 오류:", error)
    throw error
  }
}

export async function getNewsArticlesForAdmin() {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { data, error } = await supabase.from("news_articles").select("*").order("created_at", { ascending: false })

    if (error) {
      throw new Error(`뉴스 목록 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("뉴스 목록 조회 오류:", error)
    throw error
  }
}

export async function getNewsCategories() {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { data, error } = await supabase.from("news_categories").select("*").order("name")

    if (error) {
      throw new Error(`뉴스 카테고리 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("뉴스 카테고리 조회 오류:", error)
    throw error
  }
}

export async function getNewsTags() {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { data, error } = await supabase.from("news_tags").select("*").order("name")

    if (error) {
      throw new Error(`뉴스 태그 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("뉴스 태그 조회 오류:", error)
    throw error
  }
}

// AI를 사용한 뉴스 데이터 파싱
export async function parseNewsData(text: string): Promise<Partial<NewsArticleData>> {
  if (!text.trim()) {
    throw new Error("분석할 텍스트가 없습니다.")
  }

  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 텍스트에서 뉴스 정보를 추출하여 JSON 형태로 반환해주세요. 
      정보가 없는 필드는 null로 설정하세요.

      텍스트: "${text}"

      다음 형식으로 반환해주세요:
      {
        "title": "뉴스 제목",
        "excerpt": "요약 (150자 이내)",
        "content": "본문 내용",
        "category": "카테고리 (현지 뉴스, 교민 업체, 정책, 교통, 비자, 일반 중 하나)",
        "tags": ["태그1", "태그2", "태그3"],
        "author": "작성자",
        "is_breaking": false,
        "source_url": "원문 URL (있는 경우)"
      }

      JSON만 반환하고 다른 텍스트는 포함하지 마세요.`,
      temperature: 0.3,
    })

    const cleanedResult = result.replace(/```json\n?|\n?```/g, "").trim()
    const parsedData = JSON.parse(cleanedResult)

    const newsData: Partial<NewsArticleData> = {
      title: parsedData.title || "제목 없음",
      excerpt: parsedData.excerpt || null,
      content: parsedData.content || "내용 없음",
      category: parsedData.category || "일반",
      tags: Array.isArray(parsedData.tags) ? parsedData.tags : [],
      author: parsedData.author || "Admin",
      is_breaking: Boolean(parsedData.is_breaking),
      is_published: true,
      source_url: parsedData.source_url || null,
    }

    return newsData
  } catch (error) {
    console.error("AI 뉴스 파싱 오류:", error)
    throw new Error(`AI 분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// 기존 비즈니스 카드 관련 함수들
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

    const cleanedResult = result.replace(/```json\n?|\n?```/g, "").trim()
    const parsedData = JSON.parse(cleanedResult)

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

export async function createBusinessCard(data: BusinessCardData) {
  console.log("createBusinessCard 호출됨:", data)

  if (!supabase) {
    console.error("Supabase 클라이언트가 없습니다")
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  if (!data.title || !data.description || !data.category_id) {
    throw new Error("제목, 설명, 카테고리는 필수 입력 항목입니다.")
  }

  try {
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

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("카드 생성 오류:", error)
    throw error
  }
}

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
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

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

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("카드 업데이트 오류:", error)
    throw error
  }
}

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
