"use server"

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

// 언어 감지 함수
async function detectLanguage(text: string): Promise<string> {
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 텍스트의 언어를 감지하고 ISO 639-1 코드로 반환해주세요. 
      한국어면 'ko', 영어면 'en', 태국어면 'th'를 반환하세요.
      
      텍스트: "${text.substring(0, 500)}"
      
      언어 코드만 반환하세요:`,
      temperature: 0,
    })

    return result.trim().toLowerCase()
  } catch (error) {
    console.error("언어 감지 오류:", error)
    return "en" // 기본값
  }
}

// 텍스트 번역 함수
async function translateToKorean(text: string, fromLanguage: string): Promise<string> {
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 ${fromLanguage === "th" ? "태국어" : "영어"} 텍스트를 자연스러운 한국어로 번역해주세요. 
      뉴스 기사의 톤을 유지하고, 태국 관련 고유명사는 적절히 한국어로 표기해주세요.
      
      원문: "${text}"
      
      번역문만 반환하세요:`,
      temperature: 0.3,
    })

    return result.trim()
  } catch (error) {
    console.error("번역 오류:", error)
    return text // 번역 실패시 원문 반환
  }
}

// URL에서 뉴스 내용 스크래핑
export async function scrapeNewsFromUrl(url: string): Promise<ScrapedNewsData> {
  try {
    console.log("뉴스 URL 스크래핑 시작:", url)

    // URL에서 HTML 가져오기
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`)
    }

    const html = await response.text()
    console.log("HTML 가져오기 성공, 길이:", html.length)

    // AI로 HTML에서 뉴스 내용 추출
    const { text: extractedData } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 HTML에서 뉴스 기사의 주요 정보를 추출하여 JSON 형태로 반환해주세요.
      
      HTML: "${html.substring(0, 8000)}"
      
      다음 형식으로 반환해주세요:
      {
        "title": "기사 제목",
        "content": "기사 본문 (전체 내용)",
        "excerpt": "기사 요약 (2-3문장)",
        "author": "작성자 (있는 경우)",
        "publishedAt": "발행일시 (ISO 형식, 있는 경우)",
        "imageUrl": "대표 이미지 URL (있는 경우)"
      }
      
      JSON만 반환하고 다른 텍스트는 포함하지 마세요.`,
      temperature: 0.3,
    })

    console.log("AI 추출 결과:", extractedData.substring(0, 500))

    // JSON 파싱
    const cleanedResult = extractedData.replace(/```json\n?|\n?```/g, "").trim()
    const parsedData = JSON.parse(cleanedResult)

    // 언어 감지
    const detectedLanguage = await detectLanguage(parsedData.title + " " + parsedData.content.substring(0, 1000))
    console.log("감지된 언어:", detectedLanguage)

    let finalData = {
      title: parsedData.title || "제목 없음",
      content: parsedData.content || "내용 없음",
      excerpt: parsedData.excerpt || "",
      author: parsedData.author || "Unknown",
      publishedAt: parsedData.publishedAt || new Date().toISOString(),
      imageUrl: parsedData.imageUrl || "",
      language: detectedLanguage,
      isTranslated: false,
    }

    // 한국어가 아닌 경우 번역
    if (detectedLanguage !== "ko") {
      console.log("번역 시작...")

      const translatedTitle = await translateToKorean(finalData.title, detectedLanguage)
      const translatedContent = await translateToKorean(finalData.content, detectedLanguage)
      const translatedExcerpt = finalData.excerpt ? await translateToKorean(finalData.excerpt, detectedLanguage) : ""

      finalData = {
        ...finalData,
        title: translatedTitle,
        content: translatedContent,
        excerpt: translatedExcerpt,
        isTranslated: true,
      }

      console.log("번역 완료")
    }

    return finalData
  } catch (error) {
    console.error("뉴스 스크래핑 오류:", error)
    throw new Error(`뉴스 스크래핑 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

// AI로 뉴스 데이터 분석 및 카테고리/태그 추출
export async function analyzeNewsContent(newsData: ScrapedNewsData): Promise<{
  category: string
  tags: string[]
  readTime: number
}> {
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `다음 뉴스 기사를 분석하여 적절한 카테고리와 태그를 추천해주세요.
      
      제목: "${newsData.title}"
      내용: "${newsData.content.substring(0, 2000)}"
      
      카테고리는 다음 중에서 선택해주세요:
      - 현지 뉴스: 태국 현지 일반 뉴스
      - 교민 업체: 한국인 교민 관련 비즈니스 뉴스
      - 정책: 정부 정책, 법률 관련
      - 교통: 교통, 항공, 운송 관련
      - 비자: 비자, 출입국 관련
      - 경제: 경제, 금융, 투자 관련
      - 문화: 문화, 예술, 엔터테인먼트
      - 스포츠: 스포츠 관련
      - 일반: 기타
      
      태그는 태국 관련 키워드를 5개 이내로 추천해주세요.
      
      다음 형식으로 반환해주세요:
      {
        "category": "카테고리명",
        "tags": ["태그1", "태그2", "태그3"],
        "readTime": 예상독서시간(분)
      }
      
      JSON만 반환하세요:`,
      temperature: 0.3,
    })

    const cleanedResult = result.replace(/```json\n?|\n?```/g, "").trim()
    const analysisResult = JSON.parse(cleanedResult)

    return {
      category: analysisResult.category || "일반",
      tags: Array.isArray(analysisResult.tags) ? analysisResult.tags : [],
      readTime: analysisResult.readTime || Math.ceil(newsData.content.length / 200),
    }
  } catch (error) {
    console.error("뉴스 분석 오류:", error)
    return {
      category: "일반",
      tags: ["태국"],
      readTime: Math.ceil(newsData.content.length / 200),
    }
  }
}
