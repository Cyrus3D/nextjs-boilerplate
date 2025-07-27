import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminPassword } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password || password.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "관리자 비밀번호를 입력해주세요.",
        },
        { status: 400 },
      )
    }

    const result = await verifyAdminPassword(password)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Admin auth error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
