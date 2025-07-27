"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Link, X, Check, Loader2 } from "lucide-react"

interface ImageUploadProps {
  currentImageUrl?: string
  onImageChange: (imageUrl: string) => void
  onImageRemove: () => void
}

export default function ImageUpload({ currentImageUrl, onImageChange, onImageRemove }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageChange(imageUrl.trim())
      setImageUrl("")
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("파일 크기는 5MB 이하여야 합니다.")
        return
      }

      // 파일 타입 체크
      if (!file.type.startsWith("image/")) {
        setUploadError("이미지 파일만 업로드 가능합니다.")
        return
      }

      setSelectedFile(file)
      setUploadError(null)

      // 미리보기 생성
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadError(null)

    try {
      // FormData 생성
      const formData = new FormData()
      formData.append("file", selectedFile)

      // 업로드 API 호출
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("업로드 실패")
      }

      const result = await response.json()

      if (result.success && result.imageUrl) {
        onImageChange(result.imageUrl)
        setSelectedFile(null)
        setPreviewUrl(null)
      } else {
        throw new Error(result.error || "업로드 실패")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError("이미지 업로드 중 오류가 발생했습니다.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadError(null)
  }

  return (
    <Card>
      <CardContent className="p-4">
        {/* 현재 이미지 표시 */}
        {currentImageUrl && (
          <div className="mb-4">
            <Label className="text-sm font-medium">현재 대표 이미지</Label>
            <div className="relative mt-2">
              <img
                src={currentImageUrl || "/placeholder.svg"}
                alt="Current image"
                className="w-full h-48 object-cover rounded-lg border"
              />
              <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={onImageRemove}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              이미지 URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              파일 업로드
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div>
              <Label htmlFor="image-url">이미지 URL 주소</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button onClick={handleUrlSubmit} disabled={!imageUrl.trim()}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, WebP 형식의 이미지 URL을 입력하세요</p>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div>
              <Label htmlFor="image-file">이미지 파일 선택</Label>
              <Input id="image-file" type="file" accept="image/*" onChange={handleFileSelect} className="mt-1" />
              <p className="text-xs text-gray-500 mt-1">최대 5MB, JPG, PNG, GIF, WebP 형식 지원</p>
            </div>

            {uploadError && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">{uploadError}</div>
            )}

            {previewUrl && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">미리보기</Label>
                <div className="relative">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleFileUpload} disabled={isUploading} className="flex-1">
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        업로드 중...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        업로드하기
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleRemoveFile}>
                    취소
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
