import { supabase, safeSupabaseOperation } from "./supabase"
import type { BusinessCard } from "../types/business-card"
import type { NewsArticle } from "../types/news"

// Sample data for fallback when Supabase is not configured
const sampleBusinessCards: BusinessCard[] = [
  {
    id: 1,
    title: "윤키친 (YOON'S KITCHEN)",
    description:
      "공항에서 15분거리, 무한 리필 숯불 구이로 리노베이션을 마치고 돌아왔습니다. 한국 맛과 감성을 그대로 살려 교민과 현지인들에게 좋은 반응을 얻고 있습니다.",
    phone: "082-048-8139",
    website: "https://maps.app.goo.gl/KRGafHvKBo7wC6Wu7",
    facebook: "https://www.facebook.com/share/p/1BzGkvmWjt",
    category: "음식점",
    tags: ["한식", "구이", "무한리필", "공항근처"],
    image_url: "/placeholder.svg?height=200&width=300&text=윤키친",
    view_count: 245,
    is_premium: false,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "방콕막창 2호점",
    description:
      "팔람4 빅씨 맞은편! 가성비 맛집에서 저렴하고 맛있게 즐거운 경험을 선사합니다. 오픈 기념 선물도 준비되어 있습니다.",
    phone: "063-886-1034",
    website: "https://maps.app.goo.gl/CQX8NKdDUt1Eg6Lc7",
    category: "음식점",
    tags: ["막창", "가성비", "오픈기념"],
    image_url: "/placeholder.svg?height=200&width=300&text=방콕막창",
    view_count: 189,
    is_premium: false,
    created_at: "2024-01-16T11:00:00Z",
    updated_at: "2024-01-16T11:00:00Z",
  },
  {
    id: 3,
    title: "스타익스프레스 특송",
    description: "태국-한국 항공특송 전문업체. Kg당 130바트로 픽업부터 한국 주소지까지 논스톱 배송서비스를 제공합니다.",
    phone: "02-123-4567",
    website: "https://www.starexpress.co.kr",
    category: "배송업체",
    tags: ["특송", "항공배송", "한국배송"],
    image_url: "/placeholder.svg?height=200&width=300&text=스타익스프레스",
    view_count: 312,
    is_premium: true,
    created_at: "2024-01-17T09:00:00Z",
    updated_at: "2024-01-17T09:00:00Z",
  },
]

const sampleNewsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "태국 중앙은행 총재 후보, 내주 내각 추천 예정",
    content:
      "태국 중앙은행 총재 후보가 다음 주 내각에서 추천될 예정이라고 정부 관계자가 발표했습니다. 새로운 총재는 태국의 통화정책과 경제 안정화에 중요한 역할을 할 것으로 예상됩니다.",
    summary: "태국 중앙은행 새 총재 후보 내주 내각 추천 예정",
    category: "경제",
    tags: ["중앙은행", "총재", "내각", "통화정책"],
    source_url: "https://www.bangkokpost.com/thailand/general/3078318/man-shot-on-way-to-work-in-samut-prakan",
    image_url: "/placeholder.svg?height=200&width=400&text=중앙은행",
    view_count: 156,
    is_breaking: false,
    published_at: "2024-07-15T08:30:00Z",
    created_at: "2024-07-15T08:30:00Z",
    updated_at: "2024-07-15T08:30:00Z",
  },
  {
    id: 2,
    title: "외국인 관광객, 열차 그래피티 혐의로 체포",
    content:
      "방콕에서 외국인 관광객이 지하철 열차에 그래피티를 그린 혐의로 체포되었습니다. 태국 당국은 공공시설 훼손에 대해 강력히 대응하고 있다고 밝혔습니다.",
    summary: "외국인 관광객 지하철 그래피티로 체포",
    category: "사회",
    tags: ["관광객", "그래피티", "체포", "지하철"],
    source_url: "https://www.thairath.co.th/news/politic/2873908",
    image_url: "/placeholder.svg?height=200&width=400&text=지하철그래피티",
    view_count: 89,
    is_breaking: true,
    published_at: "2024-07-15T14:20:00Z",
    created_at: "2024-07-15T14:20:00Z",
    updated_at: "2024-07-15T14:20:00Z",
  },
  {
    id: 3,
    title: "미얀마 지진 여파 치앙라이까지 흔들림",
    content:
      "미얀마에서 발생한 강진의 여파로 태국 북부 치앙라이 지역까지 진동이 감지되었습니다. 다행히 인명피해는 보고되지 않았으나, 주민들이 일시적으로 대피하는 소동이 있었습니다.",
    summary: "미얀마 지진 여파로 치앙라이 진동 감지",
    category: "사회",
    tags: ["지진", "미얀마", "치앙라이", "진동"],
    source_url: "https://www.matichon.co.th/politics/news_5301784",
    image_url: "/placeholder.svg?height=200&width=400&text=지진여파",
    view_count: 203,
    is_breaking: false,
    published_at: "2024-07-15T16:45:00Z",
    created_at: "2024-07-15T16:45:00Z",
    updated_at: "2024-07-15T16:45:00Z",
  },
]

