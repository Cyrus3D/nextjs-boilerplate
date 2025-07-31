import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL이 필요합니다." }, { status: 400 })
    }

    // URL 유효성 검사
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: "유효하지 않은 URL입니다." }, { status: 400 })
    }

    // 허용된 도메인 체크 (보안상 필요)
    const allowedDomains = [
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

    const isAllowed = allowedDomains.some(
      (domain) => validUrl.hostname === domain || validUrl.hostname.endsWith("." + domain),
    )

    if (!isAllowed) {
      return NextResponse.json(
        {
          error: "허용되지 않은 도메인입니다.",
        },
        { status: 403 },
      )
    }

    // 웹페이지 내용 가져오기
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      // 타임아웃 설정
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `웹페이지를 가져올 수 없습니다. (${response.status})`,
        },
        { status: 400 },
      )
    }

    const html = await response.text()

    // HTML에서 텍스트 추출 (간단한 방법)
    const textContent = extractTextFromHtml(html)

    if (textContent.length < 100) {
      return NextResponse.json(
        {
          error: "충분한 텍스트 내용을 찾을 수 없습니다.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      content: textContent,
      url: url,
      title: extractTitleFromHtml(html),
    })
  } catch (error) {
    console.error("웹 스크래핑 오류:", error)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return NextResponse.json({ error: "요청 시간이 초과되었습니다." }, { status: 408 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "알 수 없는 오류가 발생했습니다." }, { status: 500 })
  }
}

// HTML에서 텍스트 추출하는 간단한 함수
function extractTextFromHtml(html: string): string {
  // HTML 태그 제거
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "") // 스크립트 제거
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "") // 스타일 제거
    .replace(/<[^>]*>/g, " ") // HTML 태그 제거
    .replace(/\s+/g, " ") // 연속된 공백을 하나로
    .trim()

  // 너무 긴 경우 제한 (AI 토큰 한계 고려)
  if (text.length > 8000) {
    text = text.substring(0, 8000) + "..."
  }

  return text
}

// HTML에서 제목 추출
function extractTitleFromHtml(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1]
      .replace(/<[^>]*>/g, "") // HTML 태그 제거
      .replace(/\s+/g, " ")
      .trim()
  }
  return ""
}
