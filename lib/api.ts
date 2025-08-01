import { supabase, safeSupabaseOperation, type BusinessCard, type NewsArticle } from "./supabase"

// Sample data for fallback
const sampleBusinessCards: BusinessCard[] = [
  {
    id: "1",
    title: "윤키친 (YOON'S KITCHEN)",
    description:
      "공항에서 15분거리, 무한 리필 숯불 구이로 리노베이션을 마치고 돌아왔습니다. 한국 맛과 감성을 그대로 살려 교민과 현지인들에게 좋은 반응을 얻고 있습니다.",
    category: "음식점",
    phone: "082-048-8139",
    address: "공항에서 15분거리",
    website: "https://maps.app.goo.gl/KRGafHvKBo7wC6Wu7",
    facebook: "https://www.facebook.com/share/p/1BzGkvmWjt",
    tags: ["한식", "무한리필", "숯불구이", "단체예약"],
    is_active: true,
    is_premium: true,
    is_promoted: false,
    view_count: 1250,
    exposure_count: 3400,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "방콕막창 2호점",
    description:
      "팔람4 빅씨 맞은편! 가성비 맛집에서 저렴하고 맛있게 즐거운 경험을 선사합니다. 오픈 기념 선물도 준비되어 있습니다.",
    category: "음식점",
    phone: "063-886-1034",
    address: "팔람4 빅씨 맞은편",
    website: "https://maps.app.goo.gl/CQX8NKdDUt1Eg6Lc7",
    tags: ["막창", "가성비", "오픈기념"],
    is_active: true,
    is_premium: false,
    is_promoted: true,
    view_count: 890,
    exposure_count: 2100,
    created_at: "2024-01-16T09:30:00Z",
    updated_at: "2024-01-16T09:30:00Z",
  },
  {
    id: "3",
    title: "스타익스프레스 특송택배",
    description:
      "Kg당 130바트, 방콕 계신위치에서 픽업해서 한국 주소지까지 논스톱 배송서비스. 항공특송, 항공이사, 구매대행 서비스 제공.",
    category: "배송서비스",
    phone: "02-123-4567",
    website: "https://www.starexpress.co.kr",
    tags: ["특송", "택배", "한국배송", "픽업서비스"],
    is_active: true,
    is_premium: true,
    is_promoted: true,
    view_count: 2100,
    exposure_count: 5600,
    created_at: "2024-01-17T14:20:00Z",
    updated_at: "2024-01-17T14:20:00Z",
  },
]

const sampleNewsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "태국 정부, 외국인 관광객 대상 새로운 비자 정책 발표",
    content:
      "태국 정부가 외국인 관광객 유치를 위한 새로운 비자 정책을 발표했습니다. 이번 정책은 장기 체류 관광객을 대상으로 하며, 최대 90일까지 체류가 가능합니다.",
    summary: "태국 정부가 외국인 관광객을 위한 새로운 90일 비자 정책을 발표했습니다.",
    category: "정치",
    source_url: "https://www.bangkokpost.com/thailand/general/3078318/man-shot-on-way-to-work-in-samut-prakan",
    author: "방콕포스트",
    tags: ["비자", "관광", "정책"],
    is_published: true,
    is_breaking: false,
    view_count: 1500,
    published_at: "2024-01-15T08:00:00Z",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    title: "방콕 지하철 새 노선 개통, 교통 체증 완화 기대",
    content:
      "방콕 대중교통공사가 새로운 지하철 노선을 개통했다고 발표했습니다. 이번 노선은 도심과 외곽을 연결하여 교통 체증 완화에 도움이 될 것으로 예상됩니다.",
    summary: "방콕에 새로운 지하철 노선이 개통되어 교통 체증 완화가 기대됩니다.",
    category: "교통",
    source_url: "https://www.nationthailand.com/business/economy/40053391",
    author: "네이션",
    tags: ["지하철", "교통", "방콕"],
    is_published: true,
    is_breaking: true,
    view_count: 2300,
    published_at: "2024-01-16T10:30:00Z",
    created_at: "2024-01-16T10:30:00Z",
    updated_at: "2024-01-16T10:30:00Z",
  },
]

// Business Cards API
export async function getBusinessCards(limit = 20, offset = 0): Promise<BusinessCard[]> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase!
      .from("business_cards")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)
  })

  return result || sampleBusinessCards
}

