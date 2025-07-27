// 현재 구조 + 향후 확장 대비
export interface BusinessCard {
  id: number
  title: string
  description: string
  category: string
  location?: string
  phone?: string
  kakaoId?: string
  lineId?: string
  website?: string // 기본 웹사이트 또는 주요 링크
  mapUrl?: string // 향후 추가될 수 있는 전용 지도 링크
  socialLinks?: BusinessLink[] // 향후 확장용
  hours?: string
  price?: string
  promotion?: string
  tags: string[]
  image?: string // 이미지 URL 필드 추가
  isPromoted?: boolean
  // 프리미엄 및 노출 관련 필드 추가
  isPremium?: boolean
  premiumExpiresAt?: string
  exposureCount?: number
  lastExposedAt?: string
  exposureWeight?: number
  fairnessScore?: number // 클라이언트 계산용
}

// 향후 확장을 위한 링크 타입
export interface BusinessLink {
  type: "website" | "map" | "facebook" | "instagram" | "youtube" | "blog" | "menu"
  url: string
  displayName?: string
  isPrimary?: boolean
}

// URL 타입 정의
export type UrlType = "website" | "map" | "social" | "unknown"

// 카드 정렬 옵션
export type CardSortOption = "fairness" | "premium-first" | "random" | "recent"

// 노출 통계
export interface ExposureStats {
  totalExposures: number
  averageExposures: number
  lastUpdated: string
}
