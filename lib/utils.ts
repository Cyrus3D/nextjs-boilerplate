import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL 타입 판별 함수
export function getUrlType(url?: string | null): "website" | "map" | "unknown" {
  if (!url) return "unknown"

  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes("maps.google") || lowerUrl.includes("goo.gl/maps") || lowerUrl.includes("maps.app.goo.gl")) {
    return "map"
  }

  return "website"
}

// 위치 정보가 유효한지 확인
export function isValidLocation(location?: string | null): boolean {
  if (!location) return false

  const cleanLocation = location.trim()
  return cleanLocation.length > 0 && cleanLocation !== "Unknown" && cleanLocation !== "N/A"
}

// 검색용 위치 정보 정리
export function cleanLocationForSearch(location: string): string {
  return location
    .replace(/[^\w\s가-힣]/g, " ") // 특수문자 제거
    .replace(/\s+/g, " ") // 연속 공백 제거
    .trim()
}

// 구글 맵 검색 URL 생성
export function generateGoogleMapsSearchUrl(location: string, businessName?: string): string {
  const query = businessName ? `${businessName} ${location}` : location
  const encodedQuery = encodeURIComponent(query)
  return `https://maps.google.com/maps?q=${encodedQuery}`
}

// 링크에서 플랫폼 이름 추출
export function getLinkPlatform(url: string): string {
  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes("maps.google") || lowerUrl.includes("goo.gl/maps")) {
    return "Google Maps"
  }
  if (lowerUrl.includes("facebook.com")) {
    return "Facebook"
  }
  if (lowerUrl.includes("instagram.com")) {
    return "Instagram"
  }
  if (lowerUrl.includes("youtube.com")) {
    return "YouTube"
  }
  if (lowerUrl.includes("tiktok.com")) {
    return "TikTok"
  }
  if (lowerUrl.includes("threads.net")) {
    return "Threads"
  }

  try {
    const domain = new URL(url).hostname.replace("www.", "")
    return domain.charAt(0).toUpperCase() + domain.slice(1)
  } catch {
    return "웹사이트"
  }
}
