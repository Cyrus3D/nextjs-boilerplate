"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// 뉴스 테이블 존재 확인 함수
export async function checkNewsTablesExist(): Promise<boolean> {
  try {
    const supabase = createClient()

    // news 테이블 존재 확인
    const { error } = await supabase.from("news").select("id").limit(1)

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

// 뉴스 목록 가져오기
export async function getNews(limit = 10, offset = 0) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return { data: [], error: null, count: 0 }
    }

    const supabase = createClient()

    const { data, error, count } = await supabase
      .from("news")
      .select(
        `
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
      `,
        { count: "exact" },
      )
      .eq("is_active", true)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching news:", error)
      return { data: [], error: error.message, count: 0 }
    }

    // 태그 정보 별도 조회
    const newsIds = (data || []).map((item) => item.id)
    let tagsData: any[] = []

    if (newsIds.length > 0) {
      const { data: tagRelations } = await supabase
        .from("news_tag_relations")
        .select(`
          news_id,
          tag:news_tags(
            id,
            name
          )
        `)
        .in("news_id", newsIds)

      tagsData = tagRelations || []
    }

    // 뉴스별 태그 그룹화
    const tagsMap = new Map<number, any[]>()
    tagsData.forEach((relation) => {
      if (!tagsMap.has(relation.news_id)) {
        tagsMap.set(relation.news_id, [])
      }
      if (relation.tag) {
        tagsMap.get(relation.news_id)?.push(relation.tag)
      }
    })

    // 안전한 기본값 설정
    const safeData = (data || []).map((item) => ({
      id: item.id,
      title: item.title || "제목 없음",
      summary: item.summary || (item.content ? item.content.substring(0, 150) + "..." : "요약 없음"),
      content: item.content || "내용 없음",
      author: item.author || null,
      source_url: item.source_url || null,
      image_url: item.image_url || null,
      published_at: item.published_at || new Date().toISOString(),
      view_count: Number(item.view_count) || 0,
      is_featured: Boolean(item.is_featured),
      is_active: Boolean(item.is_active),
      original_language: item.original_language || "ko",
      is_translated: Boolean(item.is_translated),
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
      category: item.category || null,
      tags: tagsMap.get(item.id) || [],
    }))

    return { data: safeData, error: null, count: count || 0 }
  } catch (error) {
    console.error("Error in getNews:", error)
    return { data: [], error: "Failed to fetch news", count: 0 }
  }
}

// 뉴스 카테고리 가져오기
export async function getNewsCategories() {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return { data: [], error: null }
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("news_categories")
      .select("id, name, color_class, is_active, created_at, updated_at")
      .eq("is_active", true)
      .order("name")

    if (error) {
      console.error("Error fetching news categories:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getNewsCategories:", error)
    return { data: [], error: "Failed to fetch categories" }
  }
}

// 뉴스 태그 가져오기
export async function getNewsTags() {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return { data: [], error: null }
    }

    const supabase = createClient()

    const { data, error } = await supabase.from("news_tags").select("id, name, created_at, updated_at").order("name")

    if (error) {
      console.error("Error fetching news tags:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getNewsTags:", error)
    return { data: [], error: "Failed to fetch tags" }
  }
}

// 뉴스 생성
export async function createNews(newsData: {
  title: string
  content: string
  summary?: string
  category_id?: number
  author?: string
  source_url?: string
  image_url?: string
  is_featured?: boolean
  original_language?: string
  is_translated?: boolean
}) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return { data: null, error: "News tables do not exist" }
    }

    const supabase = createClient()

    const insertData = {
      title: String(newsData.title),
      content: String(newsData.content),
      summary: newsData.summary ? String(newsData.summary) : null,
      category_id: newsData.category_id ? Number(newsData.category_id) : null,
      author: newsData.author ? String(newsData.author) : null,
      source_url: newsData.source_url ? String(newsData.source_url) : null,
      image_url: newsData.image_url ? String(newsData.image_url) : null,
      is_featured: Boolean(newsData.is_featured),
      original_language: newsData.original_language ? String(newsData.original_language) : "ko",
      is_translated: Boolean(newsData.is_translated),
      view_count: 0,
      published_at: new Date().toISOString(),
      is_active: true,
    }

    const { data, error } = await supabase.from("news").insert([insertData]).select().single()

    if (error) {
      console.error("Error creating news:", error)
      return { data: null, error: error.message }
    }

    revalidatePath("/dashboard-mgmt-2024")
    return { data, error: null }
  } catch (error) {
    console.error("Error in createNews:", error)
    return { data: null, error: "Failed to create news" }
  }
}

