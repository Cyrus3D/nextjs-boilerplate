import { scrapeWebContent, generateText, openai } from "./utils" // Assuming these functions are imported from another file

export async function analyzeNewsFromUrl(url: string) {
  console.log("Starting news analysis for URL:", url)

  try {
    // First scrape the web content
    const scrapedData = await scrapeWebContent(url)
    console.log("Scraped data:", scrapedData)

    if (!scrapedData.title && !scrapedData.body) {
      throw new Error("웹페이지에서 콘텐츠를 추출할 수 없습니다.")
    }

    // Detect language from the scraped content
    const detectedLanguage =
      detectLanguageFromUrl(url) || detectLanguageFromContent(scrapedData.body || scrapedData.title || "")
    console.log("Detected language:", detectedLanguage)

    // Prepare content for AI analysis
    const contentToAnalyze = `
제목: ${scrapedData.title || ""}
설명: ${scrapedData.description || ""}
본문: ${scrapedData.body || ""}
URL: ${url}
언어: ${detectedLanguage}
`.trim()

    console.log("Sending to AI for analysis...")

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 뉴스 기사를 분석하고 JSON 형식으로 응답해주세요. 모든 텍스트 필드는 한국어로 번역해주세요:

${contentToAnalyze}

다음 형식으로 응답해주세요:
{
  "title": "한국어로 번역된 제목 (간결하고 명확하게)",
  "content": "한국어로 번역된 전체 내용 (자연스러운 한국어로)",
  "summary": "한국어로 작성된 3-4문장 요약",
  "author": "작성자명 (한국어로 번역, 없으면 빈 문자열)",
  "category": "다음 중 하나: 정치, 경제, 사회, 국제, 문화, 스포츠, 기술, 건강, 교육, 환경, 비즈니스, 여행, 음식, 엔터테인먼트, 기타",
  "tags": ["관련", "태그", "목록", "한국어로"],
  "language": "${detectedLanguage}"
}

주의사항:
- 모든 텍스트는 자연스러운 한국어로 번역
- 제목은 뉴스 헤드라인 형식으로 간결하게
- 내용은 완전한 문장으로 구성
- 카테고리는 내용을 분석하여 가장 적합한 것으로 선택
- 태그는 검색에 유용한 키워드로 구성`,
    })

    console.log("AI response received:", text)

    // Parse the AI response
    let analysisResult
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError)
      console.log("Raw AI response:", text)

      // Fallback: create a basic structure with translated content
      const translatedTitle = await translateText(scrapedData.title || "", detectedLanguage, "ko")
      const translatedContent = await translateText(scrapedData.body || "", detectedLanguage, "ko")
      const translatedSummary = await translateText(scrapedData.description || "", detectedLanguage, "ko")

      analysisResult = {
        title: translatedTitle,
        content: translatedContent,
        summary: translatedSummary,
        author: "",
        category: "기타",
        tags: ["뉴스"],
        language: detectedLanguage,
      }
    }

    console.log("Final analysis result:", analysisResult)
    return analysisResult
  } catch (error) {
    console.error("News analysis error:", error)
    throw new Error(`뉴스 분석 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// Helper function to translate individual text
async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  if (!text.trim() || fromLang === toLang) return text

  try {
    const { text: translatedText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 텍스트를 ${fromLang}에서 ${toLang}로 자연스럽게 번역해주세요. 번역된 텍스트만 응답하세요:

${text}`,
    })
    return translatedText.trim()
  } catch (error) {
    console.error("Translation error:", error)
    return text // Return original text if translation fails
  }
}

// Enhanced language detection
function detectLanguageFromUrl(url: string): string | null {
  // Placeholder for URL-based language detection logic
  return null
}

function detectLanguageFromContent(content: string): string {
  const text = content.toLowerCase()

  // Thai language detection
  if (/[\u0E00-\u0E7F]/.test(text)) return "th"

  // Korean language detection
  if (/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text)) return "ko"

  // Japanese language detection
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) return "ja"

  // Chinese language detection
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh"

  // Default to English
  return "en"
}
