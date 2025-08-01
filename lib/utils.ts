import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatRelativeTime(date: Date | string): string {
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
  } else {
    return formatDate(date)
  }
}

export function getRelativeTime(date: Date | string): string {
  return formatRelativeTime(date)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Thai phone number formatting
  if (cleaned.startsWith("66")) {
    // International format: +66 XX XXX XXXX
    const number = cleaned.slice(2)
    if (number.length === 9) {
      return `+66 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`
    }
  } else if (cleaned.startsWith("0") && cleaned.length === 10) {
    // Local format: 0XX XXX XXXX
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }

  return phone // Return original if no pattern matches
}

export function detectUrlType(url: string): string {
  if (!url) return "unknown"

  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.com")) return "facebook"
  if (lowerUrl.includes("instagram.com")) return "instagram"
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "youtube"
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return "twitter"
  if (lowerUrl.includes("tiktok.com")) return "tiktok"
  if (lowerUrl.includes("line.me")) return "line"
  if (lowerUrl.includes("t.me") || lowerUrl.includes("telegram.me")) return "telegram"
  if (lowerUrl.includes("wa.me") || lowerUrl.includes("whatsapp.com")) return "whatsapp"
  if (lowerUrl.includes("maps.google.com") || lowerUrl.includes("goo.gl/maps")) return "map"

  return "website"
}

export function getUrlType(url: string): string {
  return detectUrlType(url)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname
    return domain.replace("www.", "")
  } catch {
    return ""
  }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function formatViewCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("ko-KR").format(num)
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
    .replace(/javascript:/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
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

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