// 뉴스 업데이트
export async function updateNews(
  id: number,
  newsData: Partial<{
    title: string
    content: string
    summary: string
    category_id: number
    author: string
    source_url: string
    image_url: string
    is_featured: boolean
    is_active: boolean
    original_language: string
    is_translated: boolean
  }>,
) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return { data: null, error: "News tables do not exist" }
    }

    const supabase = createClient()

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // 안전한 타입 변환
    if (newsData.title !== undefined) updateData.title = String(newsData.title)
    if (newsData.content !== undefined) updateData.content = String(newsData.content)
    if (newsData.summary !== undefined) updateData.summary = newsData.summary ? String(newsData.summary) : null
    if (newsData.category_id !== undefined)
      updateData.category_id = newsData.category_id ? Number(newsData.category_id) : null
    if (newsData.author !== undefined) updateData.author = newsData.author ? String(newsData.author) : null
    if (newsData.source_url !== undefined)
      updateData.source_url = newsData.source_url ? String(newsData.source_url) : null
    if (newsData.image_url !== undefined) updateData.image_url = newsData.image_url ? String(newsData.image_url) : null
    if (newsData.is_featured !== undefined) updateData.is_featured = Boolean(newsData.is_featured)
    if (newsData.is_active !== undefined) updateData.is_active = Boolean(newsData.is_active)
    if (newsData.original_language !== undefined) updateData.original_language = String(newsData.original_language)
    if (newsData.is_translated !== undefined) updateData.is_translated = Boolean(newsData.is_translated)

    const { data, error } = await supabase.from("news").update(updateData).eq("id", Number(id)).select().single()

    if (error) {
      console.error("Error updating news:", error)
      return { data: null, error: error.message }
    }

    revalidatePath("/dashboard-mgmt-2024")
    return { data, error: null }
  } catch (error) {
    console.error("Error in updateNews:", error)
    return { data: null, error: "Failed to update news" }
  }
}

// 뉴스 삭제
export async function deleteNews(id: number) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return { error: "News tables do not exist" }
    }

    const supabase = createClient()

    const { error } = await supabase.from("news").delete().eq("id", Number(id))

    if (error) {
      console.error("Error deleting news:", error)
      return { error: error.message }
    }

    revalidatePath("/dashboard-mgmt-2024")
    return { error: null }
  } catch (error) {
    console.error("Error in deleteNews:", error)
    return { error: "Failed to delete news" }
  }
}

// 뉴스 조회수 증가
export async function incrementNewsViewCount(id: number) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return { error: "News tables do not exist" }
    }

    const supabase = createClient()

    // RPC 함수가 없을 수 있으므로 직접 업데이트
    const { data: currentNews } = await supabase.from("news").select("view_count").eq("id", Number(id)).single()

    if (currentNews) {
      const newViewCount = (Number(currentNews.view_count) || 0) + 1

      const { error } = await supabase.from("news").update({ view_count: newViewCount }).eq("id", Number(id))

      if (error) {
        console.error("Error incrementing view count:", error)
        return { error: error.message }
      }
    }

    return { error: null }
  } catch (error) {
    console.error("Error in incrementNewsViewCount:", error)
    return { error: "Failed to increment view count" }
  }
}

// AI 뉴스 분석 및 저장
export async function analyzeAndSaveNews(url: string) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return {
        success: false,
        error: "News tables do not exist. Please run the database setup script first.",
      }
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
      return {
        success: false,
        error: errorData.error || "Failed to analyze news",
      }
    }

    const result = await response.json()

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to analyze news",
      }
    }

    revalidatePath("/dashboard-mgmt-2024")
    return {
      success: true,
      data: result.data,
      message: "News analyzed and saved successfully",
    }
  } catch (error) {
    console.error("Error in analyzeAndSaveNews:", error)
    return {
      success: false,
      error: "Failed to analyze and save news",
    }
  }
}
