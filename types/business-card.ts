export interface BusinessCard {
  id: number
  title: string
  description: string
  category: string
  location?: string
  phone?: string
  kakaoId?: string
  lineId?: string
  website?: string
  mapUrl?: string // 지도 URL 추가
  hours?: string
  price?: string
  promotion?: string
  tags: string[]
  image?: string
  rating?: number
  isPromoted?: boolean
}
