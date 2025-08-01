import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface ScrapedNewsData {
  title: string
  content: string
  excerpt?: string
  author?: string
  publishedAt?: string
  imageUrl?: string
  language: string
  isTranslated: boolean
}

export interface NewsAnalysisResult {
  category: string
  tags: string[]
  readTime: number
}

// 언어 감지 함수
async function detectLanguage(text: string): Promise<string> {
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Detect the language of the following text and return only the language code (ko for Korean, en for English, th for Thai, etc.):

Text: "${text.substring(0, 500)}"

Return only the 2-letter language code.`,
      temperature: 0,
    })

    return result.trim().toLowerCase()
  } catch (error) {
    console.error("언어 감지 오류:", error)
    return "unknown"
  }
}

// 텍스트 번역 함수
async function translateToKorean(text: string, fromLanguage: string): Promise<string> {
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Translate the following ${fromLanguage} text to Korean. Maintain the original meaning and tone:

Text: "${text}"

Return only the Korean translation.`,
      temperature: 0.3,
    })

    return result.trim()
  } catch (error) {
    console.error("번역 오류:", error)
    return text // 번역 실패시 원본 반환
  }
}

// HTML에서 텍스트 추출 함수
function extractTextFromHtml(html: string): string {
  // 기본적인 HTML 태그 제거
  return html
    .replace(/<script[^>]*>.*?<\/script>/gis, "")
    .replace(/<style[^>]*>.*?<\/style>/gis, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// 메타 태그에서 정보 추출
function extractMetaInfo(html: string) {
  const metaInfo: any = {}

  // 제목 추출
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
  if (titleMatch) {
    metaInfo.title = extractTextFromHtml(titleMatch[1])
  }

  // 메타 태그에서 정보 추출
  const metaTags = html.match(/<meta[^>]*>/gi) || []

  for (const tag of metaTags) {
    const nameMatch = tag.match(/name=["']([^"']+)["']/i)
    const propertyMatch = tag.match(/property=["']([^"']+)["']/i)
    const contentMatch = tag.match(/content=["']([^"']+)["']/i)

    if (contentMatch) {
      const content = contentMatch[1]

      if (nameMatch) {
        const name = nameMatch[1].toLowerCase()
        if (name === "description") metaInfo.description = content
        if (name === "author") metaInfo.author = content
      }

      if (propertyMatch) {
        const property = propertyMatch[1].toLowerCase()
        if (property === "og:title") metaInfo.ogTitle = content
        if (property === "og:description") metaInfo.ogDescription = content
        if (property === "og:image") metaInfo.ogImage = content
        if (property === "article:author") metaInfo.author = content
        if (property === "article:published_time") metaInfo.publishedTime = content
      }
    }
  }

  return metaInfo
}

// 본문 내용 추출
function extractMainContent(html: string): string {
  // 일반적인 기사 본문 선택자들
  const contentSelectors = [
    "article",
    ".article-content",
    ".post-content",
    ".entry-content",
    ".content",
    ".story-body",
    ".article-body",
    "main",
    "#content",
    ".news-content",
  ]

  // 간단한 선택자 매칭 (실제로는 더 정교한 파싱이 필요)
  for (const selector of contentSelectors) {
    const regex = new RegExp(`<[^>]*class=["'][^"']*${selector.replace(".", "")}[^"']*["'][^>]*>(.*?)</[^>]*>`, "gis")
    const match = html.match(regex)
    if (match && match[1]) {
      const content = extractTextFromHtml(match[1])
      if (content.length > 200) {
        // 충분한 길이의 내용만 반환
        return content
      }
    }
  }

  // 선택자로 찾지 못한 경우 body 내용 전체에서 추출
  const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/gis)
  if (bodyMatch) {
    return extractTextFromHtml(bodyMatch[0])
  }

  return extractTextFromHtml(html)
}

// URL에서 뉴스 스크래핑
export async function scrapeNewsFromUrl(url: string): Promise<ScrapedNewsData> {
  try {
    console.log("뉴스 스크래핑 시작:", url)

    // URL에서 HTML 가져오기
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    console.log("HTML 가져오기 완료, 길이:", html.length)

    // 메타 정보 추출
    const metaInfo = extractMetaInfo(html)
    console.log("메타 정보:", metaInfo)

    // 본문 내용 추출
    const mainContent = extractMainContent(html)
    console.log("본문 길이:", mainContent.length)

    if (!mainContent || mainContent.length < 100) {
      throw new Error("충분한 본문 내용을 찾을 수 없습니다.")
    }

    // 제목 결정
    const title = metaInfo.ogTitle || metaInfo.title || "제목 없음"

    // 언어 감지
    const detectedLanguage = await detectLanguage(title + " " + mainContent.substring(0, 500))
    console.log("감지된 언어:", detectedLanguage)

    let finalTitle = title
    let finalContent = mainContent
    let finalExcerpt = metaInfo.ogDescription || metaInfo.description
    let isTranslated = false

    // 한국어가 아닌 경우 번역
    if (detectedLanguage !== "ko") {
      console.log("번역 시작...")
      finalTitle = await translateToKorean(title, detectedLanguage)
      finalContent = await translateToKorean(mainContent, detectedLanguage)
      if (finalExcerpt) {
        finalExcerpt = await translateToKorean(finalExcerpt, detectedLanguage)
      }
      isTranslated = true
      console.log("번역 완료")
    }

    const result: ScrapedNewsData = {
      title: finalTitle,
      content: finalContent,
      excerpt: finalExcerpt,
      author: metaInfo.author,
      publishedAt: metaInfo.publishedTime,
      imageUrl: metaInfo.ogImage,
      language: detectedLanguage,
      isTranslated,
    }

    console.log("스크래핑 완료:", {
      title: result.title.substring(0, 50) + "...",
      contentLength: result.content.length,
      language: result.language,
      isTranslated: result.isTranslated,
    })

    return result
  } catch (error) {
    console.error("뉴스 스크래핑 오류:", error)
    throw new Error(`뉴스 스크래핑 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// AI로 뉴스 내용 분석
export async function analyzeNewsContent(scrapedData: ScrapedNewsData): Promise<NewsAnalysisResult> {
  try {
    console.log("뉴스 내용 분석 시작")

    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 뉴스 기사를 분석하여 카테고리와 태그를 추천해주세요.

제목: ${scrapedData.title}
내용: ${scrapedData.content.substring(0, 1000)}...

다음 카테고리 중에서 가장 적합한 것을 선택하세요:
- 현지 뉴스: 태국 현지 일반 뉴스
- 교민 업체: 한국인 대상 비즈니스 관련
- 정책: 정부 정책, 법률, 규정 관련
- 교통: 교통, 운송 관련
- 비자: 비자, 출입국 관련
- 경제: 경제, 금융, 투자 관련
- 문화: 문화, 예술, 엔터테인먼트
- 스포츠: 스포츠 관련
- 일반: 기타

그리고 관련 태그 3-5개를 추천해주세요. 다음 태그들을 우선적으로 고려하세요:
태국, 방콕, 파타야, 치앙마이, 푸켓, 교민, 비자, 정책, 교통, 경제, 문화, 관광, 코로나, 날씨, 축제, 음식, 쇼핑, 부동산, 투자, 의료

JSON 형식으로 응답해주세요:
{
  "category": "카테고리명",
  "tags": ["태그1", "태그2", "태그3"],
  "readTime": 예상읽기시간(분)
}`,
      temperature: 0.3,
    })

    const cleanedResult = result.replace(/```json\n?|\n?```/g, "").trim()
    const analysisResult = JSON.parse(cleanedResult)

    const finalResult: NewsAnalysisResult = {
      category: analysisResult.category || "일반",
      tags: Array.isArray(analysisResult.tags) ? analysisResult.tags : [],
      readTime: analysisResult.readTime || Math.ceil(scrapedData.content.length / 200),
    }

    console.log("분석 완료:", finalResult)
    return finalResult
  } catch (error) {
    console.error("뉴스 분석 오류:", error)
    // 기본값 반환
    return {
      category: "일반",
      tags: ["태국"],
      readTime: Math.ceil(scrapedData.content.length / 200),
    }
  }
}
