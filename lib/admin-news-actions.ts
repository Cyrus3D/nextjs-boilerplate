"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// 뉴스 테이블 존재 확인 함수
export async function checkNewsTablesExist(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

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

// 뉴스 목록 가져오기
export async function getNewsArticles(limit = 10, offset = 0) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return { data: [], error: null, count: 0 }
    }

    const supabase = getSupabaseClient()

    const { data, error, count } = await supabase
      .from("news_articles")
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
    const safeData = (data || []).map((item) => ({
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

    return { data: safeData, error: null, count: Number(count) || 0 }
  } catch (error) {
    console.error("Error in getNewsArticles:", error)
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

    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("news_categories")
      .select("id, name, color_class, created_at")
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

    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("news_tags").select("id, name, created_at").order("name")

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

// 뉴스 조회수 증가
export async function incrementNewsViewCount(id: number) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return { error: "News tables do not exist" }
    }

    const supabase = getSupabaseClient()
    const newsId = Number(id)

    // 현재 조회수 가져오기
    const { data: currentNews } = await supabase.from("news_articles").select("view_count").eq("id", newsId).single()

    if (currentNews) {
      const newViewCount = Number(currentNews.view_count || 0) + 1

      const { error } = await supabase.from("news_articles").update({ view_count: newViewCount }).eq("id", newsId)

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
export async function analyzeNewsUrl(url: string) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return {
        success: false,
        message: "News tables do not exist. Please run the database setup script first.",
        data: null,
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
        message: errorData.message || "Failed to analyze news",
        data: null,
      }
    }

    const result = await response.json()

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to analyze news",
        data: null,
      }
    }

    revalidatePath("/dashboard-mgmt-2024")
    return {
      success: true,
      message: "News analyzed and saved successfully",
      data: result.data,
    }
  } catch (error) {
    console.error("Error in analyzeNewsUrl:", error)
    return {
      success: false,
      message: "Failed to analyze and save news",
      data: null,
    }
  }
}

// 뉴스 삭제
export async function deleteNewsArticle(id: number) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return { success: false, message: "News tables do not exist" }
    }

    const supabase = getSupabaseClient()
    const newsId = Number(id)

    const { error } = await supabase.from("news_articles").delete().eq("id", newsId)

    if (error) {
      console.error("Error deleting news article:", error)
      return { success: false, message: error.message }
    }

    revalidatePath("/dashboard-mgmt-2024")
    return { success: true, message: "뉴스 기사가 삭제되었습니다." }
  } catch (error) {
    console.error("Error in deleteNewsArticle:", error)
    return { success: false, message: "Failed to delete news article" }
  }
}

// 뉴스 추천 상태 토글
export async function toggleNewsFeature(id: number, featured: boolean) {
  try {
    const tablesExist = await checkNewsTablesExist()
    if (!tablesExist) {
      return { success: false, message: "News tables do not exist" }
    }

    const supabase = getSupabaseClient()
    const newsId = Number(id)

    const { error } = await supabase
      .from("news_articles")
      .update({ is_featured: Boolean(featured) })
      .eq("id", newsId)

    if (error) {
      console.error("Error toggling news feature:", error)
      return { success: false, message: error.message }
    }

    revalidatePath("/dashboard-mgmt-2024")
    return { success: true, message: "뉴스 추천 상태가 변경되었습니다." }
  } catch (error) {
    console.error("Error in toggleNewsFeature:", error)
    return { success: false, message: "Failed to toggle news feature" }
  }
}
