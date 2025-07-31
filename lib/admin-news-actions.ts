"use server"

import { supabase } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"
import type { NewsFormData, NewsArticle, NewsCategory, NewsTag, NewsAnalysisResult } from "../types/news"

// AI를 사용한 뉴스 분석
export async function analyzeNewsFromUrl(url: string): Promise<NewsAnalysisResult> {
  if (!url.trim()) {
    throw new Error("분석할 URL이 없습니다.")
  }

  try {
    // URL에서 내용 추출 (실제로는 웹 스크래핑이 필요하지만, 여기서는 시뮬레이션)
    const { text: analysisResult } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 URL의 뉴스를 분석해주세요: ${url}

      다음 형식으로 JSON을 반환해주세요:
      {
        "title": "뉴스 제목",
        "content": "뉴스 본문 (최소 200자 이상)",
        "summary": "뉴스 요약 (100자 내외)",
        "category": "카테고리명 (일반뉴스, 비즈니스, 기술, 건강, 여행, 음식, 교육, 스포츠 중 하나)",
        "tags": ["태그1", "태그2", "태그3"],
        "language": "언어코드 (ko, en, th 중 하나)",
        "author": "작성자명 (있는 경우)"
      }

      JSON만 반환하고 다른 텍스트는 포함하지 마세요.`,
      temperature: 0.3,
    })

    const cleanedResult = analysisResult.replace(/```json\n?|\n?```/g, "").trim()
    const parsedData = JSON.parse(cleanedResult)

    return {
      title: parsedData.title || "제목 없음",
      content: parsedData.content || "내용 없음",
      summary: parsedData.summary || "요약 없음",
      category: parsedData.category || "일반뉴스",
      tags: parsedData.tags || [],
      language: parsedData.language || "ko",
      author: parsedData.author || null,
    }
  } catch (error) {
    console.error("뉴스 분석 오류:", error)
    throw new Error(`뉴스 분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// 언어 감지 및 번역
export async function translateNews(
  content: string,
  fromLang = "auto",
): Promise<{ translatedContent: string; detectedLanguage: string }> {
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 텍스트를 분석하고 한국어로 번역해주세요.

      텍스트: "${content}"

      다음 형식으로 JSON을 반환해주세요:
      {
        "translatedContent": "한국어로 번역된 내용",
        "detectedLanguage": "감지된 언어코드 (ko, en, th 중 하나)"
      }

      만약 원문이 이미 한국어라면 원문을 그대로 반환하고 detectedLanguage를 "ko"로 설정하세요.
      JSON만 반환하고 다른 텍스트는 포함하지 마세요.`,
      temperature: 0.1,
    })

    const cleanedResult = result.replace(/```json\n?|\n?```/g, "").trim()
    const parsedData = JSON.parse(cleanedResult)

    return {
      translatedContent: parsedData.translatedContent || content,
      detectedLanguage: parsedData.detectedLanguage || "ko",
    }
  } catch (error) {
    console.error("번역 오류:", error)
    return {
      translatedContent: content,
      detectedLanguage: fromLang === "auto" ? "ko" : fromLang,
    }
  }
}

// 뉴스 생성
export async function createNews(data: NewsFormData): Promise<NewsArticle> {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  if (!data.title || !data.content) {
    throw new Error("제목과 내용은 필수 입력 항목입니다.")
  }

  try {
    // 카테고리 ID 찾기
    let categoryId = data.category_id
    if (!categoryId && data.category_id) {
      const { data: categories, error: categoryError } = await supabase
        .from("news_categories")
        .select("id")
        .eq("name", data.category_id)
        .single()

      if (!categoryError && categories) {
        categoryId = categories.id
      }
    }

    // 뉴스 생성
    const newsData = {
      title: data.title,
      content: data.content,
      summary: data.summary || null,
      category_id: categoryId || null,
      author: data.author || null,
      source_url: data.source_url || null,
      image_url: data.image_url || null,
      is_featured: data.is_featured || false,
      is_active: data.is_active !== false,
      published_at: data.published_at || new Date().toISOString(),
      original_language: data.original_language || "ko",
      is_translated: data.is_translated || false,
    }

    const { data: newsResult, error: newsError } = await supabase
      .from("news")
      .insert([newsData])
      .select(`
        *,
        category:news_categories(*)
      `)
      .single()

    if (newsError) {
      throw new Error(`뉴스 생성 실패: ${newsError.message}`)
    }

    // 태그 처리
    if (data.tag_names && data.tag_names.length > 0) {
      await addTagsToNews(newsResult.id, data.tag_names)
    }

    revalidatePath("/dashboard-mgmt-2024")
    return newsResult
  } catch (error) {
    console.error("뉴스 생성 오류:", error)
    throw error
  }
}

// 뉴스 업데이트
export async function updateNews(id: number, data: Partial<NewsFormData>): Promise<NewsArticle> {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (data.title !== undefined) updateData.title = data.title
    if (data.content !== undefined) updateData.content = data.content
    if (data.summary !== undefined) updateData.summary = data.summary || null
    if (data.category_id !== undefined) updateData.category_id = data.category_id
    if (data.author !== undefined) updateData.author = data.author || null
    if (data.source_url !== undefined) updateData.source_url = data.source_url || null
    if (data.image_url !== undefined) updateData.image_url = data.image_url || null
    if (data.is_featured !== undefined) updateData.is_featured = Boolean(data.is_featured)
    if (data.is_active !== undefined) updateData.is_active = Boolean(data.is_active)
    if (data.published_at !== undefined) updateData.published_at = data.published_at
    if (data.original_language !== undefined) updateData.original_language = data.original_language
    if (data.is_translated !== undefined) updateData.is_translated = Boolean(data.is_translated)

    const { data: result, error } = await supabase
      .from("news")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        category:news_categories(*)
      `)
      .single()

    if (error) {
      throw new Error(`뉴스 업데이트 실패: ${error.message}`)
    }

    // 태그 업데이트
    if (data.tag_names !== undefined) {
      await updateNewsTagsTransaction(id, data.tag_names)
    }

    revalidatePath("/dashboard-mgmt-2024")
    return result
  } catch (error) {
    console.error("뉴스 업데이트 오류:", error)
    throw error
  }
}

