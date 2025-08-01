import { supabase, safeSupabaseOperation } from "./supabase"
import type { BusinessCard } from "@/types/business-card"
import type { NewsArticle } from "@/types/news"

// Sample data defined inline to avoid external dependencies
const sampleBusinessCards: BusinessCard[] = [
  {
    id: 1,
    title: "윤키친 (YOON'S KITCHEN)",
    description:
      "공항에서 15분거리, 무한 리필 숯불 구이로 리노베이션을 마치고 돌아왔습니다. 한국 맛과 감성을 그대로 살려 교민과 현지인들에게 좋은 반응을 얻고 있습니다.",
    category: "음식점",
    location: "공항 근처",
    phone: "082-048-8139",
    website: "https://www.facebook.com/share/p/1BzGkvmWjt",
    image: "/placeholder.svg?height=200&width=300&text=윤키친",
    hours: "매일 영업",
    price: "합리적인 가격",
    promotion: "무한 리필 서비스",
    kakaoId: "moda70",
    lineId: "moda70",
    tags: ["한식", "구이", "무한리필", "공항근처"],
    isPremium: false,
    isPromoted: true,
    exposureCount: 245,
    viewCount: 120,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "방콕막창 2호점",
    description:
      "팔람4 빅씨 맞은편! 가성비 맛집에서 저렴하고 맛있게 즐거운 경험을 선사합니다. 오픈 기념 선물도 준비되어 있습니다.",
    category: "음식점",
    location: "팔람4",
    phone: "063-886-1034",
    website: "https://maps.app.goo.gl/CQX8NKdDUt1Eg6Lc7",
    image: "/placeholder.svg?height=200&width=300&text=방콕막창",
    hours: "매일 영업",
    price: "가성비 좋음",
    promotion: "오픈 기념 선물",
    tags: ["막창", "가성비", "팔람4", "오픈기념"],
    isPremium: false,
    isPromoted: false,
    exposureCount: 189,
    viewCount: 89,
    created_at: "2024-01-16T14:20:00Z",
    updated_at: "2024-01-16T14:20:00Z",
  },
  {
    id: 3,
    title: "스타익스프레스 특송택배",
    description:
      "태국-한국 항공특송 서비스. Kg당 130바트로 방콕 계신위치에서 픽업해서 한국 주소지까지 논스톱 배송서비스를 제공합니다.",
    category: "배송업",
    location: "방콕 전지역",
    phone: "02-123-4567",
    website: "https://www.starexpress.co.kr",
    image: "/placeholder.svg?height=200&width=300&text=스타익스프레스",
    hours: "평일 9시-18시",
    price: "kg당 130바트부터",
    promotion: "픽업 서비스 무료",
    tags: ["특송", "택배", "항공배송", "픽업서비스"],
    isPremium: true,
    isPromoted: true,
    exposureCount: 312,
    viewCount: 156,
    created_at: "2024-01-17T09:15:00Z",
    updated_at: "2024-01-17T09:15:00Z",
  },
]

const sampleNewsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "태국 관광청, 한국인 관광객 유치 위한 새로운 캠페인 발표",
    content:
      "태국 관광청이 한국인 관광객 유치를 위한 대규모 마케팅 캠페인을 발표했습니다. 이번 캠페인은 K-pop과 태국 문화의 융합을 테마로 진행될 예정입니다. 특히 방콕과 파타야, 푸켓 등 주요 관광지에서 한국어 서비스를 확대하고, 한국 관광객들이 선호하는 음식점과 쇼핑몰에 대한 정보를 제공할 예정입니다.",
    summary: "태국 관광청이 한국인 대상 새로운 관광 캠페인을 발표했습니다.",
    category: "관광",
    tags: ["관광", "캠페인", "K-pop", "문화"],
    imageUrl: "/placeholder.svg?height=200&width=400&text=태국관광청",
    sourceUrl: "https://example.com/news/1",
    author: "뉴스팀",
    isPublished: true,
    isBreaking: false,
    viewCount: 1250,
    language: "ko",
    createdAt: "2024-01-20T07:30:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
    publishedAt: "2024-01-20T08:00:00Z",
  },
  {
    id: 2,
    title: "[속보] 방콕 지하철 새로운 노선 개통 예정",
    content:
      "방콕 대중교통공사가 새로운 지하철 노선의 개통 일정을 발표했습니다. 새 노선은 수완나품 공항과 시내 중심가를 직접 연결하여 교통 편의성을 크게 향상시킬 것으로 예상됩니다. 이번 노선 개통으로 공항에서 시내까지의 이동 시간이 기존 1시간에서 30분으로 단축될 것으로 예상됩니다.",
    summary: "방콕에 공항 직결 지하철 노선이 새롭게 개통됩니다.",
    category: "교통",
    tags: ["지하철", "교통", "공항", "개통"],
    imageUrl: "/placeholder.svg?height=200&width=400&text=방콕지하철",
    sourceUrl: "https://example.com/news/2",
    author: "교통부 기자",
    isPublished: true,
    isBreaking: true,
    viewCount: 2100,
    language: "ko",
    createdAt: "2024-01-21T12:00:00Z",
    updatedAt: "2024-01-21T12:30:00Z",
    publishedAt: "2024-01-21T12:30:00Z",
  },
  {
    id: 3,
    title: "태국 한인회, 설날 행사 개최 안내",
    content:
      "태국 한인회에서 다가오는 설날을 맞아 대규모 행사를 개최한다고 발표했습니다. 전통 놀이, 음식 체험, 문화 공연 등 다양한 프로그램이 준비되어 있습니다. 특히 올해는 태국 현지인들도 함께 참여할 수 있는 문화 교류 프로그램을 마련하여 한-태 우정을 더욱 돈독히 할 예정입니다.",
    summary: "태국 한인회가 설날 맞이 대규모 행사를 개최합니다.",
    category: "문화",
    tags: ["한인회", "설날", "행사", "전통문화"],
    imageUrl: "/placeholder.svg?height=200&width=400&text=설날행사",
    sourceUrl: "https://example.com/news/3",
    author: "문화부 기자",
    isPublished: true,
    isBreaking: false,
    viewCount: 890,
    language: "ko",
    createdAt: "2024-01-19T15:30:00Z",
    updatedAt: "2024-01-19T16:00:00Z",
    publishedAt: "2024-01-19T16:00:00Z",
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
      .order("is_premium", { ascending: false })
      .order("is_promoted", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) throw error

    return data?.map(mapBusinessCardFromDB) || []
  }, sampleBusinessCards)
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
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
      }

      if (category && category !== "all") {
        queryBuilder = queryBuilder.eq("category", category)
      }

      const { data, error } = await queryBuilder
        .order("is_premium", { ascending: false })
        .order("is_promoted", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error

      return data?.map(mapBusinessCardFromDB) || []
    },
    sampleBusinessCards.filter((card) => {
      const matchesQuery =
        !query ||
        card.title.toLowerCase().includes(query.toLowerCase()) ||
        card.description.toLowerCase().includes(query.toLowerCase()) ||
        card.location?.toLowerCase().includes(query.toLowerCase())

      const matchesCategory = !category || category === "all" || card.category === category

      return matchesQuery && matchesCategory
    }),
  )
}

