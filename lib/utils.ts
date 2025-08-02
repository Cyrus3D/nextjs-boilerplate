import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// URL 타입 감지 함수
export function getUrlType(
  url: string,
): "phone" | "email" | "website" | "kakao" | "line" | "facebook" | "instagram" | "youtube" | "unknown" {
  if (!url) return "unknown"

  const cleanUrl = url.toLowerCase().trim()

  // 전화번호 패턴
  if (/^(\+?66|0)[0-9\s\-$$$$]{8,}$/.test(cleanUrl.replace(/\s/g, ""))) {
    return "phone"
  }

  // 이메일 패턴
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanUrl)) {
    return "email"
  }

  // 카카오톡 패턴
  if (cleanUrl.includes("kakao") || cleanUrl.includes("kakaotalk") || cleanUrl.startsWith("kakao:")) {
    return "kakao"
  }

  // 라인 패턴
  if (cleanUrl.includes("line.me") || cleanUrl.includes("line://") || cleanUrl.startsWith("line:")) {
    return "line"
  }

  // 페이스북 패턴
  if (cleanUrl.includes("facebook.com") || cleanUrl.includes("fb.com") || cleanUrl.includes("fb.me")) {
    return "facebook"
  }

  // 인스타그램 패턴
  if (cleanUrl.includes("instagram.com") || cleanUrl.includes("instagr.am")) {
    return "instagram"
  }

  // 유튜브 패턴
  if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
    return "youtube"
  }

  // 웹사이트 패턴
  if (
    cleanUrl.startsWith("http") ||
    cleanUrl.startsWith("www.") ||
    cleanUrl.includes(".com") ||
    cleanUrl.includes(".co.") ||
    cleanUrl.includes(".net") ||
    cleanUrl.includes(".org")
  ) {
    return "website"
  }

  return "unknown"
}

// 전화번호 포맷팅 함수
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ""

  // 숫자만 추출
  const numbers = phone.replace(/\D/g, "")

  // 태국 번호 형식으로 포맷팅
  if (numbers.startsWith("66")) {
    // +66 형식
    const withoutCountryCode = numbers.substring(2)
    if (withoutCountryCode.length === 9) {
      return `+66 ${withoutCountryCode.substring(0, 2)} ${withoutCountryCode.substring(2, 5)} ${withoutCountryCode.substring(5)}`
    }
  } else if (numbers.startsWith("0") && numbers.length === 10) {
    // 0XX XXX XXXX 형식
    return `${numbers.substring(0, 3)} ${numbers.substring(3, 6)} ${numbers.substring(6)}`
  } else if (numbers.length === 9) {
    // XX XXX XXXX 형식 (0 없이)
    return `0${numbers.substring(0, 2)} ${numbers.substring(2, 5)} ${numbers.substring(5)}`
  }

  return phone // 포맷팅할 수 없으면 원본 반환
}

// URL 정규화 함수
export function normalizeUrl(url: string): string {
  if (!url) return ""

  const trimmed = url.trim()

  // 이미 프로토콜이 있으면 그대로 반환
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed
  }

  // 특수 프로토콜들
  if (
    trimmed.startsWith("kakao:") ||
    trimmed.startsWith("line:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("mailto:")
  ) {
    return trimmed
  }

  // www로 시작하면 https 추가
  if (trimmed.startsWith("www.")) {
    return `https://${trimmed}`
  }

  // 도메인 패턴이면 https 추가
  if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/.test(trimmed)) {
    return `https://${trimmed}`
  }

  return trimmed
}

// 텍스트 자르기 함수
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

// 날짜 포맷팅 함수
export function formatDate(date: string | Date, locale = "ko-KR"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return ""

  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// 상대 시간 표시 함수
export function getRelativeTime(date: string | Date, locale = "ko-KR"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) return "방금 전"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`

  return formatDate(dateObj, locale)
}

// 숫자 포맷팅 함수 (조회수 등)
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
  return `${(num / 1000000).toFixed(1)}M`
}

// 색상 유틸리티
export function getStatusColor(status: "active" | "inactive" | "premium" | "promoted" | "breaking"): string {
  const colors = {
    active: "text-green-600 bg-green-50",
    inactive: "text-gray-600 bg-gray-50",
    premium: "text-amber-600 bg-amber-50",
    promoted: "text-blue-600 bg-blue-50",
    breaking: "text-red-600 bg-red-50",
  }

  return colors[status] || colors.active
}

// 카테고리 색상 매핑
export function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    음식점: "bg-orange-100 text-orange-800",
    숙박: "bg-blue-100 text-blue-800",
    쇼핑: "bg-purple-100 text-purple-800",
    서비스: "bg-green-100 text-green-800",
    의료: "bg-red-100 text-red-800",
    교육: "bg-indigo-100 text-indigo-800",
    여행: "bg-cyan-100 text-cyan-800",
    부동산: "bg-yellow-100 text-yellow-800",
    정책: "bg-slate-100 text-slate-800",
    교통: "bg-emerald-100 text-emerald-800",
    경제: "bg-teal-100 text-teal-800",
    문화: "bg-pink-100 text-pink-800",
    스포츠: "bg-lime-100 text-lime-800",
    일반: "bg-gray-100 text-gray-800",
  }

  return colors[category] || colors["일반"]
}

// 검색어 하이라이트
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text

  const regex = new RegExp(`(${searchTerm})`, "gi")
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}

// 디바운스 함수
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 쓰로틀 함수
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 로컬 스토리지 유틸리티
export const storage = {
  get: (key: string) => {
    if (typeof window === "undefined") return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set: (key: string, value: any) => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 저장 실패 시 무시
    }
  },

  remove: (key: string) => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(key)
    } catch {
      // 삭제 실패 시 무시
    }
  },
}

// 쿠키 유틸리티
export const cookies = {
  get: (name: string): string | null => {
    if (typeof document === "undefined") return null

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)

    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null
    }

    return null
  },

  set: (name: string, value: string, days = 7) => {
    if (typeof document === "undefined") return

    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)

    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  },

  remove: (name: string) => {
    if (typeof document === "undefined") return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  },
}

// 이미지 로딩 유틸리티
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

// 스크롤 유틸리티
export function scrollToTop(smooth = true) {
  if (typeof window === "undefined") return

  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "auto",
  })
}

export function scrollToElement(elementId: string, offset = 0) {
  if (typeof window === "undefined") return

  const element = document.getElementById(elementId)
  if (element) {
    const top = element.offsetTop - offset
    window.scrollTo({
      top,
      behavior: "smooth",
    })
  }
}

// 클립보드 유틸리티
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined") return false

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // 폴백: 임시 텍스트 영역 생성
    try {
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.opacity = "0"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      return true
    } catch {
      return false
    }
  }
}

// 파일 크기 포맷팅
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// 랜덤 ID 생성
export function generateId(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

// 배열 셔플
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

// 객체 깊은 복사
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any
  if (typeof obj === "object") {
    const cloned: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  return obj
}

// 환경 변수 체크
export function getEnvVar(name: string, defaultValue?: string): string {
  if (typeof process === "undefined") return defaultValue || ""
  return process.env[name] || defaultValue || ""
}

// 개발 환경 체크
export function isDevelopment(): boolean {
  return getEnvVar("NODE_ENV") === "development"
}

export function isProduction(): boolean {
  return getEnvVar("NODE_ENV") === "production"
}
