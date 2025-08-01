import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format relative time (e.g., "3시간 전", "2일 전")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

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

// Determine URL type (Google Maps, Website, etc.)
export function getUrlType(url: string): "maps" | "website" | "unknown" {
  if (!url) return "unknown"

  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes("maps.google") || lowerUrl.includes("goo.gl/maps") || lowerUrl.includes("maps.app.goo.gl")) {
    return "maps"
  }

  if (lowerUrl.startsWith("http://") || lowerUrl.startsWith("https://")) {
    return "website"
  }

  return "unknown"
}

// Format Thai phone numbers
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ""

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "")

  // Thai mobile numbers (10 digits starting with 0)
  if (digits.length === 10 && digits.startsWith("0")) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  // Thai landline numbers (9 digits starting with 0)
  if (digits.length === 9 && digits.startsWith("0")) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
  }

  // International format
  if (digits.length > 10) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`
  }

  return phone
}

// Debounce function for search
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

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

// Create URL-friendly slug
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

// Format currency (Thai Baht)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Validate email address
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate Thai phone number
export function isValidThaiPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "")

  // Thai mobile: 10 digits starting with 0
  // Thai landline: 9 digits starting with 0
  return (digits.length === 10 && digits.startsWith("0")) || (digits.length === 9 && digits.startsWith("0"))
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Check if string is URL
export function isUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

// Extract domain from URL
export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname
    return domain.replace(/^www\./, "")
  } catch {
    return ""
  }
}

// Calculate reading time (words per minute)
export function calculateReadingTime(text: string, wpm = 200): number {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wpm)
  return Math.max(1, minutes) // Minimum 1 minute
}

// Format date for display
export function formatDisplayDate(date: string | Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

// Check if date is today
export function isToday(date: string | Date): boolean {
  const today = new Date()
  const targetDate = new Date(date)

  return today.toDateString() === targetDate.toDateString()
}

// Check if date is this week
export function isThisWeek(date: string | Date): boolean {
  const today = new Date()
  const targetDate = new Date(date)
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  return targetDate >= weekAgo && targetDate <= today
}
