"use client"

import { useEffect, useState } from "react"

export default function ServiceWorkerRegistration() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only register service worker in production and if supported
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      registerServiceWorker()
    }
  }, [])

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      })

      console.log("Service Worker registered successfully:", registration)
      setIsRegistered(true)

      // Handle updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New content is available, prompt user to refresh
              if (confirm("새로운 버전이 사용 가능합니다. 페이지를 새로고침하시겠습니까?")) {
                window.location.reload()
              }
            }
          })
        }
      })
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
    }
  }

  // Don't render anything in development or if service workers aren't supported
  if (process.env.NODE_ENV !== "production" || typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
          <p className="text-sm">Service Worker 등록 실패: {error}</p>
        </div>
      )}
      {isRegistered && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="text-sm">오프라인 지원이 활성화되었습니다</p>
        </div>
      )}
    </div>
  )
}
