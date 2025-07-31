"use server"

import { createClient } from "@/lib/supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { NewsFormData, NewsData, NewsAnalysisResult } from "@/types/news"

// Supabase 클라이언트 생성
const supabase = createClient()

// 뉴스 목록 조회 (관리자용)
export async function getNewsForAdmin(): Promise<NewsData[]> {
  try {
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase 뉴스 조회 오류:", error)
      throw new Error(`뉴스 목록 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("뉴스 목록 조회 오류:", error)
    throw error
  }
}

// 뉴스 생성
export async function createNews(newsData: NewsFormData): Promise<NewsData> {
  try {
    const { data, error } = await supabase
      .from("news")
      .insert({
        title: newsData.title,
        summary: newsData.summary || null,
        content: newsData.content,
        image_url: newsData.imageUrl || null,
        source: newsData.source,
        original_url: newsData.originalUrl,
        published_at: newsData.publishedAt ? new Date(newsData.publishedAt).toISOString() : null,
        category: newsData.category,
        tags: newsData.tags,
        is_active: newsData.isActive,
        is_featured: newsData.isFeatured,
        original_language: newsData.original_language || "ko",
        is_translated: newsData.is_translated || false,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase 뉴스 삽입 오류:", error)
      throw new Error(`뉴스 생성 실패: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("뉴스 생성 오류:", error)
    throw error
  }
}

// 뉴스 수정
export async function updateNews(id: number, newsData: Partial<NewsFormData>): Promise<NewsData> {
  try {
    const updateData: any = {}

    if (newsData.title !== undefined) updateData.title = newsData.title
    if (newsData.summary !== undefined) updateData.summary = newsData.summary || null
    if (newsData.content !== undefined) updateData.content = newsData.content
    if (newsData.imageUrl !== undefined) updateData.image_url = newsData.imageUrl || null
    if (newsData.source !== undefined) updateData.source = newsData.source
    if (newsData.originalUrl !== undefined) updateData.original_url = newsData.originalUrl
    if (newsData.publishedAt !== undefined) {
      updateData.published_at = newsData.publishedAt ? new Date(newsData.publishedAt).toISOString() : null
    }
    if (newsData.category !== undefined) updateData.category = newsData.category
    if (newsData.tags !== undefined) updateData.tags = newsData.tags
    if (newsData.isActive !== undefined) updateData.is_active = newsData.isActive
    if (newsData.isFeatured !== undefined) updateData.is_featured = newsData.isFeatured
    if (newsData.original_language !== undefined) updateData.original_language = newsData.original_language
    if (newsData.is_translated !== undefined) updateData.is_translated = newsData.is_translated

    const { data, error } = await supabase.from("news").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Supabase 뉴스 수정 오류:", error)
      throw new Error(`뉴스 수정 실패: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("뉴스 수정 오류:", error)
    throw error
  }
}

// 뉴스 삭제
export async function deleteNews(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("news").delete().eq("id", id)

    if (error) {
      console.error("Supabase 뉴스 삭제 오류:", error)
      throw new Error(`뉴스 삭제 실패: ${error.message}`)
    }
  } catch (error) {
    console.error("뉴스 삭제 오류:", error)
    throw error
  }
}

// 다중 뉴스 삭제
export async function deleteMultipleNews(ids: number[]): Promise<void> {
  try {
    const { error } = await supabase.from("news").delete().in("id", ids)

    if (error) {
      console.error("Supabase 다중 뉴스 삭제 오류:", error)
      throw new Error(`뉴스 삭제 실패: ${error.message}`)
    }
  } catch (error) {
    console.error("다중 뉴스 삭제 오류:", error)
    throw error
  }
}

// 뉴스 특성 상태 업데이트
export async function updateNewsFeatureStatus(id: number, isFeatured: boolean): Promise<void> {
  try {
    const { error } = await supabase.from("news").update({ is_featured: isFeatured }).eq("id", id)

    if (error) {
      console.error("Supabase 뉴스 특성 상태 업데이트 오류:", error)
      throw new Error(`뉴스 특성 상태 업데이트 실패: ${error.message}`)
    }
  } catch (error) {
    console.error("뉴스 특성 상태 업데이트 오류:", error)
    throw error
  }
}

// 언어 감지
export async function detectLanguage(text: string): Promise<string> {
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `다음 텍스트의 언어를 감지하고 언어 코드만 반환하세요 (ko, en, th 중 하나):

텍스트: "${text.substring(0, 500)}"

언어 코드만 반환하세요:`,
      maxTokens: 10,
    })

    const detectedLanguage = result.trim().toLowerCase()

    // 유효한 언어 코드인지 확인
    if (["ko", "en", "th"].includes(detectedLanguage)) {
      return detectedLanguage
    }

    // 기본값으로 한국어 반환
    return "ko"
  } catch (error) {
    console.error("언어 감지 오류:", error)
    return "ko" // 기본값
  }
}

// 텍스트 번역
export async function translateNewsText(text: string, fromLanguage: string, toLanguage = "ko"): Promise<string> {
  if (fromLanguage === toLanguage) {
    return text
  }

  try {
    const languageNames = {
      ko: "한국어",
      en: "영어",
      th: "태국어",
    }

    const { text: translatedText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 텍스트를 ${languageNames[fromLanguage as keyof typeof languageNames]}에서 ${languageNames[toLanguage as keyof typeof languageNames]}로 번역하세요. 뉴스 기사의 톤과 스타일을 유지하면서 자연스럽게 번역해주세요.

원본 텍스트:
${text}

번역된 텍스트:`,
      maxTokens: Math.max(1000, Math.ceil(text.length * 1.5)),
    })

    return translatedText.trim()
  } catch (error) {
    console.error("텍스트 번역 오류:", error)
    throw new Error(`번역 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// 웹페이지에서 뉴스 내용 추출
async function extractNewsFromUrl(url: string): Promise<{
  title: string
  content: string
  summary?: string
  imageUrl?: string
  publishedAt?: string
}> {
  try {
    // 실제 구현에서는 웹 스크래핑 라이브러리를 사용해야 합니다
    // 여기서는 AI를 사용한 간단한 구현을 제공합니다
    const { text: extractedData } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 URL에서 뉴스 기사 정보를 추출하세요: ${url}

다음 형식으로 JSON을 반환하세요:
{
  "title": "기사 제목",
  "content": "기사 전체 내용",
  "summary": "기사 요약 (2-3문장)",
  "imageUrl": "대표 이미지 URL (있는 경우)",
  "publishedAt": "발행일 (YYYY-MM-DD 형식)"
}

실제 웹페이지에 접근할 수 없으므로, URL을 기반으로 가능한 정보를 추론하여 제공하세요.`,
      maxTokens: 2000,
    })

    try {
      return JSON.parse(extractedData)
    } catch {
      // JSON 파싱 실패 시 기본값 반환
      return {
        title: "뉴스 제목을 입력하세요",
        content: "뉴스 내용을 입력하세요",
        summary: "뉴스 요약을 입력하세요",
      }
    }
  } catch (error) {
    console.error("뉴스 추출 오류:", error)
    throw new Error(`뉴스 추출 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// 뉴스 데이터 파싱 (AI 분석)
export async function parseNewsData(url: string, enableTranslation = true): Promise<NewsAnalysisResult> {
  try {
    // 1. 웹페이지에서 뉴스 내용 추출
    const extractedNews = await extractNewsFromUrl(url)

    // 2. 언어 감지
    const detectedLanguage = await detectLanguage(extractedNews.title + " " + extractedNews.content.substring(0, 500))

    let result: NewsAnalysisResult = {
      title: extractedNews.title,
      content: extractedNews.content,
      summary: extractedNews.summary,
      imageUrl: extractedNews.imageUrl,
      publishedAt: extractedNews.publishedAt,
      category: "일반",
      tags: [],
      isActive: true,
      isFeatured: false,
      original_language: detectedLanguage,
      is_translated: false,
    }

    // 3. 번역 (필요한 경우)
    if (enableTranslation && detectedLanguage !== "ko") {
      try {
        const translatedTitle = await translateNewsText(extractedNews.title, detectedLanguage)
        const translatedContent = await translateNewsText(extractedNews.content, detectedLanguage)
        const translatedSummary = extractedNews.summary
          ? await translateNewsText(extractedNews.summary, detectedLanguage)
          : undefined

        result = {
          ...result,
          title: translatedTitle,
          content: translatedContent,
          summary: translatedSummary,
          is_translated: true,
        }
      } catch (translationError) {
        console.error("번역 오류:", translationError)
        // 번역 실패 시 원본 텍스트 유지
      }
    }

    // 4. 카테고리 자동 분류
    try {
      const { text: categoryResult } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `다음 뉴스 기사의 카테고리를 분류하세요. 다음 중 하나를 선택하세요:
정치, 경제, 사회, 문화, 스포츠, 국제, 생활, 기술, 일반

제목: ${result.title}
내용: ${result.content.substring(0, 500)}

카테고리만 반환하세요:`,
        maxTokens: 10,
      })

      const categories = ["정치", "경제", "사회", "문화", "스포츠", "국제", "생활", "기술", "일반"]
      const detectedCategory = categoryResult.trim()

      if (categories.includes(detectedCategory)) {
        result.category = detectedCategory
      }
    } catch (error) {
      console.error("카테고리 분류 오류:", error)
    }

    // 5. 태그 자동 생성
    try {
      const { text: tagsResult } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `다음 뉴스 기사에서 관련 태그를 3-5개 추출하세요. 쉼표로 구분하여 반환하세요.

제목: ${result.title}
내용: ${result.content.substring(0, 500)}

태그 (쉼표로 구분):`,
        maxTokens: 100,
      })

      const tags = tagsResult
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .slice(0, 5)

      result.tags = tags
    } catch (error) {
      console.error("태그 생성 오류:", error)
    }

    // 6. 출처 추출
    try {
      const urlObj = new URL(url)
      result.source = urlObj.hostname.replace("www.", "")
    } catch (error) {
      result.source = "알 수 없음"
    }

    return result
  } catch (error) {
    console.error("뉴스 데이터 파싱 오류:", error)
    throw new Error(`뉴스 분석 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}
