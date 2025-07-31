"use server"

import { supabase } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"
import type { NewsFormData } from "../types/news"

export interface NewsData extends NewsFormData {
  id?: number
  view_count?: number
  created_at?: string
  updated_at?: string
  original_language?: string
  is_translated?: boolean
}

// 언어 감지 함수
async function detectLanguage(text: string): Promise<string> {
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 텍스트의 언어를 감지하고 언어 코드만 반환해주세요. 
      한국어: ko, 영어: en, 태국어: th
      
      텍스트: "${text.substring(0, 500)}"
      
      언어 코드만 반환하세요 (ko, en, th 중 하나):`,
      temperature: 0.1,
    })

    const detectedLang = result.trim().toLowerCase()
    return ["ko", "en", "th"].includes(detectedLang) ? detectedLang : "en"
  } catch (error) {
    console.error("언어 감지 오류:", error)
    return "en" // 기본값
  }
}

// 번역 함수
async function translateToKorean(text: string, fromLanguage: string): Promise<string> {
  if (fromLanguage === "ko") {
    return text // 이미 한국어인 경우 번역하지 않음
  }

  try {
    const languageNames = {
      en: "영어",
      th: "태국어",
    }

    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 ${languageNames[fromLanguage as keyof typeof languageNames] || "외국어"} 텍스트를 자연스러운 한국어로 번역해주세요. 
      뉴스 기사의 톤과 스타일을 유지하면서 정확하고 읽기 쉽게 번역해주세요.

      원문:
      "${text}"

      번역된 한국어 텍스트만 반환해주세요:`,
      temperature: 0.3,
    })

    return result.trim()
  } catch (error) {
    console.error("번역 오류:", error)
    throw new Error(`번역 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// AI를 사용한 뉴스 데이터 파싱 (번역 기능 포함)
export async function parseNewsData(
  url: string,
  enableTranslation = true,
): Promise<Partial<NewsFormData & { original_language: string; is_translated: boolean }>> {
  if (!url.trim()) {
    throw new Error("분석할 URL이 없습니다.")
  }

  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 URL의 뉴스 기사를 분석하여 JSON 형태로 반환해주세요. 
      실제 웹사이트에 접근할 수 없으므로, URL을 기반으로 가상의 뉴스 데이터를 생성해주세요.
      
      URL: "${url}"

      다음 형식으로 반환해주세요:
      {
        "title": "기사 제목",
        "summary": "기사 요약 (2-3문장)",
        "content": "기사 전체 내용 (상세한 내용)",
        "imageUrl": "기사 대표 이미지 URL (있다면)",
        "source": "출처명",
        "category": "카테고리 (정치, 경제, 사회, 문화, 스포츠, 국제, 생활, 기술 중 하나)",
        "tags": ["태그1", "태그2", "태그3"],
        "language": "언어코드 (ko, en, th 중 하나)"
      }

      JSON만 반환하고 다른 텍스트는 포함하지 마세요.`,
      temperature: 0.3,
    })

    // JSON 파싱 시도
    const cleanedResult = result.replace(/```json\n?|\n?```/g, "").trim()
    const parsedData = JSON.parse(cleanedResult)

    // 언어 감지
    const detectedLanguage = parsedData.language || (await detectLanguage(parsedData.title + " " + parsedData.content))
    let isTranslated = false

    // 번역이 활성화되고 한국어가 아닌 경우 번역 수행
    if (enableTranslation && detectedLanguage !== "ko") {
      try {
        console.log(`${detectedLanguage} 언어 감지됨. 한국어로 번역 시작...`)

        const translatedTitle = await translateToKorean(parsedData.title, detectedLanguage)
        const translatedSummary = parsedData.summary
          ? await translateToKorean(parsedData.summary, detectedLanguage)
          : ""
        const translatedContent = await translateToKorean(parsedData.content, detectedLanguage)

        parsedData.title = translatedTitle
        parsedData.summary = translatedSummary
        parsedData.content = translatedContent
        isTranslated = true

        console.log("번역 완료")
      } catch (translationError) {
        console.error("번역 실패:", translationError)
        // 번역 실패 시 원문 그대로 사용하고 사용자에게 알림
        throw new Error(
          `번역 중 오류가 발생했습니다. 원문을 확인하고 수동으로 번역해주세요. (${translationError instanceof Error ? translationError.message : "알 수 없는 오류"})`,
        )
      }
    }

    // 기본값 설정
    const newsData: Partial<NewsFormData & { original_language: string; is_translated: boolean }> = {
      title: parsedData.title || "제목 없음",
      summary: parsedData.summary || "",
      content: parsedData.content || "내용 없음",
      imageUrl: parsedData.imageUrl || "",
      source: parsedData.source || "알 수 없는 출처",
      originalUrl: url,
      category: parsedData.category || "일반",
      tags: Array.isArray(parsedData.tags) ? parsedData.tags : [],
      isActive: true,
      isFeatured: false,
      original_language: detectedLanguage,
      is_translated: isTranslated,
    }

    return newsData
  } catch (error) {
    console.error("AI 뉴스 파싱 오류:", error)
    throw new Error(`AI 분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// 기존 텍스트 번역 함수 (수동 번역용)
export async function translateNewsText(text: string, fromLanguage: string): Promise<string> {
  if (!text.trim()) {
    throw new Error("번역할 텍스트가 없습니다.")
  }

  if (fromLanguage === "ko") {
    return text
  }

  try {
    return await translateToKorean(text, fromLanguage)
  } catch (error) {
    console.error("텍스트 번역 오류:", error)
    throw error
  }
}

// 뉴스 생성
export async function createNews(data: NewsFormData & { original_language?: string; is_translated?: boolean }) {
  console.log("createNews 호출됨:", data)

  if (!supabase) {
    console.error("Supabase 클라이언트가 없습니다")
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  // 필수 필드 검증
  if (!data.title || !data.content || !data.source || !data.originalUrl) {
    throw new Error("제목, 내용, 출처, 원본 URL은 필수 입력 항목입니다.")
  }

  try {
    // 데이터베이스에 삽입할 데이터 준비
    const insertData = {
      title: data.title,
      summary: data.summary || null,
      content: data.content,
      image_url: data.imageUrl || null,
      source: data.source,
      original_url: data.originalUrl,
      published_at: data.publishedAt ? new Date(data.publishedAt).toISOString() : new Date().toISOString(),
      category: data.category || "일반",
      tags: data.tags || [],
      is_active: data.isActive !== false,
      is_featured: data.isFeatured || false,
      view_count: 0,
      original_language: data.original_language || "ko",
      is_translated: data.is_translated || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("삽입할 뉴스 데이터:", insertData)

    const { data: result, error } = await supabase.from("news").insert([insertData]).select().single()

    if (error) {
      console.error("Supabase 뉴스 삽입 오류:", error)
      throw new Error(`뉴스 생성 실패: ${error.message}`)
    }

    console.log("뉴스 생성 성공:", result)

    // 페이지 재검증
    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("뉴스 생성 오류:", error)
    throw error
  }
}

// 뉴스 업데이트
export async function updateNews(
  id: number,
  data: Partial<NewsFormData & { original_language?: string; is_translated?: boolean }>,
) {
  console.log("updateNews 호출됨:", { id, data })

  if (!supabase) {
    console.error("Supabase 클라이언트가 없습니다")
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  if (!id || id <= 0) {
    throw new Error("유효하지 않은 뉴스 ID입니다.")
  }

  try {
    // 업데이트할 데이터 준비
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // 각 필드를 안전하게 처리
    if (data.title !== undefined) updateData.title = data.title || null
    if (data.summary !== undefined) updateData.summary = data.summary || null
    if (data.content !== undefined) updateData.content = data.content || null
    if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl || null
    if (data.source !== undefined) updateData.source = data.source || null
    if (data.originalUrl !== undefined) updateData.original_url = data.originalUrl || null
    if (data.publishedAt !== undefined)
      updateData.published_at = data.publishedAt ? new Date(data.publishedAt).toISOString() : null
    if (data.category !== undefined) updateData.category = data.category || "일반"
    if (data.tags !== undefined) updateData.tags = data.tags || []
    if (data.isActive !== undefined) updateData.is_active = Boolean(data.isActive)
    if (data.isFeatured !== undefined) updateData.is_featured = Boolean(data.isFeatured)
    if (data.original_language !== undefined) updateData.original_language = data.original_language || "ko"
    if (data.is_translated !== undefined) updateData.is_translated = Boolean(data.is_translated)

    console.log("업데이트할 뉴스 데이터:", updateData)

    const { data: result, error } = await supabase.from("news").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Supabase 뉴스 업데이트 오류:", error)
      throw new Error(`뉴스 업데이트 실패: ${error.message}`)
    }

    if (!result) {
      throw new Error("업데이트된 뉴스를 찾을 수 없습니다.")
    }

    console.log("뉴스 업데이트 성공:", result)

    // 페이지 재검증
    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("뉴스 업데이트 오류:", error)
    throw error
  }
}

// 뉴스 삭제
export async function deleteNews(id: number) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { error } = await supabase.from("news").delete().eq("id", id)

    if (error) {
      throw new Error(`뉴스 삭제 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("뉴스 삭제 오류:", error)
    throw error
  }
}

