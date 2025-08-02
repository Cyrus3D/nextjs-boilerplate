import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date and time formatting utilities
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

export function getRelativeTime(date: string | Date): string {
  return formatRelativeTime(date)
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Thai phone number formatting
  if (cleaned.startsWith("66")) {
    // International format starting with 66
    const number = cleaned.substring(2)
    if (number.length === 9) {
      return `+66 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`
    }
  } else if (cleaned.startsWith("0") && cleaned.length === 10) {
    // Local format starting with 0
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`
  } else if (cleaned.length === 9) {
    // Without leading 0
    return `0${cleaned.substring(0, 2)}-${cleaned.substring(2, 5)}-${cleaned.substring(5)}`
  }

  // Return original if no pattern matches
  return phone
}

// Text utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
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

// URL utilities
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
    return new URL(url).hostname
  } catch {
    return ""
  }
}

export function getUrlType(url: string): "website" | "map" | "social" | "unknown" {
  if (!isValidUrl(url)) return "unknown"

  const domain = extractDomain(url).toLowerCase()

  // Map services
  if (domain.includes("maps.google") || domain.includes("goo.gl") || domain.includes("maps.app.goo.gl")) {
    return "map"
  }

  // Social media platforms
  if (
    domain.includes("facebook") ||
    domain.includes("instagram") ||
    domain.includes("youtube") ||
    domain.includes("twitter") ||
    domain.includes("tiktok") ||
    domain.includes("line.me") ||
    domain.includes("t.me")
  ) {
    return "social"
  }

  return "website"
}

export function detectUrlType(url: string): string {
  if (!url) return "website"

  const domain = extractDomain(url).toLowerCase()

  if (domain.includes("facebook.com")) return "facebook"
  if (domain.includes("instagram.com")) return "instagram"
  if (domain.includes("youtube.com") || domain.includes("youtu.be")) return "youtube"
  if (domain.includes("line.me")) return "line"
  if (domain.includes("t.me")) return "telegram"
  if (domain.includes("twitter.com") || domain.includes("x.com")) return "twitter"
  if (domain.includes("tiktok.com")) return "tiktok"
  if (domain.includes("wa.me") || domain.includes("whatsapp.com")) return "whatsapp"

  return "website"
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

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Utility functions
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
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
