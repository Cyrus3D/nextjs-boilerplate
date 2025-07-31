"use server"

import { supabase } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { revalidatePath } from "next/cache"
import type { NewsFormData, NewsArticle, NewsCategory, NewsTag, NewsAnalysisResult } from "../types/news"

// Check if Supabase is available
function checkSupabase() {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다. 환경 변수를 확인해주세요.")
  }
  return supabase
}

// Helper function to extract JSON from AI response with better error handling
function extractJsonFromResponse(text: string): any {
  if (!text || typeof text !== "string") {
    throw new Error("AI 응답이 비어있거나 유효하지 않습니다.")
  }

  // Clean the text first
  const cleanText = text.trim()
  console.log("Attempting to parse AI response:", cleanText.substring(0, 200) + "...")

  // Check if the response contains obvious non-JSON content
  if (cleanText.toLowerCase().includes("redirecting") || cleanText.toLowerCase().includes("loading")) {
    throw new Error("AI가 리다이렉트 페이지나 로딩 페이지를 분석했습니다. 다른 URL을 시도해주세요.")
  }

  try {
    // First try to parse as is
    const parsed = JSON.parse(cleanText)
    console.log("Successfully parsed JSON directly")
    return parsed
  } catch (firstError) {
    console.log("Direct JSON parse failed, trying to extract JSON...")

    // Try to find JSON within the text
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        console.log("Successfully parsed extracted JSON")
        return parsed
      } catch (secondError) {
        console.log("Extracted JSON parse failed, trying cleanup...")

        // If still fails, try to clean up common issues
        let cleanedText = jsonMatch[0]
          .replace(/```json\n?/g, "")
          .replace(/\n?```/g, "")
          .replace(/^[^{]*/, "")
          .replace(/[^}]*$/, "")
          .trim()

        // Fix common JSON issues
        cleanedText = cleanedText
          .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
          .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes to keys
          .replace(/:\s*'([^']*)'/g, ': "$1"') // Replace single quotes with double quotes
          .replace(/\n/g, "\\n") // Escape newlines in strings
          .replace(/\t/g, "\\t") // Escape tabs in strings

        try {
          const parsed = JSON.parse(cleanedText)
          console.log("Successfully parsed cleaned JSON")
          return parsed
        } catch (thirdError) {
          console.log("All JSON parsing attempts failed")
        }
      }
    }

    // If no JSON found, try to extract key information manually from the text
    console.log("Attempting manual extraction from text...")

    const titleMatch = cleanText.match(/title["\s]*:?["\s]*([^"\n,}]+)/i)
    const contentMatch = cleanText.match(/content["\s]*:?["\s]*([^"]+?)(?=\n|$|,|})/i)
    const summaryMatch = cleanText.match(/summary["\s]*:?["\s]*([^"\n,}]+)/i)
    const categoryMatch = cleanText.match(/category["\s]*:?["\s]*([^"\n,}]+)/i)

    if (titleMatch && contentMatch) {
      console.log("Successfully extracted data manually")
      return {
        title: titleMatch[1].trim(),
        content: contentMatch[1].trim(),
        summary: summaryMatch ? summaryMatch[1].trim() : "",
        category: categoryMatch ? categoryMatch[1].trim() : "일반뉴스",
        tags: [],
        language: "ko",
        author: null,
      }
    }

    // If all else fails, create a basic structure from the available text
    if (cleanText.length > 100) {
      console.log("Creating fallback structure from available text")
      return {
        title: "분석된 뉴스",
        content: cleanText.substring(0, 1000),
        summary: cleanText.substring(0, 150) + "...",
        category: "일반뉴스",
        tags: [],
        language: "ko",
        author: null,
      }
    }

    throw new Error("AI 응답에서 유효한 데이터를 추출할 수 없습니다.")
  }
}

// AI를 사용한 뉴스 분석
export async function analyzeNewsFromUrl(url: string): Promise<NewsAnalysisResult> {
  if (!url.trim()) {
    throw new Error("분석할 URL이 없습니다.")
  }

  try {
    console.log(`Starting news analysis for URL: ${url}`)

    // 웹페이지 내용 가져오기
    const scrapeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/scrape-news`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      },
    )

    const scrapeData = await scrapeResponse.json()

    if (!scrapeResponse.ok) {
      console.error("Scraping failed:", scrapeData)
      throw new Error(scrapeData.error || "웹페이지를 가져올 수 없습니다.")
    }

    const { content, title: pageTitle, contentLength } = scrapeData

    console.log(`Scraped content length: ${contentLength}, Title: ${pageTitle?.substring(0, 50)}...`)

    if (!content || content.length < 200) {
      throw new Error("웹페이지에서 충분한 내용을 추출할 수 없습니다. 다른 URL을 시도해보세요.")
    }

    // Check if content looks like redirect or error content
    const lowerContent = content.toLowerCase()
    if (
      lowerContent.includes("redirecting") ||
      lowerContent.includes("loading") ||
      lowerContent.includes("please wait") ||
      lowerContent.includes("javascript required")
    ) {
      throw new Error(
        "웹페이지가 제대로 로드되지 않았습니다. JavaScript가 필요한 페이지이거나 접근이 제한된 페이지입니다.",
      )
    }

    // Truncate content if too long to avoid token limits
    const maxContentLength = 6000
    const truncatedContent =
      content.length > maxContentLength ? content.substring(0, maxContentLength) + "..." : content

    console.log("Sending to AI for analysis...")

    // AI로 뉴스 분석 - 더 구체적인 프롬프트 사용
    const { text: analysisResult } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음은 뉴스 웹페이지에서 추출한 내용입니다. 이를 분석하여 구조화된 뉴스 정보를 JSON 형식으로 만들어 주세요.

웹페이지 제목: ${pageTitle || ""}
웹페이지 내용: ${truncatedContent}

반드시 다음 JSON 형식으로만 응답해주세요. 다른 설명이나 텍스트는 절대 포함하지 마세요:

{
  "title": "뉴스 제목 (한국어로 번역)",
  "content": "뉴스 전체 내용 (한국어로 번역, 최소 200자)",
  "summary": "뉴스 요약 (한국어, 80-120자)",
  "category": "일반뉴스",
  "tags": ["태그1", "태그2", "태그3"],
  "language": "ko",
  "author": null
}

중요한 규칙:
1. 반드시 유효한 JSON 형식으로만 응답
2. 제목과 내용은 한국어로 번역
3. 내용은 최소 200자 이상
4. 카테고리는 "일반뉴스", "비즈니스", "기술", "건강", "여행", "음식", "교육", "스포츠", "문화", "정치" 중 선택
5. 태그는 3-5개 정도
6. JSON 외의 다른 텍스트는 절대 포함하지 마세요`,
      temperature: 0.1,
      maxTokens: 1500,
    })

    console.log("AI Response received, length:", analysisResult.length)
    console.log("AI Response preview:", analysisResult.substring(0, 300) + "...")

    if (!analysisResult || analysisResult.length < 50) {
      throw new Error("AI 응답이 너무 짧습니다. 다시 시도해주세요.")
    }

    // Check if response contains error indicators
    const lowerResponse = analysisResult.toLowerCase()
    if (
      lowerResponse.includes("error") ||
      lowerResponse.includes("sorry") ||
      lowerResponse.includes("cannot") ||
      lowerResponse.includes("redirecting") ||
      lowerResponse.includes("unable")
    ) {
      throw new Error("AI가 내용을 분석할 수 없습니다. URL의 내용을 확인해주세요.")
    }

    const parsedData = extractJsonFromResponse(analysisResult)

    // 필수 필드 검증 및 기본값 설정
    const result = {
      title: parsedData.title || pageTitle || "제목 없음",
      content: parsedData.content || content.substring(0, 1000),
      summary: parsedData.summary || (parsedData.content || content).substring(0, 100) + "...",
      category: parsedData.category || "일반뉴스",
      tags: Array.isArray(parsedData.tags) ? parsedData.tags.slice(0, 5) : [],
      language: parsedData.language || "ko",
      author: parsedData.author || null,
    }

    // 내용 길이 검증
    if (result.content.length < 50) {
      result.content = content.substring(0, 1000) // Use original content if AI content is too short
    }

    console.log("Analysis completed successfully")
    console.log("Result preview:", {
      title: result.title.substring(0, 50) + "...",
      contentLength: result.content.length,
      category: result.category,
      tagsCount: result.tags.length,
    })

    return result
  } catch (error) {
    console.error("뉴스 분석 오류:", error)

    // 구체적인 오류 메시지 제공
    if (error instanceof Error) {
      if (error.message.includes("fetch") || error.message.includes("network")) {
        throw new Error("웹페이지에 접근할 수 없습니다. URL을 확인해주세요.")
      }
      if (error.message.includes("JSON") || error.message.includes("parse")) {
        throw new Error("AI 응답을 처리할 수 없습니다. 다시 시도해주세요.")
      }
      if (error.message.includes("token") || error.message.includes("length")) {
        throw new Error("내용이 너무 길어서 분석할 수 없습니다. 더 짧은 기사를 시도해보세요.")
      }
      if (error.message.includes("redirect") || error.message.includes("loading")) {
        throw new Error("웹페이지가 제대로 로드되지 않았습니다. 다른 URL을 시도해보세요.")
      }
      throw error
    }

    throw new Error("뉴스 분석 중 알 수 없는 오류가 발생했습니다.")
  }
}

// 언어 감지 및 번역
export async function translateNews(
  content: string,
  fromLang = "auto",
): Promise<{ translatedContent: string; detectedLanguage: string }> {
  try {
    if (!content || content.length < 10) {
      throw new Error("번역할 내용이 너무 짧습니다.")
    }

    console.log("Starting translation...")

    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Translate the following text to Korean and detect the original language.

Text: "${content.substring(0, 3000)}" ${content.length > 3000 ? "..." : ""}

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "translatedContent": "Korean translation of the content",
  "detectedLanguage": "Detected language code (ko, en, or th)"
}

If the original text is already in Korean, return it as is and set detectedLanguage to "ko".
Return ONLY the JSON object, nothing else.`,
      temperature: 0.1,
      maxTokens: 2000,
    })

    console.log("Translation response received")

    const parsedData = extractJsonFromResponse(result)

    return {
      translatedContent: parsedData.translatedContent || content,
      detectedLanguage: parsedData.detectedLanguage || "ko",
    }
  } catch (error) {
    console.error("번역 오류:", error)
    return {
      translatedContent: content,
      detectedLanguage: fromLang === "auto" ? "ko" : fromLang,
    }
  }
}

// 뉴스 생성
export async function createNews(data: NewsFormData): Promise<NewsArticle> {
  const client = checkSupabase()

  if (!data.title || !data.content) {
    throw new Error("제목과 내용은 필수 입력 항목입니다.")
  }

  try {
    // 뉴스 생성
    const newsData = {
      title: data.title,
      content: data.content,
      summary: data.summary || null,
      category_id: data.category_id || null,
      author: data.author || null,
      source_url: data.source_url || null,
      image_url: data.image_url || null,
      is_featured: data.is_featured || false,
      is_active: data.is_active !== false,
      published_at: data.published_at || new Date().toISOString(),
      original_language: data.original_language || "ko",
      is_translated: data.is_translated || false,
    }

    const { data: newsResult, error: newsError } = await client.from("news").insert([newsData]).select("*").single()

    if (newsError) {
      throw new Error(`뉴스 생성 실패: ${newsError.message}`)
    }

    // 카테고리 정보 별도 조회
    let categoryInfo = null
    if (newsResult.category_id) {
      const { data: categoryData } = await client
        .from("news_categories")
        .select("*")
        .eq("id", newsResult.category_id)
        .single()

      categoryInfo = categoryData
    }

    // 태그 처리
    if (data.tag_names && data.tag_names.length > 0) {
      await addTagsToNews(newsResult.id, data.tag_names)
    }

    // 태그 정보 조회
    const { data: tagData } = await client
      .from("news_tag_relations")
      .select(`
        tag:news_tags(*)
      `)
      .eq("news_id", newsResult.id)

    const tags = tagData?.map((t: any) => t.tag) || []

    revalidatePath("/dashboard-mgmt-2024")

    return {
      ...newsResult,
      category: categoryInfo,
      tags: tags,
    }
  } catch (error) {
    console.error("뉴스 생성 오류:", error)
    throw error
  }
}

// 뉴스 업데이트
export async function updateNews(id: number, data: Partial<NewsFormData>): Promise<NewsArticle> {
  const client = checkSupabase()

  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (data.title !== undefined) updateData.title = data.title
    if (data.content !== undefined) updateData.content = data.content
    if (data.summary !== undefined) updateData.summary = data.summary || null
    if (data.category_id !== undefined) updateData.category_id = data.category_id
    if (data.author !== undefined) updateData.author = data.author || null
    if (data.source_url !== undefined) updateData.source_url = data.source_url || null
    if (data.image_url !== undefined) updateData.image_url = data.image_url || null
    if (data.is_featured !== undefined) updateData.is_featured = Boolean(data.is_featured)
    if (data.is_active !== undefined) updateData.is_active = Boolean(data.is_active)
    if (data.published_at !== undefined) updateData.published_at = data.published_at
    if (data.original_language !== undefined) updateData.original_language = data.original_language
    if (data.is_translated !== undefined) updateData.is_translated = Boolean(data.is_translated)

    const { data: result, error } = await client.from("news").update(updateData).eq("id", id).select("*").single()

    if (error) {
      throw new Error(`뉴스 업데이트 실패: ${error.message}`)
    }

    // 카테고리 정보 별도 조회
    let categoryInfo = null
    if (result.category_id) {
      const { data: categoryData } = await client
        .from("news_categories")
        .select("*")
        .eq("id", result.category_id)
        .single()

      categoryInfo = categoryData
    }

    // 태그 업데이트
    if (data.tag_names !== undefined) {
      await updateNewsTagsTransaction(id, data.tag_names)
    }

    // 태그 정보 조회
    const { data: tagData } = await client
      .from("news_tag_relations")
      .select(`
        tag:news_tags(*)
      `)
      .eq("news_id", id)

    const tags = tagData?.map((t: any) => t.tag) || []

    revalidatePath("/dashboard-mgmt-2024")

    return {
      ...result,
      category: categoryInfo,
      tags: tags,
    }
  } catch (error) {
    console.error("뉴스 업데이트 오류:", error)
    throw error
  }
}

// 뉴스 삭제
export async function deleteNews(id: number): Promise<void> {
  const client = checkSupabase()

  try {
    const { error } = await client.from("news").delete().eq("id", id)

    if (error) {
      throw new Error(`뉴스 삭제 실패: ${error.message}`)
    }

    revalidatePath("/dashboard-mgmt-2024")
  } catch (error) {
    console.error("뉴스 삭제 오류:", error)
    throw error
  }
}

// 뉴스 목록 조회
export async function getNewsForAdmin(): Promise<NewsArticle[]> {
  const client = checkSupabase()

  try {
    // 뉴스 기본 정보 조회
    const { data: newsData, error: newsError } = await client
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })

    if (newsError) {
      // Check if table doesn't exist
      if (newsError.message.includes("does not exist") || newsError.code === "42P01") {
        console.log("News table does not exist")
        return []
      }
      throw new Error(`뉴스 목록 조회 실패: ${newsError.message}`)
    }

    if (!newsData || newsData.length === 0) {
      return []
    }

    // 카테고리 정보 조회
    const categoryIds = [...new Set(newsData.map((news) => news.category_id).filter(Boolean))]
    const categoriesMap = new Map()

    if (categoryIds.length > 0) {
      const { data: categoriesData } = await client.from("news_categories").select("*").in("id", categoryIds)

      if (categoriesData) {
        categoriesData.forEach((cat) => categoriesMap.set(cat.id, cat))
      }
    }

    // 태그 정보 조회
    const newsIds = newsData.map((news) => news.id)
    const { data: tagRelationsData } = await client
      .from("news_tag_relations")
      .select(`
        news_id,
        tag:news_tags(*)
      `)
      .in("news_id", newsIds)

    // 뉴스별 태그 그룹화
    const tagsMap = new Map()
    if (tagRelationsData) {
      tagRelationsData.forEach((relation) => {
        if (!tagsMap.has(relation.news_id)) {
          tagsMap.set(relation.news_id, [])
        }
        tagsMap.get(relation.news_id).push(relation.tag)
      })
    }

    // 결과 조합
    return newsData.map((news) => ({
      ...news,
      category: categoriesMap.get(news.category_id) || null,
      tags: tagsMap.get(news.id) || [],
    }))
  } catch (error) {
    console.error("뉴스 목록 조회 오류:", error)
    // Return empty array instead of throwing error to prevent app crash
    return []
  }
}

// 뉴스 카테고리 조회
export async function getNewsCategories(): Promise<NewsCategory[]> {
  const client = checkSupabase()

  try {
    const { data, error } = await client.from("news_categories").select("*").order("name")

    if (error) {
      // Check if table doesn't exist
      if (error.message.includes("does not exist") || error.code === "42P01") {
        console.log("News categories table does not exist")
        return []
      }
      throw new Error(`뉴스 카테고리 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("뉴스 카테고리 조회 오류:", error)
    // Return empty array instead of throwing error to prevent app crash
    return []
  }
}

// 뉴스 태그 조회
export async function getNewsTags(): Promise<NewsTag[]> {
  const client = checkSupabase()

  try {
    const { data, error } = await client.from("news_tags").select("*").order("name")

    if (error) {
      // Check if table doesn't exist
      if (error.message.includes("does not exist") || error.code === "42P01") {
        console.log("News tags table does not exist")
        return []
      }
      throw new Error(`뉴스 태그 조회 실패: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("뉴스 태그 조회 오류:", error)
    // Return empty array instead of throwing error to prevent app crash
    return []
  }
}

// 뉴스에 태그 추가
async function addTagsToNews(newsId: number, tagNames: string[]): Promise<void> {
  const client = checkSupabase()

  if (!tagNames.length) return

  try {
    // 태그 생성 또는 조회
    const tagIds: number[] = []

    for (const tagName of tagNames) {
      if (!tagName.trim()) continue

      // 기존 태그 확인
      const { data: existingTag, error: tagSelectError } = await client
        .from("news_tags")
        .select("id")
        .eq("name", tagName.trim())
        .single()

      if (!tagSelectError && existingTag) {
        tagIds.push(existingTag.id)
      } else {
        // 새 태그 생성
        const { data: newTag, error: tagInsertError } = await client
          .from("news_tags")
          .insert({ name: tagName.trim() })
          .select("id")
          .single()

        if (!tagInsertError && newTag) {
          tagIds.push(newTag.id)
        }
      }
    }

    // 태그 관계 생성
    if (tagIds.length > 0) {
      const relations = tagIds.map((tagId) => ({
        news_id: newsId,
        tag_id: tagId,
      }))

      await client.from("news_tag_relations").insert(relations)
    }
  } catch (error) {
    console.error("태그 추가 오류:", error)
  }
}

// 뉴스 태그 업데이트 (트랜잭션)
async function updateNewsTagsTransaction(newsId: number, tagNames: string[]): Promise<void> {
  const client = checkSupabase()

  try {
    // 기존 태그 관계 삭제
    await client.from("news_tag_relations").delete().eq("news_id", newsId)

    // 새 태그 추가
    if (tagNames.length > 0) {
      await addTagsToNews(newsId, tagNames)
    }
  } catch (error) {
    console.error("태그 업데이트 오류:", error)
  }
}

// Add a function to check if news tables exist
export async function checkNewsTablesExist(): Promise<boolean> {
  const client = checkSupabase()

  try {
    // Try to query the news table with a limit to check if it exists
    const { error } = await client.from("news").select("id").limit(1)

    if (error) {
      if (error.message.includes("does not exist") || error.code === "42P01") {
        return false
      }
    }

    return true
  } catch (error) {
    console.error("뉴스 테이블 존재 확인 오류:", error)
    return false
  }
}
