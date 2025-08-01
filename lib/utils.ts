import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(d)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
    const number = cleaned.substring(2)
    if (number.length === 9) {
      return `+66 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`
    }
  } else if (cleaned.startsWith("0") && cleaned.length === 10) {
    // Local format: 0XX XXX XXXX
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`
  }

  return phone
}

export function getUrlType(
  url: string,
): "website" | "facebook" | "line" | "instagram" | "youtube" | "tiktok" | "twitter" | "other" {
  if (!url) return "other"

  const lowerUrl = url.toLowerCase()

  if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.com")) return "facebook"
  if (lowerUrl.includes("line.me") || lowerUrl.includes("line://")) return "line"
  if (lowerUrl.includes("instagram.com")) return "instagram"
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "youtube"
  if (lowerUrl.includes("tiktok.com")) return "tiktok"
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return "twitter"

  return "website"
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

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
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

export function getTimeAgo(date: Date | string): string {
  const now = new Date()
  const past = typeof date === "string" ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return "방금 전"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`
  return `${Math.floor(diffInSeconds / 31536000)}년 전`
}
