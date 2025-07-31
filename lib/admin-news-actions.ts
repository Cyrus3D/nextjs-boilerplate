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
}

// AI를 사용한 뉴스 데이터 파싱
export async function parseNewsData(url: string): Promise<Partial<NewsFormData>> {
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
        "tags": ["태그1", "태그2", "태그3"]
      }

      JSON만 반환하고 다른 텍스트는 포함하지 마세요.`,
      temperature: 0.3,
    })

    // JSON 파싱 시도
    const cleanedResult = result.replace(/```json\n?|\n?```/g, "").trim()
    const parsedData = JSON.parse(cleanedResult)

    // 기본값 설정
    const newsData: Partial<NewsFormData> = {
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
    }

    return newsData
  } catch (error) {
    console.error("AI 뉴스 파싱 오류:", error)
    throw new Error(`AI 분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// 뉴스 생성
export async function createNews(data: NewsFormData) {
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
export async function updateNews(id: number, data: Partial<NewsFormData>) {
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