export async function incrementViewCount(cardId: string): Promise<void> {
  return safeSupabaseOperation(async () => {
    const { error } = await supabase!.rpc("increment_view_count", {
      card_id: Number.parseInt(cardId),
    })

    if (error) throw error
  }, undefined)
}

// News Articles API
export async function getNewsArticles(): Promise<NewsArticle[]> {
  return safeSupabaseOperation(async () => {
    const { data, error } = await supabase!
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .order("is_breaking", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) throw error

    return data?.map(mapNewsArticleFromDB) || []
  }, sampleNewsArticles)
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

      const { data, error } = await queryBuilder
        .order("is_breaking", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error

      return data?.map(mapNewsArticleFromDB) || []
    },
    sampleNewsArticles.filter((article) => {
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase()) ||
        article.summary?.toLowerCase().includes(query.toLowerCase())

      const matchesCategory = !category || category === "all" || article.category === category

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
        .eq("is_published", true)
        .eq("is_breaking", true)
        .order("created_at", { ascending: false })
        .limit(3)

      if (error) throw error

      return data?.map(mapNewsArticleFromDB) || []
    },
    sampleNewsArticles.filter((article) => article.isBreaking).slice(0, 3),
  )
}

export async function incrementNewsViewCount(articleId: number): Promise<void> {
  return safeSupabaseOperation(async () => {
    const { error } = await supabase!.rpc("increment_news_view_count", {
      article_id: articleId,
    })

    if (error) throw error
  }, undefined)
}

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
      breakingCount: sampleNewsArticles.filter((article) => article.isBreaking).length,
      premiumCount: sampleBusinessCards.filter((card) => card.isPremium).length,
    },
  )
}

// Helper functions to map database objects to frontend types
function mapBusinessCardFromDB(dbCard: any): BusinessCard {
  return {
    id: dbCard.id,
    title: dbCard.title,
    description: dbCard.description,
    category: dbCard.category,
    location: dbCard.location,
    phone: dbCard.phone,
    website: dbCard.website,
    image: dbCard.image,
    hours: dbCard.hours,
    price: dbCard.price,
    promotion: dbCard.promotion,
    kakaoId: dbCard.kakao_id,
    lineId: dbCard.line_id,
    facebookUrl: dbCard.facebook_url,
    instagramUrl: dbCard.instagram_url,
    youtubeUrl: dbCard.youtube_url,
    tiktokUrl: dbCard.tiktok_url,
    isPremium: dbCard.is_premium,
    isPromoted: dbCard.is_promoted,
    exposureCount: dbCard.exposure_count,
    viewCount: dbCard.view_count,
    tags: dbCard.business_card_tags?.map((bct: any) => bct.tags.name) || [],
    created_at: dbCard.created_at,
    updated_at: dbCard.updated_at,
  }
}

function mapNewsArticleFromDB(dbArticle: any): NewsArticle {
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    content: dbArticle.content,
    summary: dbArticle.summary || dbArticle.excerpt,
    category: dbArticle.category,
    tags: dbArticle.tags || [],
    imageUrl: dbArticle.image_url,
    sourceUrl: dbArticle.source_url,
    author: dbArticle.author || "편집부",
    isPublished: dbArticle.is_published,
    isBreaking: dbArticle.is_breaking,
    viewCount: dbArticle.view_count,
    language: dbArticle.language || "ko",
    translatedTitle: dbArticle.translated_title,
    translatedContent: dbArticle.translated_content,
    translatedSummary: dbArticle.translated_summary,
    createdAt: dbArticle.created_at,
    updatedAt: dbArticle.updated_at,
    publishedAt: dbArticle.published_at || dbArticle.created_at,
  }
}
