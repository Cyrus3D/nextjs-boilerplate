import { supabase, isSupabaseConfigured } from "./supabase"
import type { NewsArticle, NewsCategory } from "../types/news"

// Sample news data for fallback
const sampleNewsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "태국 정부, 관광객 비자 연장 정책 발표",
    content: "태국 정부가 관광 활성화를 위해 관광객 비자 연장 정책을 발표했습니다...",
    summary: "태국 정부가 관광 활성화를 위한 새로운 비자 정책을 발표했습니다.",
    category: "정책",
    source: "태국 관광청",
    author: "뉴스팀",
    published_at: new Date().toISOString(),
    image_url: "/placeholder.svg?height=200&width=400",
    external_url: null,
    tags: ["비자", "관광", "정책"],
    view_count: 245,
    is_featured: true,
    is_breaking: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "방콕 지하철 새 노선 개통 예정",
    content: "방콕 대중교통 시스템이 확장됩니다...",
    summary: "방콕 지하철 새 노선이 다음 달 개통 예정입니다.",
    category: "교통",
    source: "BTS",
    author: "교통팀",
    published_at: new Date(Date.now() - 86400000).toISOString(),
    image_url: "/placeholder.svg?height=200&width=400",
    external_url: null,
    tags: ["교통", "지하철", "방콕"],
    view_count: 189,
    is_featured: false,
    is_breaking: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "태국 한인회 신년 행사 개최",
    content: "태국 한인회에서 신년 맞이 행사를 개최합니다...",
    summary: "태국 한인회 신년 행사가 이번 주말 개최됩니다.",
    category: "커뮤니티",
    source: "태국한인회",
    author: "커뮤니티팀",
    published_at: new Date(Date.now() - 172800000).toISOString(),
    image_url: "/placeholder.svg?height=200&width=400",
    external_url: null,
    tags: ["한인회", "행사", "커뮤니티"],
    view_count: 156,
    is_featured: false,
    is_breaking: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const sampleNewsCategories: NewsCategory[] = [
  { id: 1, name: "정책", color_class: "bg-blue-100 text-blue-800", description: "정부 정책 및 법률" },
  { id: 2, name: "교통", color_class: "bg-green-100 text-green-800", description: "교통 관련 소식" },
  { id: 3, name: "커뮤니티", color_class: "bg-purple-100 text-purple-800", description: "한인 커뮤니티 소식" },
  { id: 4, name: "경제", color_class: "bg-orange-100 text-orange-800", description: "경제 및 비즈니스" },
  { id: 5, name: "문화", color_class: "bg-pink-100 text-pink-800", description: "문화 및 엔터테인먼트" },
  { id: 6, name: "생활", color_class: "bg-yellow-100 text-yellow-800", description: "일상 생활 정보" },
]

