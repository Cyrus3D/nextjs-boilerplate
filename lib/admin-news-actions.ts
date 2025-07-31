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

// Scrape web content from URL
async function scrapeWebContent(url: string): Promise<{
  title: string
  content: string
  description: string
  image: string
}> {
  try {
    console.log("Scraping content from URL:", url)

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      timeout: 10000,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    console.log("HTML content length:", html.length)

    // Extract title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
    let title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : ""

    // Try og:title if regular title is not good enough
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    if (ogTitleMatch && ogTitleMatch[1].length > title.length) {
      title = ogTitleMatch[1]
    }

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    let description = descMatch ? descMatch[1] : ""

    // Try og:description if regular description is not available
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    if (ogDescMatch && (!description || ogDescMatch[1].length > description.length)) {
      description = ogDescMatch[1]
    }

    // Extract image
    const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    const image = imgMatch ? imgMatch[1] : ""

    // Extract main content by removing scripts, styles, and other non-content elements
    let content = html
      .replace(/<script[^>]*>.*?<\/script>/gis, "")
      .replace(/<style[^>]*>.*?<\/style>/gis, "")
      .replace(/<nav[^>]*>.*?<\/nav>/gis, "")
      .replace(/<header[^>]*>.*?<\/header>/gis, "")
      .replace(/<footer[^>]*>.*?<\/footer>/gis, "")
      .replace(/<aside[^>]*>.*?<\/aside>/gis, "")
      .replace(/<!--.*?-->/gs, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    // Clean up HTML entities
    content = content
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

    console.log("Extracted data:", {
      title: title.substring(0, 100),
      contentLength: content.length,
      descriptionLength: description.length,
    })

    return {
      title: title || "제목 없음",
      content: content.substring(0, 8000), // Limit content length
      description: description || "",
      image: image || "",
    }
  } catch (error) {
    console.error("Error scraping web content:", error)
    throw new Error(`웹 콘텐츠를 가져올 수 없습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
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

// Delete news (soft delete)
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

// News form data type
export interface NewsFormData {
  title: string
  content: string
  summary?: string
  category_id?: number
  author?: string
  source_url?: string
  image_url?: string
  is_featured: boolean
  is_active: boolean
  published_at?: string
  original_language: string
  is_translated: boolean
  tag_names: string[]
}

// News article type for admin
export interface NewsArticle {
  id: number
  title: string
  content: string
  summary?: string
  category_id?: number
  category?: { id: number; name: string; color_class?: string }
  author?: string
  source_url?: string
  image_url?: string
  is_featured: boolean
  is_active: boolean
  published_at: string
  original_language: string
  is_translated: boolean
  view_count: number
  created_at: string
  updated_at: string
  tags?: { id: number; name: string }[]
}

// News category type
export interface NewsCategory {
  id: number
  name: string
  color_class?: string
}

// News tag type
export interface NewsTag {
  id: number
  name: string
}

// Check if news tables exist
export async function checkNewsTablesExist(): Promise<boolean> {
  if (!supabase) {
    return false
  }

  try {
    const { error } = await supabase.from("news").select("id").limit(1)
    return !error
  } catch (error) {
    console.error("Error checking news tables:", error)
    return false
  }
}

// Get news for admin with manual joins to avoid relationship errors
export async function getNewsForAdmin(): Promise<NewsArticle[]> {
  if (!supabase) {
    return []
  }

  try {
    // First, get all news articles
    const { data: newsData, error: newsError } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })

    if (newsError) {
      console.error("Error fetching news:", newsError)
      return []
    }

    if (!Array.isArray(newsData) || newsData.length === 0) {
      return []
    }

    // Get all categories
    const { data: categoriesData } = await supabase.from("news_categories").select("*")

    const categoriesMap = new Map()
    if (Array.isArray(categoriesData)) {
      categoriesData.forEach((cat) => {
        categoriesMap.set(cat.id, cat)
      })
    }

    // Get all tags relationships
    const { data: tagRelationsData } = await supabase.from("news_tag_relations").select(`
        news_id,
        tag_id,
        news_tags(id, name)
      `)

    const tagsMap = new Map()
    if (Array.isArray(tagRelationsData)) {
      tagRelationsData.forEach((relation) => {
        if (!tagsMap.has(relation.news_id)) {
          tagsMap.set(relation.news_id, [])
        }
        if (relation.news_tags) {
          tagsMap.get(relation.news_id).push(relation.news_tags)
        }
      })
    }

    // Combine the data
    const result = newsData.map((news) => ({
      ...news,
      category: news.category_id ? categoriesMap.get(news.category_id) || null : null,
      tags: tagsMap.get(news.id) || [],
    }))

    return result
  } catch (error) {
    console.error("Error fetching news for admin:", error)
    return []
  }
}

// Get news categories
export async function getNewsCategories(): Promise<NewsCategory[]> {
  if (!supabase) {
    return []
  }

  try {
    const { data, error } = await supabase.from("news_categories").select("*").order("name")

    if (error) {
      console.error("Error fetching news categories:", error)
      return []
    }

    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching news categories:", error)
    return []
  }
}

// Get news tags
export async function getNewsTags(): Promise<NewsTag[]> {
  if (!supabase) {
    return []
  }

  try {
    const { data, error } = await supabase.from("news_tags").select("*").order("name")

    if (error) {
      console.error("Error fetching news tags:", error)
      return []
    }

    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching news tags:", error)
    return []
  }
}

// Analyze news from URL - Enhanced with automatic Korean translation
export async function analyzeNewsFromUrl(url: string): Promise<{
  title: string
  content: string
  summary: string
  category: string
  author?: string
  language: string
  tags: string[]
}> {
  try {
    console.log("Starting news analysis for URL:", url)

    // Step 1: Scrape the web content
    const scrapedData = await scrapeWebContent(url)
    console.log("Scraped data received:", {
      titleLength: scrapedData.title.length,
      contentLength: scrapedData.content.length,
    })

    // Step 2: Use AI to analyze and structure the content
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `당신은 뉴스 콘텐츠 분석 전문가입니다. 
      주어진 웹페이지에서 추출된 내용을 분석하여 구조화된 뉴스 정보를 제공해주세요.
      
      다음 JSON 형식으로 정확히 응답해주세요:
      {
        "title": "정리된 뉴스 제목",
        "content": "정리된 본문 내용 (최소 200자 이상)",
        "summary": "3-4문장의 핵심 요약",
        "category": "정치|경제|사회|문화|스포츠|기술|국제|생활 중 하나",
        "author": "작성자명 (있는 경우, 없으면 null)",
        "language": "ko|en|th 중 하나 (원본 언어)",
        "tags": ["관련태그1", "관련태그2", "관련태그3"]
      }
      
      - 제목은 명확하고 간결하게 정리
      - 본문은 중요한 내용만 정리하되 충분한 정보 포함
      - 요약은 핵심 내용을 3-4문장으로 압축
      - 카테고리는 내용에 가장 적합한 것으로 선택
      - 태그는 검색에 유용한 키워드로 3-5개 선정
      - language는 원본 콘텐츠의 언어를 정확히 감지`,
      prompt: `웹페이지 제목: ${scrapedData.title}

웹페이지 설명: ${scrapedData.description}

웹페이지 본문:
${scrapedData.content}

위 내용을 분석하여 구조화된 뉴스 정보를 JSON 형식으로 제공해주세요.`,
      maxTokens: 2000,
    })

    console.log("AI analysis response:", text.substring(0, 200) + "...")

    try {
      const result = JSON.parse(text)

      // Validate and clean the result
      let cleanResult = {
        title: String(result.title || scrapedData.title || "제목 없음").trim(),
        content: String(result.content || scrapedData.content || "내용 없음").trim(),
        summary: String(result.summary || scrapedData.description || "요약 없음").trim(),
        category: String(result.category || "일반").trim(),
        author: result.author ? String(result.author).trim() : undefined,
        language: String(result.language || "ko").trim(),
        tags: Array.isArray(result.tags) ? result.tags.map((tag: any) => String(tag).trim()).filter(Boolean) : [],
      }

      // Step 3: Enhanced translation to Korean if not already in Korean
      if (cleanResult.language !== "ko") {
        console.log(`Translating content from ${cleanResult.language} to Korean...`)

        try {
          // Translate all fields in parallel for better performance
          const [translatedTitle, translatedContent, translatedSummary, translatedAuthor, ...translatedTags] =
            await Promise.all([
              // Translate title
              generateText({
                model: openai("gpt-4o"),
                system:
                  "당신은 전문 번역가입니다. 뉴스 제목을 자연스러운 한국어로 번역해주세요. 간결하고 명확하게 번역해주세요.",
                prompt: `다음 ${cleanResult.language === "th" ? "태국어" : "영어"} 뉴스 제목을 한국어로 번역해주세요:\n\n${cleanResult.title}`,
              }).then((result) => result.text.trim()),

              // Translate content
              generateText({
                model: openai("gpt-4o"),
                system:
                  "당신은 전문 번역가입니다. 뉴스 본문을 자연스러운 한국어로 번역해주세요. 원문의 의미와 뉘앙스를 정확히 전달하되, 한국어로 읽기 자연스럽게 번역해주세요.",
                prompt: `다음 ${cleanResult.language === "th" ? "태국어" : "영어"} 뉴스 본문을 한국어로 번역해주세요:\n\n${cleanResult.content}`,
              }).then((result) => result.text.trim()),

              // Translate summary
              generateText({
                model: openai("gpt-4o"),
                system: "당신은 전문 번역가입니다. 뉴스 요약을 자연스러운 한국어로 번역해주세요.",
                prompt: `다음 ${cleanResult.language === "th" ? "태국어" : "영어"} 뉴스 요약을 한국어로 번역해주세요:\n\n${cleanResult.summary}`,
              }).then((result) => result.text.trim()),

              // Translate author name if exists
              cleanResult.author
                ? generateText({
                    model: openai("gpt-4o"),
                    system: "작성자 이름을 한국어 표기법에 맞게 변환해주세요. 이미 한국어라면 그대로 반환해주세요.",
                    prompt: `다음 ${cleanResult.language === "th" ? "태국어" : "영어"} 작성자 이름을 한국어로 변환해주세요:\n\n${cleanResult.author}`,
                  }).then((result) => result.text.trim())
                : Promise.resolve(cleanResult.author),

              // Translate tags
              ...cleanResult.tags.map((tag) =>
                generateText({
                  model: openai("gpt-4o"),
                  system: "태그를 한국어로 번역해주세요. 간단한 키워드 형태로 번역해주세요.",
                  prompt: `다음 ${cleanResult.language === "th" ? "태국어" : "영어"} 태그를 한국어로 번역해주세요:\n\n${tag}`,
                }).then((result) => result.text.trim()),
              ),
            ])

          // Update result with all translations
          cleanResult = {
            ...cleanResult,
            title: translatedTitle,
            content: translatedContent,
            summary: translatedSummary,
            author: translatedAuthor,
            tags: translatedTags,
            language: "ko", // Update language to Korean after translation
          }

          console.log("All content successfully translated to Korean")
        } catch (translationError) {
          console.error("Error during translation:", translationError)
          // Continue with original content if translation fails
          console.log("Continuing with original content due to translation failure")
        }
      }

      console.log("Final analysis result:", {
        title: cleanResult.title.substring(0, 50) + "...",
        contentLength: cleanResult.content.length,
        summaryLength: cleanResult.summary.length,
        category: cleanResult.category,
        language: cleanResult.language,
        tagsCount: cleanResult.tags.length,
      })

      return cleanResult
    } catch (parseError) {
      console.error("Error parsing AI response as JSON:", parseError)
      console.log("Raw AI response:", text)

      // Fallback to scraped data if JSON parsing fails
      return {
        title: scrapedData.title || "제목 없음",
        content: scrapedData.content || "내용 없음",
        summary: scrapedData.description || "요약 없음",
        category: "일반",
        language: "ko",
        tags: ["뉴스"],
      }
    }
  } catch (error) {
    console.error("Error analyzing news from URL:", error)
    throw new Error(`뉴스 URL 분석에 실패했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// Translate news content
export async function translateNews(
  content: string,
  originalLanguage: string,
): Promise<{
  translatedContent: string
  detectedLanguage: string
}> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `당신은 전문 번역가입니다. 주어진 텍스트를 한국어로 번역해주세요.
      원문의 의미와 뉘앙스를 정확히 전달하되, 자연스러운 한국어로 번역해주세요.
      뉴스 기사의 경우 정확성과 객관성을 유지해주세요.`,
      prompt: `다음 텍스트를 한국어로 번역해주세요:\n\n${content}`,
    })

    return {
      translatedContent: text,
      detectedLanguage: originalLanguage,
    }
  } catch (error) {
    console.error("Error translating news:", error)
    throw new Error("번역에 실패했습니다.")
  }
}

