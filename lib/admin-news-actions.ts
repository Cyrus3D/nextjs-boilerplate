"use server"

import { createServerClient } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"

export interface NewsFormData {
  title: string
  content: string
  summary?: string
  category_id?: number
  author?: string
  source_url?: string
  image_url?: string
  is_featured?: boolean
  is_active?: boolean
  published_at?: string
  original_language?: string
  is_translated?: boolean
  tag_names?: string[]
}

// 뉴스 테이블 존재 확인 함수
export async function checkNewsTablesExist(): Promise<boolean> {
  try {
    const supabase = createServerClient()

    // news_articles 테이블 존재 확인
    const { error } = await supabase.from("news_articles").select("id").limit(1)

    if (error) {
      if (error.message.includes("does not exist") || error.code === "42P01") {
        console.log("News tables do not exist:", error.message)
        return false
      }
      console.error("Error checking news tables:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error checking news tables:", error)
    return false
  }
}

// 뉴스 목록 가져오기 (관리자용)
export async function getNewsForAdmin() {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return []
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("news_articles")
      .select(`
        id,
        title,
        summary,
        content,
        author,
        source_url,
        image_url,
        published_at,
        view_count,
        is_featured,
        is_active,
        original_language,
        is_translated,
        created_at,
        updated_at,
        category_id,
        category:news_categories(
          id,
          name,
          color_class
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching news for admin:", error)
      return []
    }

    // 태그 정보 별도 조회
    const newsIds = (data || []).map((item) => Number(item.id))
    let tagsData: any[] = []

    if (newsIds.length > 0) {
      const { data: tagRelations } = await supabase
        .from("news_article_tags")
        .select(`
          article_id,
          tag:news_tags(
            id,
            name
          )
        `)
        .in("article_id", newsIds)

      tagsData = tagRelations || []
    }

    // 뉴스별 태그 그룹화
    const tagsMap = new Map<number, any[]>()
    tagsData.forEach((relation) => {
      const articleId = Number(relation.article_id)
      if (!tagsMap.has(articleId)) {
        tagsMap.set(articleId, [])
      }
      if (relation.tag) {
        tagsMap.get(articleId)?.push(relation.tag)
      }
    })

    // 안전한 기본값 설정
    return (data || []).map((item) => ({
      id: Number(item.id),
      title: String(item.title || "제목 없음"),
      summary: String(item.summary || (item.content ? String(item.content).substring(0, 150) + "..." : "요약 없음")),
      content: String(item.content || "내용 없음"),
      author: item.author ? String(item.author) : null,
      source_url: item.source_url ? String(item.source_url) : null,
      image_url: item.image_url ? String(item.image_url) : null,
      published_at: String(item.published_at || new Date().toISOString()),
      view_count: Number(item.view_count) || 0,
      is_featured: Boolean(item.is_featured),
      is_active: Boolean(item.is_active),
      original_language: String(item.original_language || "ko"),
      is_translated: Boolean(item.is_translated),
      created_at: String(item.created_at || new Date().toISOString()),
      updated_at: String(item.updated_at || new Date().toISOString()),
      category: item.category || null,
      tags: tagsMap.get(Number(item.id)) || [],
    }))
  } catch (error) {
    console.error("Error in getNewsForAdmin:", error)
    return []
  }
}

// 뉴스 카테고리 가져오기
export async function getNewsCategories() {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return []
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("news_categories")
      .select("id, name, color_class, created_at")
      .order("name")

    if (error) {
      console.error("Error fetching news categories:", error)
      return []
    }

    return (data || []).map((category) => ({
      id: Number(category.id),
      name: String(category.name),
      color_class: String(category.color_class || "bg-gray-100 text-gray-800"),
      created_at: String(category.created_at),
    }))
  } catch (error) {
    console.error("Error in getNewsCategories:", error)
    return []
  }
}

// 뉴스 태그 가져오기
export async function getNewsTags() {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return []
    }

    const supabase = createServerClient()

    const { data, error } = await supabase.from("news_tags").select("id, name, created_at").order("name")

    if (error) {
      console.error("Error fetching news tags:", error)
      return []
    }

    return (data || []).map((tag) => ({
      id: Number(tag.id),
      name: String(tag.name),
      created_at: String(tag.created_at),
    }))
  } catch (error) {
    console.error("Error in getNewsTags:", error)
    return []
  }
}

// 뉴스 생성
export async function createNews(data: NewsFormData) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      throw new Error("News tables do not exist. Please run the database setup script first.")
    }

    const supabase = createServerClient()

    // 필수 필드 검증
    if (!String(data.title).trim() || !String(data.content).trim()) {
      throw new Error("제목과 내용은 필수 입력 항목입니다.")
    }

    // 뉴스 데이터 준비
    const newsData = {
      title: String(data.title).trim(),
      content: String(data.content).trim(),
      summary: data.summary ? String(data.summary).trim() : null,
      category_id: data.category_id ? Number(data.category_id) : null,
      author: data.author ? String(data.author).trim() : null,
      source_url: data.source_url ? String(data.source_url).trim() : null,
      image_url: data.image_url ? String(data.image_url).trim() : null,
      is_featured: Boolean(data.is_featured),
      is_active: data.is_active !== false,
      published_at: data.published_at ? String(data.published_at) : new Date().toISOString(),
      original_language: String(data.original_language || "ko"),
      is_translated: Boolean(data.is_translated),
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabase.from("news_articles").insert([newsData]).select().single()

    if (error) {
      console.error("Error creating news:", error)
      throw new Error(`뉴스 생성 실패: ${error.message}`)
    }

    // 태그 처리
    if (data.tag_names && data.tag_names.length > 0) {
      await processNewsTags(Number(result.id), data.tag_names)
    }

    revalidatePath("/dashboard-mgmt-2024")
    return result
  } catch (error) {
    console.error("Error in createNews:", error)
    throw error
  }
}

// 뉴스 업데이트
export async function updateNews(id: number, data: NewsFormData) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      throw new Error("News tables do not exist.")
    }

    const supabase = createServerClient()
    const newsId = Number(id)

    // 업데이트 데이터 준비
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (data.title !== undefined) updateData.title = String(data.title).trim()
    if (data.content !== undefined) updateData.content = String(data.content).trim()
    if (data.summary !== undefined) updateData.summary = data.summary ? String(data.summary).trim() : null
    if (data.category_id !== undefined) updateData.category_id = data.category_id ? Number(data.category_id) : null
    if (data.author !== undefined) updateData.author = data.author ? String(data.author).trim() : null
    if (data.source_url !== undefined) updateData.source_url = data.source_url ? String(data.source_url).trim() : null
    if (data.image_url !== undefined) updateData.image_url = data.image_url ? String(data.image_url).trim() : null
    if (data.is_featured !== undefined) updateData.is_featured = Boolean(data.is_featured)
    if (data.is_active !== undefined) updateData.is_active = Boolean(data.is_active)
    if (data.published_at !== undefined) updateData.published_at = String(data.published_at)
    if (data.original_language !== undefined) updateData.original_language = String(data.original_language)
    if (data.is_translated !== undefined) updateData.is_translated = Boolean(data.is_translated)

    const { data: result, error } = await supabase
      .from("news_articles")
      .update(updateData)
      .eq("id", newsId)
      .select()
      .single()

    if (error) {
      console.error("Error updating news:", error)
      throw new Error(`뉴스 업데이트 실패: ${error.message}`)
    }

    // 태그 처리
    if (data.tag_names !== undefined) {
      // 기존 태그 관계 삭제
      await supabase.from("news_article_tags").delete().eq("article_id", newsId)

      // 새 태그 관계 생성
      if (data.tag_names.length > 0) {
        await processNewsTags(newsId, data.tag_names)
      }
    }

    revalidatePath("/dashboard-mgmt-2024")
    return result
  } catch (error) {
    console.error("Error in updateNews:", error)
    throw error
  }
}

// 뉴스 삭제
export async function deleteNews(id: number) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      throw new Error("News tables do not exist.")
    }

    const supabase = createServerClient()
    const newsId = Number(id)

    const { error } = await supabase.from("news_articles").delete().eq("id", newsId)

    if (error) {
      console.error("Error deleting news:", error)
      throw new Error(`뉴스 삭제 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteNews:", error)
    throw error
  }
}

// 태그 처리 헬퍼 함수
async function processNewsTags(articleId: number, tagNames: string[]) {
  const supabase = createServerClient()

  for (const tagName of tagNames) {
    const safeTagName = String(tagName).trim()
    if (!safeTagName) continue

    // 태그 존재 확인 또는 생성
    const { data: existingTag } = await supabase.from("news_tags").select("id").eq("name", safeTagName).single()

    let tagId = existingTag?.id

    if (!tagId) {
      const { data: newTag, error } = await supabase
        .from("news_tags")
        .insert([{ name: safeTagName }])
        .select("id")
        .single()

      if (error) {
        console.error("Error creating tag:", error)
        continue
      }

      tagId = newTag?.id
    }

    if (tagId) {
      // 뉴스-태그 관계 생성
      await supabase.from("news_article_tags").insert([
        {
          article_id: Number(articleId),
          tag_id: Number(tagId),
        },
      ])
    }
  }
}

// URL에서 뉴스 분석
export async function analyzeNewsFromUrl(url: string) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      throw new Error("News tables do not exist. Please run the database setup script first.")
    }

    // URL 유효성 검사
    try {
      new URL(String(url))
    } catch {
      throw new Error("유효한 URL을 입력해주세요.")
    }

    // 뉴스 스크래핑 API 호출
    const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const response = await fetch(`${apiUrl}/api/scrape-news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: String(url) }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "뉴스 분석에 실패했습니다.")
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || "뉴스 분석에 실패했습니다.")
    }

    return {
      title: String(result.data?.title || "제목 없음"),
      content: String(result.data?.content || "내용 없음"),
      summary: String(result.data?.summary || "요약 없음"),
      category: String(result.data?.category || "기타"),
      tags: Array.isArray(result.data?.tags) ? result.data.tags.map((tag: any) => String(tag)) : [],
      author: result.data?.author ? String(result.data.author) : null,
      language: String(result.data?.language || "ko"),
    }
  } catch (error) {
    console.error("Error in analyzeNewsFromUrl:", error)
    throw error
  }
}

// 뉴스 번역
export async function translateNews(content: string, fromLanguage = "auto") {
  try {
    if (!String(content).trim()) {
      throw new Error("번역할 내용이 없습니다.")
    }

    const { text: translatedContent } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 텍스트를 한국어로 번역해주세요. 원문의 의미와 뉘앙스를 최대한 보존하면서 자연스러운 한국어로 번역하세요.

원문 언어: ${String(fromLanguage)}
원문:
${String(content)}

번역된 텍스트만 반환하고 다른 설명은 포함하지 마세요.`,
      temperature: 0.3,
    })

    // 언어 감지
    const { text: detectedLanguage } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 텍스트의 언어를 감지하고 언어 코드만 반환하세요 (ko, en, th, ja, zh 등):

${String(content).substring(0, 200)}

언어 코드만 반환하세요.`,
      temperature: 0,
    })

    return {
      translatedContent: String(translatedContent),
      detectedLanguage: String(detectedLanguage).trim().toLowerCase(),
    }
  } catch (error) {
    console.error("Error in translateNews:", error)
    throw new Error(`번역 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}
