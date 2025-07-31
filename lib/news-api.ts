import { supabase } from "./supabase"
import type { NewsArticle, NewsCategory } from "../types/news"

// 샘플 뉴스 데이터 (데이터베이스가 없을 때 사용)
const SAMPLE_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: "태국 정부, 한국인 관광객 대상 새로운 비자 정책 발표",
    summary:
      "태국 정부가 한국인 관광객 유치를 위한 새로운 비자 정책을 발표했습니다. 이번 정책으로 한국인들의 태국 방문이 더욱 편리해질 것으로 예상됩니다.",
    content:
      "태국 관광청은 오늘 기자회견을 통해 한국인 관광객을 대상으로 한 새로운 비자 정책을 발표했습니다. 주요 내용으로는 관광비자 연장 기간 확대, 다중입국 비자 발급 조건 완화, 온라인 비자 신청 시스템 개선 등이 포함되어 있습니다.",
    category: "정치",
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    source: "태국 일보",
    author: "김태국",
    imageUrl: "/placeholder.svg?height=200&width=300&text=태국+비자+정책",
    url: "https://example.com/news/1",
    tags: ["속보", "정치", "한국", "태국", "비자"],
    viewCount: 156,
    isBreaking: true,
    isPinned: true,
  },
  {
    id: 2,
    title: "방콕 지하철 새 노선 개통 예정, 교민 거주지역 접근성 향상",
    summary:
      "방콕 대중교통공사가 새로운 지하철 노선의 개통 일정을 발표했습니다. 한국인 교민들이 많이 거주하는 지역의 교통 편의성이 크게 개선될 예정입니다.",
    content:
      "방콕 대중교통공사(BMCL)는 오늘 새로운 지하철 노선인 오렌지 라인의 개통 일정을 발표했습니다. 이 노선은 방콕 중심부에서 동쪽 지역을 연결하며, 한국인 교민들이 많이 거주하는 수쿰빗, 통로, 에까마이 지역의 접근성을 크게 향상시킬 것으로 예상됩니다.",
    category: "사회",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: "방콕 포스트",
    author: "이방콕",
    imageUrl: "/placeholder.svg?height=200&width=300&text=방콕+지하철",
    url: null,
    tags: ["사회", "방콕", "교민"],
    viewCount: 89,
    isBreaking: false,
    isPinned: true,
  },
  {
    id: 3,
    title: "태국 바트화 강세 지속, 한국 투자자들 관심 증가",
    summary: "최근 태국 바트화의 강세가 지속되면서 한국 투자자들의 태국 투자에 대한 관심이 높아지고 있습니다.",
    content:
      "태국 중앙은행에 따르면 올해 들어 바트화는 달러 대비 약 8% 상승했으며, 이는 아시아 통화 중 가장 높은 상승률을 기록했습니다. 전문가들은 태국의 견고한 경제 펀더멘털과 관광업 회복이 바트화 강세의 주요 원인이라고 분석했습니다.",
    category: "경제",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: "경제신문",
    author: "박경제",
    imageUrl: "/placeholder.svg?height=200&width=300&text=태국+경제",
    url: null,
    tags: ["경제", "태국", "한국", "투자"],
    viewCount: 67,
    isBreaking: false,
    isPinned: false,
  },
  {
    id: 4,
    title: "방콕 한인회, 추석 맞이 대규모 행사 개최 예정",
    summary: "방콕 한인회가 다가오는 추석을 맞아 교민들을 위한 대규모 행사를 준비하고 있다고 발표했습니다.",
    content:
      "방콕 한인회는 오는 9월 29일 추석을 맞아 방콕 시내 호텔에서 교민 화합 행사를 개최한다고 발표했습니다. 이번 행사에는 전통 차례상 차리기 체험, 한국 전통 놀이, K-POP 공연 등 다양한 프로그램이 준비되어 있습니다.",
    category: "교민소식",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: "한인신문",
    author: "최교민",
    imageUrl: "/placeholder.svg?height=200&width=300&text=추석+행사",
    url: null,
    tags: ["교민", "방콕", "한국"],
    viewCount: 234,
    isBreaking: false,
    isPinned: false,
  },
  {
    id: 5,
    title: "K-POP 콘서트 방콕 개최, 한류 열풍 지속",
    summary: "세계적인 K-POP 그룹의 방콕 콘서트가 확정되면서 태국 내 한류 열풍이 더욱 뜨거워지고 있습니다.",
    content:
      "태국 최대 공연장인 임팩트 아레나에서 오는 11월 K-POP 그룹의 대규모 콘서트가 개최됩니다. 이번 콘서트는 아시아 투어의 일환으로 진행되며, 태국 팬들의 뜨거운 관심을 받고 있습니다.",
    category: "문화",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    source: "문화일보",
    author: "송문화",
    imageUrl: "/placeholder.svg?height=200&width=300&text=K-POP+콘서트",
    url: null,
    tags: ["방콕", "한국"],
    viewCount: 145,
    isBreaking: false,
    isPinned: false,
  },
  {
    id: 6,
    title: "태국 프리미어리그에 한국 선수 영입, 현지 팬들 환영",
    summary: "태국 프리미어리그 구단이 한국 선수를 영입하면서 현지 축구팬들의 관심이 집중되고 있습니다.",
    content:
      "방콕 유나이티드 FC가 K리그에서 활약했던 한국 선수를 영입했다고 발표했습니다. 이 선수는 지난 시즌 K리그에서 우수한 성적을 거둔 공격수로, 태국 리그에서의 활약이 기대됩니다.",
    category: "스포츠",
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    source: "스포츠투데이",
    author: "김스포츠",
    imageUrl: "/placeholder.svg?height=200&width=300&text=축구+선수",
    url: null,
    tags: ["방콕", "한국"],
    viewCount: 98,
    isBreaking: false,
    isPinned: false,
  },
  {
    id: 7,
    title: "태국 정부, 디지털 노마드 비자 도입 검토",
    summary:
      "태국 정부가 디지털 노마드를 위한 특별 비자 도입을 검토하고 있어 한국 IT 전문가들의 관심이 높아지고 있습니다.",
    content:
      "태국 디지털경제사회부는 원격근무가 가능한 외국인 전문가들을 위한 디지털 노마드 비자 도입을 검토 중이라고 발표했습니다. 이 비자는 최대 1년간 체류가 가능하며, IT, 디자인, 마케팅 등 다양한 분야의 전문가들이 대상입니다.",
    category: "IT/과학",
    publishedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    source: "IT뉴스",
    author: "이아이티",
    imageUrl: "/placeholder.svg?height=200&width=300&text=디지털+노마드",
    url: null,
    tags: ["태국", "한국", "비자"],
    viewCount: 76,
    isBreaking: false,
    isPinned: false,
  },
  {
    id: 8,
    title: "방콕 새로운 한국마트 오픈, 교민들 편의 증대",
    summary: "방콕에 새로운 한국마트가 오픈하면서 교민들의 생활 편의가 크게 향상될 것으로 예상됩니다.",
    content:
      "방콕 수쿰빗 지역에 대형 한국마트가 새롭게 문을 열었습니다. 이 마트는 한국 식품, 생활용품, 화장품 등 다양한 한국 제품을 판매하며, 특히 신선한 한국 채소와 육류를 저렴한 가격에 제공합니다.",
    category: "생활정보",
    publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    source: "생활정보",
    author: "박생활",
    imageUrl: "/placeholder.svg?height=200&width=300&text=한국마트",
    url: null,
    tags: ["방콕", "교민", "한국"],
    viewCount: 187,
    isBreaking: false,
    isPinned: false,
  },
  {
    id: 9,
    title: "한-태 정상회담 개최 예정, 양국 관계 발전 기대",
    summary: "한국과 태국 정상회담이 예정되어 있어 양국 관계의 새로운 전환점이 될 것으로 기대됩니다.",
    content:
      "한국과 태국 정부는 다음 달 정상회담을 개최한다고 발표했습니다. 이번 회담에서는 경제협력 확대, 문화교류 증진, 관광산업 발전 등 다양한 분야의 협력 방안이 논의될 예정입니다.",
    category: "국제",
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    source: "국제뉴스",
    author: "최국제",
    imageUrl: "/placeholder.svg?height=200&width=300&text=정상회담",
    url: null,
    tags: ["한국", "태국", "정치"],
    viewCount: 123,
    isBreaking: false,
    isPinned: false,
  },
  {
    id: 10,
    title: "태국 우기철 대비 안전 수칙, 교민들 주의 당부",
    summary: "태국의 우기철이 시작되면서 교민들의 안전에 각별한 주의가 필요한 시점입니다.",
    content:
      "태국 기상청은 올해 우기철이 평년보다 강할 것으로 예상된다고 발표했습니다. 특히 방콕과 주변 지역에는 집중호우와 함께 침수 위험이 높아질 것으로 예상됩니다.",
    category: "기타",
    publishedAt: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(),
    source: "안전뉴스",
    author: "김안전",
    imageUrl: "/placeholder.svg?height=200&width=300&text=우기철+안전",
    url: null,
    tags: ["태국", "교민"],
    viewCount: 95,
    isBreaking: false,
    isPinned: false,
  },
]

