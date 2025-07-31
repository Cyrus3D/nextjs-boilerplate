export interface SampleBusinessCard {
  id: number
  title: string
  description: string
  category: string
  location?: string
  phone?: string
  kakaoId?: string
  lineId?: string
  website?: string
  hours?: string
  price?: string
  promotion?: string
  tags: string[]
  image?: string
  isPromoted: boolean
  isPremium: boolean
  premiumExpiresAt?: string
  exposureCount: number
  lastExposedAt?: string
  exposureWeight: number
  created_at: string
  updated_at: string
  facebookUrl?: string
  instagramUrl?: string
  tiktokUrl?: string
  threadsUrl?: string
  youtubeUrl?: string
}

export interface SampleCategory {
  id: number
  name: string
  color_class: string
  created_at: string
}

export const sampleCategories: SampleCategory[] = [
  {
    id: 1,
    name: "음식점",
    color_class: "bg-red-100 text-red-800",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "배송서비스",
    color_class: "bg-blue-100 text-blue-800",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "여행서비스",
    color_class: "bg-green-100 text-green-800",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "식품",
    color_class: "bg-orange-100 text-orange-800",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "이벤트서비스",
    color_class: "bg-purple-100 text-purple-800",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 6,
    name: "방송서비스",
    color_class: "bg-indigo-100 text-indigo-800",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 7,
    name: "전자제품",
    color_class: "bg-cyan-100 text-cyan-800",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 8,
    name: "유흥업소",
    color_class: "bg-pink-100 text-pink-800",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 9,
    name: "교통서비스",
    color_class: "bg-emerald-100 text-emerald-800",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 10,
    name: "서비스",
    color_class: "bg-gray-100 text-gray-800",
    created_at: "2024-01-01T00:00:00Z",
  },
]

