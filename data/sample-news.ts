import type { NewsItem } from "@/types/news"

export const sampleNews: NewsItem[] = [
  {
    id: 1,
    title: "태국 한인 커뮤니티 새로운 문화센터 개관",
    summary: "방콕 시내에 한인들을 위한 새로운 문화센터가 개관하여 다양한 문화 프로그램을 제공할 예정입니다.",
    content: `태국 방콕에 한인 커뮤니티를 위한 새로운 문화센터가 개관했습니다. 

이번에 개관한 문화센터는 총 3층 규모로, 1층에는 전시공간과 카페, 2층에는 강의실과 회의실, 3층에는 공연장이 마련되어 있습니다.

문화센터에서는 한국어 교육, 전통문화 체험, 요리 교실, 음악 공연 등 다양한 프로그램을 운영할 계획입니다. 특히 태국 현지인들을 대상으로 한 한국 문화 체험 프로그램도 준비되어 있어 한태 문화 교류의 중심지 역할을 할 것으로 기대됩니다.

문화센터 관계자는 "한인 커뮤니티의 결속을 다지고, 태국 현지인들과의 문화 교류를 통해 상호 이해를 증진시키는 것이 목표"라고 밝혔습니다.`,
    imageUrl: "/placeholder.svg?height=300&width=500&text=문화센터",
    source: "태국 한인 뉴스",
    originalUrl: "https://example.com/news/cultural-center-opening",
    publishedAt: "2024-01-15T09:00:00Z",
    category: "문화",
    tags: ["한인사회", "문화센터", "방콕", "커뮤니티"],
    viewCount: 1250,
    isActive: true,
    isFeatured: true,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    originalLanguage: "ko",
    isTranslated: false,
  },
  {
    id: 2,
    title: "태국 경제 성장률 전망 상향 조정",
    summary: "태국 중앙은행이 올해 경제 성장률 전망을 기존 3.2%에서 3.8%로 상향 조정했다고 발표했습니다.",
    content: `태국 중앙은행(BOT)이 2024년 경제 성장률 전망을 기존 3.2%에서 3.8%로 상향 조정했다고 발표했습니다.

이번 상향 조정은 관광업 회복세와 수출 증가, 내수 소비 개선 등이 주요 요인으로 분석됩니다. 특히 중국과 한국 등 주요 관광객 송출국의 여행 수요 회복이 태국 경제에 긍정적인 영향을 미치고 있는 것으로 나타났습니다.

중앙은행 관계자는 "글로벌 경제 불확실성에도 불구하고 태국 경제의 기초 체력이 견고하다"며 "특히 서비스업과 제조업 부문의 회복세가 뚜렷하다"고 설명했습니다.

한편, 인플레이션율은 목표 범위인 1-3% 내에서 안정적으로 관리되고 있으며, 기준금리는 당분간 현 수준을 유지할 것으로 전망됩니다.`,
    imageUrl: "/placeholder.svg?height=300&width=500&text=경제성장",
    source: "태국 경제 일보",
    originalUrl: "https://example.com/news/thailand-economic-growth",
    publishedAt: "2024-01-14T14:30:00Z",
    category: "경제",
    tags: ["경제성장", "중앙은행", "관광업", "수출"],
    viewCount: 890,
    isActive: true,
    isFeatured: false,
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
    originalLanguage: "ko",
    isTranslated: false,
  },
  {
    id: 3,
    title: "방콕 지하철 새 노선 개통으로 교통 편의성 크게 향상",
    summary: "방콕 대중교통공사가 새로운 지하철 노선을 개통하여 시민들의 교통 편의성이 크게 향상될 것으로 기대됩니다.",
    content: `방콕 대중교통공사(BMCL)가 새로운 지하철 노선인 '퍼플라인 연장선'을 정식 개통했다고 발표했습니다.

이번에 개통된 노선은 기존 퍼플라인을 방콕 중심부까지 연장한 것으로, 총 8개 역이 새롭게 추가되었습니다. 이로써 방콕 북부 지역 주민들의 도심 접근성이 크게 개선될 것으로 예상됩니다.

새 노선은 첨단 기술을 적용한 무인 운행 시스템을 도입하여 운행 간격을 기존 5분에서 3분으로 단축했습니다. 또한 모든 역사에 장애인 편의시설과 에어컨 시설을 완비하여 승객 편의성을 높였습니다.

방콕 시장은 "이번 노선 개통으로 교통 체증 완화와 대기오염 감소에도 기여할 것"이라며 "앞으로도 대중교통 인프라 확충에 지속적으로 투자하겠다"고 밝혔습니다.

개통 첫 주에는 기념 이벤트로 모든 승객에게 50% 할인 혜택을 제공할 예정입니다.`,
    imageUrl: "/placeholder.svg?height=300&width=500&text=지하철",
    source: "방콕 교통 뉴스",
    originalUrl: "https://example.com/news/bangkok-subway-new-line",
    publishedAt: "2024-01-13T11:15:00Z",
    category: "사회",
    tags: ["교통", "지하철", "방콕", "인프라"],
    viewCount: 2100,
    isActive: true,
    isFeatured: true,
    createdAt: "2024-01-13T11:15:00Z",
    updatedAt: "2024-01-13T11:15:00Z",
    originalLanguage: "ko",
    isTranslated: false,
  },
  {
    id: 4,
    title: "태국 정부, 디지털 노마드 비자 신설 발표",
    summary: "태국 정부가 원격 근무자들을 위한 새로운 디지털 노마드 비자를 신설한다고 발표했습니다.",
    content: `태국 정부가 글로벌 원격 근무 트렌드에 맞춰 '디지털 노마드 비자(Digital Nomad Visa)'를 새롭게 신설한다고 발표했습니다.

이 비자는 원격으로 일하는 외국인 전문직 종사자들이 태국에서 최대 1년간 체류할 수 있도록 하는 제도입니다. 기존 관광비자와 달리 장기 체류가 가능하며, 비자 연장도 가능합니다.

신청 자격은 월 소득 5만 바트 이상의 원격 근무자로, IT, 디자인, 마케팅, 컨설팅 등 다양한 분야의 전문직이 대상입니다. 신청 시 고용 증명서, 소득 증명서, 건강보험 가입 증명서 등이 필요합니다.

태국 관광청 관계자는 "코로나19 이후 원격 근무가 일반화되면서 장기 체류 관광객이 증가하고 있다"며 "이들을 적극 유치하여 관광 수입 증대와 지역 경제 활성화를 도모하겠다"고 설명했습니다.

새 비자는 다음 달부터 온라인으로 신청할 수 있으며, 처리 기간은 약 2주 정도 소요될 예정입니다.`,
    imageUrl: "/placeholder.svg?height=300&width=500&text=디지털노마드",
    source: "태국 정부 공보",
    originalUrl: "https://example.com/news/digital-nomad-visa",
    publishedAt: "2024-01-12T16:45:00Z",
    category: "정치",
    tags: ["비자", "디지털노마드", "원격근무", "정부정책"],
    viewCount: 3200,
    isActive: true,
    isFeatured: true,
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    originalLanguage: "ko",
    isTranslated: false,
  },
  {
    id: 5,
    title: "푸켓 국제공항 새 터미널 건설 착공",
    summary: "푸켓 국제공항의 새로운 터미널 건설이 착공되어 2026년 완공을 목표로 하고 있습니다.",
    content: `푸켓 국제공항의 새로운 제3터미널 건설 공사가 정식 착공되었습니다.

새 터미널은 연간 1,500만 명의 승객을 수용할 수 있는 규모로 건설되며, 현재 공항 용량의 2배에 달합니다. 총 건설비는 200억 바트가 투입될 예정입니다.

터미널에는 최신 자동화 시설과 친환경 기술이 적용됩니다. 태양광 발전 시설, 빗물 재활용 시스템, 에너지 효율적인 냉방 시스템 등을 도입하여 탄소 중립을 목표로 하고 있습니다.

또한 승객 편의를 위해 더 많은 면세점과 레스토랑, 휴게 시설이 마련될 예정입니다. 특히 태국 전통 문화를 체험할 수 있는 문화 공간도 조성되어 관광객들에게 특별한 경험을 제공할 계획입니다.

공항 관계자는 "푸켓은 태국의 대표적인 관광지로서 늘어나는 관광객 수요에 대응하기 위해 인프라 확충이 필수적"이라며 "새 터미널 완공으로 더 많은 관광객을 유치할 수 있을 것"이라고 기대감을 표했습니다.

건설 공사는 2026년 말 완공을 목표로 하고 있으며, 공사 기간 중에도 기존 터미널 운영에는 차질이 없도록 할 예정입니다.`,
    imageUrl: "/placeholder.svg?height=300&width=500&text=공항터미널",
    source: "푸켓 공항 공사",
    originalUrl: "https://example.com/news/phuket-airport-terminal",
    publishedAt: "2024-01-11T10:20:00Z",
    category: "사회",
    tags: ["공항", "푸켓", "인프라", "관광"],
    viewCount: 1800,
    isActive: true,
    isFeatured: false,
    createdAt: "2024-01-11T10:20:00Z",
    updatedAt: "2024-01-11T10:20:00Z",
    originalLanguage: "ko",
    isTranslated: false,
  },
]

// 뉴스 카테고리별 통계
export const newsCategoryStats = {
  정치: 1,
  경제: 1,
  사회: 2,
  문화: 1,
  스포츠: 0,
  국제: 0,
  생활: 0,
  기술: 0,
  일반: 0,
}

// 인기 태그
export const popularTags = [
  "한인사회",
  "경제성장",
  "교통",
  "관광",
  "정부정책",
  "인프라",
  "문화",
  "비자",
  "공항",
  "방콕",
]
