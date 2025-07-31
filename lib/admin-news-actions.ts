"use server"

import { supabase } from "./supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function getNewsArticles() {
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
      .eq("is_active", true)
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching news:", error)
      return []
    }

    return (
      data?.map((article) => ({
        ...article,
        tags: article.tags?.map((t: any) => t.tag) || [],
      })) || []
    )
  } catch (error) {
    console.error("Error in getNewsArticles:", error)
    return []
  }
}

export async function incrementNewsViewCount(newsId: number) {
  try {
    const { error } = await supabase.rpc("increment_news_view_count", {
      news_id: newsId,
    })

    if (error) {
      console.error("Error incrementing view count:", error)
    }
  } catch (error) {
    console.error("Error in incrementNewsViewCount:", error)
  }
}

export async function analyzeNewsUrl(url: string) {
  try {
    // URL 검증
    if (!url || !url.startsWith("http")) {
      throw new Error("유효하지 않은 URL입니다.")
    }

    console.log("Analyzing URL:", url)

    // 웹 스크래핑
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    // 기본 메타데이터 추출
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    const imageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)

    const title = titleMatch?.[1]?.trim() || "No title found"
    const description = descMatch?.[1]?.trim() || ""
    const imageUrl = imageMatch?.[1]?.trim() || null

    // 본문 텍스트 추출 (간단한 방식)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    let bodyText = bodyMatch?.[1] || html

    // HTML 태그 제거
    bodyText = bodyText
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 3000) // 처음 3000자만

    console.log("Extracted content:", { title, description, bodyText: bodyText.substring(0, 200) })

    // AI 분석
    const { text: analysis } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 뉴스 기사를 분석해주세요:

제목: ${title}
설명: ${description}
내용: ${bodyText}

다음 형식으로 JSON 응답해주세요:
{
  "title": "정제된 제목",
  "summary": "3-4문장의 요약",
  "content": "상세 내용 (원본 내용을 정리하여 작성)",
  "category": "정치|경제|사회|문화|스포츠|기술|국제|기타 중 하나",
  "tags": ["태그1", "태그2", "태그3"],
  "author": "작성자명 (추출 가능한 경우)",
  "language": "ko|en|th 중 하나"
}

한국어로 응답해주세요.`,
    })

    console.log("AI Analysis result:", analysis)

    let analysisData
    try {
      analysisData = JSON.parse(analysis)
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      // 파싱 실패 시 기본값 사용
      analysisData = {
        title: title,
        summary: description || bodyText.substring(0, 200) + "...",
        content: bodyText,
        category: "기타",
        tags: ["뉴스"],
        author: null,
        language: "ko",
      }
    }

    // 카테고리 ID 찾기
    const { data: categories } = await supabase.from("news_categories").select("id, name")

    const categoryMap: { [key: string]: number } = {
      정치: 1,
      경제: 2,
      사회: 3,
      문화: 4,
      스포츠: 5,
      기술: 6,
      국제: 7,
      기타: 8,
    }

    const categoryId = categoryMap[analysisData.category] || 8

    // 뉴스 기사 저장
    const { data: newsArticle, error: insertError } = await supabase
      .from("news_articles")
      .insert({
        title: analysisData.title,
        summary: analysisData.summary,
        content: analysisData.content,
        author: analysisData.author,
        source_url: url,
        image_url: imageUrl,
        category_id: categoryId,
        published_at: new Date().toISOString(),
        view_count: 0,
        is_featured: false,
        is_active: true,
        original_language: analysisData.language,
        is_translated: analysisData.language !== "ko",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting news article:", insertError)
      throw new Error("뉴스 기사 저장에 실패했습니다.")
    }

    // 태그 처리
    if (analysisData.tags && analysisData.tags.length > 0) {
      for (const tagName of analysisData.tags) {
        // 태그 존재 확인 또는 생성
        const { data: existingTag } = await supabase.from("news_tags").select("id").eq("name", tagName).single()

        let tagId = existingTag?.id

        if (!tagId) {
          const { data: newTag } = await supabase.from("news_tags").insert({ name: tagName }).select("id").single()

          tagId = newTag?.id
        }

        if (tagId) {
          await supabase.from("news_article_tags").insert({
            article_id: newsArticle.id,
            tag_id: tagId,
          })
        }
      }
    }

    return {
      success: true,
      message: "뉴스 분석이 완료되었습니다.",
      data: newsArticle,
    }
  } catch (error) {
    console.error("Error in analyzeNewsUrl:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "뉴스 분석 중 오류가 발생했습니다.",
      data: null,
    }
  }
}

export async function deleteNewsArticle(id: number) {
  try {
    const { error } = await supabase.from("news_articles").delete().eq("id", id)

    if (error) {
      throw error
    }

    return { success: true, message: "뉴스 기사가 삭제되었습니다." }
  } catch (error) {
    console.error("Error deleting news article:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.",
    }
  }
}

export async function toggleNewsFeature(id: number, featured: boolean) {
  try {
    const { error } = await supabase.from("news_articles").update({ is_featured: featured }).eq("id", id)

    if (error) {
      throw error
    }

    return { success: true, message: "뉴스 추천 상태가 변경되었습니다." }
  } catch (error) {
    console.error("Error toggling news feature:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "상태 변경 중 오류가 발생했습니다.",
    }
  }
}
