import { supabase } from "./supabase"

export async function updateExposureStats(cardIds: number[]) {
  if (!supabase || cardIds.length === 0) {
    return
  }

  try {
    // 각 카드의 노출 카운트를 1씩 증가
    const updates = cardIds.map((id) => ({
      id,
      exposure_count: 1, // 실제로는 현재 값에 +1 해야 함
      last_exposed_at: new Date().toISOString(),
    }))

    // 배치 업데이트 실행
    for (const update of updates) {
      await supabase
        .from("business_cards")
        .update({
          exposure_count: supabase.rpc("increment_exposure", { card_id: update.id }),
          last_exposed_at: update.last_exposed_at,
        })
        .eq("id", update.id)
    }
  } catch (error) {
    console.error("Error updating exposure stats:", error)
  }
}

export function calculateExposureWeight(card: {
  exposureCount: number
  isPremium: boolean
  isPromoted: boolean
  lastExposedAt?: string | null
}): number {
  let weight = 1.0

  // 프리미엄 카드는 가중치 증가
  if (card.isPremium) {
    weight += 0.5
  }

  // 추천 카드는 가중치 증가
  if (card.isPromoted) {
    weight += 0.3
  }

  // 노출 횟수가 적을수록 가중치 증가 (최근에 덜 노출된 카드 우선)
  if (card.exposureCount < 10) {
    weight += 0.2
  } else if (card.exposureCount < 50) {
    weight += 0.1
  }

  // 최근 노출 시간 고려 (24시간 이내 노출된 카드는 가중치 감소)
  if (card.lastExposedAt) {
    const lastExposed = new Date(card.lastExposedAt)
    const now = new Date()
    const hoursSinceExposure = (now.getTime() - lastExposed.getTime()) / (1000 * 60 * 60)

    if (hoursSinceExposure < 24) {
      weight -= 0.2
    }
  }

  return Math.max(0.1, weight) // 최소 가중치 0.1 보장
}
