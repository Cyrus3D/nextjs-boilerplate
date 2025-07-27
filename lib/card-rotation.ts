import { supabase, isSupabaseConfigured } from "./supabase"
import type { BusinessCard } from "../types/business-card"

export function sortCardsForFairExposure(cards: BusinessCard[]): BusinessCard[] {
  // 프리미엄 카드와 일반 카드 분리
  const premiumCards = cards.filter((card) => card.isPremium)
  const regularCards = cards.filter((card) => !card.isPremium)

  // 노출 횟수와 가중치를 고려한 공정성 점수 계산
  const calculateFairnessScore = (card: BusinessCard): number => {
    const baseScore = 1000 - card.exposureCount * 10
    const weightMultiplier = card.exposureWeight || 1.0
    const timeSinceLastExposure = card.lastExposedAt ? Date.now() - new Date(card.lastExposedAt).getTime() : Date.now()

    // 시간이 오래 지날수록 점수 증가 (1시간 = 3600000ms)
    const timeBonus = Math.min(timeSinceLastExposure / 3600000, 24) * 50

    return (baseScore + timeBonus) * weightMultiplier
  }

  // 각 그룹 내에서 공정성 점수로 정렬
  premiumCards.sort((a, b) => calculateFairnessScore(b) - calculateFairnessScore(a))
  regularCards.sort((a, b) => calculateFairnessScore(b) - calculateFairnessScore(a))

  // 프리미엄:일반 = 2:1 비율로 섞기
  const result: BusinessCard[] = []
  let premiumIndex = 0
  let regularIndex = 0

  while (premiumIndex < premiumCards.length || regularIndex < regularCards.length) {
    // 프리미엄 카드 2개 추가
    for (let i = 0; i < 2 && premiumIndex < premiumCards.length; i++) {
      result.push(premiumCards[premiumIndex++])
    }

    // 일반 카드 1개 추가
    if (regularIndex < regularCards.length) {
      result.push(regularCards[regularIndex++])
    }
  }

  return result
}

export async function updateExposureStats(cardIds: number[]): Promise<void> {
  if (!isSupabaseConfigured() || !supabase || cardIds.length === 0) {
    return
  }

  const now = new Date().toISOString()

  try {
    for (const cardId of cardIds) {
      // 현재 노출 카운트 조회
      const { data: currentCard, error: fetchError } = await supabase
        .from("business_cards")
        .select("exposure_count")
        .eq("id", cardId)
        .single()

      if (fetchError) {
        console.error(`Error fetching current exposure count for card ${cardId}:`, fetchError)
        continue
      }

      // 노출 카운트 증가
      const newExposureCount = (currentCard?.exposure_count || 0) + 1
      const { error: updateError } = await supabase
        .from("business_cards")
        .update({
          exposure_count: newExposureCount,
          last_exposed_at: now,
          updated_at: now,
        })
        .eq("id", cardId)

      if (updateError) {
        console.error(`Error updating exposure stats for card ${cardId}:`, updateError)
      }
    }
  } catch (error) {
    console.error("Failed to update exposure stats:", error)
  }
}

export async function resetExposureStats(): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    return
  }

  try {
    const { error } = await supabase
      .from("business_cards")
      .update({
        exposure_count: 0,
        last_exposed_at: null,
        updated_at: new Date().toISOString(),
      })
      .neq("id", 0) // Update all records

    if (error) {
      console.error("Error resetting exposure stats:", error)
    }
  } catch (error) {
    console.error("Failed to reset exposure stats:", error)
  }
}