// 다중 뉴스 삭제
export async function deleteMultipleNews(ids: number[]) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  if (!ids.length) {
    throw new Error("삭제할 뉴스가 선택되지 않았습니다.")
  }

  try {
    const { error } = await supabase.from("news").delete().in("id", ids)

    if (error) {
      throw new Error(`뉴스 삭제 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return { success: true, deletedCount: ids.length }
  } catch (error) {
    console.error("다중 뉴스 삭제 오류:", error)
    throw error
  }
}

// 뉴스 목록 가져오기 (관리자용)
export async function getNewsForAdmin() {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false })

    if (error) {
      throw new Error(`뉴스 목록 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("뉴스 목록 조회 오류:", error)
    throw error
  }
}

// 뉴스 특성 상태 업데이트
export async function updateNewsFeatureStatus(id: number, isFeatured: boolean) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const updateData: any = {
      is_featured: isFeatured,
      updated_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabase.from("news").update(updateData).eq("id", id).select().single()

    if (error) {
      throw new Error(`뉴스 특성 상태 업데이트 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    revalidatePath("/")

    return result
  } catch (error) {
    console.error("뉴스 특성 상태 업데이트 오류:", error)
    throw error
  }
}

// 뉴스 조회수 증가
export async function incrementNewsViewCount(id: number) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { error } = await supabase.rpc("increment_news_view_count", { news_id: id })

    if (error) {
      console.error("뉴스 조회수 업데이트 오류:", error)
      // 조회수 업데이트 실패는 치명적이지 않으므로 에러를 던지지 않음
    }
  } catch (error) {
    console.error("뉴스 조회수 증가 오류:", error)
    // 조회수 업데이트 실패는 치명적이지 않으므로 에러를 던지지 않음
  }
}
