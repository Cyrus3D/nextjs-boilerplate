import { supabase } from "./supabase"
import type { NewsArticle, NewsCategory } from "../types/news"

// 뉴스 기사 페이지네이션 조회
export async function getNewsArticlesPaginated(
  page = 1,
  pageSize = 20,
  categoryFilter?: string,
  searchTerm?: string,
): Promise<{
  articles: NewsArticle[]
  total: number
  hasMore: boolean
}> {
  try {
    if (!supabase) {
      throw new Error("Supabase client not initialized")
    }

    // 먼저 함수를 사용해서 시도
    try {
      const { data, error } = await supabase.rpc("get_news_articles_paginated", {
        page_num: page,
        page_size: pageSize,
        category_filter: categoryFilter || null,
        search_term: searchTerm || null,
        include_inactive: false,
      })

      if (error) {
        console.error("Error calling RPC function:", error)
        throw error
      }

      if (!data || data.length === 0) {
        return {
          articles: [],
          total: 0,
          hasMore: false,
        }
      }

      const total = data[0]?.total_count || 0
      const articles: NewsArticle[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.summary || "",
        content: item.content || "",
        category: item.category_name || "기타",
        publishedAt: item.published_at,
        source: item.source || "알 수 없음",
        author: item.author || null,
        imageUrl: item.image_url || null,
        url: item.external_url || null,
        tags: item.tags || [],
        viewCount: item.view_count || 0,
        isBreaking: item.is_breaking || false,
        isPinned: item.is_pinned || false,
      }))

      return {
        articles,
        total: Number(total),
        hasMore: page * pageSize < total,
      }
    } catch (rpcError) {
      console.warn("RPC function failed, trying direct query:", rpcError)

      // RPC 함수가 실패하면 직접 쿼리 시도
      let query = supabase
        .from("news_articles")
        .select(`
          id,
          title,
          summary,
          content,
          published_at,
          source,
          author,
          image_url,
          external_url,
          view_count,
          is_breaking,
          is_pinned,
          news_categories (
            name
          )
        `)
        .eq("is_active", true)
        .order("is_pinned", { ascending: false })
        .order("is_breaking", { ascending: false })
        .order("published_at", { ascending: false })

      // 카테고리 필터 적용
      if (categoryFilter) {
        query = query.eq("news_categories.name", categoryFilter)
      }

      // 검색어 필터 적용
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%`)
      }

      // 페이지네이션 적용
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data: directData, error: directError, count } = await query

      if (directError) {
        console.error("Direct query also failed:", directError)
        throw directError
      }

      const articles: NewsArticle[] = (directData || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.summary || "",
        content: item.content || "",
        category: item.news_categories?.name || "기타",
        publishedAt: item.published_at,
        source: item.source || "알 수 없음",
        author: item.author || null,
        imageUrl: item.image_url || null,
        url: item.external_url || null,
        tags: [], // 직접 쿼리에서는 태그를 가져오지 않음
        viewCount: item.view_count || 0,
        isBreaking: item.is_breaking || false,
        isPinned: item.is_pinned || false,
      }))

      return {
        articles,
        total: count || 0,
        hasMore: (count || 0) > page * pageSize,
      }
    }
  } catch (error) {
    console.error("Error in getNewsArticlesPaginated:", error)

    // 모든 쿼리가 실패하면 샘플 데이터 반환
    const sampleArticles: NewsArticle[] = [
      {
        id: 1,
        title: "태국 정부, 새로운 관광 정책 발표",
        summary: "태국 정부가 한국인 관광객 유치를 위한 새로운 정책을 발표했습니다.",
        content: "태국 관광청은 오늘 기자회견을 통해 한국인 관광객을 대상으로 한 새로운 관광 정책을 발표했습니다.",
        category: "정치",
        publishedAt: new Date().toISOString(),
        source: "태국 일보",
        author: "김태국",
        imageUrl: "/placeholder.svg?height=200&width=300&text=태국+관광+정책",
        url: null,
        tags: ["정치", "관광", "한국"],
        viewCount: 156,
        isBreaking: true,
        isPinned: true,
      },
      {
        id: 2,
        title: "방콕 지하철 새 노선 개통 예정",
        summary: "방콕 대중교통공사가 새로운 지하철 노선의 개통 일정을 발표했습니다.",
        content: "방콕 대중교통공사(BMCL)는 오늘 새로운 지하철 노선인 오렌지 라인의 개통 일정을 발표했습니다.",
        category: "교통",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        source: "방콕 포스트",
        author: "이방콕",
        imageUrl: "/placeholder.svg?height=200&width=300&text=방콕+지하철",
        url: null,
        tags: ["교통", "방콕", "지하철"],
        viewCount: 89,
        isBreaking: false,
        isPinned: true,
      },
    ]

    return {
      articles: sampleArticles.slice(0, pageSize),
      total: sampleArticles.length,
      hasMore: false,
    }
  }
}

// 뉴스 카테고리 조회
export async function getNewsCategories(): Promise<NewsCategory[]> {
  try {
    if (!supabase) {
      throw new Error("Supabase client not initialized")
    }

    // 먼저 함수를 사용해서 시도
    try {
      const { data, error } = await supabase.rpc("get_news_categories")

      if (error) {
        console.error("Error calling RPC function:", error)
        throw error
      }

      return (
        data?.map((item: any) => ({
          id: item.id,
          name: item.name,
          color_class: item.color_class,
        })) || []
      )
    } catch (rpcError) {
      console.warn("RPC function failed, trying direct query:", rpcError)

      // RPC 함수가 실패하면 직접 쿼리 시도
      const { data: directData, error: directError } = await supabase
        .from("news_categories")
        .select("id, name, color_class")
        .order("name")

      if (directError) {
        console.error("Direct query also failed:", directError)
        throw directError
      }

      return (
        directData?.map((item: any) => ({
          id: item.id,
          name: item.name,
          color_class: item.color_class,
        })) || []
      )
    }
  } catch (error) {
    console.error("Error in getNewsCategories:", error)

    // 모든 쿼리가 실패하면 기본 카테고리 반환
    return [
      { id: 1, name: "정치", color_class: "bg-red-100 text-red-800" },
      { id: 2, name: "경제", color_class: "bg-blue-100 text-blue-800" },
      { id: 3, name: "사회", color_class: "bg-green-100 text-green-800" },
      { id: 4, name: "국제", color_class: "bg-purple-100 text-purple-800" },
      { id: 5, name: "문화", color_class: "bg-pink-100 text-pink-800" },
      { id: 6, name: "스포츠", color_class: "bg-orange-100 text-orange-800" },
      { id: 7, name: "IT/과학", color_class: "bg-cyan-100 text-cyan-800" },
      { id: 8, name: "교민소식", color_class: "bg-yellow-100 text-yellow-800" },
      { id: 9, name: "생활정보", color_class: "bg-indigo-100 text-indigo-800" },
      { id: 10, name: "기타", color_class: "bg-gray-100 text-gray-800" },
    ]
  }
}

// 뉴스 조회수 증가
export async function incrementNewsViewCount(articleId: number): Promise<void> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized")
      return
    }

    // 먼저 함수를 사용해서 시도
    try {
      const { error } = await supabase.rpc("increment_news_view_count", {
        article_id: articleId,
      })

      if (error) {
        console.error("Error calling RPC function:", error)
        throw error
      }
    } catch (rpcError) {
      console.warn("RPC function failed, trying direct update:", rpcError)

      // RPC 함수가 실패하면 직접 업데이트 시도
      const { error: directError } = await supabase
        .from("news_articles")
        .update({
          view_count: supabase.raw("view_count + 1"),
          updated_at: new Date().toISOString(),
        })
        .eq("id", articleId)
        .eq("is_active", true)

      if (directError) {
        console.error("Direct update also failed:", directError)
      }
    }
  } catch (error) {
    console.error("Error in incrementNewsViewCount:", error)
  }
}

// 인기 뉴스 조회
export async function getPopularNews(limit = 10): Promise<NewsArticle[]> {
  try {
    if (!supabase) {
      throw new Error("Supabase client not initialized")
    }

    // 먼저 함수를 사용해서 시도
    try {
      const { data, error } = await supabase.rpc("get_popular_news", {
        limit_count: limit,
      })

      if (error) {
        console.error("Error calling RPC function:", error)
        throw error
      }

      return (
        data?.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary || "",
          content: null,
          category: item.category_name || "기타",
          publishedAt: item.published_at,
          source: item.source || "알 수 없음",
          author: null,
          imageUrl: null,
          url: null,
          tags: [],
          viewCount: item.view_count || 0,
          isBreaking: item.is_breaking || false,
          isPinned: item.is_pinned || false,
        })) || []
      )
    } catch (rpcError) {
      console.warn("RPC function failed, trying direct query:", rpcError)

      // RPC 함수가 실패하면 직접 쿼리 시도
      const { data: directData, error: directError } = await supabase
        .from("news_articles")
        .select(`
          id,
          title,
          summary,
          published_at,
          source,
          view_count,
          is_breaking,
          is_pinned,
          news_categories (
            name
          )
        `)
        .eq("is_active", true)
        .order("view_count", { ascending: false })
        .order("published_at", { ascending: false })
        .limit(limit)

      if (directError) {
        console.error("Direct query also failed:", directError)
        throw directError
      }

      return (
        directData?.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary || "",
          content: null,
          category: item.news_categories?.name || "기타",
          publishedAt: item.published_at,
          source: item.source || "알 수 없음",
          author: null,
          imageUrl: null,
          url: null,
          tags: [],
          viewCount: item.view_count || 0,
          isBreaking: item.is_breaking || false,
          isPinned: item.is_pinned || false,
        })) || []
      )
    }
  } catch (error) {
    console.error("Error in getPopularNews:", error)
    return []
  }
}

// 최신 뉴스 조회
export async function getLatestNews(limit = 10): Promise<NewsArticle[]> {
  try {
    if (!supabase) {
      throw new Error("Supabase client not initialized")
    }

    // 먼저 함수를 사용해서 시도
    try {
      const { data, error } = await supabase.rpc("get_latest_news", {
        limit_count: limit,
      })

      if (error) {
        console.error("Error calling RPC function:", error)
        throw error
      }

      return (
        data?.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary || "",
          content: null,
          category: item.category_name || "기타",
          publishedAt: item.published_at,
          source: item.source || "알 수 없음",
          author: null,
          imageUrl: null,
          url: null,
          tags: [],
          viewCount: item.view_count || 0,
          isBreaking: item.is_breaking || false,
          isPinned: item.is_pinned || false,
        })) || []
      )
    } catch (rpcError) {
      console.warn("RPC function failed, trying direct query:", rpcError)

      // RPC 함수가 실패하면 직접 쿼리 시도
      const { data: directData, error: directError } = await supabase
        .from("news_articles")
        .select(`
          id,
          title,
          summary,
          published_at,
          source,
          view_count,
          is_breaking,
          is_pinned,
          news_categories (
            name
          )
        `)
        .eq("is_active", true)
        .order("published_at", { ascending: false })
        .limit(limit)

      if (directError) {
        console.error("Direct query also failed:", directError)
        throw directError
      }

      return (
        directData?.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary || "",
          content: null,
          category: item.news_categories?.name || "기타",
          publishedAt: item.published_at,
          source: item.source || "알 수 없음",
          author: null,
          imageUrl: null,
          url: null,
          tags: [],
          viewCount: item.view_count || 0,
          isBreaking: item.is_breaking || false,
          isPinned: item.is_pinned || false,
        })) || []
      )
    }
  } catch (error) {
    console.error("Error in getLatestNews:", error)
    return []
  }
}

// 뉴스 상세 조회
export async function getNewsArticleById(id: number): Promise<NewsArticle | null> {
  try {
    if (!supabase) {
      throw new Error("Supabase client not initialized")
    }

    // 먼저 함수를 사용해서 시도
    try {
      const { data, error } = await supabase.rpc("get_news_article_by_id", {
        article_id: id,
      })

      if (error) {
        console.error("Error calling RPC function:", error)
        throw error
      }

      if (!data || data.length === 0) {
        return null
      }

      const item = data[0]
      return {
        id: item.id,
        title: item.title,
        summary: item.summary || "",
        content: item.content || "",
        category: item.category_name || "기타",
        publishedAt: item.published_at,
        source: item.source || "알 수 없음",
        author: item.author || null,
        imageUrl: item.image_url || null,
        url: item.external_url || null,
        tags: item.tags || [],
        viewCount: item.view_count || 0,
        isBreaking: item.is_breaking || false,
        isPinned: item.is_pinned || false,
      }
    } catch (rpcError) {
      console.warn("RPC function failed, trying direct query:", rpcError)

      // RPC 함수가 실패하면 직접 쿼리 시도
      const { data: directData, error: directError } = await supabase
        .from("news_articles")
        .select(`
          id,
          title,
          summary,
          content,
          published_at,
          source,
          author,
          image_url,
          external_url,
          view_count,
          is_breaking,
          is_pinned,
          news_categories (
            name
          )
        `)
        .eq("id", id)
        .eq("is_active", true)
        .single()

      if (directError) {
        console.error("Direct query also failed:", directError)
        return null
      }

      if (!directData) {
        return null
      }

      return {
        id: directData.id,
        title: directData.title,
        summary: directData.summary || "",
        content: directData.content || "",
        category: directData.news_categories?.name || "기타",
        publishedAt: directData.published_at,
        source: directData.source || "알 수 없음",
        author: directData.author || null,
        imageUrl: directData.image_url || null,
        url: directData.external_url || null,
        tags: [], // 직접 쿼리에서는 태그를 가져오지 않음
        viewCount: directData.view_count || 0,
        isBreaking: directData.is_breaking || false,
        isPinned: directData.is_pinned || false,
      }
    }
  } catch (error) {
    console.error("Error in getNewsArticleById:", error)
    return null
  }
}

// 캐시 관련 함수들
const CACHE_DURATION = 5 * 60 * 1000 // 5분
const cache = new Map<string, { data: any; timestamp: number }>()

export function getCachedNewsData<T>(key: string): T | null {
  const cached = cache.get(`news_${key}`)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }
  return null
}

export function setCachedNewsData<T>(key: string, data: T): void {
  cache.set(`news_${key}`, {
    data,
    timestamp: Date.now(),
  })
}
