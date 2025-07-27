import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminPassword } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ success: false, error: "비밀번호가 필요합니다." }, { status: 400 })
    }

    const result = await verifyAdminPassword(password)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
