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
      "공항에서 15분거리 무한 리필 숯불 구이로 돌아왔습니다. 한국 맛과 감성을 그대로 살려 교민과 현지인들에게 좋은 반응을 얻고 있습니다.",
    category: "한식당",
    phone: "082-048-8139",
    address: "공항 근처 15분 거리",
    website: "https://maps.app.goo.gl/KRGafHvKBo7wC6Wu7",
    facebook: "https://www.facebook.com/share/p/1BzGkvmWjt",
    tags: ["한식", "무한리필", "숯불구이", "교민맛집"],
    view_count: 1250,
    exposure_count: 3400,
    is_premium: true,
    is_promoted: false,
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "방콕막창 2호점",
    description:
      "팔람4 빅씨 맞은편! 가성비 맛집에서 저렴하고 맛있게 즐거운 경험을 선사합니다. 오픈 기념 선물도 준비되어 있습니다.",
    category: "한식당",
    phone: "063-886-1034",
    address: "팔람4 빅씨 맞은편",
    website: "https://maps.app.goo.gl/CQX8NKdDUt1Eg6Lc7",
    tags: ["막창", "가성비", "한식", "오픈기념"],
    view_count: 890,
    exposure_count: 2100,
    is_premium: false,
    is_promoted: true,
    is_active: true,
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
  },
  {
    id: "3",
    title: "스타익스프레스 (STAR EXPRESS)",
    description:
      "Kg당 130바트 방콕 계신위치에서 픽업해서 한국 주소지까지 논스톱 배송서비스. 항공특송, 항공이사, 구매대행 전문업체입니다.",
    category: "배송서비스",
    phone: "02-123-4567",
    website: "https://www.starexpress.co.kr",
    tags: ["특송", "배송", "항공이사", "구매대행"],
    view_count: 2100,
    exposure_count: 5600,
    is_premium: true,
    is_promoted: true,
    is_active: true,
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-05T09:15:00Z",
  },
]

const sampleNewsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "태국 90일 체류 정책 발표",
    content:
      "태국 정부가 한국인을 포함한 특정 국가 국민들에 대해 90일 무비자 체류를 허용하는 새로운 정책을 발표했습니다.",
    summary: "태국 정부, 한국인 90일 무비자 체류 허용 정책 발표",
    category: "정책",
    source_url: "https://example.com/news1",
    tags: ["비자", "정책", "90일체류"],
    view_count: 1500,
    is_breaking: false,
    is_published: true,
    published_at: "2024-01-15T08:00:00Z",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    title: "방콕 지하철 새 노선 개통",
    content:
      "방콕 대중교통공사가 새로운 지하철 노선을 개통한다고 발표했습니다. 이번 노선은 교민 거주 지역과 주요 상업지구를 연결합니다.",
    summary: "방콕 지하철 새 노선, 교민 거주지와 상업지구 연결",
    category: "교통",
    source_url: "https://example.com/news2",
    tags: ["지하철", "교통", "방콕"],
    view_count: 980,
    is_breaking: true,
    is_published: true,
    published_at: "2024-01-14T16:30:00Z",
    created_at: "2024-01-14T16:30:00Z",
    updated_at: "2024-01-14T16:30:00Z",
  },
  {
    id: "3",
    title: "태국 중앙은행 기준금리 동결",
    content: "태국 중앙은행이 이번 달 통화정책회의에서 기준금리를 현 수준으로 유지하기로 결정했다고 발표했습니다.",
    summary: "태국 중앙은행, 기준금리 현 수준 유지 결정",
    category: "경제",
    source_url: "https://example.com/news3",
    tags: ["금리", "경제", "중앙은행"],
    view_count: 750,
    is_breaking: true,
    is_published: true,
    published_at: "2024-01-14T11:00:00Z",
    created_at: "2024-01-14T11:00:00Z",
    updated_at: "2024-01-14T11:00:00Z",
  },
]

