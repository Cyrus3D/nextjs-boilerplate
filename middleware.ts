import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 관리자 페이지 경로 (추측하기 어렵게 변경)
const ADMIN_PATH = "/dashboard-mgmt-2024"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "your-secure-admin-password-2024"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 관리자 페이지 접근 제한
  if (pathname.startsWith(ADMIN_PATH)) {
    // Basic Auth 헤더 확인
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return new Response("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Area"',
        },
      })
    }

    // Basic Auth 디코딩
    const base64Credentials = authHeader.split(" ")[1]
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii")
    const [username, password] = credentials.split(":")

    // 사용자명과 비밀번호 확인
    if (username !== "admin" || password !== ADMIN_PASSWORD) {
      return new Response("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Area"',
        },
      })
    }
  }

  // 기존 /admin 경로로 접근 시 404 처리
  if (pathname.startsWith("/admin")) {
    return new Response("Not Found", { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard-mgmt-2024/:path*", "/admin/:path*"],
}
