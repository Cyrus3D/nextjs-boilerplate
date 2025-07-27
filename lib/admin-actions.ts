"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { supabase, isSupabaseConfigured } from "./supabase"

// 비즈니스 카드 데이터 스키마
const BusinessCardSchema = z.object({
  title: z.string().describe("비즈니스 이름 또는 제목"),
  description: z.string().describe("비즈니스에 대한 상세 설명"),
  category: z
    .string()
    .describe(
      "비즈니스 카테고리 (음식점, 배송서비스, 여행서비스, 식품, 이벤트서비스, 방송서비스, 전자제품, 유흥업소, 교통서비스, 서비스 중 하나)",
    ),
  location: z.string().optional().describe("위치 정보"),
  phone: z.string().optional().describe("전화번호"),
  kakaoId: z.string().optional().describe("카카오톡 ID"),
  lineId: z.string().optional().describe("라인 ID"),
  website: z.string().optional().describe("웹사이트 URL 또는 지도 링크"),
  hours: z.string().optional().describe("영업시간"),
  price: z.string().optional().describe("가격 정보"),
  promotion: z.string().optional().describe("프로모션 또는 특별 혜택"),
  tags: z.array(z.string()).describe("관련 태그들"),
  rating: z.number().min(0).max(5).optional().describe("평점 (0-5)"),
  isPromoted: z.boolean().optional().describe("추천 비즈니스 여부"),
})

export async function parseBusinessCardData(input: string, type: "text" | "image") {
  try {
    let prompt = ""

    if (type === "text") {
      prompt = `다음 텍스트에서 비즈니스 정보를 추출하여 구조화된 데이터로 변환해주세요:

${input}

다음 규칙을 따라주세요:
1. 카테고리는 반드시 다음 중 하나여야 합니다: 음식점, 배송서비스, 여행서비스, 식품, 이벤트서비스, 방송서비스, 전자제품, 유흥업소, 교통서비스, 서비스
2. 전화번호는 정확한 형식으로 추출해주세요
3. 웹사이트나 지도 링크가 있으면 정확히 추출해주세요
4. 태그는 비즈니스의 특성을 잘 나타내는 키워드들로 생성해주세요
5. 프로모션 정보가 있으면 간결하게 요약해주세요
6. 평점 정보가 명시되어 있으면 추출하고, 없으면 null로 설정해주세요`
    } else {
      prompt = `이미지에서 비즈니스 정보를 추출하여 구조화된 데이터로 변환해주세요.

이미지 데이터: ${input}

다음 규칙을 따라주세요:
1. 이미지에서 텍스트를 읽어 비즈니스 정보를 추출해주세요
2. 카테고리는 반드시 다음 중 하나여야 합니다: 음식점, 배송서비스, 여행서비스, 식품, 이벤트서비스, 방송서비스, 전자제품, 유흥업소, 교통서비스, 서비스
3. 연락처 정보를 정확히 추출해주세요
4. 태그는 이미지에서 파악할 수 있는 비즈니스 특성으로 생성해주세요`
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: BusinessCardSchema,
      prompt: prompt,
    })

    return {
      success: true,
      data: object,
    }
  } catch (error) {
    console.error("Error parsing business card data:", error)
    return {
      success: false,
      error: "AI 분석 중 오류가 발생했습니다. API 키를 확인해주세요.",
    }
  }
}

export async function saveBusinessCard(data: any) {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: "데이터베이스가 설정되지 않았습니다.",
    }
  }

  try {
    // 1. 카테고리 ID 찾기 또는 생성
    let categoryId = 10 // 기본값: 서비스

    const { data: categories, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", data.category)
      .single()

    if (categoryError && categoryError.code !== "PGRST116") {
      console.error("Category query error:", categoryError)
    } else if (categories) {
      categoryId = categories.id
    }

    // 2. 비즈니스 카드 저장
    const { data: savedCard, error: cardError } = await supabase
      .from("business_cards")
      .insert({
        title: data.title,
        description: data.description,
        category_id: categoryId,
        location: data.location,
        phone: data.phone,
        kakao_id: data.kakaoId,
        line_id: data.lineId,
        website: data.website,
        hours: data.hours,
        price: data.price,
        promotion: data.promotion,
        rating: data.rating,
        is_promoted: data.isPromoted || false,
        image_url: "/placeholder.svg?height=200&width=400",
      })
      .select()
      .single()

    if (cardError) {
      console.error("Card insert error:", cardError)
      return {
        success: false,
        error: "비즈니스 카드 저장 중 오류가 발생했습니다.",
      }
    }

    // 3. 태그 처리
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        // 태그 찾기 또는 생성
        let { data: tag, error: tagError } = await supabase.from("tags").select("id").eq("name", tagName).single()

        if (tagError && tagError.code === "PGRST116") {
          // 태그가 없으면 생성
          const { data: newTag, error: createTagError } = await supabase
            .from("tags")
            .insert({ name: tagName })
            .select()
            .single()

          if (createTagError) {
            console.error("Tag creation error:", createTagError)
            continue
          }
          tag = newTag
        }

        if (tag) {
          // 비즈니스 카드와 태그 연결
          await supabase.from("business_card_tags").insert({
            business_card_id: savedCard.id,
            tag_id: tag.id,
          })
        }
      }
    }

    return {
      success: true,
      data: savedCard,
    }
  } catch (error) {
    console.error("Error saving business card:", error)
    return {
      success: false,
      error: "저장 중 오류가 발생했습니다.",
    }
  }
}

