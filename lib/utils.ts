import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUrlType(url: string | null | undefined): string {
  if (!url) return "unknown"

  const urlString = String(url).toLowerCase()

  if (urlString.includes("maps.google") || urlString.includes("goo.gl/maps") || urlString.includes("maps.app.goo.gl")) {
    return "map"
  }

  if (urlString.includes("facebook.com") || urlString.includes("fb.com")) {
    return "facebook"
  }

  if (urlString.includes("instagram.com")) {
    return "instagram"
  }

  if (urlString.includes("youtube.com") || urlString.includes("youtu.be")) {
    return "youtube"
  }

  if (urlString.includes("tiktok.com")) {
    return "tiktok"
  }

  if (urlString.includes("line.me")) {
    return "line"
  }

  if (urlString.includes("open.kakao.com")) {
    return "kakao"
  }

  return "website"
}

export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return ""

  const phoneString = String(phone).replace(/\D/g, "")

  // Thai phone number format
  if (phoneString.length === 10 && phoneString.startsWith("0")) {
    return `${phoneString.slice(0, 3)}-${phoneString.slice(3, 6)}-${phoneString.slice(6)}`
  }

  // International format
  if (phoneString.length > 10) {
    return `+${phoneString.slice(0, 2)} ${phoneString.slice(2, 5)}-${phoneString.slice(5, 8)}-${phoneString.slice(8)}`
  }

  return String(phone)
}

export function formatCurrency(amount: number | string | null | undefined, currency = "THB"): string {
  if (!amount) return ""

  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount

  if (isNaN(numAmount)) return String(amount)

  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount)
}

export function timeAgo(dateString: string | null | undefined): string {
  if (!dateString) return "알 수 없음"

  try {
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
  } catch {
    return "알 수 없음"
  }
}

export function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[+]?[0-9\-$$$$\s]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 9
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return String(html)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "")
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
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

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
