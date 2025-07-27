import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BusinessLink, UrlType } from "../types/business-card"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 확장된 URL 타입 감지 함수
export function getUrlType(url?: string): UrlType {
  if (!url) return "unknown"

  // 지도 링크 패턴
  const mapPatterns = [
    /maps\.app\.goo\.gl/,
    /maps\.google\.com/,
    /goo\.gl\/maps/,
    /google\.com\/maps/,
    /g\.co\/kgs/,
    /naver\.me\/maps/,
    /map\.kakao\.com/,
  ]

  // 소셜 미디어 패턴
  const socialPatterns = [
    /facebook\.com/,
    /instagram\.com/,
    /youtube\.com/,
    /twitter\.com/,
    /tiktok\.com/,
    /linkedin\.com/,
  ]

  if (mapPatterns.some((pattern) => pattern.test(url))) {
    return "map"
  }

  if (socialPatterns.some((pattern) => pattern.test(url))) {
    return "social"
  }

  return "website"
}

// 링크에서 플랫폼 이름 추출
export function getLinkPlatform(url: string): string {
  const platforms = {
    "facebook.com": "Facebook",
    "instagram.com": "Instagram",
    "youtube.com": "YouTube",
    "twitter.com": "Twitter",
    "tiktok.com": "TikTok",
    "maps.google.com": "Google Maps",
    "maps.app.goo.gl": "Google Maps",
    "naver.me": "Naver Map",
    "map.kakao.com": "Kakao Map",
  }

  for (const [domain, platform] of Object.entries(platforms)) {
    if (url.includes(domain)) {
      return platform
    }
  }

  return "웹사이트"
}

// 여러 링크를 파싱하는 함수 (향후 사용)
export function parseMultipleLinks(linkString: string): BusinessLink[] {
  // 예: "웹사이트: https://example.com | 지도: https://maps.app.goo.gl/xyz"
  const links: BusinessLink[] = []

  const linkPairs = linkString.split("|").map((s) => s.trim())

  linkPairs.forEach((pair) => {
    const [label, url] = pair.split(":").map((s) => s.trim())
    if (url && url.startsWith("http")) {
      const type = getUrlType(url)
      links.push({
        type: type === "unknown" ? "website" : type,
        url,
        displayName: label,
        isPrimary: links.length === 0,
      })
    }
  })

  return links
}

// 구글 맵 검색 URL 생성 함수
export function generateGoogleMapsSearchUrl(location: string, businessName?: string): string {
  const searchQuery = businessName ? `${businessName} ${location}` : location
  const encodedQuery = encodeURIComponent(searchQuery)
  return `https://www.google.com/maps/search/${encodedQuery}`
}

// 위치 정보가 유효한지 확인하는 함수
export function isValidLocation(location?: string): boolean {
  if (!location) return false

  const trimmedLocation = location.trim()
  if (trimmedLocation.length < 2) return false

  const invalidPatterns = [/^전지역$/, /^전국$/, /^온라인$/, /^인터넷$/, /^배송$/, /^택배$/, /^태국\s*전지역$/]

  return !invalidPatterns.some((pattern) => pattern.test(trimmedLocation))
}

// 위치 정보를 정리하는 함수
export function cleanLocationForSearch(location: string): string {
  return location
    .replace(/\s*$$[^)]*$$/g, "") // 괄호와 내용 제거
    .replace(/\s*-\s*.*$/, "") // 대시 이후 내용 제거
    .replace(/\s+/g, " ") // 연속된 공백을 하나로
    .trim()
}