// Create news
export async function createNews(newsData: NewsFormData): Promise<NewsArticle> {
  if (!supabase) {
    throw new Error("데이터베이스 연결이 없습니다.")
  }

  try {
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from("news")
      .insert({
        title: newsData.title,
        content: newsData.content,
        summary: newsData.summary || null,
        category_id: newsData.category_id || null,
        author: newsData.author || null,
        source_url: newsData.source_url || null,
        image_url: newsData.image_url || null,
        is_featured: newsData.is_featured,
        is_active: newsData.is_active,
        published_at: newsData.published_at || now,
        original_language: newsData.original_language,
        is_translated: newsData.is_translated,
        view_count: 0,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error creating news:", error)
      throw new Error(`뉴스 생성 중 데이터베이스 오류: ${error.message}`)
    }

    // Handle tags if provided
    if (newsData.tag_names && newsData.tag_names.length > 0) {
      await handleNewsTags(data.id, newsData.tag_names)
    }

    return data as NewsArticle
  } catch (error) {
    console.error("Error creating news:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("뉴스 생성에 실패했습니다.")
  }
}

// Update news
export async function updateNews(id: number, newsData: NewsFormData): Promise<NewsArticle> {
  if (!supabase) {
    throw new Error("데이터베이스 연결이 없습니다.")
  }

  try {
    const { data, error } = await supabase
      .from("news")
      .update({
        title: newsData.title,
        content: newsData.content,
        summary: newsData.summary || null,
        category_id: newsData.category_id || null,
        author: newsData.author || null,
        source_url: newsData.source_url || null,
        image_url: newsData.image_url || null,
        is_featured: newsData.is_featured,
        is_active: newsData.is_active,
        published_at: newsData.published_at,
        original_language: newsData.original_language,
        is_translated: newsData.is_translated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Database error updating news:", error)
      throw new Error(`뉴스 업데이트 중 데이터베이스 오류: ${error.message}`)
    }

    // Handle tags if provided
    if (newsData.tag_names) {
      await handleNewsTags(id, newsData.tag_names)
    }

    return data as NewsArticle
  } catch (error) {
    console.error("Error updating news:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("뉴스 업데이트에 실패했습니다.")
  }
}

// Handle news tags (create tags and link them)
async function handleNewsTags(newsId: number, tagNames: string[]): Promise<void> {
  if (!supabase || !tagNames.length) return

  try {
    // First, remove existing tag associations
    await supabase.from("news_tag_relations").delete().eq("news_id", newsId)

    // Create or get tags
    for (const tagName of tagNames) {
      if (!tagName.trim()) continue

      // Try to get existing tag
      const { data: existingTag } = await supabase.from("news_tags").select("id").eq("name", tagName.trim()).single()

      let tagId: number

      if (existingTag) {
        tagId = existingTag.id
      } else {
        // Create new tag
        const { data: newTag, error } = await supabase
          .from("news_tags")
          .insert({ name: tagName.trim() })
          .select("id")
          .single()

        if (error) throw error
        tagId = newTag.id
      }

      // Link tag to news
      await supabase.from("news_tag_relations").insert({
        news_id: newsId,
        tag_id: tagId,
      })
    }
  } catch (error) {
    console.error("Error handling news tags:", error)
  }
}

// Check if news tables exist and refresh schema if needed
export async function checkAndRefreshNewsSchema(): Promise<boolean> {
  if (!supabase) {
    return false
  }

  try {
    // Try to select from news table to check if it exists
    const { data, error } = await supabase
      .from("news")
      .select("id, title, content, author, original_language, is_translated")
      .limit(1)

    if (error) {
      console.error("News table schema error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error checking news schema:", error)
    return false
  }
}
