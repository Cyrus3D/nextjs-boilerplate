import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// 웹 스크래핑을 위한 간단한 HTML 파싱 함수
async function scrapeWebContent(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()

    // 기본적인 HTML 태그 제거 및 텍스트 추출
    const textContent = html
      .replace(/<script[^>]*>.*?<\/script>/gis, "")
      .replace(/<style[^>]*>.*?<\/style>/gis, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    // 제목 추출 시도
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : ""

    // 메타 설명 추출 시도
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    const description = descMatch ? descMatch[1] : ""

    // 이미지 추출 시도
    const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    const image = imgMatch ? imgMatch[1] : ""

    return {
      title,
      content: textContent.substring(0, 5000), // 처음 5000자만
      description,
      image,
      url,
    }
  } catch (error) {
    console.error("Error scraping web content:", error)
    throw new Error("Failed to scrape web content")
  }
}

// AI를 사용한 뉴스 분석
async function analyzeNewsWithAI(scrapedData: any) {
  try {
    const prompt = `
다음 웹페이지 내용을 분석하여 뉴스 기사로 정리해주세요:

제목: ${scrapedData.title}
설명: ${scrapedData.description}
내용: ${scrapedData.content}

다음 JSON 형식으로 응답해주세요:
{
  "title": "정리된 제목",
  "summary": "3-4문장의 요약",
  "content": "정리된 본문 내용",
  "category": "정치|경제|사회|문화|스포츠|국제|생활|기술 중 하나",
  "tags": ["태그1", "태그2", "태그3"],
  "author": "작성자명 (있는 경우)",
  "language": "ko"
}

한국어로 작성하고, 객관적이고 정확한 정보만 포함해주세요.
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
    })

    // JSON 파싱 시도
    try {
      const analysisResult = JSON.parse(text)
      return analysisResult
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError)
      // JSON 파싱 실패 시 기본값 반환
      return {
        title: scrapedData.title || "제목 없음",
        summary: scrapedData.description || "요약 없음",
        content: scrapedData.content || "내용 없음",
        category: "기타",
        tags: ["뉴스"],
        author: null,
        language: "ko",
      }
    }
  } catch (error) {
    console.error("Error analyzing news with AI:", error)
    throw new Error("Failed to analyze news with AI")
  }
}

// 카테고리 ID 찾기 또는 생성
async function findOrCreateCategory(supabase: any, categoryName: string) {
  try {
    // 기존 카테고리 찾기
    const { data: existingCategory } = await supabase
      .from("news_categories")
      .select("id")
      .eq("name", categoryName)
      .single()

    if (existingCategory) {
      return existingCategory.id
    }

    // 새 카테고리 생성
    const { data: newCategory, error } = await supabase
      .from("news_categories")
      .insert([
        {
          name: categoryName,
          color_class: "bg-gray-100 text-gray-800",
          is_active: true,
        },
      ])
      .select("id")
      .single()

    if (error) {
      console.error("Error creating category:", error)
      return null
    }

    return newCategory.id
  } catch (error) {
    console.error("Error in findOrCreateCategory:", error)
    return null
  }
}

// 태그 ID들 찾기 또는 생성
async function findOrCreateTags(supabase: any, tagNames: string[]) {
  try {
    const tagIds = []

    for (const tagName of tagNames) {
      // 기존 태그 찾기
      const { data: existingTag } = await supabase.from("news_tags").select("id").eq("name", tagName).single()

      if (existingTag) {
        tagIds.push(existingTag.id)
      } else {
        // 새 태그 생성
        const { data: newTag, error } = await supabase
          .from("news_tags")
          .insert([{ name: tagName }])
          .select("id")
          .single()

        if (!error && newTag) {
          tagIds.push(newTag.id)
        }
      }
    }

    return tagIds
  } catch (error) {
    console.error("Error in findOrCreateTags:", error)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 })
    }

    // URL 유효성 검사
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ success: false, error: "Invalid URL format" }, { status: 400 })
    }

    console.log("Starting news analysis for URL:", url)

    // 1. 웹 콘텐츠 스크래핑
    const scrapedData = await scrapeWebContent(url)
    console.log("Scraped data:", { title: scrapedData.title, contentLength: scrapedData.content.length })

    // 2. AI 분석
    const analysisResult = await analyzeNewsWithAI(scrapedData)
    console.log("AI analysis result:", analysisResult)

    // 3. 데이터베이스에 저장
    const supabase = createClient()

    // 카테고리 ID 찾기/생성
    const categoryId = await findOrCreateCategory(supabase, analysisResult.category)

    // 뉴스 저장
    const { data: newsData, error: newsError } = await supabase
      .from("news")
      .insert([
        {
          title: analysisResult.title,
          summary: analysisResult.summary,
          content: analysisResult.content,
          category_id: categoryId,
          author: analysisResult.author,
          source_url: url,
          image_url: scrapedData.image || null,
          published_at: new Date().toISOString(),
          view_count: 0,
          is_featured: false,
          is_active: true,
          original_language: analysisResult.language || "ko",
          is_translated: false,
        },
      ])
      .select()
      .single()

    if (newsError) {
      console.error("Error saving news:", newsError)
      return NextResponse.json({ success: false, error: "Failed to save news to database" }, { status: 500 })
    }

    // 태그 처리
    if (analysisResult.tags && analysisResult.tags.length > 0) {
      const tagIds = await findOrCreateTags(supabase, analysisResult.tags)

      // 뉴스-태그 관계 저장
      if (tagIds.length > 0) {
        const newsTagRelations = tagIds.map((tagId) => ({
          news_id: newsData.id,
          tag_id: tagId,
        }))

        await supabase.from("news_tag_relations").insert(newsTagRelations)
      }
    }

    console.log("News saved successfully:", newsData.id)

    return NextResponse.json({
      success: true,
      data: {
        id: newsData.id,
        title: newsData.title,
        summary: newsData.summary,
        category: analysisResult.category,
        tags: analysisResult.tags,
      },
      message: "News analyzed and saved successfully",
    })
  } catch (error) {
    console.error("Error in scrape-news API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
