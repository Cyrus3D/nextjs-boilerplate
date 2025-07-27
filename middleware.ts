import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 관리자 페이지 접근 시 커스텀 로그인 페이지로 리다이렉트
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard-mgmt-2024")) {
    // 이미 로그인된 상태인지 확인 (세션 스토리지는 서버에서 확인 불가하므로 쿠키 사용)
    const adminAuth = request.cookies.get("admin-auth")

    if (!adminAuth) {
      // 커스텀 로그인 페이지로 리다이렉트하지 않고 그대로 진행
      // 컴포넌트 레벨에서 인증 처리
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
