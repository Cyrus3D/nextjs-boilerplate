export interface BusinessCard {
  id: number
  title: string
  description: string
  category: string
  location?: string
  phone?: string
  kakaoId?: string
  lineId?: string
  website?: string // 단일 필드로 웹사이트와 지도 링크 모두 저장
  hours?: string
  price?: string
  promotion?: string
  tags: string[]
  image?: string
  rating?: number
  isPromoted?: boolean
}
