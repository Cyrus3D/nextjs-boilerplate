"use server"

import { supabase } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"
import type { NewsFormData, NewsAnalysisResult } from "@/types/news"

// 뉴스 URL에서 내용 분석
export async function analyzeNewsFromUrl(url: string): Promise<NewsAnalysisResult> {
  if (!url.trim()) {
    throw new Error("URL이 필요합니다.")
  }

  try {
    // URL에서 내용 가져오기 (실제로는 웹 스크래핑 라이브러리 사용)
    const response = await fetch(url)
    const html = await response.text()

    // HTML에서 텍스트 추출 (간단한 방법)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 5000) // 처음 5000자만 사용

    if (!textContent) {
      throw new Error("URL에서 내용을 추출할 수 없습니다.")
    }

    // AI로 뉴스 분석
    const { text: analysisResult } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 웹페이지 내용을 분석하여 뉴스 기사로 정리해주세요.

웹페이지 내용:
${textContent}

다음 JSON 형식으로 반환해주세요:
{
  "title": "뉴스 제목 (한국어)",
  "content": "뉴스 본문 (한국어, 500자 이상)",
  "summary": "요약 (한국어, 100자 내외)",
  "category": "카테고리 (general, business, technology, health, entertainment, sports, politics, travel, food, lifestyle 중 하나)",
  "tags": ["태그1", "태그2", "태그3"],
  "language": "원본 언어 코드 (ko, en, th 등)",
  "isTranslated": "번역 여부 (boolean)"
}

JSON만 반환하고 다른 텍스트는 포함하지 마세요.`,
      temperature: 0.3,
    })

    // JSON 파싱
    const cleanedResult = analysisResult.replace(/```json\n?|\n?```/g, "").trim()
    const parsedData = JSON.parse(cleanedResult)

    return {
      title: parsedData.title || "제목 없음",
      content: parsedData.content || "내용 없음",
      summary: parsedData.summary || "",
      category: parsedData.category || "general",
      tags: Array.isArray(parsedData.tags) ? parsedData.tags : [],
      language: parsedData.language || "ko",
      isTranslated: Boolean(parsedData.isTranslated),
    }
  } catch (error) {
    console.error("뉴스 분석 오류:", error)
    throw new Error(`뉴스 분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// 뉴스 생성
export async function createNews(data: NewsFormData) {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  if (!data.title || !data.content) {
    throw new Error("제목과 내용은 필수 입력 항목입니다.")
  }

  try {
    const insertData = {
      title: data.title,
      content: data.content,
      summary: data.summary || null,
      source_url: data.source_url || null,
      image_url: data.image_url || null,
      category: data.category || "general",
      tags: data.tags || [],
      is_featured: data.is_featured || false,
      is_active: data.is_active !== false,
      original_language: "ko",
      is_translated: false,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabase.from("news").insert([insertData]).select().single()

    if (error) {
      throw new Error(`뉴스 생성 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    return result
  } catch (error) {
    console.error("뉴스 생성 오류:", error)
    throw error
  }
}

// 뉴스 업데이트
export async function updateNews(id: number, data: Partial<NewsFormData>) {
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
    if (data.content !== undefined) updateData.content = data.content
    if (data.summary !== undefined) updateData.summary = data.summary || null
    if (data.source_url !== undefined) updateData.source_url = data.source_url || null
    if (data.image_url !== undefined) updateData.image_url = data.image_url || null
    if (data.category !== undefined) updateData.category = data.category
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.is_featured !== undefined) updateData.is_featured = Boolean(data.is_featured)
    if (data.is_active !== undefined) updateData.is_active = Boolean(data.is_active)

    const { data: result, error } = await supabase.from("news").update(updateData).eq("id", id).select().single()

    if (error) {
      throw new Error(`뉴스 업데이트 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
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
    return { success: true }
  } catch (error) {
    console.error("뉴스 삭제 오류:", error)
    throw error
  }
}

// 뉴스 목록 가져오기
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
    return { success: true, deletedCount: ids.length }
  } catch (error) {
    console.error("다중 뉴스 삭제 오류:", error)
    throw error
  }
}
