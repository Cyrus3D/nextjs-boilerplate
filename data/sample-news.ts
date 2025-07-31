import type { NewsItem } from "../types/news"

export const sampleNews: NewsItem[] = [
  {
    id: 1,
    title: "태국 방콕 한인 커뮤니티 새로운 문화센터 개관",
    summary: "방콕 한인 커뮤니티가 새로운 문화센터를 개관하여 다양한 문화 프로그램과 한국어 교육을 제공할 예정입니다.",
    content: `방콕 한인 커뮤니티가 오랫동안 준비해온 새로운 문화센터가 드디어 개관했습니다. 

이번에 개관한 문화센터는 총 3층 규모로, 1층에는 한국 전통 문화 전시관과 도서관이, 2층에는 한국어 교실과 세미나실이, 3층에는 다목적 홀과 카페가 마련되어 있습니다.

문화센터에서는 매주 한국어 교육 프로그램을 운영하며, 한국 전통 문화 체험 프로그램, K-pop 댄스 클래스, 한국 요리 교실 등 다양한 프로그램을 제공할 예정입니다.

한인회 관계자는 "이번 문화센터 개관을 통해 태국 현지인들에게 한국 문화를 더욱 널리 알리고, 한인 커뮤니티의 결속을 다지는 계기가 되기를 바란다"고 말했습니다.`,
    imageUrl: "/placeholder.svg?height=200&width=400",
    source: "태국 한인 뉴스",
    originalUrl: "https://example.com/korean-cultural-center-bangkok",
    publishedAt: "2024-01-15T10:00:00Z",
    category: "문화",
    tags: ["한인커뮤니티", "문화센터", "방콕", "한국문화"],
    viewCount: 1250,
    isActive: true,
    isFeatured: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    originalLanguage: "ko",
    isTranslated: false,
  },
  {
    id: 2,
    title: "태국 정부, 한국인 관광객 대상 비자 면제 기간 연장 발표",
    summary: "태국 정부가 한국인 관광객에 대한 무비자 입국 허용 기간을 기존 30일에서 45일로 연장한다고 발표했습니다.",
    content: `태국 정부가 한국인 관광객 유치를 위해 무비자 입국 허용 기간을 연장한다고 발표했습니다.

태국 관광청에 따르면, 한국인 관광객은 2024년 2월 1일부터 무비자로 최대 45일까지 태국에 체류할 수 있게 됩니다. 기존에는 30일이었던 체류 기간이 15일 연장된 것입니다.

이번 조치는 코로나19 이후 회복되고 있는 관광 산업을 더욱 활성화하기 위한 것으로, 한국인 관광객들이 더 여유롭게 태국을 여행할 수 있게 되었습니다.

태국 관광청 관계자는 "한국은 태국의 주요 관광객 송출국 중 하나로, 이번 비자 면제 기간 연장을 통해 더 많은 한국인 관광객들이 태국을 방문하기를 기대한다"고 말했습니다.

단, 이번 연장 조치는 관광 목적으로만 적용되며, 비즈니스나 기타 목적의 방문에는 기존 규정이 적용됩니다.`,
    imageUrl: "/placeholder.svg?height=200&width=400",
    source: "태국 관광청",
    originalUrl: "https://example.com/thailand-visa-extension-korean",
    publishedAt: "2024-01-20T14:30:00Z",
    category: "정치",
    tags: ["비자면제", "관광", "태국정부", "한국인관광객"],
    viewCount: 2100,
    isActive: true,
    isFeatured: true,
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    originalLanguage: "th",
    isTranslated: true,
  },
  {
    id: 3,
    title: "방콕 한인 식당가, 새로운 K-푸드 트렌드로 현지인들 사이에서 인기",
    summary:
      "방콕의 한인 식당들이 현지 입맛에 맞춘 퓨전 한식을 선보이며 태국 현지인들 사이에서 큰 인기를 얻고 있습니다.",
    content: `방콕의 한인 식당가가 새로운 변화를 맞고 있습니다. 전통 한식에 태국 현지 재료와 조리법을 접목한 퓨전 한식이 태국 현지인들 사이에서 큰 인기를 얻고 있기 때문입니다.

특히 톰얌 김치찌개, 팟타이 비빔밥, 망고 빙수 등 태국 현지 재료를 활용한 창의적인 메뉴들이 젊은 태국인들 사이에서 화제가 되고 있습니다.

방콕 시내 한인 식당 '서울키친'의 김 사장은 "처음에는 전통 한식만 고집했지만, 현지 고객들의 입맛을 고려한 메뉴 개발을 통해 매출이 30% 이상 증가했다"고 말했습니다.

이러한 트렌드는 K-pop, K-드라마의 인기와 함께 한국 문화에 대한 태국인들의 관심이 높아진 것과 무관하지 않습니다. 실제로 많은 태국 젊은이들이 한국 드라마에서 본 음식을 직접 맛보기 위해 한인 식당을 찾고 있습니다.

한인 식당 업계에서는 이러한 트렌드를 활용해 더욱 다양한 퓨전 메뉴 개발에 나서고 있으며, 태국 현지 식재료 공급업체들과의 협력도 강화하고 있습니다.`,
    imageUrl: "/placeholder.svg?height=200&width=400",
    source: "방콕 비즈니스 투데이",
    originalUrl: "https://example.com/korean-fusion-food-bangkok",
    publishedAt: "2024-01-18T16:45:00Z",
    category: "생활",
    tags: ["한식", "퓨전요리", "방콕", "K-푸드", "한인식당"],
    viewCount: 890,
    isActive: true,
    isFeatured: false,
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    originalLanguage: "ko",
    isTranslated: false,
  },
  {
    id: 4,
    title: "태국 스타트업 생태계에서 활약하는 한국인 창업가들",
    summary: "태국의 스타트업 생태계에서 한국인 창업가들이 혁신적인 기술과 아이디어로 주목받고 있습니다.",
    content: `태국의 스타트업 생태계에서 한국인 창업가들의 활약이 눈에 띄고 있습니다.

방콕을 중심으로 한 태국의 스타트업 생태계는 최근 몇 년간 급속한 성장을 보이고 있으며, 이 과정에서 한국인 창업가들이 중요한 역할을 하고 있습니다.

특히 핀테크, 이커머스, 푸드테크 분야에서 한국인이 설립한 스타트업들이 주목받고 있습니다. 한국의 IT 기술력과 태국의 시장 잠재력이 결합되어 시너지 효과를 내고 있는 것입니다.

방콕에서 배달 앱을 운영하는 한국인 창업가 이 모 씨는 "한국의 배달 문화와 기술을 태국 시장에 맞게 현지화하여 성공할 수 있었다"며 "언어와 문화의 차이를 극복하는 것이 가장 큰 도전이었지만, 현지 파트너들과의 협력을 통해 해결할 수 있었다"고 말했습니다.

태국 정부도 외국인 창업가들을 적극 지원하고 있으며, 특히 한국인 창업가들에게는 별도의 지원 프로그램을 운영하고 있습니다.

업계 전문가들은 한국과 태국 간의 경제 협력이 더욱 강화되면서, 양국 스타트업 생태계의 교류도 더욱 활발해질 것으로 전망하고 있습니다.`,
    imageUrl: "/placeholder.svg?height=200&width=400",
    source: "테크 아시아",
    originalUrl: "https://example.com/korean-startups-thailand",
    publishedAt: "2024-01-22T11:20:00Z",
    category: "기술",
    tags: ["스타트업", "창업", "핀테크", "한국인창업가", "태국"],
    viewCount: 1560,
    isActive: true,
    isFeatured: false,
    createdAt: "2024-01-22T11:20:00Z",
    updatedAt: "2024-01-22T11:20:00Z",
    originalLanguage: "en",
    isTranslated: true,
  },
  {
    id: 5,
    title: "치앙마이 한인 은퇴자 커뮤니티, 현지 봉사활동으로 화제",
    summary: "치앙마이에 거주하는 한인 은퇴자들이 현지 사회를 위한 다양한 봉사활동을 펼치며 좋은 반응을 얻고 있습니다.",
    content: `태국 북부 치앙마이에 거주하는 한인 은퇴자들이 현지 사회를 위한 봉사활동으로 주목받고 있습니다.

'치앙마이 한인 실버 봉사단'이라는 이름으로 활동하는 이들은 현지 고아원, 양로원, 장애인 시설 등을 정기적으로 방문하여 봉사활동을 펼치고 있습니다.

특히 한국어 교육 봉사, 한국 전통 문화 체험 프로그램, 의료 봉사 등 다양한 분야에서 활동하고 있어 현지 주민들로부터 큰 호응을 얻고 있습니다.

봉사단 대표인 김 모 씨(67세)는 "은퇴 후 제2의 인생을 태국에서 보내면서, 우리를 따뜻하게 받아준 현지 사회에 보답하고 싶었다"며 "언어는 달라도 마음은 통한다는 것을 매번 느끼고 있다"고 말했습니다.

현재 봉사단에는 50여 명의 한인 은퇴자들이 참여하고 있으며, 매월 정기 모임을 통해 봉사 계획을 세우고 있습니다.

치앙마이 시청 관계자는 "한인 은퇴자들의 봉사활동이 지역 사회에 큰 도움이 되고 있으며, 이러한 활동이 한국과 태국의 우정을 더욱 돈독하게 만들고 있다"고 평가했습니다.

이들의 활동은 현지 언론에도 여러 차례 소개되면서, 다른 외국인 커뮤니티에도 좋은 영향을 미치고 있습니다.`,
    imageUrl: "/placeholder.svg?height=200&width=400",
    source: "치앙마이 뉴스",
    originalUrl: "https://example.com/korean-retirees-volunteer-chiangmai",
    publishedAt: "2024-01-25T09:15:00Z",
    category: "사회",
    tags: ["봉사활동", "은퇴자", "치앙마이", "한인커뮤니티", "사회공헌"],
    viewCount: 720,
    isActive: true,
    isFeatured: false,
    createdAt: "2024-01-25T09:15:00Z",
    updatedAt: "2024-01-25T09:15:00Z",
    originalLanguage: "ko",
    isTranslated: false,
  },
]

