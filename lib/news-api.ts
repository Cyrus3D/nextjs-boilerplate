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

    const { data, error } = await supabase.rpc("get_news_articles_paginated", {
      page_num: page,
      page_size: pageSize,
      category_filter: categoryFilter || null,
      search_term: searchTerm || null,
      include_inactive: false,
    })

    if (error) {
      console.error("Error fetching news articles:", error)
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
      summary: item.summary,
      content: item.content,
      category: item.category_name || "기타",
      publishedAt: item.published_at,
      source: item.source,
      author: item.author,
      imageUrl: item.image_url,
      url: item.external_url,
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
    return {
      articles: [],
      total: 0,
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

    const { data, error } = await supabase.rpc("get_news_categories")

    if (error) {
      console.error("Error fetching news categories:", error)
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
    return []
  }
}

// 뉴스 조회수 증가
export async function incrementNewsViewCount(articleId: number): Promise<void> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized")
      return
    }

    const { error } = await supabase.rpc("increment_news_view_count", {
      article_id: articleId,
    })

    if (error) {
      console.error("Error incrementing news view count:", error)
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

    const { data, error } = await supabase.rpc("get_popular_news", {
      limit_count: limit,
    })

    if (error) {
      console.error("Error fetching popular news:", error)
      throw error
    }

    return (
      data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        content: null,
        category: item.category_name || "기타",
        publishedAt: item.published_at,
        source: item.source,
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
    return []
  }
}

// 최신 뉴스 조회
export async function getLatestNews(limit = 10): Promise<NewsArticle[]> {
  try {
    if (!supabase) {
      throw new Error("Supabase client not initialized")
    }

    const { data, error } = await supabase.rpc("get_latest_news", {
      limit_count: limit,
    })

    if (error) {
      console.error("Error fetching latest news:", error)
      throw error
    }

    return (
      data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        content: null,
        category: item.category_name || "기타",
        publishedAt: item.published_at,
        source: item.source,
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
    return []
  }
}

// 뉴스 상세 조회
export async function getNewsArticleById(id: number): Promise<NewsArticle | null> {
  try {
    if (!supabase) {
      throw new Error("Supabase client not initialized")
    }

    const { data, error } = await supabase.rpc("get_news_article_by_id", {
      article_id: id,
    })

    if (error) {
      console.error("Error fetching news article:", error)
      return null
    }

    if (!data || data.length === 0) {
      return null
    }

    const item = data[0]
    return {
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      category: item.category_name || "기타",
      publishedAt: item.published_at,
      source: item.source,
      author: item.author,
      imageUrl: item.image_url,
      url: item.external_url,
      tags: item.tags || [],
      viewCount: item.view_count || 0,
      isBreaking: item.is_breaking || false,
      isPinned: item.is_pinned || false,
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
