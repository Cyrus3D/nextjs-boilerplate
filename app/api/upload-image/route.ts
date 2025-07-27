import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "파일이 없습니다." }, { status: 400 })
    }

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 })
    }

    // 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "이미지 파일만 업로드 가능합니다." }, { status: 400 })
    }

    // 파일 이름 생성 (타임스탬프 + 원본 이름)
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_") // 특수문자 제거
    const fileName = `${timestamp}_${originalName}`

    // 업로드 디렉토리 생성
    const uploadDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 파일 저장
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    // 공개 URL 생성
    const imageUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      fileName: fileName,
    })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json({ success: false, error: "이미지 업로드 중 오류가 발생했습니다." }, { status: 500 })
  }
}
