import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // 관리자 페이지 접근 제한
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminPassword = request.headers.get("authorization")

    if (adminPassword !== "Bearer your-admin-password") {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Area"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
