import { supabase, isSupabaseConfigured } from "./supabase"
import type { BusinessCard } from "../types/business-card"

// 카드 노출 통계 업데이트
export async function updateExposureStats(cardIds: number[]) {
  if (!isSupabaseConfigured() || !supabase || cardIds.length === 0) {
    return
  }

  try {
    // 각 카드의 노출 횟수 증가
    for (const cardId of cardIds) {
      await supabase.rpc("increment_exposure", { card_id: cardId })
    }
  } catch (error) {
    console.error("Error updating exposure stats:", error)
  }
}

// 공평한 노출을 위한 가중치 계산
export function calculateExposureWeight(card: any): number {
  const now = new Date()
  const lastExposed = card.last_exposed_at ? new Date(card.last_exposed_at) : new Date(0)
  const hoursSinceLastExposure = (now.getTime() - lastExposed.getTime()) / (1000 * 60 * 60)

  // 기본 가중치
  let weight = 1.0

  // 노출 횟수가 적을수록 가중치 증가
  const avgExposure = 100 // 평균 노출 횟수 기준
  if (card.exposure_count < avgExposure) {
    weight += (avgExposure - card.exposure_count) / avgExposure
  }

  // 오래 노출되지 않았을수록 가중치 증가
  if (hoursSinceLastExposure > 24) {
    weight += Math.min(hoursSinceLastExposure / 24, 2.0)
  }

  return weight
}

// 카드 순서 결정 알고리즘
export function sortCardsForFairExposure(cards: BusinessCard[]): BusinessCard[] {
  // 1. 프리미엄 카드와 일반 카드 분리
  const premiumCards = cards.filter((card) => card.isPremium && !isPremiumExpired(card))
  const regularCards = cards.filter((card) => !card.isPremium || isPremiumExpired(card))

  // 2. 프리미엄 카드 정렬 (최신 결제순)
  const sortedPremiumCards = premiumCards.sort((a, b) => {
    if (a.premiumExpiresAt && b.premiumExpiresAt) {
      return new Date(b.premiumExpiresAt).getTime() - new Date(a.premiumExpiresAt).getTime()
    }
    return 0
  })

  // 3. 일반 카드 공평 노출 정렬
  const sortedRegularCards = sortRegularCardsForFairness(regularCards)

  // 4. 프리미엄 카드를 상단에, 일반 카드를 하단에 배치
  return [...sortedPremiumCards, ...sortedRegularCards]
}

// 일반 카드의 공평한 노출을 위한 정렬
function sortRegularCardsForFairness(cards: BusinessCard[]): BusinessCard[] {
  const now = new Date()
  const sessionSeed = getSessionSeed()

  // 각 카드에 공평성 점수 계산
  const cardsWithScore = cards.map((card) => {
    let fairnessScore = 0

    // 1. 노출 횟수 기반 점수 (적게 노출될수록 높은 점수)
    const maxExposure = Math.max(...cards.map((c) => c.exposureCount || 0))
    const exposureScore = maxExposure - (card.exposureCount || 0)
    fairnessScore += exposureScore * 0.4

    // 2. 마지막 노출 시간 기반 점수 (오래될수록 높은 점수)
    const lastExposed = card.lastExposedAt ? new Date(card.lastExposedAt) : new Date(0)
    const hoursSinceExposure = (now.getTime() - lastExposed.getTime()) / (1000 * 60 * 60)
    fairnessScore += Math.min(hoursSinceExposure, 168) * 0.3 // 최대 1주일

    // 3. 세션 기반 랜덤 요소 (같은 세션에서는 일관성 유지)
    const cardHash = hashString(card.id.toString() + sessionSeed)
    const randomScore = (cardHash % 1000) / 1000
    fairnessScore += randomScore * 0.3

    return {
      ...card,
      fairnessScore,
    }
  })

  // 공평성 점수 기준으로 정렬
  return cardsWithScore.sort((a, b) => b.fairnessScore - a.fairnessScore).map(({ fairnessScore, ...card }) => card)
}

// 프리미엄 만료 확인
function isPremiumExpired(card: BusinessCard): boolean {
  if (!card.premiumExpiresAt) return true
  return new Date(card.premiumExpiresAt) < new Date()
}

// 세션별 시드 생성 (브라우저 세션 동안 일관성 유지)
function getSessionSeed(): string {
  if (typeof window === "undefined") return "0"

  let seed = sessionStorage.getItem("cardRotationSeed")
  if (!seed) {
    seed = Date.now().toString() + Math.random().toString()
    sessionStorage.setItem("cardRotationSeed", seed)
  }
  return seed
}

// 문자열 해시 함수
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 32bit 정수로 변환
  }
  return Math.abs(hash)
}

// 시간 기반 로테이션 (매 시간마다 순서 변경)
export function getTimeBasedRotationSeed(): string {
  const now = new Date()
  const hoursSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60))
  return hoursSinceEpoch.toString()
}

// 카드 그룹 로테이션 (페이지네이션과 유사)
export function rotateCardGroups(cards: BusinessCard[], groupSize = 6): BusinessCard[] {
  if (cards.length <= groupSize) return cards

  const timeBasedOffset = Math.floor(Date.now() / (1000 * 60 * 60)) % cards.length
  const rotatedCards = [...cards.slice(timeBasedOffset), ...cards.slice(0, timeBasedOffset)]

  return rotatedCards
}
