import { supabase, safeSupabaseOperation } from "./supabase"
import type { BusinessCard } from "@/types/business-card"
import type { NewsArticle } from "@/types/news"

// Sample data defined inline to avoid external dependencies
const sampleBusinessCards: BusinessCard[] = [
  {
    id: "1",
    title: "윤키친 (YOON'S KITCHEN)",
    description:
      "공항에서 15분거리, 무한 리필 숯불 구이로 리노베이션을 마치고 돌아왔습니다. 한국 맛과 감성을 그대로 살려 교민과 현지인들에게 좋은 반응을 얻고 있습니다.",
    category: "음식점",
    phone: "082-048-8139",
    website: "https://www.facebook.com/share/p/1BzGkvmWjt",
    map_url: "https://maps.app.goo.gl/KRGafHvKBo7wC6Wu7",
    image_url: "/placeholder.svg?height=200&width=300&text=윤키친",
    tags: ["한식", "구이", "무한리필", "공항근처"],
    view_count: 245,
    is_premium: false,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "방콕막창 2호점",
    description:
      "팔람4 빅씨 맞은편! 가성비 맛집에서 저렴하고 맛있게 즐거운 경험을 선사합니다. 오픈 기념 선물도 준비되어 있습니다.",
    category: "음식점",
    phone: "063-886-1034",
    website: "https://maps.app.goo.gl/CQX8NKdDUt1Eg6Lc7",
    image_url: "/placeholder.svg?height=200&width=300&text=방콕막창",
    tags: ["막창", "가성비", "팔람4", "오픈기념"],
    view_count: 189,
    is_premium: false,
    created_at: "2024-01-16T14:20:00Z",
    updated_at: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    title: "스타익스프레스 특송택배",
    description:
      "태국-한국 항공특송 서비스. Kg당 130바트로 방콕 계신위치에서 픽업해서 한국 주소지까지 논스톱 배송서비스를 제공합니다.",
    category: "배송업",
    phone: "02-123-4567",
    website: "https://www.starexpress.co.kr",
    image_url: "/placeholder.svg?height=200&width=300&text=스타익스프레스",
    tags: ["특송", "택배", "항공배송", "픽업서비스"],
    view_count: 312,
    is_premium: true,
    created_at: "2024-01-17T09:15:00Z",
    updated_at: "2024-01-17T09:15:00Z",
  },
]

const sampleNewsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "태국 관광청, 한국인 관광객 유치 위한 새로운 캠페인 발표",
    content:
      "태국 관광청이 한국인 관광객 유치를 위한 대규모 마케팅 캠페인을 발표했습니다. 이번 캠페인은 K-pop과 태국 문화의 융합을 테마로 진행될 예정입니다.",
    summary: "태국 관광청이 한국인 대상 새로운 관광 캠페인을 발표했습니다.",
    category: "관광",
    tags: ["관광", "캠페인", "K-pop", "문화"],
    image_url: "/placeholder.svg?height=200&width=400&text=태국관광청",
    source_url: "https://example.com/news/1",
    author: "뉴스팀",
    view_count: 1250,
    is_breaking: false,
    is_published: true,
    published_at: "2024-01-20T08:00:00Z",
    created_at: "2024-01-20T07:30:00Z",
    updated_at: "2024-01-20T08:00:00Z",
  },
  {
    id: "2",
    title: "[속보] 방콕 지하철 새로운 노선 개통 예정",
    content:
      "방콕 대중교통공사가 새로운 지하철 노선의 개통 일정을 발표했습니다. 새 노선은 수완나품 공항과 시내 중심가를 직접 연결하여 교통 편의성을 크게 향상시킬 것으로 예상됩니다.",
    summary: "방콕에 공항 직결 지하철 노선이 새롭게 개통됩니다.",
    category: "교통",
    tags: ["지하철", "교통", "공항", "개통"],
    image_url: "/placeholder.svg?height=200&width=400&text=방콕지하철",
    source_url: "https://example.com/news/2",
    author: "교통부 기자",
    view_count: 2100,
    is_breaking: true,
    is_published: true,
    published_at: "2024-01-21T12:30:00Z",
    created_at: "2024-01-21T12:00:00Z",
    updated_at: "2024-01-21T12:30:00Z",
  },
  {
    id: "3",
    title: "태국 한인회, 설날 행사 개최 안내",
    content:
      "태국 한인회에서 다가오는 설날을 맞아 대규모 행사를 개최한다고 발표했습니다. 전통 놀이, 음식 체험, 문화 공연 등 다양한 프로그램이 준비되어 있습니다.",
    summary: "태국 한인회가 설날 맞이 대규모 행사를 개최합니다.",
    category: "문화",
    tags: ["한인회", "설날", "행사", "전통문화"],
    image_url: "/placeholder.svg?height=200&width=400&text=설날행사",
    source_url: "https://example.com/news/3",
    author: "문화부 기자",
    view_count: 890,
    is_breaking: false,
    is_published: true,
    published_at: "2024-01-19T16:00:00Z",
    created_at: "2024-01-19T15:30:00Z",
    updated_at: "2024-01-19T16:00:00Z",
  },
]

// Business Cards API
export async function getBusinessCards(): Promise<BusinessCard[]> {
  return safeSupabaseOperation(async () => {
    const { data, error } = await supabase!
      .from("business_cards")
      .select(`
        *,
        business_card_tags (
          tags (
            name
          )
        )
      `)
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data.map((card: any) => ({
      ...card,
      tags: card.business_card_tags?.map((bt: any) => bt.tags.name) || [],
    }))
  }, sampleBusinessCards)
}

