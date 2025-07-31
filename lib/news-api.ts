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
  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

  try {
    // RPC 함수를 사용하여 데이터 조회
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
  } catch (error) {
    console.error("Error in getNewsArticlesPaginated:", error)
    throw error
  }
}

// 뉴스 카테고리 조회
export async function getNewsCategories(): Promise<NewsCategory[]> {
  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

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
  } catch (error) {
    console.error("Error in getNewsCategories:", error)
    throw error
  }
}

// 뉴스 조회수 증가
export async function incrementNewsViewCount(articleId: number): Promise<void> {
  if (!supabase) {
    console.warn("Supabase client not initialized")
    return
  }

  try {
    const { error } = await supabase.rpc("increment_news_view_count", {
      article_id: articleId,
    })

    if (error) {
      console.error("Error calling RPC function:", error)
    }
  } catch (error) {
    console.error("Error in incrementNewsViewCount:", error)
  }
}

// 인기 뉴스 조회
export async function getPopularNews(limit = 10): Promise<NewsArticle[]> {
  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

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
  } catch (error) {
    console.error("Error in getPopularNews:", error)
    throw error
  }
}

// 최신 뉴스 조회
export async function getLatestNews(limit = 10): Promise<NewsArticle[]> {
  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

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
  } catch (error) {
    console.error("Error in getLatestNews:", error)
    throw error
  }
}

// 뉴스 상세 조회
export async function getNewsArticleById(id: number): Promise<NewsArticle | null> {
  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

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
  } catch (error) {
    console.error("Error in getNewsArticleById:", error)
    throw error
  }
}

// 속보 뉴스 조회
export async function getBreakingNews(limit = 5): Promise<NewsArticle[]> {
  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

  try {
    const { data, error } = await supabase.rpc("get_breaking_news", {
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
        isBreaking: true,
        isPinned: false,
      })) || []
    )
  } catch (error) {
    console.error("Error in getBreakingNews:", error)
    throw error
  }
}

// 고정 뉴스 조회
export async function getPinnedNews(): Promise<NewsArticle[]> {
  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

  try {
    const { data, error } = await supabase.rpc("get_pinned_news")

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
        isBreaking: false,
        isPinned: true,
      })) || []
    )
  } catch (error) {
    console.error("Error in getPinnedNews:", error)
    throw error
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
