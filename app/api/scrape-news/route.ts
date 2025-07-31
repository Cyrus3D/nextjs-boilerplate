import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

interface ScrapedContent {
  title: string
  content: string
  description: string
  imageUrl: string
  finalUrl: string
  source: string
  contentLength: number
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL이 필요합니다." }, { status: 400 })
    }

    console.log(`스크래핑 시작: ${url}`)

    // URL 유효성 검사
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: "유효하지 않은 URL입니다." }, { status: 400 })
    }

    // 웹페이지 가져오기 (리다이렉트 자동 처리)
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      redirect: "follow", // 자동으로 리다이렉트 따라가기
    })

    if (!response.ok) {
      console.error(`HTTP 오류: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `웹페이지를 가져올 수 없습니다: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const html = await response.text()
    const finalUrl = response.url // 최종 리다이렉트된 URL

    console.log(`HTML 가져오기 완료: ${html.length}자, 최종 URL: ${finalUrl}`)

    // HTML 콘텐츠 검증
    if (html.length < 500) {
      return NextResponse.json({ error: "웹페이지 내용이 너무 짧습니다." }, { status: 400 })
    }

    // 리다이렉트 페이지 감지
    const redirectPatterns = [
      /redirecting/i,
      /please wait/i,
      /loading/i,
      /잠시만 기다려/i,
      /리다이렉트/i,
      /javascript.*required/i,
      /enable.*javascript/i,
    ]

    const isRedirectPage = redirectPatterns.some((pattern) => pattern.test(html))

    if (isRedirectPage) {
      console.error("리다이렉트 페이지 감지됨")
      return NextResponse.json({ error: "리다이렉트 페이지입니다. 실제 콘텐츠를 가져올 수 없습니다." }, { status: 400 })
    }

    // Cheerio로 HTML 파싱
    const $ = cheerio.load(html)

    // 제목 추출 (여러 방법 시도)
    let title = ""
    const titleSelectors = [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      "h1",
      "title",
      ".article-title",
      ".news-title",
      ".post-title",
    ]

    for (const selector of titleSelectors) {
      const element = $(selector).first()
      if (element.length) {
        title = element.attr("content") || element.text().trim()
        if (title && title.length > 5) break
      }
    }

    // 본문 내용 추출
    let content = ""
    const contentSelectors = [
      'meta[property="og:description"]',
      ".article-content",
      ".news-content",
      ".post-content",
      ".content",
      "article",
      ".entry-content",
      "main",
      ".main-content",
    ]

    for (const selector of contentSelectors) {
      const element = $(selector).first()
      if (element.length) {
        content = element.text().trim()
        if (content && content.length > 200) break
      }
    }

    // 메타 설명 추출
    let description = ""
    const descriptionSelectors = ['meta[name="description"]', 'meta[property="og:description"]']

    for (const selector of descriptionSelectors) {
      const element = $(selector).first()
      if (element.length) {
        description = element.attr("content") || ""
        if (description && description.length > 10) break
      }
    }

    // 이미지 URL 추출
    let imageUrl = ""
    const imageSelectors = ['meta[property="og:image"]', 'meta[name="twitter:image"]', ".article-image img"]

    for (const selector of imageSelectors) {
      const element = $(selector).first()
      if (element.length) {
        imageUrl = element.attr("content") || element.attr("src") || ""
        if (imageUrl) {
          // 상대 URL을 절대 URL로 변환
          if (imageUrl.startsWith("/")) {
            imageUrl = new URL(imageUrl, finalUrl).href
          }
          break
        }
      }
    }

    // 소스 도메인 추출
    const source = new URL(finalUrl).hostname

    // 결과 검증
    if (!title || title.length < 5) {
      console.error("제목을 찾을 수 없음")
      return NextResponse.json({ error: "웹페이지에서 제목을 찾을 수 없습니다." }, { status: 400 })
    }

    if (!content || content.length < 100) {
      console.error("본문 내용이 부족함")
      return NextResponse.json({ error: "웹페이지에서 충분한 본문 내용을 찾을 수 없습니다." }, { status: 400 })
    }

    // 뉴스 콘텐츠인지 확인
    const newsKeywords = ["뉴스", "기사", "보도", "취재", "news", "article", "report"]
    const hasNewsKeywords = newsKeywords.some(
      (keyword) =>
        title.toLowerCase().includes(keyword) ||
        content.toLowerCase().includes(keyword) ||
        html.toLowerCase().includes(keyword),
    )

    if (!hasNewsKeywords && content.length < 500) {
      console.error("뉴스 콘텐츠가 아닌 것으로 판단됨")
      return NextResponse.json({ error: "뉴스 기사가 아닌 것으로 보입니다." }, { status: 400 })
    }

    const result: ScrapedContent = {
      title: title.substring(0, 200), // 제목 길이 제한
      content: content.substring(0, 5000), // 내용 길이 제한
      description: description.substring(0, 500), // 설명 길이 제한
      imageUrl,
      finalUrl,
      source,
      contentLength: content.length,
    }

    console.log(`스크래핑 완료:`, {
      title: result.title.substring(0, 50) + "...",
      contentLength: result.contentLength,
      source: result.source,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("스크래핑 오류:", error)
    return NextResponse.json(
      {
        error: `스크래핑 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      },
      { status: 500 },
    )
  }
}
