"use server"

import { supabase } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"
import type { NewsFormData, NewsArticle, NewsCategory, NewsTag, NewsAnalysisResult } from "../types/news"

// Check if Supabase is available
function checkSupabase() {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다. 환경 변수를 확인해주세요.")
  }
  return supabase
}

// Helper function to extract JSON from AI response
function extractJsonFromResponse(text: string): any {
  try {
    // First try to parse as is
    return JSON.parse(text)
  } catch {
    // Try to find JSON within the text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch {
        // If still fails, try to clean up common issues
        const cleanedText = text
          .replace(/```json\n?/g, "")
          .replace(/\n?```/g, "")
          .replace(/^[^{]*/, "")
          .replace(/[^}]*$/, "")
          .trim()

        return JSON.parse(cleanedText)
      }
    }
    throw new Error("JSON을 찾을 수 없습니다")
  }
}

// AI를 사용한 뉴스 분석
export async function analyzeNewsFromUrl(url: string): Promise<NewsAnalysisResult> {
  if (!url.trim()) {
    throw new Error("분석할 URL이 없습니다.")
  }

  try {
    const { text: analysisResult } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Please analyze the news from this URL: ${url}

IMPORTANT: You must respond ONLY with valid JSON in the exact format below. Do not include any other text, explanations, or markdown formatting.

{
  "title": "News title in Korean",
  "content": "Full news content in Korean (minimum 200 characters)",
  "summary": "News summary in Korean (around 100 characters)",
  "category": "Category name (choose one: 일반뉴스, 비즈니스, 기술, 건강, 여행, 음식, 교육, 스포츠, 문화, 정치)",
  "tags": ["tag1", "tag2", "tag3"],
  "language": "Language code (ko, en, or th)",
  "author": "Author name if available, otherwise null"
}

Return ONLY the JSON object, nothing else.`,
      temperature: 0.1,
    })

    console.log("AI Response:", analysisResult)

    const parsedData = extractJsonFromResponse(analysisResult)

    // Validate required fields
    if (!parsedData.title || !parsedData.content) {
      throw new Error("AI 응답에서 필수 필드(제목, 내용)를 찾을 수 없습니다.")
    }

    return {
      title: parsedData.title || "제목 없음",
      content: parsedData.content || "내용 없음",
      summary: parsedData.summary || parsedData.content.substring(0, 100) + "...",
      category: parsedData.category || "일반뉴스",
      tags: Array.isArray(parsedData.tags) ? parsedData.tags : [],
      language: parsedData.language || "ko",
      author: parsedData.author || null,
    }
  } catch (error) {
    console.error("뉴스 분석 오류:", error)

    // If it's a JSON parsing error, provide a more helpful message
    if (error instanceof SyntaxError || (error instanceof Error && error.message.includes("JSON"))) {
      throw new Error("AI 응답을 파싱할 수 없습니다. URL이 유효한 뉴스 페이지인지 확인해주세요.")
    }

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
      prompt: `Translate the following text to Korean and detect the original language.

Text: "${content}"

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "translatedContent": "Korean translation of the content",
  "detectedLanguage": "Detected language code (ko, en, or th)"
}

If the original text is already in Korean, return it as is and set detectedLanguage to "ko".
Return ONLY the JSON object, nothing else.`,
      temperature: 0.1,
    })

    console.log("Translation Response:", result)

    const parsedData = extractJsonFromResponse(result)

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
  const client = checkSupabase()

  if (!data.title || !data.content) {
    throw new Error("제목과 내용은 필수 입력 항목입니다.")
  }

  try {
    // 뉴스 생성
    const newsData = {
      title: data.title,
      content: data.content,
      summary: data.summary || null,
      category_id: data.category_id || null,
      author: data.author || null,
      source_url: data.source_url || null,
      image_url: data.image_url || null,
      is_featured: data.is_featured || false,
      is_active: data.is_active !== false,
      published_at: data.published_at || new Date().toISOString(),
      original_language: data.original_language || "ko",
      is_translated: data.is_translated || false,
    }

    const { data: newsResult, error: newsError } = await client
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
  const client = checkSupabase()

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

    const { data: result, error } = await client
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
  const client = checkSupabase()

  try {
    const { error } = await client.from("news").delete().eq("id", id)

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
  const client = checkSupabase()

  try {
    const { data, error } = await client
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
  const client = checkSupabase()

  try {
    const { data, error } = await client.from("news_categories").select("*").order("name")

    if (error) {
      throw new Error(`뉴스 카테고리 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("뉴스 카테고리 조회 오류:", error)
    // Return empty array instead of throwing error to prevent app crash
    return []
  }
}

// 뉴스 태그 조회
export async function getNewsTags(): Promise<NewsTag[]> {
  const client = checkSupabase()

  try {
    const { data, error } = await client.from("news_tags").select("*").order("name")

    if (error) {
      throw new Error(`뉴스 태그 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("뉴스 태그 조회 오류:", error)
    // Return empty array instead of throwing error to prevent app crash
    return []
  }
}

// 뉴스에 태그 추가
async function addTagsToNews(newsId: number, tagNames: string[]): Promise<void> {
  const client = checkSupabase()

  if (!tagNames.length) return

  try {
    // 태그 생성 또는 조회
    const tagIds: number[] = []

    for (const tagName of tagNames) {
      if (!tagName.trim()) continue

      // 기존 태그 확인
      const { data: existingTag, error: tagSelectError } = await client
        .from("news_tags")
        .select("id")
        .eq("name", tagName.trim())
        .single()

      if (!tagSelectError && existingTag) {
        tagIds.push(existingTag.id)
      } else {
        // 새 태그 생성
        const { data: newTag, error: tagInsertError } = await client
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

      await client.from("news_tag_relations").insert(relations)
    }
  } catch (error) {
    console.error("태그 추가 오류:", error)
  }
}

// 뉴스 태그 업데이트 (트랜잭션)
async function updateNewsTagsTransaction(newsId: number, tagNames: string[]): Promise<void> {
  const client = checkSupabase()

  try {
    // 기존 태그 관계 삭제
    await client.from("news_tag_relations").delete().eq("news_id", newsId)

    // 새 태그 추가
    if (tagNames.length > 0) {
      await addTagsToNews(newsId, tagNames)
    }
  } catch (error) {
    console.error("태그 업데이트 오류:", error)
  }
}
