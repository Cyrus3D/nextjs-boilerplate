import type { NewsArticle } from "@/types/news"

export const sampleNewsArticles: NewsArticle[] = [
  {
    id: "news-001",
    title: "태국 관광청, 2025년 한국인 관광객 유치 확대 정책 발표",
    excerpt: "태국 관광청이 한국인 관광객을 대상으로 한 새로운 혜택과 편의시설 확충 계획을 발표했습니다.",
    content: `태국 관광청(TAT)이 2025년 한국인 관광객 유치를 위한 대대적인 정책을 발표했습니다.

주요 내용:
- 한국어 안내 서비스 확대
- 한국인 전용 관광 패키지 개발
- 주요 관광지 한글 표기 확대
- 한국 음식점 인증 프로그램 도입

이번 정책으로 연간 한국인 관광객 200만 명 유치를 목표로 하고 있습니다.`,
    imageUrl: "/placeholder.svg?height=200&width=400&text=태국+관광청+정책",
    category: "현지 뉴스",
    tags: ["관광정책", "한국인", "TAT", "관광청"],
    author: "태국 관광청",
    publishedAt: "2025-01-08T09:00:00Z",
    readTime: 3,
    viewCount: 1250,
    isBreaking: true,
    source: "태국 관광청 공식 발표",
  },
  {
    id: "news-002",
    title: "BTS 신규 노선 개통, 한인 거주지역 접근성 대폭 개선",
    excerpt: "방콕 BTS 스카이트레인 신규 노선이 개통되어 한인들이 많이 거주하는 지역의 교통편이 크게 개선되었습니다.",
    content: `방콕 대중교통공사(BTSC)가 BTS 스카이트레인 신규 노선을 정식 개통했습니다.

신규 노선 주요 정보:
- 총 연장: 15km, 12개 역사
- 한인 밀집 거주지역 4곳 경유
- 운행시간: 오전 6시 ~ 자정
- 요금: 기존 노선과 동일

특히 프롬퐁, 통로, 아속 지역 거주 한인들의 출퇴근 시간이 평균 30분 단축될 것으로 예상됩니다.`,
    imageUrl: "/placeholder.svg?height=200&width=400&text=BTS+신규노선",
    category: "현지 뉴스",
    tags: ["BTS", "교통", "스카이트레인", "한인거주지"],
    author: "교통부 기자",
    publishedAt: "2025-01-07T14:30:00Z",
    readTime: 4,
    viewCount: 890,
    isBreaking: false,
  },
  {
    id: "news-003",
    title: "파타야 '서울식당', 현지인들 사이에서 큰 인기",
    excerpt: "파타야에 위치한 한식당 '서울식당'이 현지 태국인들 사이에서 입소문을 타며 연일 만석을 기록하고 있습니다.",
    content: `파타야 중심가에 위치한 한식당 '서울식당'이 개업 6개월 만에 현지 최고 인기 식당으로 자리잡았습니다.

성공 요인:
- 현지인 입맛에 맞춘 한식 메뉴 개발
- 합리적인 가격대 (150-300바트)
- 깔끔한 인테리어와 친절한 서비스
- SNS 마케팅 적극 활용

김민수 사장은 "현지 문화를 존중하면서도 한식의 정체성을 유지하는 것이 성공 비결"이라고 말했습니다.`,
    imageUrl: "/placeholder.svg?height=200&width=400&text=서울식당+성공사례",
    category: "교민 업체",
    tags: ["한식당", "파타야", "성공사례", "현지화"],
    author: "비즈니스 리포터",
    publishedAt: "2025-01-06T11:15:00Z",
    readTime: 5,
    viewCount: 2100,
    isBreaking: false,
  },
  {
    id: "news-004",
    title: "방콕 '코리아마트', 온라인 배송 서비스 전국 확대",
    excerpt: "방콕 대표 한인마트인 코리아마트가 온라인 주문 배송 서비스를 태국 전국으로 확대한다고 발표했습니다.",
    content: `방콕 최대 규모의 한인마트 '코리아마트'가 온라인 배송 서비스를 전국으로 확대합니다.

서비스 확대 내용:
- 배송 지역: 방콕 → 전국 77개 주
- 배송 시간: 당일/익일 배송
- 최소 주문금액: 1,000바트
- 냉동/냉장 상품 배송 가능

이로써 지방 거주 한인들도 한국 식품을 쉽게 구매할 수 있게 되었습니다.`,
    imageUrl: "/placeholder.svg?height=200&width=400&text=코리아마트+배송확대",
    category: "교민 업체",
    tags: ["한인마트", "온라인배송", "전국확대", "한국식품"],
    author: "유통업계 전문기자",
    publishedAt: "2025-01-05T16:45:00Z",
    readTime: 3,
    viewCount: 1680,
    isBreaking: false,
  },
  {
    id: "news-005",
    title: "태국 LTR 비자 신청 절차 대폭 간소화",
    excerpt: "태국 정부가 장기거주비자(LTR) 신청 절차를 간소화하고 온라인 신청 시스템을 도입한다고 발표했습니다.",
    content: `태국 정부가 외국인 투자 유치를 위해 LTR(Long Term Resident) 비자 신청 절차를 대폭 간소화합니다.

주요 변경사항:
- 온라인 신청 시스템 도입
- 필요 서류 50% 감축
- 심사 기간 30일 → 15일 단축
- 영어 서류 제출 허용

특히 한국인 신청자들을 위한 한국어 안내 서비스도 제공될 예정입니다.`,
    imageUrl: "/placeholder.svg?height=200&width=400&text=LTR+비자+간소화",
    category: "현지 뉴스",
    tags: ["LTR비자", "장기거주", "비자간소화", "온라인신청"],
    author: "이민 전문기자",
    publishedAt: "2025-01-04T10:20:00Z",
    readTime: 4,
    viewCount: 3200,
    isBreaking: false,
  },
  {
    id: "news-006",
    title: "치앙마이 '그린투어', 친환경 관광 프로그램으로 주목",
    excerpt:
      "치앙마이의 한인 여행사 '그린투어'가 친환경 관광 프로그램을 선보이며 현지 관광업계의 주목을 받고 있습니다.",
    content: `치앙마이에서 활동하는 한인 여행사 '그린투어'가 친환경 관광 프로그램으로 큰 호응을 얻고 있습니다.

프로그램 특징:
- 탄소 배출 최소화 투어 코스
- 현지 커뮤니티와 상생 프로그램
- 친환경 숙박시설 연계
- 플라스틱 프리 투어 진행

박지영 대표는 "지속가능한 관광이 미래 여행업의 핵심"이라며 사업 확장 계획을 밝혔습니다.`,
    imageUrl: "/placeholder.svg?height=200&width=400&text=그린투어+친환경관광",
    category: "교민 업체",
    tags: ["여행사", "치앙마이", "친환경관광", "지속가능"],
    author: "관광업계 기자",
    publishedAt: "2025-01-03T13:10:00Z",
    readTime: 4,
    viewCount: 950,
    isBreaking: false,
  },
]
