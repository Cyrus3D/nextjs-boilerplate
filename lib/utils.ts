import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL이 지도 링크인지 확인하는 함수
export function isMapUrl(url: string): boolean {
  if (!url) return false

  const mapPatterns = [
    /maps\.app\.goo\.gl/,
    /maps\.google\.com/,
    /goo\.gl\/maps/,
    /google\.com\/maps/,
    /maps\.app\.goo/,
    /g\.co\/kgs/,
  ]

  return mapPatterns.some((pattern) => pattern.test(url))
}

// URL이 웹사이트 링크인지 확인하는 함수
export function isWebsiteUrl(url: string): boolean {
  if (!url) return false
  return !isMapUrl(url) && (url.startsWith("http") || url.startsWith("www"))
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
