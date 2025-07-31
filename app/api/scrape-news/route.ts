import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL이 필요합니다." }, { status: 400 })
    }

    console.log("스크래핑 시작:", url)

    // 더 나은 헤더로 실제 브라우저처럼 요청
    const response = await fetch(url, {
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
      console.error("HTTP 오류:", response.status, response.statusText)
      return NextResponse.json(
        {
          error: `HTTP 오류: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      )
    }

    const html = await response.text()
    console.log("HTML 길이:", html.length)
    console.log("최종 URL:", response.url)

    // 리다이렉트 페이지나 오류 페이지 감지
    const redirectPatterns = [
      /redirecting/i,
      /redirect/i,
      /loading/i,
      /please wait/i,
      /잠시만 기다려/i,
      /리다이렉트/i,
      /페이지를 찾을 수 없습니다/i,
      /404/i,
      /error/i,
      /access denied/i,
      /접근이 거부되었습니다/i,
    ]

    const isRedirectPage = redirectPatterns.some((pattern) => pattern.test(html))

    if (isRedirectPage) {
      console.error("리다이렉트 또는 오류 페이지 감지됨")
      return NextResponse.json(
        {
          error: "페이지에 접근할 수 없습니다. 리다이렉트 또는 오류 페이지입니다.",
        },
        { status: 400 },
      )
    }

    // HTML이 너무 짧으면 유효하지 않은 콘텐츠로 간주
    if (html.length < 500) {
      console.error("HTML 콘텐츠가 너무 짧음:", html.length)
      return NextResponse.json(
        {
          error: "페이지 콘텐츠가 충분하지 않습니다.",
        },
        { status: 400 },
      )
    }

    const $ = cheerio.load(html)

    // 메타 태그에서 정보 추출
    const ogTitle = $('meta[property="og:title"]').attr("content") || ""
    const ogDescription = $('meta[property="og:description"]').attr("content") || ""
    const ogImage = $('meta[property="og:image"]').attr("content") || ""
    const metaDescription = $('meta[name="description"]').attr("content") || ""

    // 제목 추출 (우선순위: og:title > title 태그 > h1)
    const title = ogTitle || $("title").text().trim() || $("h1").first().text().trim()

    // 본문 추출 (다양한 선택자 시도)
    const contentSelectors = [
      "article",
      ".article-content",
      ".news-content",
      ".post-content",
      ".content",
      ".entry-content",
      "main",
      ".main-content",
      "#content",
      ".story-body",
      ".article-body",
    ]

    let content = ""
    for (const selector of contentSelectors) {
      const element = $(selector)
      if (element.length > 0) {
        // 스크립트, 스타일, 광고 등 제거
        element.find("script, style, .ad, .advertisement, .social-share, .related-articles").remove()
        content = element.text().trim()
        if (content.length > 200) {
          break
        }
      }
    }

    // 본문이 충분하지 않으면 전체 body에서 추출
    if (content.length < 200) {
      $("script, style, nav, header, footer, .ad, .advertisement, .menu, .sidebar").remove()
      content = $("body").text().trim()
    }

    // 텍스트 정리
    content = content.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim()

    // 이미지 URL 처리
    let imageUrl = ogImage
    if (imageUrl && !imageUrl.startsWith("http")) {
      const baseUrl = new URL(response.url).origin
      imageUrl = new URL(imageUrl, baseUrl).href
    }

    // 최종 검증
    if (!title || title.length < 5) {
      console.error("제목이 너무 짧거나 없음:", title)
      return NextResponse.json(
        {
          error: "페이지 제목을 찾을 수 없습니다.",
        },
        { status: 400 },
      )
    }

    if (content.length < 100) {
      console.error("본문이 너무 짧음:", content.length)
      return NextResponse.json(
        {
          error: "페이지 본문이 충분하지 않습니다.",
        },
        { status: 400 },
      )
    }

    // 뉴스 콘텐츠인지 확인
    const newsKeywords = ["뉴스", "기사", "보도", "취재", "기자", "뉴스룸", "news", "article", "reporter"]
    const hasNewsKeywords = newsKeywords.some(
      (keyword) => html.toLowerCase().includes(keyword) || title.toLowerCase().includes(keyword),
    )

    if (!hasNewsKeywords && content.length < 500) {
      console.warn("뉴스 콘텐츠가 아닐 수 있음")
    }

    const result = {
      title: title.substring(0, 200), // 제목 길이 제한
      content: content.substring(0, 5000), // 본문 길이 제한
      description: ogDescription || metaDescription || content.substring(0, 300),
      imageUrl: imageUrl || "",
      finalUrl: response.url,
      source: new URL(response.url).hostname,
      scrapedAt: new Date().toISOString(),
    }

    console.log("스크래핑 완료:", {
      title: result.title.substring(0, 50) + "...",
      contentLength: result.content.length,
      hasImage: !!result.imageUrl,
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
