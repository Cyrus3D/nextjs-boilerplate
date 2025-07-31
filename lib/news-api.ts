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

    // 오류 발생 시 샘플 데이터 반환
    return getSampleNewsData(page, pageSize, categoryFilter, searchTerm)
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

    // 오류 발생 시 기본 카테고리 반환
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
  try {
    if (!supabase) {
      throw new Error("Supabase client not initialized")
    }

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
    return null
  }
}

// 샘플 뉴스 데이터 필터링 함수 (백업용)
function getSampleNewsData(
  page: number,
  pageSize: number,
  categoryFilter?: string,
  searchTerm?: string,
): {
  articles: NewsArticle[]
  total: number
  hasMore: boolean
} {
  const SAMPLE_NEWS_ARTICLES: NewsArticle[] = [
    {
      id: 1,
      title: "태국 정부, 한국인 관광객 대상 새로운 비자 정책 발표",
      summary:
        "태국 정부가 한국인 관광객 유치를 위한 새로운 비자 정책을 발표했습니다. 이번 정책으로 한국인들의 태국 방문이 더욱 편리해질 것으로 예상됩니다.",
      content:
        "태국 관광청은 오늘 기자회견을 통해 한국인 관광객을 대상으로 한 새로운 비자 정책을 발표했습니다. 주요 내용으로는 관광비자 연장 기간 확대, 다중입국 비자 발급 조건 완화, 온라인 비자 신청 시스템 개선 등이 포함되어 있습니다.",
      category: "정치",
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      source: "태국 일보",
      author: "김태국",
      imageUrl: "/placeholder.svg?height=200&width=300&text=태국+비자+정책",
      url: "https://example.com/news/1",
      tags: ["속보", "정치", "한국", "태국", "비자"],
      viewCount: 156,
      isBreaking: true,
      isPinned: true,
    },
    {
      id: 2,
      title: "방콕 지하철 새 노선 개통 예정, 교민 거주지역 접근성 향상",
      summary:
        "방콕 대중교통공사가 새로운 지하철 노선의 개통 일정을 발표했습니다. 한국인 교민들이 많이 거주하는 지역의 교통 편의성이 크게 개선될 예정입니다.",
      content:
        "방콕 대중교통공사(BMCL)는 오늘 새로운 지하철 노선인 오렌지 라인의 개통 일정을 발표했습니다. 이 노선은 방콕 중심부에서 동쪽 지역을 연결하며, 한국인 교민들이 많이 거주하는 수쿰빗, 통로, 에까마이 지역의 접근성을 크게 향상시킬 것으로 예상됩니다.",
      category: "사회",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: "방콕 포스트",
      author: "이방콕",
      imageUrl: "/placeholder.svg?height=200&width=300&text=방콕+지하철",
      url: null,
      tags: ["사회", "방콕", "교민"],
      viewCount: 89,
      isBreaking: false,
      isPinned: true,
    },
  ]

  let filteredArticles = [...SAMPLE_NEWS_ARTICLES]

  // 카테고리 필터 적용
  if (categoryFilter) {
    filteredArticles = filteredArticles.filter((article) => article.category === categoryFilter)
  }

  // 검색어 필터 적용
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase()
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.summary.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  // 정렬 (고정 > 속보 > 날짜순)
  filteredArticles.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    if (a.isBreaking && !b.isBreaking) return -1
    if (!a.isBreaking && b.isBreaking) return 1
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  // 페이지네이션 적용
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

  return {
    articles: paginatedArticles,
    total: filteredArticles.length,
    hasMore: endIndex < filteredArticles.length,
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
