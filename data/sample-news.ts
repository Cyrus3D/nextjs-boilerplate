import type { NewsItem } from "@/types/news"

export const sampleNews: Omit<NewsItem, "id" | "created_at" | "updated_at">[] = [
  {
    title: "태국 방콕 새로운 한국 레스토랑 오픈",
    content:
      "방콕 시내 중심가에 새로운 한국 레스토랑이 오픈했습니다. 이 레스토랑은 정통 한국 요리를 제공하며, 현지 한국인들과 태국인들에게 큰 인기를 끌고 있습니다. 특히 김치찌개와 불고기가 인기 메뉴로 자리잡고 있으며, 한국 전통 차도 함께 제공됩니다.",
    summary: "방콕에 새로운 한국 레스토랑이 오픈하여 현지에서 큰 인기를 끌고 있습니다.",
    source_url: "https://example.com/news/korean-restaurant-bangkok",
    image_url: "/placeholder.svg?height=200&width=300",
    category: "food",
    tags: ["한국음식", "방콕", "레스토랑", "오픈"],
    is_featured: true,
    is_active: true,
    original_language: "ko",
    is_translated: false,
    view_count: 150,
  },
  {
    title: "태국 관광업계 한국인 관광객 증가 추세",
    content:
      "최근 태국 관광청 발표에 따르면, 한국인 관광객 수가 전년 대비 30% 증가한 것으로 나타났습니다. 특히 방콕과 파타야, 푸켓 등 주요 관광지에서 한국인 관광객들의 방문이 크게 늘었습니다. 이는 한류 문화의 영향과 직항편 증가, 그리고 태국 정부의 적극적인 관광 마케팅 덕분으로 분석됩니다.",
    summary: "태국을 방문하는 한국인 관광객이 전년 대비 30% 증가했습니다.",
    source_url: "https://example.com/news/korean-tourists-thailand",
    image_url: "/placeholder.svg?height=200&width=300",
    category: "travel",
    tags: ["관광", "한국인", "태국", "증가"],
    is_featured: false,
    is_active: true,
    original_language: "ko",
    is_translated: false,
    view_count: 89,
  },
  {
    title: "방콕 한국 문화센터 K-POP 콘서트 개최",
    content:
      "방콕 한국 문화센터에서 K-POP 콘서트가 개최됩니다. 이번 콘서트에는 현지에서 활동하는 한국 아티스트들과 태국 K-POP 커버 댄스팀들이 참여할 예정입니다. 콘서트는 무료로 진행되며, 한국 문화를 알리는 다양한 부대행사도 함께 열립니다.",
    summary: "방콕 한국 문화센터에서 K-POP 콘서트가 무료로 개최됩니다.",
    source_url: "https://example.com/news/kpop-concert-bangkok",
    image_url: "/placeholder.svg?height=200&width=300",
    category: "entertainment",
    tags: ["K-POP", "콘서트", "방콕", "한국문화"],
    is_featured: true,
    is_active: true,
    original_language: "ko",
    is_translated: false,
    view_count: 234,
  },
  {
    title: "태국 한국 기업 투자 확대",
    content:
      "태국에 진출한 한국 기업들이 현지 투자를 확대하고 있습니다. 특히 제조업과 IT 분야에서 한국 기업들의 투자가 활발해지고 있으며, 이는 태국의 경제 성장에도 긍정적인 영향을 미치고 있습니다. 태국 정부는 한국 기업들의 투자를 적극 환영하며 다양한 인센티브를 제공하고 있습니다.",
    summary: "태국 진출 한국 기업들이 제조업과 IT 분야 투자를 확대하고 있습니다.",
    source_url: "https://example.com/news/korean-investment-thailand",
    image_url: "/placeholder.svg?height=200&width=300",
    category: "business",
    tags: ["투자", "한국기업", "태국", "제조업", "IT"],
    is_featured: false,
    is_active: true,
    original_language: "ko",
    is_translated: false,
    view_count: 67,
  },
]
