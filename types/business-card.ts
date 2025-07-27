export interface BusinessCard {
  id: number
  title: string
  description: string
  category: string
  location?: string | null
  phone?: string | null
  kakaoId?: string | null
  lineId?: string | null
  website?: string | null
  hours?: string | null
  price?: string | null
  promotion?: string | null
  tags: string[]
  image?: string | null
  isPromoted: boolean
  isPremium: boolean
  premiumExpiresAt?: string | null
  exposureCount: number
  lastExposedAt?: string | null
  exposureWeight: number
}

export interface BusinessCardData {
  title: string
  description: string
  category_id: number
  location?: string | null
  phone?: string | null
  kakao_id?: string | null
  line_id?: string | null
  website?: string | null
  hours?: string | null
  price?: string | null
  promotion?: string | null
  image_url?: string | null
  is_promoted?: boolean
  is_active?: boolean
  is_premium?: boolean
  premium_expires_at?: string | null
  exposure_count?: number
  last_exposed_at?: string | null
  exposure_weight?: number
}

export interface Category {
  id: number
  name: string
  color_class: string
  created_at: string
}

export interface Tag {
  id: number
  name: string
  created_at: string
}

export interface BusinessCardTag {
  id: number
  business_card_id: number
  tag_id: number
  created_at: string
}
