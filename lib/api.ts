import { supabase, safeSupabaseOperation } from "./supabase"
import type { BusinessCard } from "@/types/business-card"
import type { NewsArticle } from "@/types/news"

// Sample data for fallback
const sampleBusinessCards: BusinessCard[] = [
  {
    id: 1,
    title: "방콕 맛집 - 한국식당",
    description:
      "정통 한국 요리를 맛볼 수 있는 방콕 최고의 한국식당입니다. 김치찌개, 불고기, 비빔밥 등 다양한 메뉴를 제공합니다.",
    category: "음식점",
    location: "방콕 수쿰빗 소이 11",
    phone: "02-123-4567",
    kakaoId: "korean_restaurant_bkk",
    lineId: "korean_rest",
    website: "https://korean-restaurant-bangkok.com",
    hours: "매일 11:00 - 22:00",
    price: "메인 요리 150-300바트",
    promotion: "런치 세트 20% 할인 (평일 11:00-15:00)",
    tags: ["한국음식", "방콕", "수쿰빗", "런치", "디너"],
    image: "/placeholder.svg?height=200&width=400&text=한국식당",
    isPromoted: true,
    isPremium: false,
    exposureCount: 45,
    viewCount: 120,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "태국 전국 배송 서비스",
    description: "한국에서 태국으로, 태국에서 한국으로 안전하고 빠른 배송 서비스를 제공합니다.",
    category: "배송서비스",
    location: "방콕 라차다피섹",
    phone: "089-123-4567",
    kakaoId: "thai_delivery_service",
    lineId: "thai_delivery",
    website: "https://thai-delivery-service.com",
    hours: "월-금 09:00 - 18:00",
    price: "1kg당 150바트부터",
    promotion: "첫 배송 30% 할인",
    tags: ["배송", "한국", "태국", "국제배송"],
    image: "/placeholder.svg?height=200&width=400&text=배송서비스",
    isPromoted: false,
    isPremium: true,
    exposureCount: 32,
    viewCount: 89,
    created_at: "2024-01-14T15:20:00Z",
    updated_at: "2024-01-14T15:20:00Z",
  },
]

const sampleNewsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "태국 관광업계, 2024년 회복세 지속",
    content:
      "태국 관광청에 따르면 2024년 상반기 외국인 관광객 수가 전년 동기 대비 25% 증가했다고 발표했습니다. 특히 한국 관광객의 증가폭이 두드러지며, 방콕과 파타야 지역의 호텔 예약률이 크게 상승했습니다.",
    summary: "태국 관광업계가 2024년 상반기 25% 성장을 기록하며 회복세를 보이고 있습니다.",
    category: "경제",
    tags: ["관광", "태국", "경제", "회복"],
    imageUrl: "/placeholder.svg?height=300&width=600&text=태국관광",
    sourceUrl: "https://example.com/news/1",
    author: "편집부",
    isPublished: true,
    isBreaking: false,
    viewCount: 245,
    readTime: 3,
    language: "ko",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    publishedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: 2,
    title: "방콕 지하철 새 노선 개통 예정",
    content:
      "방콕 대중교통공사(BMTA)는 올해 말 새로운 지하철 노선이 개통될 예정이라고 발표했습니다. 새 노선은 시내 중심가와 외곽 지역을 연결하여 교통 편의성을 크게 향상시킬 것으로 기대됩니다.",
    summary: "방콕에 새로운 지하철 노선이 올해 말 개통 예정입니다.",
    category: "교통",
    tags: ["방콕", "지하철", "교통", "개통"],
    imageUrl: "/placeholder.svg?height=300&width=600&text=방콕지하철",
    sourceUrl: "https://example.com/news/2",
    author: "교통부 기자",
    isPublished: true,
    isBreaking: true,
    viewCount: 189,
    readTime: 2,
    language: "ko",
    createdAt: "2024-01-15T11:30:00Z",
    updatedAt: "2024-01-15T11:30:00Z",
    publishedAt: "2024-01-15T11:30:00Z",
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
    readTime: dbArticle.read_time || 3,
    language: dbArticle.language || "ko",
    translatedTitle: dbArticle.translated_title,
    translatedContent: dbArticle.translated_content,
    translatedSummary: dbArticle.translated_summary,
    createdAt: dbArticle.created_at,
    updatedAt: dbArticle.updated_at,
    publishedAt: dbArticle.published_at || dbArticle.created_at,
  }
}
