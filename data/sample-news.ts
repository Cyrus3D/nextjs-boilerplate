import type { NewsArticle } from "@/types/news"

export const sampleNews: NewsArticle[] = [
  {
    id: "1",
    title: "태국 정부, 외국인 관광객 대상 새로운 비자 정책 발표",
    excerpt:
      "태국 정부가 외국인 관광객 유치를 위한 새로운 비자 정책을 발표했습니다. 한국인을 포함한 주요국 관광객들에게 더욱 편리한 입국 절차를 제공할 예정입니다.",
    content: `태국 정부가 관광업 활성화를 위해 새로운 비자 정책을 발표했습니다.

주요 내용:
• 한국인 관광객 무비자 체류 기간 30일에서 45일로 연장
• 온라인 비자 신청 시스템 도입으로 처리 시간 단축
• 다중 입국 비자 유효 기간 확대

이번 정책은 코로나19 이후 침체된 관광업 회복을 위한 조치로, 한국을 포함한 주요 관광객 송출국에 대한 입국 절차를 대폭 간소화했습니다.

태국 관광청은 "이번 정책으로 연간 외국인 관광객 4천만 명 유치를 목표로 한다"고 밝혔습니다.`,
    category: "local",
    tags: ["비자", "관광", "정책", "한국인"],
    author: "태국 현지 특파원",
    publishedAt: "2024-01-15T10:30:00Z",
    readTime: 3,
    viewCount: 1250,
    isBreaking: true,
    imageUrl: "/placeholder.svg?height=200&width=400&text=태국+비자+정책",
    sourceUrl: "https://www.bangkokpost.com/thailand/general/3078318/man-shot-on-way-to-work-in-samut-prakan",
  },
  {
    id: "2",
    title: "방콕 지하철 새 노선 개통, 한인 거주 지역 접근성 크게 향상",
    excerpt:
      "방콕 대중교통 시스템이 확장되면서 한인들이 많이 거주하는 수쿰빗, 실롬 지역의 교통 편의성이 크게 개선될 전망입니다.",
    content: `방콕 대중교통공사(BMCL)가 새로운 지하철 노선을 개통한다고 발표했습니다.

새 노선 주요 특징:
• 수쿰빗 - 실롬 구간 직통 연결
• 한인 밀집 거주지역 7개 역 신설
• 기존 대비 이동시간 40% 단축

특히 아속(Asok), 프롬퐁(Phrom Phong), 통로(Thong Lo) 등 한인들이 많이 거주하는 지역과 실롬 비즈니스 구역을 직접 연결하는 노선이 포함되어 한인 커뮤니티의 큰 호응을 얻고 있습니다.

방콕 한인회 관계자는 "출퇴근 시간이 크게 단축되어 한인들의 생활 편의성이 대폭 향상될 것"이라고 기대감을 표했습니다.`,
    category: "local",
    tags: ["교통", "지하철", "방콕", "한인거주지"],
    author: "교통 전문 기자",
    publishedAt: "2024-01-14T14:20:00Z",
    readTime: 4,
    viewCount: 890,
    isBreaking: false,
    imageUrl: "/placeholder.svg?height=200&width=400&text=방콕+지하철",
    sourceUrl: "https://www.thairath.co.th/news/politic/2873908",
  },
  {
    id: "3",
    title: "태국 바트화 강세, 한국 관광객 구매력 영향 분석",
    excerpt:
      "최근 태국 바트화의 지속적인 강세로 인해 한국 관광객들의 현지 구매력에 변화가 생기고 있어 관련 업계의 주목을 받고 있습니다.",
    content: `최근 몇 달간 태국 바트화가 원화 대비 강세를 보이면서 한국 관광객들의 소비 패턴에 변화가 나타나고 있습니다.

환율 변화 현황:
• 1바트 = 37.5원 (전월 대비 2.1% 상승)
• 연초 대비 바트화 8.5% 강세
• 미 달러 약세 영향으로 아시아 통화 전반 강세

이러한 환율 변화는 한국 관광객들의 태국 여행 비용 증가로 이어지고 있으며, 특히 쇼핑과 외식 분야에서 소비 위축이 나타나고 있습니다.

태국 관광업계는 "환율 변화에 대응하기 위해 한국 관광객 대상 할인 프로모션을 확대하고 있다"고 밝혔습니다.`,
    category: "local",
    tags: ["환율", "바트화", "관광", "경제"],
    author: "경제 분석가",
    publishedAt: "2024-01-13T09:15:00Z",
    readTime: 5,
    viewCount: 2100,
    isBreaking: false,
    imageUrl: "/placeholder.svg?height=200&width=400&text=환율+분석",
    sourceUrl: "https://www.matichon.co.th/politics/news_5301784",
  },
  {
    id: "4",
    title: "방콕 신규 한식당 '서울의 맛' 대박 행진, 현지인들도 줄서서 대기",
    excerpt:
      "최근 방콕 수쿰빗에 오픈한 한식당 '서울의 맛'이 현지인들 사이에서 큰 인기를 끌며 연일 대기줄이 이어지고 있습니다.",
    content: `방콕 수쿰빗 소이 24에 위치한 한식당 '서울의 맛'이 오픈 한 달 만에 현지 맛집으로 자리잡으며 화제가 되고 있습니다.

인기 메뉴와 특징:
• 정통 김치찌개와 불고기 세트 인기
• 현지 입맛에 맞춘 매운맛 조절
• 한국 직수입 식재료 사용으로 authentic한 맛 구현
• 합리적인 가격대 (1인 기준 300-500바트)

특히 태국 현지인들 사이에서 SNS를 통해 입소문이 퍼지면서 점심시간에는 1시간 이상 대기하는 경우도 빈번합니다.

김○○ 사장은 "현지인들이 한국 음식을 이렇게 좋아해 주실 줄 몰랐다. 앞으로 더 다양한 한국 음식을 선보일 계획"이라고 말했습니다.`,
    category: "business",
    tags: ["한식당", "맛집", "수쿰빗", "현지인기"],
    author: "맛집 탐방 기자",
    publishedAt: "2024-01-12T16:45:00Z",
    readTime: 3,
    viewCount: 1680,
    isBreaking: false,
    imageUrl: "/placeholder.svg?height=200&width=400&text=한식당+서울의맛",
    sourceUrl: "https://www.khaosod.co.th/around-thailand/news_9874255",
  },
  {
    id: "5",
    title: "태국 한인 물류업체 '코리아 익스프레스', 동남아 시장 진출 본격화",
    excerpt:
      "태국을 기반으로 한 한인 물류업체 '코리아 익스프레스'가 베트남, 라오스 등 동남아 전역으로 사업을 확장한다고 발표했습니다.",
    content: `태국 방콕에 본사를 둔 한인 물류업체 '코리아 익스프레스'가 동남아시아 전역으로 사업 영역을 확장한다고 발표했습니다.

확장 계획:
• 베트남 호치민, 하노이 지사 설립
• 라오스, 캄보디아 물류 네트워크 구축
• 한국-동남아 직배송 서비스 강화
• 연말까지 직원 200명 추가 채용 예정

이 회사는 2019년 설립 이후 꾸준한 성장을 거듭해 현재 태국 내 한인 물류업계 1위 업체로 자리잡았습니다.

박○○ 대표는 "K-컬처 확산과 함께 한국 상품에 대한 동남아 수요가 급증하고 있어 이번 확장을 결정했다"며 "2025년까지 동남아 최대 한인 물류 네트워크를 구축하겠다"고 포부를 밝혔습니다.`,
    category: "business",
    tags: ["물류", "사업확장", "동남아", "한인기업"],
    author: "비즈니스 전문 기자",
    publishedAt: "2024-01-11T11:30:00Z",
    readTime: 4,
    viewCount: 950,
    isBreaking: false,
    imageUrl: "/placeholder.svg?height=200&width=400&text=물류업체+확장",
    sourceUrl: "https://www.dailynews.co.th/news/4964282/",
  },
  {
    id: "6",
    title: "파타야 한인 리조트 '오션뷰 빌라', 럭셔리 풀빌라 단지 신규 오픈",
    excerpt:
      "파타야 정통 지역에 새롭게 문을 연 '오션뷰 빌라'가 프리미엄 풀빌라 서비스로 한인 관광객들의 큰 관심을 받고 있습니다.",
    content: `파타야 정통 해변가에 위치한 '오션뷰 빌라'가 지난주 그랜드 오픈하며 한인 관광객들 사이에서 화제가 되고 있습니다.

시설 및 서비스:
• 총 20개 독립형 풀빌라 (4-8인 수용)
• 전 객실 바다 전망, 프라이빗 풀 완비
• 24시간 한국어 컨시어지 서비스
• 한식 조식 서비스 및 BBQ 파티 패키지

특히 각 빌라마다 독립된 수영장과 바베큐 시설을 갖춰 가족 단위 관광객들에게 인기가 높습니다.

이○○ 총지배인은 "코로나19 이후 프라이빗한 휴양을 원하는 고객들이 늘어나면서 풀빌라 수요가 급증했다"며 "한국 고객들의 니즈에 맞춘 맞춤형 서비스를 제공하겠다"고 말했습니다.`,
    category: "business",
    tags: ["리조트", "파타야", "풀빌라", "관광"],
    author: "관광업계 전문 기자",
    publishedAt: "2024-01-10T13:20:00Z",
    readTime: 3,
    viewCount: 1420,
    isBreaking: false,
    imageUrl: "/placeholder.svg?height=200&width=400&text=파타야+풀빌라",
    sourceUrl: "https://www.nationthailand.com/business/economy/40053391",
  },
]
