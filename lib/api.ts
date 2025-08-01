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
    id: 1,
    title: "방콕 한식당",
    description:
      "정통 한식을 맛볼 수 있는 방콕 최고의 한식당입니다. 김치찌개, 불고기, 비빔밥 등 다양한 메뉴를 제공합니다.",
    category: "음식점",
    phone: "02-123-4567",
    address: "123 Sukhumvit Road, Bangkok",
    website: "https://example.com",
    facebook: "https://facebook.com/restaurant",
    line: "https://line.me/restaurant",
    image_url: "/placeholder.jpg",
    is_active: true,
    is_premium: true,
    is_promoted: false,
    view_count: 1250,
    exposure_count: 5000,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    tags: ["한식", "김치찌개", "불고기", "비빔밥"],
  },
  {
    id: 2,
    title: "태국 한인 마트",
    description: "한국 식품과 생필품을 판매하는 마트입니다. 김치, 라면, 고추장 등 한국 식품을 쉽게 구매할 수 있습니다.",
    category: "쇼핑",
    phone: "02-234-5678",
    address: "456 Silom Road, Bangkok",
    website: "https://koreanmart.com",
    instagram: "https://instagram.com/koreanmart",
    image_url: "/placeholder.jpg",
    is_active: true,
    is_premium: false,
    is_promoted: true,
    view_count: 890,
    exposure_count: 3200,
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
    tags: ["한국식품", "김치", "라면", "마트"],
  },
  {
    id: 3,
    title: "한국어 학원",
    description: "태국인을 위한 한국어 교육 전문 학원입니다. 초급부터 고급까지 체계적인 한국어 교육을 제공합니다.",
    category: "교육",
    phone: "02-345-6789",
    address: "789 Phayathai Road, Bangkok",
    website: "https://koreanschool.com",
    youtube: "https://youtube.com/koreanschool",
    image_url: "/placeholder.jpg",
    is_active: true,
    is_premium: false,
    is_promoted: false,
    view_count: 650,
    exposure_count: 2100,
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-05T09:15:00Z",
    tags: ["한국어", "교육", "학원", "언어"],
  },
]

const sampleNewsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "태국 한인 커뮤니티 새해 행사 개최",
    content:
      "태국 한인 커뮤니티에서 새해를 맞아 다양한 행사를 개최합니다. 전통 음식 체험, 문화 공연, 네트워킹 등 다채로운 프로그램이 준비되어 있습니다.",
    summary: "태국 한인 커뮤니티 새해 행사 개최 소식",
    category: "커뮤니티",
    source_url: "https://example.com/news/1",
    image_url: "/placeholder.jpg",
    is_published: true,
    is_breaking: false,
    view_count: 2340,
    published_at: "2024-01-20T08:00:00Z",
    created_at: "2024-01-20T08:00:00Z",
    updated_at: "2024-01-20T08:00:00Z",
    tags: ["커뮤니티", "새해", "행사", "문화"],
    language: "ko",
  },
  {
    id: 2,
    title: "방콕 한식당 새 지점 오픈",
    content:
      "인기 한식당이 방콕에 새로운 지점을 오픈했습니다. 더 넓은 공간과 다양한 메뉴로 고객들을 맞이할 예정입니다.",
    summary: "방콕 한식당 새 지점 오픈 소식",
    category: "비즈니스",
    source_url: "https://example.com/news/2",
    image_url: "/placeholder.jpg",
    is_published: true,
    is_breaking: true,
    view_count: 1890,
    published_at: "2024-01-19T15:30:00Z",
    created_at: "2024-01-19T15:30:00Z",
    updated_at: "2024-01-19T15:30:00Z",
    tags: ["한식당", "오픈", "방콕", "비즈니스"],
    language: "ko",
  },
]