const sampleCategories: Category[] = [
  { id: "1", name: "한식당", description: "한국 음식점", is_active: true, created_at: "2024-01-01T00:00:00Z" },
  {
    id: "2",
    name: "배송서비스",
    description: "택배 및 배송 업체",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "미용실",
    description: "헤어샵 및 미용 서비스",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  { id: "4", name: "마사지", description: "마사지 및 스파", is_active: true, created_at: "2024-01-01T00:00:00Z" },
  { id: "5", name: "여행사", description: "여행 및 투어 서비스", is_active: true, created_at: "2024-01-01T00:00:00Z" },
]

const sampleTags: Tag[] = [
  { id: "1", name: "한식", category: "음식", usage_count: 15, is_active: true, created_at: "2024-01-01T00:00:00Z" },
  { id: "2", name: "배송", category: "서비스", usage_count: 8, is_active: true, created_at: "2024-01-01T00:00:00Z" },
  { id: "3", name: "가성비", category: "특징", usage_count: 12, is_active: true, created_at: "2024-01-01T00:00:00Z" },
  { id: "4", name: "프리미엄", category: "등급", usage_count: 6, is_active: true, created_at: "2024-01-01T00:00:00Z" },
  { id: "5", name: "24시간", category: "운영", usage_count: 4, is_active: true, created_at: "2024-01-01T00:00:00Z" },
]

// Business Cards API
export async function getBusinessCards(limit = 20, offset = 0): Promise<BusinessCard[]> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase
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
    let queryBuilder = supabase.from("business_cards").select("*").eq("is_active", true)

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (category) {
      queryBuilder = queryBuilder.eq("category", category)
    }

    return await queryBuilder.order("created_at", { ascending: false })
  })

  if (result) return result

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
    return await supabase.from("business_cards").select("*").eq("id", id).single()
  })

  return result || sampleBusinessCards.find((card) => card.id === id) || null
}

export async function incrementViewCount(id: string): Promise<void> {
  await safeSupabaseOperation(async () => {
    return await supabase.rpc("increment_view_count", { card_id: id })
  })
}

export async function incrementExposureCount(id: string): Promise<void> {
  await safeSupabaseOperation(async () => {
    return await supabase.rpc("increment_exposure_count", { card_id: id })
  })
}

// News Articles API
export async function getNewsArticles(limit = 20, offset = 0): Promise<NewsArticle[]> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase
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
    let queryBuilder = supabase.from("news_articles").select("*").eq("is_published", true)

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    }

    if (category) {
      queryBuilder = queryBuilder.eq("category", category)
    }

    return await queryBuilder.order("published_at", { ascending: false })
  })

  if (result) return result

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
    return await supabase.from("news_articles").select("*").eq("id", id).single()
  })

  return result || sampleNewsArticles.find((article) => article.id === id) || null
}

export async function getBreakingNews(): Promise<NewsArticle[]> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .eq("is_breaking", true)
      .order("published_at", { ascending: false })
      .limit(5)
  })

  return result || sampleNewsArticles.filter((article) => article.is_breaking)
}

export async function incrementNewsViewCount(id: string): Promise<void> {
  await safeSupabaseOperation(async () => {
    return await supabase.rpc("increment_news_view_count", { article_id: id })
  })
}

// Categories API
export async function getCategories(): Promise<Category[]> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase.from("categories").select("*").eq("is_active", true).order("name")
  })

  return result || sampleCategories
}

// Tags API
export async function getTags(): Promise<Tag[]> {
  const result = await safeSupabaseOperation(async () => {
    return await supabase.from("tags").select("*").eq("is_active", true).order("usage_count", { ascending: false })
  })

  return result || sampleTags
}

// Statistics API
export async function getStatistics() {
  const stats = {
    businessCount: 0,
    newsCount: 0,
    breakingCount: 0,
    premiumCount: 0,
  }

  try {
    const [businessResult, newsResult, breakingResult, premiumResult] = await Promise.all([
      supabase.from("business_cards").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("news_articles").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("news_articles").select("*", { count: "exact", head: true }).eq("is_breaking", true),
      supabase.from("business_cards").select("*", { count: "exact", head: true }).eq("is_premium", true),
    ])

    stats.businessCount = businessResult.count || sampleBusinessCards.length
    stats.newsCount = newsResult.count || sampleNewsArticles.length
    stats.breakingCount = breakingResult.count || sampleNewsArticles.filter((a) => a.is_breaking).length
    stats.premiumCount = premiumResult.count || sampleBusinessCards.filter((c) => c.is_premium).length
  } catch (error) {
    console.error("Failed to get statistics:", error)
    // Return sample data counts as fallback
    stats.businessCount = sampleBusinessCards.length
    stats.newsCount = sampleNewsArticles.length
    stats.breakingCount = sampleNewsArticles.filter((a) => a.is_breaking).length
    stats.premiumCount = sampleBusinessCards.filter((c) => c.is_premium).length
  }

  return stats
}
