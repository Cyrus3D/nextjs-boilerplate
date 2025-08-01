export interface BusinessCard {
  id: number
  title: string
  description: string
  category: string
  location?: string
  phone?: string
  website?: string
  image?: string
  tags: string[]
  hours?: string
  price?: string
  promotion?: string
  kakaoId?: string
  lineId?: string
  facebookUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
  tiktokUrl?: string
  isPremium: boolean
  isPromoted: boolean
  exposureCount?: number
  viewCount: number
  created_at: string
  updated_at: string
}

export interface BusinessCardFormData {
  title: string
  description: string
  category: string
  location?: string
  phone?: string
  website?: string
  image?: string
  tags: string[]
  hours?: string
  price?: string
  promotion?: string
  kakaoId?: string
  lineId?: string
  facebookUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
  tiktokUrl?: string
  isPremium?: boolean
  isPromoted?: boolean
}

export interface BusinessCardFilters {
  category?: string
  search?: string
  isPremium?: boolean
  isPromoted?: boolean
}

export const BUSINESS_CATEGORIES = [
  "음식점",
  "배송서비스",
  "여행서비스",
  "식품",
  "이벤트서비스",
  "방송서비스",
  "전자제품",
  "유흥업소",
  "교통서비스",
  "서비스",
  "프리미엄",
] as const

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number]
