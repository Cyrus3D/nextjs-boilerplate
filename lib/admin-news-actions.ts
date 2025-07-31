"use server"

import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

interface ScrapedContent {
  title: string
  content: string
  description: string
  imageUrl: string
  finalUrl: string
  source: string
  scrapedAt: string
}

interface AnalyzedNews {
  title: string
  summary: string
  content: string
  category: string
  tags: string[]
  imageUrl: string
  originalUrl: string
  source: string
  publishedAt: string
  viewCount: number
  sentiment: "positive" | "negative" | "neutral"
  importance: number
}

export async function analyzeNewsFromUrl(url: string): Promise<AnalyzedNews> {
  try {
    console.log("뉴스 분석 시작:", url)

    // 1. 웹 스크래핑
    const scrapeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/scrape-news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!scrapeResponse.ok) {
      const errorData = await scrapeResponse.json()
      throw new Error(`스크래핑 실패: ${errorData.error || scrapeResponse.statusText}`)
    }

    const scrapedData: ScrapedContent = await scrapeResponse.json()
    console.log("스크래핑 완료:", {
      title: scrapedData.title.substring(0, 50) + "...",
      contentLength: scrapedData.content.length,
      source: scrapedData.source,
    })

    // 2. 콘텐츠 검증
    if (!scrapedData.title || scrapedData.title.length < 5) {
      throw new Error("제목이 너무 짧거나 없습니다.")
    }

    if (!scrapedData.content || scrapedData.content.length < 100) {
      throw new Error("본문 내용이 충분하지 않습니다.")
    }

    // 리다이렉트 콘텐츠 감지
    const redirectPatterns = [/redirecting/i, /please wait/i, /loading/i, /잠시만 기다려/i, /리다이렉트/i]

    const isRedirectContent = redirectPatterns.some(
      (pattern) => pattern.test(scrapedData.title) || pattern.test(scrapedData.content),
    )

    if (isRedirectContent) {
      throw new Error("리다이렉트 페이지입니다. 실제 뉴스 콘텐츠를 가져올 수 없습니다.")
    }

    // 3. AI 분석을 위한 콘텐츠 준비 (토큰 제한 고려)
    const analysisContent = {
      title: scrapedData.title.substring(0, 200),
      content: scrapedData.content.substring(0, 3000), // 토큰 제한
      description: scrapedData.description.substring(0, 500),
    }

    console.log("AI 분석 시작...")

    // 4. AI 분석
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `당신은 한국어 뉴스 분석 전문가입니다. 주어진 뉴스 기사를 분석하여 정확한 JSON 형식으로 응답해주세요.

응답은 반드시 다음 JSON 형식을 정확히 따라야 합니다:
{
  "title": "기사 제목",
  "summary": "3-4문장의 요약",
  "content": "주요 내용 정리",
  "category": "정치|경제|사회|문화|스포츠|국제|생활|기술 중 하나",
  "tags": ["태그1", "태그2", "태그3"],
  "sentiment": "positive|negative|neutral 중 하나",
  "importance": 1-10 사이의 숫자
}

JSON 외의 다른 텍스트는 포함하지 마세요.`,
      prompt: `다음 뉴스 기사를 분석해주세요:

제목: ${analysisContent.title}

내용: ${analysisContent.content}

설명: ${analysisContent.description}

위 내용을 분석하여 정확한 JSON 형식으로 응답해주세요.`,
    })

    console.log("AI 응답 원본:", text.substring(0, 200) + "...")

    // 5. JSON 파싱 (여러 단계로 시도)
    let parsedResult: any = null

    try {
      // 첫 번째 시도: 직접 파싱
      parsedResult = JSON.parse(text)
    } catch (error) {
      console.log("직접 JSON 파싱 실패, 정리 후 재시도...")

      try {
        // 두 번째 시도: 텍스트 정리 후 파싱
        const cleanedText = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .replace(/^\s*[\r\n]/gm, "")
          .trim()

        parsedResult = JSON.parse(cleanedText)
      } catch (error2) {
        console.log("정리된 텍스트 파싱도 실패, 수동 추출 시도...")

        try {
          // 세 번째 시도: 정규식으로 JSON 부분 추출
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            parsedResult = JSON.parse(jsonMatch[0])
          } else {
            throw new Error("JSON 형식을 찾을 수 없습니다.")
          }
        } catch (error3) {
          console.error("모든 JSON 파싱 시도 실패:", error3)

          // 폴백: 기본 구조 생성
          parsedResult = {
            title: scrapedData.title,
            summary: scrapedData.description || scrapedData.content.substring(0, 200) + "...",
            content: scrapedData.content.substring(0, 1000),
            category: "사회",
            tags: ["뉴스"],
            sentiment: "neutral",
            importance: 5,
          }
          console.log("폴백 데이터 사용")
        }
      }
    }

    // 6. 결과 검증 및 기본값 설정
    const result: AnalyzedNews = {
      title: parsedResult.title || scrapedData.title,
      summary: parsedResult.summary || scrapedData.description || "요약 정보가 없습니다.",
      content: parsedResult.content || scrapedData.content,
      category: parsedResult.category || "사회",
      tags: Array.isArray(parsedResult.tags) ? parsedResult.tags : ["뉴스"],
      imageUrl: scrapedData.imageUrl || "",
      originalUrl: url,
      source: scrapedData.source,
      publishedAt: new Date().toISOString(),
      viewCount: 0, // 기본값 0으로 설정
      sentiment: parsedResult.sentiment || "neutral",
      importance: typeof parsedResult.importance === "number" ? parsedResult.importance : 5,
    }

    console.log("뉴스 분석 완료:", {
      title: result.title.substring(0, 50) + "...",
      category: result.category,
      tags: result.tags,
      viewCount: result.viewCount,
    })

    return result
  } catch (error) {
    console.error("뉴스 분석 오류:", error)
    throw new Error(`뉴스 분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

export async function saveAnalyzedNews(newsData: AnalyzedNews) {
  try {
    console.log("뉴스 저장 시작:", newsData.title.substring(0, 50) + "...")

    // 뉴스 테이블에 저장
    const { data: newsItem, error: newsError } = await supabase
      .from("news")
      .insert({
        title: newsData.title,
        summary: newsData.summary,
        content: newsData.content,
        category: newsData.category,
        image_url: newsData.imageUrl,
        original_url: newsData.originalUrl,
        source: newsData.source,
        published_at: newsData.publishedAt,
        view_count: newsData.viewCount || 0, // 기본값 보장
        sentiment: newsData.sentiment,
        importance: newsData.importance,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (newsError) {
      console.error("뉴스 저장 오류:", newsError)
      throw new Error(`뉴스 저장 실패: ${newsError.message}`)
    }

    // 태그 저장
    if (newsData.tags && newsData.tags.length > 0) {
      for (const tagName of newsData.tags) {
        if (tagName && tagName.trim()) {
          // 태그가 존재하지 않으면 생성
          const { data: existingTag } = await supabase
            .from("news_tags")
            .select("id")
            .eq("name", tagName.trim())
            .single()

          let tagId = existingTag?.id

          if (!tagId) {
            const { data: newTag, error: tagError } = await supabase
              .from("news_tags")
              .insert({ name: tagName.trim() })
              .select("id")
              .single()

            if (tagError) {
              console.error("태그 생성 오류:", tagError)
              continue
            }
            tagId = newTag.id
          }

          // 뉴스-태그 연결
          await supabase.from("news_tag_relations").insert({
            news_id: newsItem.id,
            tag_id: tagId,
          })
        }
      }
    }

    console.log("뉴스 저장 완료:", newsItem.id)
    return newsItem
  } catch (error) {
    console.error("뉴스 저장 중 오류:", error)
    throw new Error(`뉴스 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

export async function getRecentNews(limit = 10) {
  try {
    const { data, error } = await supabase
      .from("news")
      .select(`
        *,
        news_tag_relations (
          news_tags (
            name
          )
        )
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("뉴스 조회 오류:", error)
      return []
    }

    return (
      data?.map((item) => ({
        ...item,
        tags: item.news_tag_relations?.map((rel: any) => rel.news_tags.name) || [],
        viewCount: item.view_count || 0, // 기본값 보장
      })) || []
    )
  } catch (error) {
    console.error("뉴스 조회 중 오류:", error)
    return []
  }
}

export async function deleteNews(newsId: string) {
  try {
    // 태그 관계 먼저 삭제
    await supabase.from("news_tag_relations").delete().eq("news_id", newsId)

    // 뉴스 삭제
    const { error } = await supabase.from("news").delete().eq("id", newsId)

    if (error) {
      throw new Error(`뉴스 삭제 실패: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error("뉴스 삭제 중 오류:", error)
    throw error
  }
}
