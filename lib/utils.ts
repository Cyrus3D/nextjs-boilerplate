import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 구글 맵 검색 URL 생성 함수
export function generateGoogleMapsSearchUrl(location: string, businessName?: string): string {
  // 검색어 조합: 비즈니스명 + 위치 (더 정확한 검색을 위해)
  const searchQuery = businessName ? `${businessName} ${location}` : location

  // 한글과 특수문자를 URL 인코딩
  const encodedQuery = encodeURIComponent(searchQuery)

  // 구글 맵 검색 URL 형식
  return `https://www.google.com/maps/search/${encodedQuery}`
}

// 위치 정보가 유효한지 확인하는 함수
export function isValidLocation(location?: string): boolean {
  if (!location) return false

  // 너무 짧거나 의미없는 위치 정보 필터링
  const trimmedLocation = location.trim()
  if (trimmedLocation.length < 2) return false

  // 일반적이지 않은 위치 정보 필터링
  const invalidPatterns = [/^전지역$/, /^전국$/, /^온라인$/, /^인터넷$/, /^배송$/, /^택배$/]

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
