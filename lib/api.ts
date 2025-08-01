import {
  supabase,
  safeSupabaseOperation,
  type BusinessCard,
  type NewsArticle,
  type Category,
  type Tag,
} from "./supabase"

// Sample data for fallback
const sampleBusinessCards: BusinessCard[] = [
  {
    id: "1",
    title: "윤키친 (YOON'S KITCHEN)",
    description:
      "공항에서 15분거리, 무한 리필 숯불 구이로 돌아온 윤키친입니다. 한국 맛과 감성을 그대로 살려 교민과 현지인들에게 좋은 반응을 얻고 있습니다.",
    category: "음식점",
    phone: "082 048 8139",
    address: "공항에서 15분거리",
    website: "https://maps.app.goo.gl/KRGafHvKBo7wC6Wu7",
    facebook: "https://www.facebook.com/share/p/1BzGkvmWjt",
    image_url: "/placeholder.svg?height=200&width=400&text=윤키친",
    tags: ["한식", "무한리필", "숯불구이", "단체예약"],
    is_active: true,
    is_premium: true,
    is_promoted: false,
    view_count: 1250,
    exposure_count: 3400,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "방콕막창 2호점",
    description: "팔람4 빅씨 맞은편! 가성비 맛집에서 저렴하고 맛있게 즐거운 경험을 선사합니다.",
    category: "음식점",
    phone: "0638861034",
    address: "팔람4 빅씨 맞은편",
    website: "https://maps.app.goo.gl/CQX8NKdDUt1Eg6Lc7",
    image_url: "/placeholder.svg?height=200&width=400&text=방콕막창",
    tags: ["막창", "가성비", "한식"],
    is_active: true,
    is_premium: false,
    is_promoted: true,
    view_count: 890,
    exposure_count: 2100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "스타익스프레스 배송서비스",
    description: "Kg당 130바트로 방콕에서 픽업해서 한국 주소지까지 논스톱 배송서비스를 제공합니다.",
    category: "배송서비스",
    phone: "0999 740 233",
    website: "https://www.starexpress.co.kr",
    image_url: "/placeholder.svg?height=200&width=400&text=스타익스프레스",
    tags: ["배송", "항공특송", "이사", "픽업서비스"],
    is_active: true,
    is_premium: true,
    is_promoted: true,
    view_count: 2100,
    exposure_count: 5600,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const sampleNewsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "태국 언론 주요 뉴스 - 7월 15일",
    content:
      "태국 언론에서 보도한 주요 뉴스입니다. 미군 팡아기지 사용 논의 부인, 중앙은행 총재 후보 내주 내각 추천 예정 등의 소식이 있습니다.",
    summary: "태국의 주요 정치, 경제 뉴스 모음",
    category: "정치",
    source_url: "https://newsk.net/th/?bmode=view&idx=166807813",
    image_url: "/placeholder.svg?height=200&width=400&text=태국뉴스",
    author: "태국커뮤니티",
    is_published: true,
    is_breaking: false,
    view_count: 450,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const sampleCategories: Category[] = [
  {
    id: "1",
    name: "음식점",
    description: "레스토랑 및 음식 관련 업체",
    color: "#ef4444",
    icon: "🍽️",
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "배송서비스",
    description: "택배 및 배송 관련 서비스",
    color: "#3b82f6",
    icon: "📦",
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "여행서비스",
    description: "여행 및 관광 관련 서비스",
    color: "#10b981",
    icon: "✈️",
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "서비스",
    description: "기타 서비스업",
    color: "#8b5cf6",
    icon: "🛠️",
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
]

// Business Cards API
export async function getBusinessCards(): Promise<BusinessCard[]> {
  try {
    return await safeSupabaseOperation(async () => {
      return await supabase
        .from("business_cards")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
    })
  } catch (error) {
    console.warn("Using sample data due to database error:", error)
    return sampleBusinessCards
  }
}

export async function searchBusinessCards(query: string, category?: string): Promise<BusinessCard[]> {
  try {
    let queryBuilder = supabase.from("business_cards").select("*").eq("is_active", true)

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (category) {
      queryBuilder = queryBuilder.eq("category", category)
    }

    return await safeSupabaseOperation(async () => {
      return await queryBuilder.order("created_at", { ascending: false })
    })
  } catch (error) {
    console.warn("Using filtered sample data due to database error:", error)
    return sampleBusinessCards.filter((card) => {
      const matchesQuery =
        !query ||
        card.title.toLowerCase().includes(query.toLowerCase()) ||
        card.description.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !category || card.category === category
      return matchesQuery && matchesCategory
    })
  }
}

export async function getBusinessCardById(id: string): Promise<BusinessCard | null> {
  try {
    return await safeSupabaseOperation(async () => {
      return await supabase.from("business_cards").select("*").eq("id", id).single()
    })
  } catch (error) {
    console.warn("Using sample data due to database error:", error)
    return sampleBusinessCards.find((card) => card.id === id) || null
  }
}

export async function incrementViewCount(id: string): Promise<void> {
  try {
    await safeSupabaseOperation(async () => {
      return await supabase.rpc("increment_view_count", { card_id: id })
    })
  } catch (error) {
    console.warn("Could not increment view count:", error)
  }
}

export async function incrementExposureCount(id: string): Promise<void> {
  try {
    await safeSupabaseOperation(async () => {
      return await supabase.rpc("increment_exposure_count", { card_id: id })
    })
  } catch (error) {
    console.warn("Could not increment exposure count:", error)
  }
}

// News Articles API
export async function getNewsArticles(): Promise<NewsArticle[]> {
  try {
    return await safeSupabaseOperation(async () => {
      return await supabase
        .from("news_articles")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
    })
  } catch (error) {
    console.warn("Using sample data due to database error:", error)
    return sampleNewsArticles
  }
}

export async function searchNewsArticles(query: string, category?: string): Promise<NewsArticle[]> {
  try {
    let queryBuilder = supabase.from("news_articles").select("*").eq("is_published", true)

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    }

    if (category) {
      queryBuilder = queryBuilder.eq("category", category)
    }

    return await safeSupabaseOperation(async () => {
      return await queryBuilder.order("published_at", { ascending: false })
    })
  } catch (error) {
    console.warn("Using filtered sample data due to database error:", error)
    return sampleNewsArticles.filter((article) => {
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !category || article.category === category
      return matchesQuery && matchesCategory
    })
  }
}

export async function incrementNewsViewCount(id: string): Promise<void> {
  try {
    await safeSupabaseOperation(async () => {
      return await supabase
        .from("news_articles")
        .update({ view_count: supabase.raw("view_count + 1") })
        .eq("id", id)
    })
  } catch (error) {
    console.warn("Could not increment news view count:", error)
  }
}

// Categories API
export async function getCategories(): Promise<Category[]> {
  try {
    return await safeSupabaseOperation(async () => {
      return await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
    })
  } catch (error) {
    console.warn("Using sample data due to database error:", error)
    return sampleCategories
  }
}

// Tags API
export async function getTags(): Promise<Tag[]> {
  try {
    return await safeSupabaseOperation(async () => {
      return await supabase.from("tags").select("*").eq("is_active", true).order("usage_count", { ascending: false })
    })
  } catch (error) {
    console.warn("Using sample data due to database error:", error)
    return []
  }
}

// Statistics API
export async function getStatistics() {
  try {
    const [businessCards, newsArticles, categories] = await Promise.all([
      supabase.from("business_cards").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("news_articles").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("categories").select("*", { count: "exact", head: true }).eq("is_active", true),
    ])

    return {
      businessCards: businessCards.count || 0,
      newsArticles: newsArticles.count || 0,
      categories: categories.count || 0,
    }
  } catch (error) {
    console.warn("Using sample statistics due to database error:", error)
    return {
      businessCards: sampleBusinessCards.length,
      newsArticles: sampleNewsArticles.length,
      categories: sampleCategories.length,
    }
  }
}