export async function getBusinessCardById(id: string): Promise<BusinessCard | null> {
  return safeSupabaseOperation(
    async () => {
      const { data, error } = await supabase!
        .from("business_cards")
        .select(`
        *,
        business_card_tags (
          tags (
            name
          )
        )
      `)
        .eq("id", id)
        .single()

      if (error) throw error

      return {
        ...data,
        tags: data.business_card_tags?.map((bt: any) => bt.tags.name) || [],
      }
    },
    sampleBusinessCards.find((card) => card.id === id) || null,
  )
}

export async function incrementViewCount(id: string): Promise<void> {
  return safeSupabaseOperation(async () => {
    const { error } = await supabase!.rpc("increment_view_count", { card_id: id })
    if (error) throw error
  }, undefined)
}

export async function searchBusinessCards(query: string, category?: string): Promise<BusinessCard[]> {
  return safeSupabaseOperation(
    async () => {
      let queryBuilder = supabase!
        .from("business_cards")
        .select(`
        *,
        business_card_tags (
          tags (
            name
          )
        )
      `)
        .eq("is_published", true)

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      }

      if (category && category !== "all") {
        queryBuilder = queryBuilder.eq("category", category)
      }

      const { data, error } = await queryBuilder.order("created_at", { ascending: false })

      if (error) throw error

      return data.map((card: any) => ({
        ...card,
        tags: card.business_card_tags?.map((bt: any) => bt.tags.name) || [],
      }))
    },
    sampleBusinessCards.filter((card) => {
      const matchesQuery =
        !query ||
        card.title.toLowerCase().includes(query.toLowerCase()) ||
        card.description.toLowerCase().includes(query.toLowerCase())

      const matchesCategory = !category || category === "all" || card.category === category

      return matchesQuery && matchesCategory
    }),
  )
}

// News API
export async function getNewsArticles(): Promise<NewsArticle[]> {
  return safeSupabaseOperation(async () => {
    const { data, error } = await supabase!
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })

    if (error) throw error
    return data
  }, sampleNewsArticles)
}

export async function getNewsArticleById(id: string): Promise<NewsArticle | null> {
  return safeSupabaseOperation(
    async () => {
      const { data, error } = await supabase!.from("news_articles").select("*").eq("id", id).single()

      if (error) throw error
      return data
    },
    sampleNewsArticles.find((article) => article.id === id) || null,
  )
}

export async function incrementNewsViewCount(id: string): Promise<void> {
  return safeSupabaseOperation(async () => {
    const { error } = await supabase!.rpc("increment_news_view_count", { article_id: id })
    if (error) throw error
  }, undefined)
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  return safeSupabaseOperation(
    async () => {
      const { data, error } = await supabase!
        .from("news_articles")
        .select("*")
        .eq("is_breaking", true)
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(5)

      if (error) throw error
      return data
    },
    sampleNewsArticles.filter((article) => article.is_breaking),
  )
}

export async function searchNewsArticles(query: string, category?: string): Promise<NewsArticle[]> {
  return safeSupabaseOperation(
    async () => {
      let queryBuilder = supabase!.from("news_articles").select("*").eq("is_published", true)

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
      }

      if (category && category !== "all") {
        queryBuilder = queryBuilder.eq("category", category)
      }

      const { data, error } = await queryBuilder.order("published_at", { ascending: false })

      if (error) throw error
      return data
    },
    sampleNewsArticles.filter((article) => {
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase())

      const matchesCategory = !category || category === "all" || article.category === category

      return matchesQuery && matchesCategory
    }),
  )
}

// Statistics API
export async function getStatistics() {
  return safeSupabaseOperation(
    async () => {
      const [newsCount, businessCount, breakingCount, premiumCount] = await Promise.all([
        supabase!.from("news_articles").select("id", { count: "exact" }).eq("is_published", true),
        supabase!.from("business_cards").select("id", { count: "exact" }).eq("is_published", true),
        supabase!
          .from("news_articles")
          .select("id", { count: "exact" })
          .eq("is_published", true)
          .eq("is_breaking", true),
        supabase!
          .from("business_cards")
          .select("id", { count: "exact" })
          .eq("is_published", true)
          .eq("is_premium", true),
      ])

      return {
        newsCount: newsCount.count || 0,
        businessCount: businessCount.count || 0,
        breakingCount: breakingCount.count || 0,
        premiumCount: premiumCount.count || 0,
      }
    },
    {
      newsCount: sampleNewsArticles.length,
      businessCount: sampleBusinessCards.length,
      breakingCount: sampleNewsArticles.filter((article) => article.is_breaking).length,
      premiumCount: sampleBusinessCards.filter((card) => card.is_premium).length,
    },
  )
}

// Categories API
export async function getCategories(): Promise<Array<{ id: string; name: string; count: number }>> {
  return safeSupabaseOperation(async () => {
    const { data, error } = await supabase!.from("categories").select(`
        id,
        name,
        business_cards (count)
      `)

    if (error) throw error

    return data.map((category: any) => ({
      id: category.id,
      name: category.name,
      count: category.business_cards?.[0]?.count || 0,
    }))
  }, [
    { id: "1", name: "음식점", count: 2 },
    { id: "2", name: "배송업", count: 1 },
    { id: "3", name: "서비스업", count: 0 },
  ])
}