export async function searchBusinessCards(query: string, category?: string): Promise<BusinessCard[]> {
  const result = await safeSupabaseOperation(async () => {
    let queryBuilder = supabase!.from("business_cards").select("*").eq("is_active", true)

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (category) {
      queryBuilder = queryBuilder.eq("category", category)
    }

    return await queryBuilder.order("created_at", { ascending: false })
  })

  if (result) {
    return result
  }

  // Fallback search in sample data
  return sampleBusinessCards.filter((card) => {
    const matchesQuery =
      !query ||
      card.title.toLowerCase().includes(query.toLowerCase()) ||
      card.description.toLowerCase().includes(query.toLowerCase())

    const matchesCategory = !category || card.category === category

    return matchesQuery && matchesCategory
  })
}

export async function getBusinessCardById(id: string): Promise<BusinessCard | null> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase!.from("business_cards").select("*").eq("id", id).single()
  })

  return result || sampleBusinessCards.find((card) => card.id === id) || null
}

export async function incrementViewCount(id: string): Promise<void> {
  await safeSupabaseOperation(async () => {
    return await supabase!.rpc("increment_view_count", { card_id: id })
  })
}

export async function incrementExposureCount(id: string): Promise<void> {
  await safeSupabaseOperation(async () => {
    return await supabase!.rpc("increment_exposure_count", { card_id: id })
  })
}

// News Articles API
export async function getNewsArticles(limit = 20, offset = 0): Promise<NewsArticle[]> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase!
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1)
  })

  return result || sampleNewsArticles
}

export async function searchNewsArticles(query: string, category?: string): Promise<NewsArticle[]> {
  const result = await safeSupabaseOperation(async () => {
    let queryBuilder = supabase!.from("news_articles").select("*").eq("is_published", true)

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    }

    if (category) {
      queryBuilder = queryBuilder.eq("category", category)
    }

    return await queryBuilder.order("published_at", { ascending: false })
  })

  if (result) {
    return result
  }

  // Fallback search in sample data
  return sampleNewsArticles.filter((article) => {
    const matchesQuery =
      !query ||
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase())

    const matchesCategory = !category || article.category === category

    return matchesQuery && matchesCategory
  })
}

export async function getNewsArticleById(id: string): Promise<NewsArticle | null> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase!.from("news_articles").select("*").eq("id", id).single()
  })

  return result || sampleNewsArticles.find((article) => article.id === id) || null
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase!
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .eq("is_breaking", true)
      .order("published_at", { ascending: false })
      .limit(3)
  })

  if (result) {
    return result
  }

  return sampleNewsArticles.filter((article) => article.is_breaking).slice(0, 3)
}

export async function incrementNewsViewCount(articleId: number): Promise<void> {
  await safeSupabaseOperation(async () => {
    return await supabase!.rpc("increment_news_view_count", { article_id: articleId })
  })
}

// Categories and Tags
export async function getCategories(): Promise<string[]> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase!.from("categories").select("name").eq("is_active", true).order("name")
  })

  if (result) {
    return result.map((cat: any) => cat.name)
  }

  return [
    "음식점",
    "배송서비스",
    "여행서비스",
    "식품",
    "이벤트서비스",
    "방송서비스",
    "전자제품",
    "유흥업소",
    "교통서비스",
    "서비스",
  ]
}

export async function getTags(): Promise<string[]> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase!.from("tags").select("name").eq("is_active", true).order("name")
  })

  if (result) {
    return result.map((tag: any) => tag.name)
  }

  return ["한식", "배송", "여행", "특송", "택배", "음식", "서비스", "이벤트", "방송", "전자제품"]
}

// Statistics
export async function getStatistics() {
  const businessCardsCount = await safeSupabaseOperation(async () => {
    const { count } = await supabase!
      .from("business_cards")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
    return { count }
  })

  const newsArticlesCount = await safeSupabaseOperation(async () => {
    const { count } = await supabase!
      .from("news_articles")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true)
    return { count }
  })

  const breakingNewsCount = await safeSupabaseOperation(async () => {
    const { count } = await supabase!
      .from("news_articles")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true)
      .eq("is_breaking", true)
    return { count }
  })

  const premiumCardsCount = await safeSupabaseOperation(async () => {
    const { count } = await supabase!
      .from("business_cards")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("is_premium", true)
    return { count }
  })

  return {
    newsCount: newsArticlesCount?.count || sampleNewsArticles.length,
    businessCount: businessCardsCount?.count || sampleBusinessCards.length,
    breakingCount: breakingNewsCount?.count || sampleNewsArticles.filter((article) => article.is_breaking).length,
    premiumCount: premiumCardsCount?.count || sampleBusinessCards.filter((card) => card.is_premium).length,
  }
}
