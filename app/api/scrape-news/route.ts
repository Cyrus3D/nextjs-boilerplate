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

  // Extract title
  const titleMatch = cleanHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : ""

  // Remove HTML tags and extract text content
  let textContent = cleanHtml.replace(/<[^>]+>/g, " ")

  // Clean up whitespace
  textContent = textContent.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim()

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
  ]

  unwantedPatterns.forEach((pattern) => {
    textContent = textContent.replace(pattern, "")
  })

  // Limit content length to prevent overly long responses
  if (textContent.length > 10000) {
    textContent = textContent.substring(0, 10000) + "..."
  }

  return {
    title: title.substring(0, 200), // Limit title length
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
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "유효하지 않은 URL 형식입니다." }, { status: 400 })
    }

    // Check if domain is allowed
    if (!isAllowedDomain(url)) {
      return NextResponse.json(
        { error: "허용되지 않은 도메인입니다. 지원되는 뉴스 사이트만 사용할 수 있습니다." },
        { status: 403 },
      )
    }

    // Fetch the webpage
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
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
        redirect: "follow",
        mode: "cors",
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json(
          { error: `웹페이지를 가져올 수 없습니다. HTTP ${response.status}: ${response.statusText}` },
          { status: response.status },
        )
      }

      const html = await response.text()

      if (!html || html.length < 100) {
        return NextResponse.json({ error: "웹페이지 내용이 너무 짧거나 비어있습니다." }, { status: 400 })
      }

      const { title, content } = extractTextContent(html)

      if (!content || content.length < 100) {
        return NextResponse.json({ error: "추출된 텍스트 내용이 충분하지 않습니다." }, { status: 400 })
      }

      return NextResponse.json({
        title,
        content,
        url,
        extractedAt: new Date().toISOString(),
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return NextResponse.json({ error: "요청 시간이 초과되었습니다. 다른 URL을 시도해보세요." }, { status: 408 })
        }

        return NextResponse.json({ error: `네트워크 오류: ${fetchError.message}` }, { status: 500 })
      }

      return NextResponse.json({ error: "알 수 없는 네트워크 오류가 발생했습니다." }, { status: 500 })
    }
  } catch (error) {
    console.error("Scraping error:", error)

    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