export async function updateBusinessCard(card: any) {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: "데이터베이스가 설정되지 않았습니다.",
    }
  }

  try {
    // 1. 카테고리 ID 찾기
    let categoryId = 10 // 기본값: 서비스

    const { data: categories, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", card.category)
      .single()

    if (categories) {
      categoryId = categories.id
    }

    // 2. 비즈니스 카드 업데이트
    const { error: cardError } = await supabase
      .from("business_cards")
      .update({
        title: card.title,
        description: card.description,
        category_id: categoryId,
        location: card.location,
        phone: card.phone,
        kakao_id: card.kakaoId,
        line_id: card.lineId,
        website: card.website,
        hours: card.hours,
        price: card.price,
        promotion: card.promotion,
        rating: card.rating,
        is_promoted: card.isPromoted || false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", card.id)

    if (cardError) {
      console.error("Card update error:", cardError)
      return {
        success: false,
        error: "비즈니스 카드 업데이트 중 오류가 발생했습니다.",
      }
    }

    // 3. 기존 태그 연결 삭제
    await supabase.from("business_card_tags").delete().eq("business_card_id", card.id)

    // 4. 새 태그 처리
    if (card.tags && card.tags.length > 0) {
      for (const tagName of card.tags) {
        // 태그 찾기 또는 생성
        let { data: tag, error: tagError } = await supabase.from("tags").select("id").eq("name", tagName).single()

        if (tagError && tagError.code === "PGRST116") {
          // 태그가 없으면 생성
          const { data: newTag, error: createTagError } = await supabase
            .from("tags")
            .insert({ name: tagName })
            .select()
            .single()

          if (createTagError) {
            console.error("Tag creation error:", createTagError)
            continue
          }
          tag = newTag
        }

        if (tag) {
          // 비즈니스 카드와 태그 연결
          await supabase.from("business_card_tags").insert({
            business_card_id: card.id,
            tag_id: tag.id,
          })
        }
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating business card:", error)
    return {
      success: false,
      error: "업데이트 중 오류가 발생했습니다.",
    }
  }
}

export async function deleteBusinessCard(cardId: number) {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: "데이터베이스가 설정되지 않았습니다.",
    }
  }

  try {
    // 1. 태그 연결 삭제 (CASCADE로 자동 삭제되지만 명시적으로)
    await supabase.from("business_card_tags").delete().eq("business_card_id", cardId)

    // 2. 비즈니스 카드 삭제
    const { error: cardError } = await supabase.from("business_cards").delete().eq("id", cardId)

    if (cardError) {
      console.error("Card delete error:", cardError)
      return {
        success: false,
        error: "비즈니스 카드 삭제 중 오류가 발생했습니다.",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting business card:", error)
    return {
      success: false,
      error: "삭제 중 오류가 발생했습니다.",
    }
  }
}

export async function getBusinessCards() {
  if (!isSupabaseConfigured() || !supabase) {
    return []
  }

  try {
    // 비즈니스 카드 조회 (카테고리 정보 포함)
    const { data: cards, error: cardsError } = await supabase
      .from("business_cards")
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (cardsError) {
      console.error("Cards query error:", cardsError)
      return []
    }

    if (!cards || cards.length === 0) {
      return []
    }

    // 각 카드의 태그 정보 조회
    const cardsWithTags = await Promise.all(
      cards.map(async (card) => {
        let tags: string[] = []

        try {
          const { data: tagData } = await supabase
            .from("business_card_tags")
            .select(`
              tags (
                name
              )
            `)
            .eq("business_card_id", card.id)

          if (tagData) {
            tags = tagData.map((item: any) => item.tags?.name).filter(Boolean)
          }
        } catch (error) {
          console.warn("Tags query failed for card", card.id)
        }

        return {
          id: card.id,
          title: card.title,
          description: card.description,
          category: card.categories?.name || "기타",
          location: card.location,
          phone: card.phone,
          kakaoId: card.kakao_id,
          lineId: card.line_id,
          website: card.website,
          hours: card.hours,
          price: card.price,
          promotion: card.promotion,
          tags: tags,
          rating: card.rating,
          isPromoted: card.is_promoted,
        }
      }),
    )

    return cardsWithTags
  } catch (error) {
    console.error("Error fetching business cards:", error)
    return []
  }
}
