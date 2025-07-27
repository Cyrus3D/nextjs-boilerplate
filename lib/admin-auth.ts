export interface AdminAuthResult {
  success: boolean
  error?: string
}

export async function verifyAdminPassword(password: string): Promise<AdminAuthResult> {
  // 환경 변수에서 관리자 비밀번호 가져오기
  const adminPassword = process.env.ADMIN_PASSWORD || "your-secure-admin-password-2024"

  if (!password || password.trim() === "") {
    return {
      success: false,
      error: "비밀번호를 입력해주세요.",
    }
  }

  if (password === adminPassword) {
    return {
      success: true,
    }
  } else {
    return {
      success: false,
      error: "관리자 비밀번호가 올바르지 않습니다.",
    }
  }
}

// 세션 검증 함수
export function validateAdminSession(): boolean {
  if (typeof window === "undefined") return false

  const authStatus = sessionStorage.getItem("admin-auth")
  const authTime = sessionStorage.getItem("admin-auth-time")

  if (authStatus === "true" && authTime) {
    const loginTime = Number.parseInt(authTime)
    const currentTime = Date.now()
    const sessionDuration = 2 * 60 * 60 * 1000 // 2시간

    if (currentTime - loginTime < sessionDuration) {
      return true
    } else {
      // 세션 만료
      sessionStorage.removeItem("admin-auth")
      sessionStorage.removeItem("admin-auth-time")
      return false
    }
  }

  return false
}
