"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "your-secure-admin-password-2024"
const SESSION_DURATION = 2 * 60 * 60 * 1000 // 2시간

export async function verifyAdminPassword(password: string) {
  if (!password || password.trim() === "") {
    return { success: false, error: "비밀번호를 입력해주세요." }
  }

  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: "관리자 비밀번호가 올바르지 않습니다." }
  }

  // 세션 쿠키 설정
  const cookieStore = cookies()
  const sessionToken = generateSessionToken()

  cookieStore.set("admin-session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION / 1000, // 초 단위
  })

  return { success: true }
}

export async function checkAdminAuth() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("admin-session")

  if (!sessionToken) {
    return false
  }

  // 실제 환경에서는 데이터베이스에서 세션 검증
  return true
}

export async function adminLogout() {
  const cookieStore = cookies()
  cookieStore.delete("admin-session")
  redirect("/")
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
