import { supabase, safeSupabaseOperation } from "./supabase"
import type { BusinessCard } from "@/types/business-card"
import type { NewsArticle } from "@/types/news"

// Sample data for fallback when Supabase is not configured
const sampleBusinessCards: BusinessCard[] = [
  {
    id: 1,
    title: "윤키친 (YOON'S KITCHEN)",
    description:
      "공항에서 15분거리, 무한 리필 숯불 구이로 리노베이션을 마치고 돌아왔습니다. 한국 맛과 감성을 그대로 살려 교민과 현지인들에게 좋은 반응을 얻고 있습니다.",
    category: "음식점",
    location: "공항 근처",
    phone: "082-048-8139",
    website: "https://maps.app.goo.gl/KRGafHvKBo7wC6Wu7",
    image: "/placeholder.svg?height=200&width=300&text=윤키친",
    hours: "매일 영업",
    price: "합리적인 가격",
    promotion: "무한 리필 서비스",
    kakaoId: "moda70",
    lineId: "moda70",
    facebookUrl: "https://www.facebook.com/share/p/1BzGkvmWjt",
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
    category: "배송서비스",
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
    title: "태국 중앙은행 총재 후보, 내주 내각 추천 예정",
    content:
      "태국 중앙은행 총재 후보가 다음 주 내각에서 추천될 예정이라고 정부 관계자가 발표했습니다. 새로운 총재는 태국의 통화정책과 경제 안정화에 중요한 역할을 할 것으로 예상됩니다.",
    summary: "태국 중앙은행 새 총재 후보 내주 내각 추천 예정",
    category: "경제",
    tags: ["중앙은행", "총재", "내각", "통화정책"],
    imageUrl: "/placeholder.svg?height=200&width=400&text=중앙은행",
    sourceUrl: "https://www.bangkokpost.com/thailand/general/3078318/man-shot-on-way-to-work-in-samut-prakan",
    author: "경제부 기자",
    isPublished: true,
    isBreaking: false,
    viewCount: 156,
    language: "ko",
    createdAt: "2024-07-15T08:30:00Z",
    updatedAt: "2024-07-15T08:30:00Z",
    publishedAt: "2024-07-15T08:30:00Z",
  },
  {
    id: 2,
    title: "[속보] 외국인 관광객, 열차 그래피티 혐의로 체포",
    content:
      "방콕에서 외국인 관광객이 지하철 열차에 그래피티를 그린 혐의로 체포되었습니다. 태국 당국은 공공시설 훼손에 대해 강력히 대응하고 있다고 밝혔습니다.",
    summary: "외국인 관광객 지하철 그래피티로 체포",
    category: "사회",
    tags: ["관광객", "그래피티", "체포", "지하철"],
    imageUrl: "/placeholder.svg?height=200&width=400&text=지하철그래피티",
    sourceUrl: "https://www.thairath.co.th/news/politic/2873908",
    author: "사회부 기자",
    isPublished: true,
    isBreaking: true,
    viewCount: 89,
    language: "ko",
    createdAt: "2024-07-15T14:20:00Z",
    updatedAt: "2024-07-15T14:20:00Z",
    publishedAt: "2024-07-15T14:20:00Z",
  },
  {
    id: 3,
    title: "미얀마 지진 여파 치앙라이까지 흔들림",
    content:
      "미얀마에서 발생한 강진의 여파로 태국 북부 치앙라이 지역까지 진동이 감지되었습니다. 다행히 인명피해는 보고되지 않았으나, 주민들이 일시적으로 대피하는 소동이 있었습니다.",
    summary: "미얀마 지진 여파로 치앙라이 진동 감지",
    category: "사회",
    tags: ["지진", "미얀마", "치앙라이", "진동"],
    imageUrl: "/placeholder.svg?height=200&width=400&text=지진여파",
    sourceUrl: "https://www.matichon.co.th/politics/news_5301784",
    author: "사회부 기자",
    isPublished: true,
    isBreaking: false,
    viewCount: 203,
    language: "ko",
    createdAt: "2024-07-15T16:45:00Z",
    updatedAt: "2024-07-15T16:45:00Z",
    publishedAt: "2024-07-15T16:45:00Z",
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
