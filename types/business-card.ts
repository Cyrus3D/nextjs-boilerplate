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
  created_at: string
  updated_at: string
  facebookUrl?: string | null
  instagramUrl?: string | null
  tiktokUrl?: string | null
  threadsUrl?: string | null
  youtubeUrl?: string | null
}

export interface Category {
  id: number
  name: string
  color_class: string
  created_at?: string
}

export interface Tag {
  id: number
  name: string
  created_at?: string
}

export interface BusinessCardTag {
  id: number
  business_card_id: number
  tag_id: number
  created_at?: string
}
