"use server"

import { supabase } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { NewsItem } from "@/types/news"

// Increment news view count
export async function incrementNewsViewCount(newsId: number): Promise<void> {
  if (!supabase) {
    console.log("Supabase not configured, skipping news view count update")
    return
  }

  try {
    // Get current view count
    const { data: currentData, error: fetchError } = await supabase
      .from("news")
      .select("view_count")
      .eq("id", newsId)
      .single()

    if (fetchError) {
      console.error("Error fetching current news view count:", fetchError)
      return
    }

    const currentViewCount = Number(currentData?.view_count) || 0

    // Update view count
    const { error: updateError } = await supabase
      .from("news")
      .update({
        view_count: currentViewCount + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", newsId)

    if (updateError) {
      console.error("Error updating news view count:", updateError)
    }
  } catch (error) {
    console.error("Error incrementing news view count:", error)
  }
}

// Analyze news content with AI
export async function analyzeNewsWithAI(content: string, title: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `당신은 태국 현지 뉴스를 분석하는 전문가입니다. 
      주어진 뉴스 내용을 분석하여 다음 사항들을 포함한 분석을 제공해주세요:
      1. 주요 내용 요약
      2. 태국 거주 한국인들에게 미치는 영향
      3. 주목해야 할 포인트
      4. 관련 배경 정보
      
      분석은 한국어로 작성하고, 명확하고 이해하기 쉽게 작성해주세요.`,
      prompt: `뉴스 제목: ${title}\n\n뉴스 내용: ${content}`,
    })

    return text
  } catch (error) {
    console.error("Error analyzing news with AI:", error)
    return "AI 분석을 수행할 수 없습니다."
  }
}

// Translate content to Korean
export async function translateToKorean(content: string, language = "th"): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `당신은 전문 번역가입니다. 주어진 텍스트를 자연스러운 한국어로 번역해주세요. 
      원문의 의미와 뉘앙스를 정확히 전달하되, 한국어로 읽기 자연스럽게 번역해주세요.
      뉴스 기사의 경우 정확성과 객관성을 유지해주세요.`,
      prompt: `다음 ${language === "th" ? "태국어" : "영어"} 텍스트를 한국어로 번역해주세요:\n\n${content}`,
    })

    return text
  } catch (error) {
    console.error("Error translating content:", error)
    return content // Return original content if translation fails
  }
}

// Extract tags from content
export async function extractTagsFromContent(title: string, content: string): Promise<string[]> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `당신은 뉴스 콘텐츠에서 관련 태그를 추출하는 전문가입니다.
      주어진 뉴스 제목과 내용을 분석하여 관련성이 높은 태그들을 추출해주세요.
      태그는 한국어로 작성하고, 쉼표로 구분하여 최대 10개까지 제공해주세요.
      태그는 구체적이고 검색에 유용한 키워드여야 합니다.`,
      prompt: `뉴스 제목: ${title}\n\n뉴스 내용: ${content.substring(0, 1000)}...`,
    })

    // Parse tags from AI response
    const tags = text
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0 && tag.length < 20)
      .slice(0, 10)

    return tags
  } catch (error) {
    console.error("Error extracting tags:", error)
    return []
  }
}

// Create or update news item
export async function createOrUpdateNews(newsData: Partial<NewsItem>): Promise<NewsItem | null> {
  if (!supabase) {
    console.log("Supabase not configured")
    return null
  }

  try {
    const now = new Date().toISOString()

    // Prepare data for insertion/update
    const data = {
      title: String(newsData.title || ""),
      summary: newsData.summary ? String(newsData.summary) : null,
      content: newsData.content ? String(newsData.content) : null,
      content_ko: newsData.content_ko ? String(newsData.content_ko) : null,
      source: newsData.source ? String(newsData.source) : null,
      source_url: newsData.source_url ? String(newsData.source_url) : null,
      author: newsData.author ? String(newsData.author) : null,
      published_at: newsData.published_at ? String(newsData.published_at) : now,
      category: newsData.category ? String(newsData.category) : "일반",
      tags: Array.isArray(newsData.tags) ? newsData.tags : [],
      language: newsData.language ? String(newsData.language) : "th",
      location: newsData.location ? String(newsData.location) : null,
      ai_analysis: newsData.ai_analysis ? String(newsData.ai_analysis) : null,
      reading_time: newsData.reading_time ? Number(newsData.reading_time) : null,
      view_count: Number(newsData.view_count) || 0,
      is_featured: Boolean(newsData.is_featured),
      is_active: Boolean(newsData.is_active ?? true),
      updated_at: now,
    }

    let result
    if (newsData.id) {
      // Update existing news
      const { data: updatedData, error } = await supabase
        .from("news")
        .update(data)
        .eq("id", newsData.id)
        .select()
        .single()

      if (error) throw error
      result = updatedData
    } else {
      // Create new news
      const { data: newData, error } = await supabase
        .from("news")
        .insert({ ...data, created_at: now })
        .select()
        .single()

      if (error) throw error
      result = newData
    }

    return result as NewsItem
  } catch (error) {
    console.error("Error creating/updating news:", error)
    return null
  }
}

// Get news by ID
export async function getNewsById(id: number): Promise<NewsItem | null> {
  if (!supabase) {
    return null
  }

  try {
    const { data, error } = await supabase.from("news").select("*").eq("id", id).eq("is_active", true).single()

    if (error) throw error

    return data as NewsItem
  } catch (error) {
    console.error("Error fetching news by ID:", error)
    return null
  }
}

// Get paginated news
export async function getNewsPaginated(
  page = 1,
  limit = 20,
  filters: {
    category?: string
    search?: string
    language?: string
    is_featured?: boolean
  } = {},
): Promise<{ news: NewsItem[]; total: number; hasMore: boolean }> {
  if (!supabase) {
    return { news: [], total: 0, hasMore: false }
  }

  try {
    let query = supabase
      .from("news")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .order("published_at", { ascending: false })

    // Apply filters
    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category)
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`,
      )
    }

    if (filters.language) {
      query = query.eq("language", filters.language)
    }

    if (filters.is_featured !== undefined) {
      query = query.eq("is_featured", filters.is_featured)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      news: Array.isArray(data) ? (data as NewsItem[]) : [],
      total: count || 0,
      hasMore: (count || 0) > page * limit,
    }
  } catch (error) {
    console.error("Error fetching paginated news:", error)
    return { news: [], total: 0, hasMore: false }
  }
}

// Delete news
export async function deleteNews(id: number): Promise<boolean> {
  if (!supabase) {
    return false
  }

  try {
    const { error } = await supabase
      .from("news")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) throw error

    return true
  } catch (error) {
    console.error("Error deleting news:", error)
    return false
  }
}

// Scrape and process news from URL
export async function scrapeAndProcessNews(url: string): Promise<NewsItem | null> {
  try {
    // This would typically use a web scraping service
    // For now, we'll return a placeholder
    console.log("Scraping news from URL:", url)

    // In a real implementation, you would:
    // 1. Fetch the webpage content
    // 2. Extract title, content, author, etc.
    // 3. Detect language
    // 4. Translate if needed
    // 5. Generate AI analysis
    // 6. Extract tags
    // 7. Save to database

    return null
  } catch (error) {
    console.error("Error scraping news:", error)
    return null
  }
}
