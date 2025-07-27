"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle } from "lucide-react"

export default function SecurityNotice() {
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const loginAttempts = Number.parseInt(localStorage.getItem("login-attempts") || "0")
    setAttempts(loginAttempts)

    // 24시간 후 시도 횟수 리셋
    const lastReset = localStorage.getItem("attempts-reset-time")
    const now = Date.now()
    const resetTime = 24 * 60 * 60 * 1000 // 24시간

    if (!lastReset || now - Number.parseInt(lastReset) > resetTime) {
      localStorage.setItem("login-attempts", "0")
      localStorage.setItem("attempts-reset-time", now.toString())
      setAttempts(0)
    }
  }, [])

  if (attempts >= 3) {
    return (
      <Alert className="border-red-500 bg-red-50 mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-red-700">
          <strong>보안 경고:</strong> 여러 번의 로그인 시도가 감지되었습니다. 24시간 후에 시도 횟수가 리셋됩니다.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-blue-500 bg-blue-50 mb-4">
      <Shield className="h-4 w-4" />
      <AlertDescription className="text-blue-700">보안을 위해 모든 관리자 활동이 기록됩니다.</AlertDescription>
    </Alert>
  )
}