const sampleCategories: Category[] = [
  {
    id: 1,
    name: "음식점",
    description: "한식, 중식, 일식 등 다양한 음식점",
    icon: "🍽️",
    color: "#FF6B6B",
    is_active: true,
    sort_order: 1,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "쇼핑",
    description: "마트, 쇼핑몰, 전문점",
    icon: "🛒",
    color: "#4ECDC4",
    is_active: true,
    sort_order: 2,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "교육",
    description: "학원, 과외, 교육 서비스",
    icon: "📚",
    color: "#45B7D1",
    is_active: true,
    sort_order: 3,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "의료",
    description: "병원, 약국, 의료 서비스",
    icon: "🏥",
    color: "#96CEB4",
    is_active: true,
    sort_order: 4,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "서비스",
    description: "미용, 수리, 기타 서비스",
    icon: "🔧",
    color: "#FFEAA7",
    is_active: true,
    sort_order: 5,
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Business Cards API
export async function getBusinessCards(limit = 20, offset = 0): Promise<BusinessCard[]> {
  const result = await safeSupabaseOperation(() =>
    supabase
      .from("business_cards")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1),
  )

  if (result.success && result.data) {
    return result.data
  }

  // Return sample data as fallback
  return sampleBusinessCards.slice(offset, offset + limit)
}

export async function getBusinessCardById(id: number): Promise<BusinessCard | null> {
  const result = await safeSupabaseOperation(() =>
    supabase.from("business_cards").select("*").eq("id", id).eq("is_active", true).single(),
  )

  if (result.success && result.data) {
    return result.data
  }

  // Return sample data as fallback
  return sampleBusinessCards.find((card) => card.id === id) || null
}

export async function searchBusinessCards(query: string, category?: string): Promise<BusinessCard[]> {
  let supabaseQuery = supabase.from("business_cards").select("*").eq("is_active", true)

  if (query) {
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (category) {
    supabaseQuery = supabaseQuery.eq("category", category)
  }

  const result = await safeSupabaseOperation(() => supabaseQuery.order("created_at", { ascending: false }))

  if (result.success && result.data) {
    return result.data
  }

  // Return filtered sample data as fallback
  let filtered = sampleBusinessCards
  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter(
      (card) => card.title.toLowerCase().includes(lowerQuery) || card.description.toLowerCase().includes(lowerQuery),
    )
  }
  if (category) {
    filtered = filtered.filter((card) => card.category === category)
  }
  return filtered
}

export async function incrementViewCount(id: number): Promise<void> {
  await safeSupabaseOperation(() => supabase.rpc("increment_view_count", { card_id: id }))
}

export async function incrementExposureCount(id: number): Promise<void> {
  await safeSupabaseOperation(() => supabase.rpc("increment_exposure_count", { card_id: id }))
}

// News Articles API
export async function getNewsArticles(limit = 20, offset = 0): Promise<NewsArticle[]> {
  const result = await safeSupabaseOperation(() =>
    supabase
      .from("news_articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1),
  )

  if (result.success && result.data) {
    return result.data
  }

  // Return sample data as fallback
  return sampleNewsArticles.slice(offset, offset + limit)
}

export async function getNewsArticleById(id: number): Promise<NewsArticle | null> {
  const result = await safeSupabaseOperation(() =>
    supabase.from("news_articles").select("*").eq("id", id).eq("is_published", true).single(),
  )

  if (result.success && result.data) {
    return result.data
  }

  // Return sample data as fallback
  return sampleNewsArticles.find((article) => article.id === id) || null
}

export async function searchNewsArticles(query: string, category?: string): Promise<NewsArticle[]> {
  let supabaseQuery = supabase.from("news_articles").select("*").eq("is_published", true)

  if (query) {
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
  }

  if (category) {
    supabaseQuery = supabaseQuery.eq("category", category)
  }

  const result = await safeSupabaseOperation(() => supabaseQuery.order("published_at", { ascending: false }))

  if (result.success && result.data) {
    return result.data
  }

  // Return filtered sample data as fallback
  let filtered = sampleNewsArticles
  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) || article.content.toLowerCase().includes(lowerQuery),
    )
  }
  if (category) {
    filtered = filtered.filter((article) => article.category === category)
  }
  return filtered
}

export async function incrementNewsViewCount(id: number): Promise<void> {
  await safeSupabaseOperation(() => supabase.rpc("increment_news_view_count", { article_id: id }))
}

// Categories API
export async function getCategories(): Promise<Category[]> {
  const result = await safeSupabaseOperation(() =>
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
  )

  if (result.success && result.data) {
    return result.data
  }

  // Return sample data as fallback
  return sampleCategories
}

// Tags API
export async function getTags(): Promise<Tag[]> {
  const result = await safeSupabaseOperation(() =>
    supabase.from("tags").select("*").eq("is_active", true).order("usage_count", { ascending: false }),
  )

  if (result.success && result.data) {
    return result.data || []
  }

  // Return empty array as fallback for tags
  return []
}

// Statistics API
export async function getStatistics() {
  const businessCardsResult = await safeSupabaseOperation(() =>
    supabase.from("business_cards").select("*", { count: "exact", head: true }).eq("is_active", true),
  )

  const newsResult = await safeSupabaseOperation(() =>
    supabase.from("news_articles").select("*", { count: "exact", head: true }).eq("is_published", true),
  )

  const categoriesResult = await safeSupabaseOperation(() =>
    supabase.from("categories").select("*", { count: "exact", head: true }).eq("is_active", true),
  )

  return {
    businessCards: businessCardsResult.data?.length || sampleBusinessCards.length,
    newsArticles: newsResult.data?.length || sampleNewsArticles.length,
    categories: categoriesResult.data?.length || sampleCategories.length,
    totalViews: 15420, // Sample data
  }
}
