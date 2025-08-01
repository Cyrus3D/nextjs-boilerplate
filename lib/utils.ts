import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "방금 전"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}일 전`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}주 전`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears}년 전`
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getUrlType(url: string): "website" | "map" | "unknown" {
  if (!url) return "unknown"

  const lowerUrl = url.toLowerCase()

  if (
    lowerUrl.includes("maps.google") ||
    lowerUrl.includes("goo.gl/maps") ||
    lowerUrl.includes("maps.app.goo.gl") ||
    lowerUrl.includes("google.com/maps")
  ) {
    return "map"
  }

  if (lowerUrl.startsWith("http://") || lowerUrl.startsWith("https://")) {
    return "website"
  }

  return "unknown"
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return ""

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")

  // Thai phone number formatting
  if (digits.length === 10 && digits.startsWith("0")) {
    // Format: 010-123-4567
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  if (digits.length === 9) {
    // Format: 81-123-4567 (without leading 0)
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
  }

  // International format
  if (digits.length > 10) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`
  }

  return phone
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[0-9\-$$$$\s]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 9
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

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

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export function calculateReadTime(text: string): number {
  const wordsPerMinute = 200 // Average reading speed
  const words = text.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/javascript:/gi, "")
}

export function extractTextFromHtml(html: string): string {
  // Remove HTML tags and get plain text
  return html.replace(/<[^>]*>/g, "").trim()
}

export function getColorFromString(str: string): string {
  // Generate a consistent color from a string
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = hash % 360
  return `hsl(${hue}, 70%, 50%)`
}