// Business Cards API
export async function getBusinessCards(): Promise<BusinessCard[]> {
  return safeSupabaseOperation(async () => {
    const { data, error } = await supabase!.from("business_cards").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }, sampleBusinessCards)
}

export async function getBusinessCardById(id: number): Promise<BusinessCard | null> {
  return safeSupabaseOperation(
    async () => {
      const { data, error } = await supabase!.from("business_cards").select("*").eq("id", id).single()

      if (error) throw error
      return data
    },
    sampleBusinessCards.find((card) => card.id === id) || null,
  )
}

export async function searchBusinessCards(query: string, category?: string): Promise<BusinessCard[]> {
  return safeSupabaseOperation(
    async () => {
      let queryBuilder = supabase!.from("business_cards").select("*")

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      }

      if (category) {
        queryBuilder = queryBuilder.eq("category", category)
      }

      const { data, error } = await queryBuilder.order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    },
    sampleBusinessCards.filter((card) => {
      const matchesQuery =
        !query ||
        card.title.toLowerCase().includes(query.toLowerCase()) ||
        card.description.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !category || card.category === category
      return matchesQuery && matchesCategory
    }),
  )
}

export async function incrementViewCount(id: number): Promise<void> {
  return safeSupabaseOperation(async () => {
    const { error } = await supabase!.rpc("increment_view_count", { card_id: id })
    if (error) throw error
  }, undefined)
}

// News API
export async function getNewsArticles(): Promise<NewsArticle[]> {
  return safeSupabaseOperation(async () => {
    const { data, error } = await supabase!
      .from("news_articles")
      .select("*")
      .order("published_at", { ascending: false })

    if (error) throw error
    return data || []
  }, sampleNewsArticles)
}

export async function getNewsArticleById(id: number): Promise<NewsArticle | null> {
  return safeSupabaseOperation(
    async () => {
      const { data, error } = await supabase!.from("news_articles").select("*").eq("id", id).single()

      if (error) throw error
      return data
    },
    sampleNewsArticles.find((article) => article.id === id) || null,
  )
}

export async function searchNewsArticles(query: string, category?: string): Promise<NewsArticle[]> {
  return safeSupabaseOperation(
    async () => {
      let queryBuilder = supabase!.from("news_articles").select("*")

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      }

      if (category) {
        queryBuilder = queryBuilder.eq("category", category)
      }

      const { data, error } = await queryBuilder.order("published_at", { ascending: false })

      if (error) throw error
      return data || []
    },
    sampleNewsArticles.filter((article) => {
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !category || article.category === category
      return matchesQuery && matchesCategory
    }),
  )
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  return safeSupabaseOperation(
    async () => {
      const { data, error } = await supabase!
        .from("news_articles")
        .select("*")
        .eq("is_breaking", true)
        .order("published_at", { ascending: false })

      if (error) throw error
      return data || []
    },
    sampleNewsArticles.filter((article) => article.is_breaking),
  )
}

export async function incrementNewsViewCount(id: number): Promise<void> {
  return safeSupabaseOperation(async () => {
    const { error } = await supabase!.rpc("increment_news_view_count", { article_id: id })
    if (error) throw error
  }, undefined)
}

// Categories and Tags
export async function getCategories(): Promise<string[]> {
  return safeSupabaseOperation(async () => {
    const { data, error } = await supabase!.from("categories").select("name").order("name")

    if (error) throw error
    return data?.map((cat) => cat.name) || []
  }, ["음식점", "배송업체", "미용실", "마사지", "여행사", "부동산"])
}

// Statistics
export async function getStatistics(): Promise<{
  totalBusinessCards: number
  totalNewsArticles: number
  totalViews: number
}> {
  return safeSupabaseOperation(
    async () => {
      const [businessCardsResult, newsArticlesResult] = await Promise.all([
        supabase!.from("business_cards").select("view_count", { count: "exact" }),
        supabase!.from("news_articles").select("view_count", { count: "exact" }),
      ])

      const totalBusinessCards = businessCardsResult.count || 0
      const totalNewsArticles = newsArticlesResult.count || 0
      const totalViews = [...(businessCardsResult.data || []), ...(newsArticlesResult.data || [])].reduce(
        (sum, item) => sum + (item.view_count || 0),
        0,
      )

      return {
        totalBusinessCards,
        totalNewsArticles,
        totalViews,
      }
    },
    {
      totalBusinessCards: sampleBusinessCards.length,
      totalNewsArticles: sampleNewsArticles.length,
      totalViews:
        sampleBusinessCards.reduce((sum, card) => sum + card.view_count, 0) +
        sampleNewsArticles.reduce((sum, article) => sum + article.view_count, 0),
    },
  )
}
