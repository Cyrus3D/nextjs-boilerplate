"use server"

import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { NewsArticle, NewsCategory, NewsTag, AIAnalysisResult } from "@/types/news"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
  tag_names?: string[]
}

// Check if news tables exist
export async function checkNewsTablesExist(): Promise<boolean> {
  try {
    const { error } = await supabase.from("news_articles").select("id").limit(1)

    return !error
  } catch {
    return false
  }
}

// Get news articles for admin
export async function getNewsForAdmin(): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select(`
        *,
        category:news_categories(id, name, color_class),
        tags:news_article_tags(
          tag:news_tags(id, name)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return (data || []).map((article) => ({
      ...article,
      tags: article.tags?.map((t: any) => t.tag).filter(Boolean) || [],
    }))
  } catch (error) {
    console.error("Error fetching news for admin:", error)
    throw error
  }
}

// Get news categories
export async function getNewsCategories(): Promise<NewsCategory[]> {
  try {
    const { data, error } = await supabase.from("news_categories").select("*").order("name")

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching news categories:", error)
    throw error
  }
}

// Get news tags
export async function getNewsTags(): Promise<NewsTag[]> {
  try {
    const { data, error } = await supabase.from("news_tags").select("*").order("name")

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching news tags:", error)
    throw error
  }
}

// Create news article
export async function createNews(formData: NewsFormData): Promise<NewsArticle> {
  try {
    const { data, error } = await supabase
      .from("news_articles")
      .insert({
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        category_id: formData.category_id,
        author: formData.author,
        source_url: formData.source_url,
        image_url: formData.image_url,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        published_at: formData.published_at || new Date().toISOString(),
        original_language: formData.original_language,
        is_translated: formData.is_translated,
      })
      .select()
      .single()

    if (error) throw error

    // Handle tags
    if (formData.tag_names && formData.tag_names.length > 0) {
      await handleNewsTags(data.id, formData.tag_names)
    }

    return data
  } catch (error) {
    console.error("Error creating news:", error)
    throw error
  }
}

// Update news article
export async function updateNews(id: number, formData: NewsFormData): Promise<NewsArticle> {
  try {
    const { data, error } = await supabase
      .from("news_articles")
      .update({
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        category_id: formData.category_id,
        author: formData.author,
        source_url: formData.source_url,
        image_url: formData.image_url,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        published_at: formData.published_at,
        original_language: formData.original_language,
        is_translated: formData.is_translated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Handle tags
    if (formData.tag_names) {
      await handleNewsTags(id, formData.tag_names)
    }

    return data
  } catch (error) {
    console.error("Error updating news:", error)
    throw error
  }
}

// Delete news article
export async function deleteNews(id: number): Promise<void> {
  try {
    // Delete tags first
    await supabase.from("news_article_tags").delete().eq("article_id", id)

    // Delete article
    const { error } = await supabase.from("news_articles").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error("Error deleting news:", error)
    throw error
  }
}

// Handle news tags
async function handleNewsTags(articleId: number, tagNames: string[]): Promise<void> {
  try {
    // Delete existing tags
    await supabase.from("news_article_tags").delete().eq("article_id", articleId)

    if (tagNames.length === 0) return

    // Create or get tags
    const tagIds: number[] = []

    for (const tagName of tagNames) {
      if (!tagName.trim()) continue

      // Try to find existing tag
      const { data: existingTag } = await supabase.from("news_tags").select("id").eq("name", tagName.trim()).single()

      if (existingTag) {
        tagIds.push(existingTag.id)
      } else {
        // Create new tag
        const { data: newTag, error } = await supabase
          .from("news_tags")
          .insert({ name: tagName.trim() })
          .select("id")
          .single()

        if (error) throw error
        if (newTag) tagIds.push(newTag.id)
      }
    }

    // Link tags to article
    if (tagIds.length > 0) {
      const tagLinks = tagIds.map((tagId) => ({
        article_id: articleId,
        tag_id: tagId,
      }))

      await supabase.from("news_article_tags").insert(tagLinks)
    }
  } catch (error) {
    console.error("Error handling news tags:", error)
    throw error
  }
}

// Increment news view count
export async function incrementNewsViewCount(articleId: number): Promise<void> {
  try {
    const { error } = await supabase.rpc("increment_news_view_count", {
      article_id: articleId,
    })

    if (error) throw error
  } catch (error) {
    console.error("Error incrementing news view count:", error)
    // Don't throw error for view count increment failures
  }
}

// Analyze news from URL using AI
export async function analyzeNewsFromUrl(url: string): Promise<AIAnalysisResult> {
  try {
    // Fetch content from URL
    const response = await fetch("/api/scrape-news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`)
    }

    const scrapedData = await response.json()

    if (!scrapedData.success) {
      throw new Error(scrapedData.message || "Failed to scrape content")
    }

    // Use AI to analyze the content
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a news analysis AI. Analyze the provided news content and extract structured information.
      
      Return a JSON object with the following structure:
      {
        "title": "extracted or improved title",
        "summary": "brief summary in 2-3 sentences",
        "content": "cleaned and formatted content",
        "category": "appropriate category (정치, 경제, 사회, 국제, 기술, 스포츠, 문화, 기타)",
        "tags": ["relevant", "tags", "array"],
        "author": "author name if available or null",
        "language": "detected language code (ko, en, th, etc.)"
      }
      
      Guidelines:
      - Clean up the content by removing ads, navigation, and irrelevant text
      - Improve formatting with proper paragraphs
      - Extract meaningful tags (3-5 tags)
      - Detect the primary language of the content
      - If content is in Thai or English, keep it as-is for now
      - Ensure all fields are properly filled`,
      prompt: `Analyze this news content:
      
      Title: ${scrapedData.data.title}
      Content: ${scrapedData.data.content}
      Description: ${scrapedData.data.description}
      URL: ${url}`,
    })

    try {
      const analysisResult = JSON.parse(text)
      return {
        title: analysisResult.title || scrapedData.data.title,
        summary: analysisResult.summary || scrapedData.data.description,
        content: analysisResult.content || scrapedData.data.content,
        category: analysisResult.category || "기타",
        tags: Array.isArray(analysisResult.tags) ? analysisResult.tags : [],
        author: analysisResult.author || null,
        language: analysisResult.language || "ko",
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        title: scrapedData.data.title,
        summary: scrapedData.data.description,
        content: scrapedData.data.content,
        category: "기타",
        tags: [],
        author: null,
        language: "ko",
      }
    }
  } catch (error) {
    console.error("Error analyzing news from URL:", error)
    throw error
  }
}

// Translate news content
export async function translateNews(
  content: string,
  fromLanguage = "auto",
): Promise<{ translatedContent: string; detectedLanguage: string }> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a professional translator. Translate the provided text to Korean while maintaining the original meaning, tone, and structure.
      
      Return a JSON object with:
      {
        "translatedContent": "translated text in Korean",
        "detectedLanguage": "detected source language code (en, th, ja, zh, etc.)"
      }
      
      Guidelines:
      - Maintain paragraph structure
      - Keep proper nouns and names as appropriate
      - Ensure natural Korean flow
      - Preserve any formatting or structure`,
      prompt: `Translate this content to Korean:
      
      ${content}`,
    })

    try {
      const result = JSON.parse(text)
      return {
        translatedContent: result.translatedContent || content,
        detectedLanguage: result.detectedLanguage || fromLanguage,
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        translatedContent: text, // Use the raw response as translation
        detectedLanguage: fromLanguage,
      }
    }
  } catch (error) {
    console.error("Error translating news:", error)
    throw error
  }
}

// Get public news articles (for frontend)
export async function getPublicNews(limit = 20, categoryId?: number, featured?: boolean): Promise<NewsArticle[]> {
  try {
    let query = supabase
      .from("news_articles")
      .select(`
        *,
        category:news_categories(id, name, color_class),
        tags:news_article_tags(
          tag:news_tags(id, name)
        )
      `)
      .eq("is_active", true)
      .order("published_at", { ascending: false })
      .limit(limit)

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    if (featured !== undefined) {
      query = query.eq("is_featured", featured)
    }

    const { data, error } = await query

    if (error) throw error

    return (data || []).map((article) => ({
      ...article,
      tags: article.tags?.map((t: any) => t.tag).filter(Boolean) || [],
    }))
  } catch (error) {
    console.error("Error fetching public news:", error)
    return []
  }
}
