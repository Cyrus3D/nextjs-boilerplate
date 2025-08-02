import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date and Time Utilities
export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  })
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Bangkok",
  })
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "방금 전"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}분 전`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}시간 전`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}일 전`
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months}개월 전`
  } else {
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years}년 전`
  }
}

export function getRelativeTime(date: string | Date): string {
  return formatRelativeTime(date)
}

// Phone Number Formatting
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Thai phone number formatting
  if (cleaned.startsWith("66")) {
    // International format: +66 XX XXX XXXX
    const number = cleaned.substring(2)
    if (number.length === 9) {
      return `+66 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`
    }
  } else if (cleaned.startsWith("0") && cleaned.length === 10) {
    // Local format: 0XX XXX XXXX
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`
  } else if (cleaned.length === 9) {
    // Without leading 0: XX XXX XXXX
    return `0${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`
  }

  // Return original if no pattern matches
  return phone
}

// URL and Type Detection
export function getUrlType(url: string): "website" | "map" | "social" | "unknown" {
  if (!url) return "unknown"

  const lowerUrl = url.toLowerCase()

  // Map URLs
  if (lowerUrl.includes("maps.google") || lowerUrl.includes("goo.gl/maps") || lowerUrl.includes("maps.app.goo.gl")) {
    return "map"
  }

  // Social media URLs
  const socialDomains = [
    "facebook.com",
    "instagram.com",
    "youtube.com",
    "line.me",
    "twitter.com",
    "tiktok.com",
    "linkedin.com",
  ]
  if (socialDomains.some((domain) => lowerUrl.includes(domain))) {
    return "social"
  }

  // Regular website
  if (lowerUrl.startsWith("http") || lowerUrl.startsWith("www.")) {
    return "website"
  }

  return "unknown"
}

export function detectUrlType(url: string): string {
  if (!url) return "website"

  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes("facebook.com")) return "facebook"
  if (lowerUrl.includes("instagram.com")) return "instagram"
  if (lowerUrl.includes("youtube.com")) return "youtube"
  if (lowerUrl.includes("line.me")) return "line"
  if (lowerUrl.includes("twitter.com")) return "twitter"
  if (lowerUrl.includes("tiktok.com")) return "tiktok"
  if (lowerUrl.includes("linkedin.com")) return "linkedin"
  if (lowerUrl.includes("whatsapp.com")) return "whatsapp"
  if (lowerUrl.includes("t.me")) return "telegram"
  if (lowerUrl.includes("kakao")) return "kakao"

  return "website"
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname
    return domain.replace("www.", "")
  } catch {
    return url
  }
}

// Text Processing
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function removeHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/javascript:/gi, "")
}

// Number Formatting
export function formatViewCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

export function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR")
}

// Validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Utility Functions
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200 // Average reading speed
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// JSON Utilities
export function parseJsonSafely<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function removeEmptyFields<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== "") {
      result[key as keyof T] = value
    }
  }

  return result
}