const SAMPLE_NEWS_CATEGORIES: NewsCategory[] = [
  { id: 1, name: "정치", color_class: "bg-red-100 text-red-800" },
  { id: 2, name: "경제", color_class: "bg-blue-100 text-blue-800" },
  { id: 3, name: "사회", color_class: "bg-green-100 text-green-800" },
  { id: 4, name: "국제", color_class: "bg-purple-100 text-purple-800" },
  { id: 5, name: "문화", color_class: "bg-pink-100 text-pink-800" },
  { id: 6, name: "스포츠", color_class: "bg-orange-100 text-orange-800" },
  { id: 7, name: "IT/과학", color_class: "bg-cyan-100 text-cyan-800" },
  { id: 8, name: "교민소식", color_class: "bg-yellow-100 text-yellow-800" },
  { id: 9, name: "생활정보", color_class: "bg-indigo-100 text-indigo-800" },
  { id: 10, name: "기타", color_class: "bg-gray-100 text-gray-800" },
]

// 뉴스 기사 페이지네이션 조회
export async function getNewsArticlesPaginated(
  page = 1,
  pageSize = 20,
  categoryFilter?: string,
  searchTerm?: string,
): Promise<{
  articles: NewsArticle[]
  total: number
  hasMore: boolean
}> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized, using sample data")
      return getSampleNewsData(page, pageSize, categoryFilter, searchTerm)
    }

    // 먼저 테이블 존재 여부 확인
    const { data: tableCheck, error: tableError } = await supabase.from("news_articles").select("id").limit(1)

    if (tableError) {
      console.warn("News tables not found, using sample data:", tableError.message)
      return getSampleNewsData(page, pageSize, categoryFilter, searchTerm)
    }

    // 테이블이 존재하면 실제 데이터 조회
    let query = supabase
      .from("news_articles")
      .select(
        `
        id,
        title,
        summary,
        content,
        published_at,
        source,
        author,
        image_url,
        external_url,
        view_count,
        is_breaking,
        is_pinned,
        news_categories (
          name
        )
      `,
        { count: "exact" },
      )
      .eq("is_active", true)
      .order("is_pinned", { ascending: false })
      .order("is_breaking", { ascending: false })
      .order("published_at", { ascending: false })

    // 카테고리 필터 적용
    if (categoryFilter) {
      query = query.eq("news_categories.name", categoryFilter)
    }

    // 검색어 필터 적용
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%`)
    }

    // 페이지네이션 적용
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching news articles:", error)
      return getSampleNewsData(page, pageSize, categoryFilter, searchTerm)
    }

    const articles: NewsArticle[] = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      summary: item.summary || "",
      content: item.content || "",
      category: item.news_categories?.name || "기타",
      publishedAt: item.published_at,
      source: item.source || "알 수 없음",
      author: item.author || null,
      imageUrl: item.image_url || null,
      url: item.external_url || null,
      tags: [], // 직접 쿼리에서는 태그를 가져오지 않음
      viewCount: item.view_count || 0,
      isBreaking: item.is_breaking || false,
      isPinned: item.is_pinned || false,
    }))

    return {
      articles,
      total: count || 0,
      hasMore: (count || 0) > page * pageSize,
    }
  } catch (error) {
    console.error("Error in getNewsArticlesPaginated:", error)
    return getSampleNewsData(page, pageSize, categoryFilter, searchTerm)
  }
}

// 샘플 뉴스 데이터 필터링 함수
function getSampleNewsData(
  page: number,
  pageSize: number,
  categoryFilter?: string,
  searchTerm?: string,
): {
  articles: NewsArticle[]
  total: number
  hasMore: boolean
} {
  let filteredArticles = [...SAMPLE_NEWS_ARTICLES]

  // 카테고리 필터 적용
  if (categoryFilter) {
    filteredArticles = filteredArticles.filter((article) => article.category === categoryFilter)
  }

  // 검색어 필터 적용
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase()
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.summary.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  // 정렬 (고정 > 속보 > 날짜순)
  filteredArticles.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    if (a.isBreaking && !b.isBreaking) return -1
    if (!a.isBreaking && b.isBreaking) return 1
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  // 페이지네이션 적용
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

  return {
    articles: paginatedArticles,
    total: filteredArticles.length,
    hasMore: endIndex < filteredArticles.length,
  }
}

// 뉴스 카테고리 조회
export async function getNewsCategories(): Promise<NewsCategory[]> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized, using sample data")
      return SAMPLE_NEWS_CATEGORIES
    }

    // 먼저 테이블 존재 여부 확인
    const { data: tableCheck, error: tableError } = await supabase.from("news_categories").select("id").limit(1)

    if (tableError) {
      console.warn("News categories table not found, using sample data:", tableError.message)
      return SAMPLE_NEWS_CATEGORIES
    }

    // 테이블이 존재하면 실제 데이터 조회
    const { data, error } = await supabase.from("news_categories").select("id, name, color_class").order("name")

    if (error) {
      console.error("Error fetching news categories:", error)
      return SAMPLE_NEWS_CATEGORIES
    }

    return (
      data?.map((item: any) => ({
        id: item.id,
        name: item.name,
        color_class: item.color_class,
      })) || SAMPLE_NEWS_CATEGORIES
    )
  } catch (error) {
    console.error("Error in getNewsCategories:", error)
    return SAMPLE_NEWS_CATEGORIES
  }
}

// 뉴스 조회수 증가
export async function incrementNewsViewCount(articleId: number): Promise<void> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized")
      return
    }

    // 먼저 테이블 존재 여부 확인
    const { data: tableCheck, error: tableError } = await supabase
      .from("news_articles")
      .select("id")
      .eq("id", articleId)
      .limit(1)

    if (tableError) {
      console.warn("News articles table not found:", tableError.message)
      return
    }

    // 테이블이 존재하면 조회수 증가
    const { error } = await supabase
      .from("news_articles")
      .update({
        view_count: supabase.raw("view_count + 1"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId)
      .eq("is_active", true)

    if (error) {
      console.error("Error incrementing news view count:", error)
    }
  } catch (error) {
    console.error("Error in incrementNewsViewCount:", error)
  }
}

// 인기 뉴스 조회
export async function getPopularNews(limit = 10): Promise<NewsArticle[]> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized, using sample data")
      return SAMPLE_NEWS_ARTICLES.sort((a, b) => b.viewCount - a.viewCount).slice(0, limit)
    }

    // 먼저 테이블 존재 여부 확인
    const { data: tableCheck, error: tableError } = await supabase.from("news_articles").select("id").limit(1)

    if (tableError) {
      console.warn("News articles table not found, using sample data:", tableError.message)
      return SAMPLE_NEWS_ARTICLES.sort((a, b) => b.viewCount - a.viewCount).slice(0, limit)
    }

    // 테이블이 존재하면 실제 데이터 조회
    const { data, error } = await supabase
      .from("news_articles")
      .select(`
        id,
        title,
        summary,
        published_at,
        source,
        view_count,
        is_breaking,
        is_pinned,
        news_categories (
          name
        )
      `)
      .eq("is_active", true)
      .order("view_count", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching popular news:", error)
      return SAMPLE_NEWS_ARTICLES.sort((a, b) => b.viewCount - a.viewCount).slice(0, limit)
    }

    return (
      data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.summary || "",
        content: null,
        category: item.news_categories?.name || "기타",
        publishedAt: item.published_at,
        source: item.source || "알 수 없음",
        author: null,
        imageUrl: null,
        url: null,
        tags: [],
        viewCount: item.view_count || 0,
        isBreaking: item.is_breaking || false,
        isPinned: item.is_pinned || false,
      })) || []
    )
  } catch (error) {
    console.error("Error in getPopularNews:", error)
    return SAMPLE_NEWS_ARTICLES.sort((a, b) => b.viewCount - a.viewCount).slice(0, limit)
  }
}

// 최신 뉴스 조회
export async function getLatestNews(limit = 10): Promise<NewsArticle[]> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized, using sample data")
      return SAMPLE_NEWS_ARTICLES.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ).slice(0, limit)
    }

    // 먼저 테이블 존재 여부 확인
    const { data: tableCheck, error: tableError } = await supabase.from("news_articles").select("id").limit(1)

    if (tableError) {
      console.warn("News articles table not found, using sample data:", tableError.message)
      return SAMPLE_NEWS_ARTICLES.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ).slice(0, limit)
    }

    // 테이블이 존재하면 실제 데이터 조회
    const { data, error } = await supabase
      .from("news_articles")
      .select(`
        id,
        title,
        summary,
        published_at,
        source,
        view_count,
        is_breaking,
        is_pinned,
        news_categories (
          name
        )
      `)
      .eq("is_active", true)
      .order("published_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching latest news:", error)
      return SAMPLE_NEWS_ARTICLES.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ).slice(0, limit)
    }

    return (
      data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.summary || "",
        content: null,
        category: item.news_categories?.name || "기타",
        publishedAt: item.published_at,
        source: item.source || "알 수 없음",
        author: null,
        imageUrl: null,
        url: null,
        tags: [],
        viewCount: item.view_count || 0,
        isBreaking: item.is_breaking || false,
        isPinned: item.is_pinned || false,
      })) || []
    )
  } catch (error) {
    console.error("Error in getLatestNews:", error)
    return SAMPLE_NEWS_ARTICLES.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    ).slice(0, limit)
  }
}

// 뉴스 상세 조회
export async function getNewsArticleById(id: number): Promise<NewsArticle | null> {
  try {
    if (!supabase) {
      console.warn("Supabase client not initialized, using sample data")
      return SAMPLE_NEWS_ARTICLES.find((article) => article.id === id) || null
    }

    // 먼저 테이블 존재 여부 확인
    const { data: tableCheck, error: tableError } = await supabase
      .from("news_articles")
      .select("id")
      .eq("id", id)
      .limit(1)

    if (tableError) {
      console.warn("News articles table not found, using sample data:", tableError.message)
      return SAMPLE_NEWS_ARTICLES.find((article) => article.id === id) || null
    }

    // 테이블이 존재하면 실제 데이터 조회
    const { data, error } = await supabase
      .from("news_articles")
      .select(`
        id,
        title,
        summary,
        content,
        published_at,
        source,
        author,
        image_url,
        external_url,
        view_count,
        is_breaking,
        is_pinned,
        news_categories (
          name
        )
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error fetching news article:", error)
      return SAMPLE_NEWS_ARTICLES.find((article) => article.id === id) || null
    }

    if (!data) {
      return null
    }

    return {
      id: data.id,
      title: data.title,
      summary: data.summary || "",
      content: data.content || "",
      category: data.news_categories?.name || "기타",
      publishedAt: data.published_at,
      source: data.source || "알 수 없음",
      author: data.author || null,
      imageUrl: data.image_url || null,
      url: data.external_url || null,
      tags: [], // 직접 쿼리에서는 태그를 가져오지 않음
      viewCount: data.view_count || 0,
      isBreaking: data.is_breaking || false,
      isPinned: data.is_pinned || false,
    }
  } catch (error) {
    console.error("Error in getNewsArticleById:", error)
    return SAMPLE_NEWS_ARTICLES.find((article) => article.id === id) || null
  }
}

// 캐시 관련 함수들
const CACHE_DURATION = 5 * 60 * 1000 // 5분
const cache = new Map<string, { data: any; timestamp: number }>()

export function getCachedNewsData<T>(key: string): T | null {
  const cached = cache.get(`news_${key}`)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }
  return null
}

export function setCachedNewsData<T>(key: string, data: T): void {
  cache.set(`news_${key}`, {
    data,
    timestamp: Date.now(),
  })
}
