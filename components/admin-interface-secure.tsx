"use client"

import { useState, useEffect } from "react"
import AdminLogin from "./admin-login"
import AdminInterface from "./admin-interface"
import { verifyAdminPassword, validateAdminSession } from "@/lib/admin-auth"
import { toast } from "@/hooks/use-toast"

export default function AdminInterfaceSecure() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // 세션 검증
    const isValid = validateAdminSession()
    setIsAuthenticated(isValid)
    setIsLoading(false)
  }, [])

  const handleLogin = async (password: string) => {
    try {
      setError("")
      const result = await verifyAdminPassword(password)

      if (result.success) {
        setIsAuthenticated(true)

        // 세션 저장
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin-auth", "true")
          sessionStorage.setItem("admin-auth-time", String(Date.now()))
        }

        toast({
          title: "로그인 성공",
          description: "관리자 인터페이스에 접근할 수 있습니다.",
        })
      } else {
        setError(result.error || "로그인에 실패했습니다.")
        toast({
          title: "로그인 실패",
          description: result.error || "비밀번호를 확인해주세요.",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다."
      setError(errorMessage)
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setError("")

    // 세션 정리
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin-auth")
      sessionStorage.removeItem("admin-auth-time")
    }

    toast({
      title: "로그아웃",
      description: "관리자 세션이 종료되었습니다.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} error={error} />
  }

  return <AdminInterface onLogout={handleLogout} />
}
