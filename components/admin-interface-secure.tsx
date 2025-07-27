"use client"

import { useState, useEffect } from "react"
import AdminInterface from "./admin-interface"
import AdminLogin from "./admin-login"

const ADMIN_PASSWORD = "your-secure-admin-password-2024" // 실제로는 환경 변수 사용

export default function SecureAdminInterface() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 세션 스토리지에서 인증 상태 확인
    const authStatus = sessionStorage.getItem("admin-auth")
    const authTime = sessionStorage.getItem("admin-auth-time")

    if (authStatus === "true" && authTime) {
      const loginTime = Number.parseInt(authTime)
      const currentTime = Date.now()
      const sessionDuration = 2 * 60 * 60 * 1000 // 2시간

      if (currentTime - loginTime < sessionDuration) {
        setIsAuthenticated(true)
      } else {
        // 세션 만료
        sessionStorage.removeItem("admin-auth")
        sessionStorage.removeItem("admin-auth-time")
      }
    }

    setIsLoading(false)
  }, [])

  const handleLogin = async (password: string) => {
    setLoginError("")

    // 비밀번호 검증
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin-auth", "true")
      sessionStorage.setItem("admin-auth-time", Date.now().toString())

      // 로그인 시도 횟수 초기화
      localStorage.removeItem("login-attempts")
    } else {
      setLoginError("관리자 비밀번호가 올바르지 않습니다.")

      // 잘못된 시도 기록
      const attempts = Number.parseInt(localStorage.getItem("login-attempts") || "0")
      const newAttempts = attempts + 1
      localStorage.setItem("login-attempts", newAttempts.toString())

      if (newAttempts >= 5) {
        setLoginError("너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.")

        // 5분 후 시도 횟수 초기화
        setTimeout(
          () => {
            localStorage.removeItem("login-attempts")
          },
          5 * 60 * 1000,
        )
      }
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin-auth")
    sessionStorage.removeItem("admin-auth-time")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} error={loginError} />
  }

  return (
    <div>
      {/* 로그아웃 버튼 */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          로그아웃
        </button>
      </div>

      <AdminInterface />
    </div>
  )
}
