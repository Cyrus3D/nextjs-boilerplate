import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date and time formatting
export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) return "방금 전"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`
  return `${Math.floor(diffInSeconds / 31536000)}년 전`
}

export function getRelativeTime(date: string | Date): string {
  return formatRelativeTime(date)
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Thai phone number formatting
  if (cleaned.startsWith("66")) {
    // International format +66
    const number = cleaned.substring(2)
    if (number.length === 9) {
      return `+66 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`
    }
  } else if (cleaned.startsWith("0") && cleaned.length === 10) {
    // Local format 0XX-XXX-XXXX
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`
  } else if (cleaned.length === 9) {
    // Without leading 0
    return `0${cleaned.substring(0, 2)}-${cleaned.substring(2, 5)}-${cleaned.substring(5)}`
  }

  // Return original if no pattern matches
  return phone
}

// URL utilities
export function detectUrlType(url: string): string {
  if (!url) return "unknown"

  const domain = url.toLowerCase()
  if (domain.includes("facebook.com") || domain.includes("fb.com")) return "facebook"
  if (domain.includes("instagram.com")) return "instagram"
  if (domain.includes("youtube.com") || domain.includes("youtu.be")) return "youtube"
  if (domain.includes("line.me") || domain.includes("line.")) return "line"
  if (domain.includes("kakao")) return "kakao"
  if (domain.includes("whatsapp")) return "whatsapp"
  if (domain.includes("telegram")) return "telegram"
  if (domain.includes("twitter.com") || domain.includes("x.com")) return "twitter"
  if (domain.includes("tiktok.com")) return "tiktok"
  if (domain.includes("maps.google") || domain.includes("goo.gl/maps")) return "map"
  return "website"
}

export function getUrlType(url: string): "website" | "map" | "social" | "unknown" {
  if (!url) return "unknown"

  const domain = url.toLowerCase()
  if (domain.includes("maps.google") || domain.includes("goo.gl/maps") || domain.includes("maps.app.goo.gl")) {
    return "map"
  }
  if (
    domain.includes("facebook.com") ||
    domain.includes("instagram.com") ||
    domain.includes("youtube.com") ||
    domain.includes("twitter.com") ||
    domain.includes("tiktok.com") ||
    domain.includes("line.me")
  ) {
    return "social"
  }
  if (domain.startsWith("http") || domain.includes(".com") || domain.includes(".co")) {
    return "website"
  }
  return "unknown"
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

// Text utilities
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
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
}

// Number formatting
export function formatViewCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

export function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR")
}

// Utility functions
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }) as T
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

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