// 뉴스 삭제
export async function deleteNews(id: number): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { error } = await supabase.from("news").delete().eq("id", id)

    if (error) {
      throw new Error(`뉴스 삭제 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
  } catch (error) {
    console.error("뉴스 삭제 오류:", error)
    throw error
  }
}

// 뉴스 목록 조회
export async function getNewsForAdmin(): Promise<NewsArticle[]> {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.")
  }

  try {
    const { data, error } = await supabase
      .from("news")
      .select(`
        *,
        category:news_categories(*),
        tags:news_tag_relations(tag:news_tags(*))
      `)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`뉴스 목록 조회 실패: ${error.message}`)
    }

    return (
      data?.map((news) => ({
        ...news,
        tags: news.tags?.map((t: any) => t.tag) || [],
      })) || []
    )
  } catch (error) {
    console.error("뉴스 목록 조회 오류:", error)
    throw error
  }
}

// 뉴스 카테고리 조회
export async function getNewsCategories(): Promise<NewsCategory[]> {
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

// 뉴스 태그 조회
export async function getNewsTags(): Promise<NewsTag[]> {
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

// 뉴스에 태그 추가
async function addTagsToNews(newsId: number, tagNames: string[]): Promise<void> {
  if (!supabase || !tagNames.length) return

  try {
    // 태그 생성 또는 조회
    const tagIds: number[] = []

    for (const tagName of tagNames) {
      if (!tagName.trim()) continue

      // 기존 태그 확인
      const { data: existingTag, error: tagSelectError } = await supabase
        .from("news_tags")
        .select("id")
        .eq("name", tagName.trim())
        .single()

      if (!tagSelectError && existingTag) {
        tagIds.push(existingTag.id)
      } else {
        // 새 태그 생성
        const { data: newTag, error: tagInsertError } = await supabase
          .from("news_tags")
          .insert({ name: tagName.trim() })
          .select("id")
          .single()

        if (!tagInsertError && newTag) {
          tagIds.push(newTag.id)
        }
      }
    }

    // 태그 관계 생성
    if (tagIds.length > 0) {
      const relations = tagIds.map((tagId) => ({
        news_id: newsId,
        tag_id: tagId,
      }))

      await supabase.from("news_tag_relations").insert(relations)
    }
  } catch (error) {
    console.error("태그 추가 오류:", error)
  }
}

// 뉴스 태그 업데이트 (트랜잭션)
async function updateNewsTagsTransaction(newsId: number, tagNames: string[]): Promise<void> {
  if (!supabase) return

  try {
    // 기존 태그 관계 삭제
    await supabase.from("news_tag_relations").delete().eq("news_id", newsId)

    // 새 태그 추가
    if (tagNames.length > 0) {
      await addTagsToNews(newsId, tagNames)
    }
  } catch (error) {
    console.error("태그 업데이트 오류:", error)
  }
}