export const newsCategories = [
  { id: "all", name: "전체", color: "bg-gray-100 text-gray-800" },
  { id: "정치", name: "정치", color: "bg-red-100 text-red-800" },
  { id: "경제", name: "경제", color: "bg-blue-100 text-blue-800" },
  { id: "사회", name: "사회", color: "bg-green-100 text-green-800" },
  { id: "문화", name: "문화", color: "bg-purple-100 text-purple-800" },
  { id: "스포츠", name: "스포츠", color: "bg-orange-100 text-orange-800" },
  { id: "국제", name: "국제", color: "bg-indigo-100 text-indigo-800" },
  { id: "생활", name: "생활", color: "bg-pink-100 text-pink-800" },
  { id: "기술", name: "기술", color: "bg-cyan-100 text-cyan-800" },
]

export function getNewsByCategory(category: string): NewsItem[] {
  if (category === "all") {
    return sampleNews
  }
  return sampleNews.filter((news) => news.category === category)
}

export function getFeaturedNews(): NewsItem[] {
  return sampleNews.filter((news) => news.isFeatured && news.isActive)
}

export function getRecentNews(limit = 5): NewsItem[] {
  return sampleNews
    .filter((news) => news.isActive)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

export function searchNews(query: string): NewsItem[] {
  const lowercaseQuery = query.toLowerCase()
  return sampleNews.filter(
    (news) =>
      news.isActive &&
      (news.title.toLowerCase().includes(lowercaseQuery) ||
        news.summary.toLowerCase().includes(lowercaseQuery) ||
        news.content.toLowerCase().includes(lowercaseQuery) ||
        news.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))),
  )
}
