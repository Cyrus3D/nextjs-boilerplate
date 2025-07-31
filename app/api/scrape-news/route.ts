import { type NextRequest, NextResponse } from "next/server"

// Allowed domains for security
const ALLOWED_DOMAINS = [
  "sanook.com",
  "bangkokpost.com",
  "thairath.co.th",
  "matichon.co.th",
  "overseas.mofa.go.kr",
  "khaosod.co.th",
  "dailynews.co.th",
  "nationthailand.com",
  "mgronline.com",
  "world.thaipbs.or.th",
  "komchadluek.net",
  "naewna.com",
  "prachatai.com",
  "innnews.co.th",
]

function isAllowedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ALLOWED_DOMAINS.some((domain) => urlObj.hostname.includes(domain))
  } catch {
    return false
  }
}

function extractTextContent(html: string): { title: string; content: string } {
  // Remove script and style tags
  let cleanHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
  cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
  cleanHtml = cleanHtml.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")

  // Extract title - try multiple selectors
  let title = ""
  const titleSelectors = [
    /<title[^>]*>([\s\S]*?)<\/title>/i,
    /<h1[^>]*>([\s\S]*?)<\/h1>/i,
    /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i,
    /<meta[^>]*name="title"[^>]*content="([^"]*)"[^>]*>/i,
  ]

  for (const selector of titleSelectors) {
    const match = cleanHtml.match(selector)
    if (match && match[1] && match[1].trim()) {
      title = match[1].trim()
      break
    }
  }

  // Remove HTML tags and extract text content
  let textContent = cleanHtml.replace(/<[^>]+>/g, " ")

  // Clean up whitespace and special characters
  textContent = textContent
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()

  // Remove common navigation and footer text patterns
  const unwantedPatterns = [
    /copyright.*$/gi,
    /all rights reserved.*$/gi,
    /privacy policy.*$/gi,
    /terms of service.*$/gi,
    /cookie policy.*$/gi,
    /follow us.*$/gi,
    /subscribe.*$/gi,
    /advertisement.*$/gi,
    /related articles.*$/gi,
    /more news.*$/gi,
    /share this.*$/gi,
    /print.*$/gi,
    /email.*$/gi,
    /tags:.*$/gi,
    /categories:.*$/gi,
    /posted by.*$/gi,
    /published.*$/gi,
    /updated.*$/gi,
    /source:.*$/gi,
  ]

  unwantedPatterns.forEach((pattern) => {
    textContent = textContent.replace(pattern, "")
  })

  // Remove very short lines (likely navigation or ads)
  const lines = textContent.split("\n")
  const meaningfulLines = lines.filter((line) => {
    const trimmed = line.trim()
    return trimmed.length > 20 && !trimmed.match(/^(home|news|sports|business|contact|about)$/i)
  })

  textContent = meaningfulLines.join("\n").trim()

  // Limit content length to prevent overly long responses
  if (textContent.length > 15000) {
    textContent = textContent.substring(0, 15000) + "..."
  }

  return {
    title: title.substring(0, 300), // Limit title length
    content: textContent,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL이 필요합니다." }, { status: 400 })
    }

    // Validate URL format
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: "유효하지 않은 URL 형식입니다." }, { status: 400 })
    }

    // Check if domain is allowed
    if (!isAllowedDomain(url)) {
      return NextResponse.json(
        {
          error: "허용되지 않은 도메인입니다. 지원되는 뉴스 사이트만 사용할 수 있습니다.",
          allowedDomains: ALLOWED_DOMAINS,
        },
        { status: 403 },
      )
    }

    // Fetch the webpage with better headers and error handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

    try {
      console.log(`Fetching URL: ${url}`)

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,th;q=0.6",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
          DNT: "1",
          Connection: "keep-alive",
        },
        redirect: "follow", // Follow redirects automatically
        mode: "cors",
      })

      clearTimeout(timeoutId)

      console.log(`Response status: ${response.status}, URL: ${response.url}`)

      if (!response.ok) {
        return NextResponse.json(
          {
            error: `웹페이지를 가져올 수 없습니다. HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            finalUrl: response.url,
          },
          { status: response.status >= 500 ? 500 : 400 },
        )
      }

      const contentType = response.headers.get("content-type") || ""
      if (!contentType.includes("text/html")) {
        return NextResponse.json(
          {
            error: `HTML 콘텐츠가 아닙니다. Content-Type: ${contentType}`,
            contentType,
          },
          { status: 400 },
        )
      }

      const html = await response.text()

      if (!html || html.length < 200) {
        return NextResponse.json(
          {
            error: "웹페이지 내용이 너무 짧거나 비어있습니다.",
            contentLength: html?.length || 0,
          },
          { status: 400 },
        )
      }

      // Check if we got a redirect page or error page
      const lowerHtml = html.toLowerCase()
      if (
        lowerHtml.includes("redirecting") ||
        lowerHtml.includes("redirect") ||
        lowerHtml.includes("moved permanently") ||
        lowerHtml.includes("404 not found") ||
        lowerHtml.includes("access denied") ||
        lowerHtml.includes("forbidden")
      ) {
        return NextResponse.json(
          {
            error: "웹페이지가 리다이렉트되었거나 접근할 수 없습니다. 다른 URL을 시도해보세요.",
            finalUrl: response.url,
          },
          { status: 400 },
        )
      }

      const { title, content } = extractTextContent(html)

      if (!content || content.length < 200) {
        return NextResponse.json(
          {
            error: "추출된 텍스트 내용이 충분하지 않습니다. 뉴스 내용을 찾을 수 없습니다.",
            extractedLength: content?.length || 0,
            title: title || "제목 없음",
          },
          { status: 400 },
        )
      }

      console.log(
        `Successfully extracted content. Title: ${title.substring(0, 50)}..., Content length: ${content.length}`,
      )

      return NextResponse.json({
        title: title || "제목 없음",
        content,
        url: response.url, // Use final URL after redirects
        originalUrl: url,
        extractedAt: new Date().toISOString(),
        contentLength: content.length,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)

      console.error("Fetch error:", fetchError)

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return NextResponse.json(
            { error: "요청 시간이 초과되었습니다. 웹사이트가 응답하지 않습니다." },
            { status: 408 },
          )
        }

        if (fetchError.message.includes("ENOTFOUND") || fetchError.message.includes("ECONNREFUSED")) {
          return NextResponse.json({ error: "웹사이트에 연결할 수 없습니다. URL을 확인해주세요." }, { status: 400 })
        }

        return NextResponse.json(
          {
            error: `네트워크 오류: ${fetchError.message}`,
            errorType: fetchError.name,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({ error: "알 수 없는 네트워크 오류가 발생했습니다." }, { status: 500 })
    }
  } catch (error) {
    console.error("Scraping error:", error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: `서버 오류: ${error.message}`,
          errorType: error.name,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