export const sampleBusinessCards: SampleBusinessCard[] = [
  {
    id: 1,
    title: "수락 SURAK Korean Restaurant",
    description:
      "방콕 최초의 간장게장 전문점으로 강남 역삼에서 간장게장 전문점을 운영하던 셰프가 직접 요리하여 한국과 똑같은 맛과 퀄리티로 간장게장, 양념게장, 새우장, 연어장, 갯가재장을 세트 메뉴 및 무한리필로 방콕에서도 모두 즐길 수 있습니다.",
    category: "음식점",
    location: "방콕 에까마이 파크애비뉴 Park Avenue",
    phone: "02-123-4567",
    kakaoId: "dadj12",
    website: "https://g.co/kgs/sDM2dPk",
    hours: "11:30am - 4am",
    price: "간장게장 세트 450바트",
    promotion: "신규 고객 10% 할인",
    tags: ["간장게장", "한식", "무한리필", "에까마이"],
    image: "/placeholder.svg?height=200&width=300&text=수락+Korean+Restaurant",
    isPromoted: true,
    isPremium: true,
    exposureCount: 1250,
    exposureWeight: 2.5,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:20:00Z",
    instagramUrl: "https://instagram.com/surak_bangkok",
  },
  {
    id: 2,
    title: "시그니엘 24시 출장마사지",
    description:
      "전문 건전 마사지 업체로 방콕, 파타야를 중심으로 출장 마사지를 진행하고 있습니다. 모든 마사지사는 국가 전문마사지 라이센스를 보유하고 있습니다.",
    category: "서비스",
    location: "방콕 전지역",
    phone: "082-974-7979",
    kakaoId: "sig5858",
    lineId: "sig5858",
    hours: "24시간 운영",
    price: "타이마사지 90분 850바트, 120분 950바트",
    tags: ["마사지", "출장", "24시간", "라이센스"],
    image: "/placeholder.svg?height=200&width=300&text=시그니엘+마사지",
    isPromoted: false,
    isPremium: false,
    exposureCount: 890,
    exposureWeight: 1.8,
    created_at: "2024-01-10T09:15:00Z",
    updated_at: "2024-01-18T16:45:00Z",
  },
  {
    id: 3,
    title: "방콕 비케이컴퓨터",
    description:
      "게이밍 컴퓨터 노트북 Mac 판매수리. 확실한 A/S, 보증기간 2~3년, 원하시는 고사양 스팩 조립해 드립니다. 방콕네 컴퓨터 무료 배달 가능합니다.",
    category: "전자제품",
    location: "방콕",
    phone: "02-555-0123",
    website: "https://bkcomputer.co.th",
    price: "게이밍 PC 22,000바트부터",
    promotion: "신규 고객 마우스 키보드 무료 증정",
    tags: ["컴퓨터", "게이밍", "노트북", "수리", "조립"],
    image: "/placeholder.svg?height=200&width=300&text=BK+Computer",
    isPromoted: true,
    isPremium: false,
    exposureCount: 650,
    exposureWeight: 1.5,
    created_at: "2024-01-08T11:20:00Z",
    updated_at: "2024-01-19T13:30:00Z",
  },
  {
    id: 4,
    title: "해피컴퍼니 종합서비스",
    description:
      "24시간 택시 서비스, 건전 출장마사지, 방콕 파타야 캄보디아 비자런, 공항 VIP 입국 서비스 등 다양한 서비스를 제공합니다.",
    category: "여행서비스",
    location: "방콕, 파타야",
    phone: "02-777-8888",
    kakaoId: "happythai369",
    lineId: "happythai369",
    website: "https://vo.la/happythai369",
    hours: "24시간 운영",
    price: "비자런 7,000바트",
    tags: ["택시", "비자런", "VIP서비스", "24시간"],
    image: "/placeholder.svg?height=200&width=300&text=해피컴퍼니",
    isPromoted: false,
    isPremium: true,
    exposureCount: 1100,
    exposureWeight: 2.2,
    created_at: "2024-01-12T14:45:00Z",
    updated_at: "2024-01-21T10:15:00Z",
  },
  {
    id: 5,
    title: "VALUXE COMPANY LIMITED",
    description:
      "학생비자, 엘리트비자, 은퇴비자, 결혼비자, 워크퍼밋, 법인설립, 노무/회계/세무, 태국 법률 및 소송, 은행 통장 개설, 부동산 등 종합 서비스",
    category: "서비스",
    location: "방콕",
    phone: "02-333-4444",
    website: "https://valuxe.co.th",
    price: "비자별 상이",
    tags: ["비자", "법인설립", "워크퍼밋", "부동산", "법률"],
    image: "/placeholder.svg?height=200&width=300&text=VALUXE+Company",
    isPromoted: true,
    isPremium: true,
    exposureCount: 980,
    exposureWeight: 2.0,
    created_at: "2024-01-05T08:30:00Z",
    updated_at: "2024-01-17T15:20:00Z",
  },
  {
    id: 6,
    title: "락타이몰 특송택배",
    description:
      "20년 경력의 글로벌 물류사. 직원 600명 & EV 차량 200대! 한국↔태국 항공/해상 운송. 태국→한국 120밧/kg, 한국→태국 360밧/kg",
    category: "배송서비스",
    location: "방콕, 파타야",
    phone: "080-066-9770",
    kakaoId: "jagnbacu",
    website: "https://www.starexpress.co.kr",
    price: "항공배송 120밧/kg부터",
    promotion: "첫 배송 10% 할인",
    tags: ["택배", "특송", "한국배송", "물류"],
    image: "/placeholder.svg?height=200&width=300&text=락타이몰+택배",
    isPromoted: false,
    isPremium: false,
    exposureCount: 750,
    exposureWeight: 1.6,
    created_at: "2024-01-14T12:00:00Z",
    updated_at: "2024-01-22T09:45:00Z",
  },
  {
    id: 7,
    title: "명륜진사갈비",
    description:
      "제육볶음, 안동찜닭, 소불고기 메뉴 추가. 런치스페셜 뷔페 199B+ 특가. 소고기 추가메뉴 특가제공: 꽃등심, 채끝등심, 부채살 129B",
    category: "음식점",
    location: "라마4 BIG C, 라마2 BIG C 등 5개 지점",
    phone: "02-456-7890",
    website: "https://maps.app.goo.gl/Sk9kQCs1XWBVRYR66",
    price: "런치스페셜 199바트",
    promotion: "소고기 메뉴 특가 진행중",
    tags: ["갈비", "한식", "뷔페", "런치스페셜"],
    image: "/placeholder.svg?height=200&width=300&text=명륜진사갈비",
    isPromoted: true,
    isPremium: false,
    exposureCount: 1350,
    exposureWeight: 1.9,
    created_at: "2024-01-03T16:20:00Z",
    updated_at: "2024-01-20T11:30:00Z",
  },
  {
    id: 8,
    title: "방콕 황제 이발소",
    description:
      "아속역 4번 출구에서 200미터. 동시 수용인원 15명. 90분(700밧) 발 씻기-얼굴면도-얼굴마사지-얼굴 팩-귀청소-손톱, 발톱 정리-팔, 다리마사지-등마사지-샴푸-드라이",
    category: "서비스",
    location: "아속역 4번 출구 200m",
    phone: "02-120-7409",
    kakaoId: "hwangjaek",
    lineId: "newman8609",
    hours: "10:30AM~10:30PM",
    price: "90분 코스 700바트",
    tags: ["이발소", "마사지", "아속", "남성전용"],
    image: "/placeholder.svg?height=200&width=300&text=황제+이발소",
    isPromoted: false,
    isPremium: false,
    exposureCount: 420,
    exposureWeight: 1.3,
    created_at: "2024-01-11T13:15:00Z",
    updated_at: "2024-01-19T17:40:00Z",
  },
]
