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
  hours?: string
  price?: string
  promotion?: string
  tags: string[]
  image?: string
  rating?: number
  isPromoted?: boolean
}
