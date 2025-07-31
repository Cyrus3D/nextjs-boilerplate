"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// 뉴스 테이블 존재 확인 함수
export async function checkNewsTablesExist() {
  try {
    const supabase = createClient()

    // news 테이블 존재 확인
    const { data: newsCheck, error: newsError } = await supabase.from("news").select("id").limit(1)

    if (newsError) {
      console.log("News tables do not exist:", newsError.message)
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
        *,
        category:news_categories(id, name, color_class),
        tags:news_tags(
          id,
          name
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

    // 안전한 기본값 설정
    const safeData = (data || []).map((item) => ({
      ...item,
      view_count: item.view_count || 0,
      summary: item.summary || item.content?.substring(0, 150) + "..." || "",
      tags: item.tags || [],
      category: item.category || null,
      author: item.author || null,
      source_url: item.source_url || null,
      image_url: item.image_url || null,
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

    const { data, error } = await supabase.from("news_categories").select("*").eq("is_active", true).order("name")

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

    const { data, error } = await supabase.from("news_tags").select("*").order("name")

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

    const { data, error } = await supabase
      .from("news")
      .insert([
        {
          ...newsData,
          view_count: 0,
          published_at: new Date().toISOString(),
          is_active: true,
        },
      ])
      .select()
      .single()

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

    const { data, error } = await supabase.from("news").update(newsData).eq("id", id).select().single()

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

    const { error } = await supabase.from("news").delete().eq("id", id)

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

    const { error } = await supabase.rpc("increment_news_view_count", { news_id: id })

    if (error) {
      console.error("Error incrementing view count:", error)
      return { error: error.message }
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/scrape-news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
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