// Cache for API responses
const newsApiCache = new Map<string, { data: any; timestamp: number }>()
const NEWS_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getNewsArticlesPaginated(
  page = 1,
  limit = 20,
  category?: string,
  searchTerm?: string,
): Promise<{ articles: NewsArticle[]; hasMore: boolean; total: number }> {
  const cacheKey = `news-${page}-${limit}-${category || "all"}-${searchTerm || "none"}`
  const cached = newsApiCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < NEWS_CACHE_DURATION) {
    return cached.data
  }

  if (!isSupabaseConfigured() || !supabase) {
    console.log("Supabase not configured, returning sample news data")
    let filteredArticles = sampleNewsArticles

    // Apply category filter
    if (category && category !== "all") {
      filteredArticles = sampleNewsArticles.filter((article) => article.category === category)
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower) ||
          article.summary?.toLowerCase().includes(searchLower),
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

    const result = {
      articles: paginatedArticles,
      hasMore: endIndex < filteredArticles.length,
      total: filteredArticles.length,
    }

    newsApiCache.set(cacheKey, { data: result, timestamp: Date.now() })
    return result
  }

  try {
    const selectFields = `
      id,
      title,
      content,
      summary,
      category,
      source,
      author,
      published_at,
      image_url,
      external_url,
      view_count,
      is_featured,
      is_breaking,
      created_at,
      updated_at,
      news_categories (
        id,
        name,
        color_class,
        description
      )
    `

    const query = supabase.from("news_articles").select(selectFields, { count: "exact" }).eq("is_published", true)

    const { data, error, count } = await query
      .order("is_breaking", { ascending: false })
      .order("is_featured", { ascending: false })
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Supabase news error:", error)
      // Return filtered sample data as fallback
      let filteredArticles = sampleNewsArticles

      if (category && category !== "all") {
        filteredArticles = sampleNewsArticles.filter((article) => article.category === category)
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        filteredArticles = filteredArticles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchLower) || article.content.toLowerCase().includes(searchLower),
        )
      }

      return {
        articles: filteredArticles.slice(0, limit),
        hasMore: false,
        total: filteredArticles.length,
      }
    }

    // Transform data to match NewsArticle interface
    const allArticles: NewsArticle[] = (data || []).map((article) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      summary: article.summary,
      category: article.news_categories?.name || article.category || "기타",
      source: article.source,
      author: article.author,
      published_at: article.published_at,
      image_url: article.image_url,
      external_url: article.external_url,
      tags: [], // Tags would need separate query
      view_count: article.view_count || 0,
      is_featured: article.is_featured || false,
      is_breaking: article.is_breaking || false,
      created_at: article.created_at,
      updated_at: article.updated_at,
    }))

    // Apply category filter after data transformation
    let filteredArticles = allArticles
    if (category && category !== "all") {
      filteredArticles = allArticles.filter((article) => article.category === category)
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower) ||
          article.summary?.toLowerCase().includes(searchLower),
      )
    }

    // Apply pagination to filtered results
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

    const result = {
      articles: paginatedArticles,
      hasMore: endIndex < filteredArticles.length,
      total: filteredArticles.length,
    }

    // Cache the result
    newsApiCache.set(cacheKey, { data: result, timestamp: Date.now() })

    return result
  } catch (error) {
    console.error("Error fetching news articles:", error)
    // Return filtered sample data as fallback
    let filteredArticles = sampleNewsArticles

    if (category && category !== "all") {
      filteredArticles = sampleNewsArticles.filter((article) => article.category === category)
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) || article.content.toLowerCase().includes(searchLower),
      )
    }

    return {
      articles: filteredArticles.slice(0, limit),
      hasMore: false,
      total: filteredArticles.length,
    }
  }
}

export async function getNewsCategories(): Promise<NewsCategory[]> {
  const cacheKey = "news_categories"
  const cached = newsApiCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < NEWS_CACHE_DURATION) {
    return cached.data
  }

  if (!isSupabaseConfigured() || !supabase) {
    newsApiCache.set(cacheKey, { data: sampleNewsCategories, timestamp: Date.now() })
    return sampleNewsCategories
  }

  try {
    const { data, error } = await supabase
      .from("news_categories")
      .select("id, name, color_class, description")
      .order("name")

    if (error) {
      console.error("Error fetching news categories:", error)
      newsApiCache.set(cacheKey, { data: sampleNewsCategories, timestamp: Date.now() })
      return sampleNewsCategories
    }

    const categories = data || sampleNewsCategories
    newsApiCache.set(cacheKey, { data: categories, timestamp: Date.now() })
    return categories
  } catch (error) {
    console.error("Error fetching news categories:", error)
    newsApiCache.set(cacheKey, { data: sampleNewsCategories, timestamp: Date.now() })
    return sampleNewsCategories
  }
}

export async function incrementNewsViewCount(articleId: number): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    return
  }

  try {
    // Get current view count
    const { data: currentData, error: fetchError } = await supabase
      .from("news_articles")
      .select("view_count")
      .eq("id", articleId)
      .single()

    if (fetchError) {
      console.error("Error fetching current news view count:", fetchError)
      return
    }

    const currentViewCount = currentData?.view_count || 0

    // Update view count
    const { error } = await supabase
      .from("news_articles")
      .update({
        view_count: currentViewCount + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId)

    if (error) {
      console.error("Error incrementing news view count:", error)
    }
  } catch (error) {
    console.error("Error incrementing news view count:", error)
  }
}

export async function getFeaturedNews(): Promise<NewsArticle[]> {
  const result = await getNewsArticlesPaginated(1, 10)
  return result.articles.filter((article) => article.is_featured)
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  const result = await getNewsArticlesPaginated(1, 10)
  return result.articles.filter((article) => article.is_breaking)
}

// Clear news cache
export function clearNewsApiCache(): void {
  newsApiCache.clear()
}
