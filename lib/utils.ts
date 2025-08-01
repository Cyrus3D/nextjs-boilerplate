import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-css-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(d)
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(d)
}

export function formatTime(date: string | Date): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(d)
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return ""

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Thai phone number formatting
  if (cleaned.startsWith("66")) {
    // International format: +66 XX XXX XXXX
    const withoutCountry = cleaned.slice(2)
    if (withoutCountry.length === 9) {
      return `+66 ${withoutCountry.slice(0, 2)} ${withoutCountry.slice(2, 5)} ${withoutCountry.slice(5)}`
    }
  } else if (cleaned.startsWith("0") && cleaned.length === 10) {
    // Local format: 0XX XXX XXXX
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  } else if (cleaned.length === 9) {
    // Without leading 0: XX XXX XXXX
    return `0${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`
  }

  return phone // Return original if no pattern matches
}

export function getUrlType(
  url: string,
):
  | "website"
  | "facebook"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "line"
  | "kakao"
  | "phone"
  | "email"
  | "maps"
  | "unknown" {
  if (!url) return "unknown"

  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.com")) return "facebook"
  if (lowerUrl.includes("instagram.com")) return "instagram"
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "youtube"
  if (lowerUrl.includes("tiktok.com")) return "tiktok"
  if (lowerUrl.includes("line.me") || lowerUrl.startsWith("line://")) return "line"
  if (lowerUrl.includes("kakao") || lowerUrl.startsWith("kakao")) return "kakao"
  if (lowerUrl.startsWith("tel:") || lowerUrl.startsWith("phone:")) return "phone"
  if (lowerUrl.startsWith("mailto:")) return "email"
  if (lowerUrl.includes("maps.google.com") || lowerUrl.includes("goo.gl/maps") || lowerUrl.includes("maps.app.goo.gl"))
    return "maps"

  return "website"
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200 // Average reading speed
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
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

export function formatViewCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return "방금 전"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`
  return `${Math.floor(diffInSeconds / 31536000)}년 전`
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/javascript:/gi, "")
}

export function generateExcerpt(content: string, maxLength = 150): string {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, "").trim()
  return truncateText(plainText, maxLength)
}
