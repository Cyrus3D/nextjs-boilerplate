"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Wand2, Check, X, RefreshCw, AlertCircle, FileText, ImageIcon, Loader2, Crown } from "lucide-react"
import {
  parseBusinessCardData,
  saveBusinessCard,
  getBusinessCards,
  updateBusinessCard,
  deleteBusinessCard,
} from "../lib/admin-actions"
import ImageUpload from "./image-upload"
import PremiumManagement from "./admin-premium-management"

interface ParsedBusinessData {
  title: string
  description: string
  category: string
  location?: string
  phone?: string
  kakaoId?: string
  lineId?: string
  website?: string
  hours?: string
  price?: string
  promotion?: string
  tags: string[]
  rating?: number
  isPromoted?: boolean
  image?: string
  isPremium?: boolean
  premiumExpiresAt?: string
}

interface BusinessCard extends ParsedBusinessData {
  id: number
  exposureCount?: number
  lastExposedAt?: string
  exposureWeight?: number
}

export default function AdminInterface() {
  const [inputText, setInputText] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedBusinessData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState<"create" | "manage" | "premium">("create")
  const [existingCards, setExistingCards] = useState<BusinessCard[]>([])
  const [selectedCardForEdit, setSelectedCardForEdit] = useState<BusinessCard | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoadingCards, setIsLoadingCards] = useState(false)

  const handleTextSubmit = async () => {
    if (!inputText.trim()) {
      setMessage({ type: "error", text: "텍스트를 입력해주세요." })
      return
    }

    setIsProcessing(true)
    setMessage(null)

    try {
      const result = await parseBusinessCardData(inputText, "text")
      if (result.success && result.data) {
        setParsedData(result.data)
        setMessage({ type: "success", text: "텍스트가 성공적으로 분석되었습니다!" })
      } else {
        setMessage({ type: "error", text: result.error || "분석 중 오류가 발생했습니다." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "API 호출 중 오류가 발생했습니다." })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImageSubmit = async () => {
    if (!imageFile) {
      setMessage({ type: "error", text: "이미지를 선택해주세요." })
      return
    }

    setIsProcessing(true)
    setMessage(null)

    try {
      // 이미지를 base64로 변환
      const base64 = await fileToBase64(imageFile)
      const result = await parseBusinessCardData(base64, "image")

      if (result.success && result.data) {
        setParsedData(result.data)
        setMessage({ type: "success", text: "이미지가 성공적으로 분석되었습니다!" })
      } else {
        setMessage({ type: "error", text: result.error || "분석 중 오류가 발생했습니다." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "이미지 처리 중 오류가 발생했습니다." })
    } finally {
      setIsProcessing(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSave = async () => {
    if (!parsedData) return

    setIsSaving(true)
    setMessage(null)

    try {
      const result = await saveBusinessCard(parsedData)
      if (result.success) {
        setMessage({ type: "success", text: "비즈니스 카드가 성공적으로 저장되었습니다!" })
        // 폼 초기화
        setInputText("")
        setImageFile(null)
        setParsedData(null)
        setEditMode(false)
        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setMessage({ type: "error", text: result.error || "저장 중 오류가 발생했습니다." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "저장 중 오류가 발생했습니다." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleFieldChange = (field: keyof ParsedBusinessData, value: any) => {
    if (!parsedData) return
    setParsedData({ ...parsedData, [field]: value })
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    handleFieldChange("tags", tags)
  }

  const resetForm = () => {
    setInputText("")
    setImageFile(null)
    setParsedData(null)
    setEditMode(false)
    setMessage(null)
  }

  const loadExistingCards = async () => {
    setIsLoadingCards(true)
    try {
      const cards = await getBusinessCards()
      setExistingCards(cards)
    } catch (error) {
      setMessage({ type: "error", text: "기존 카드를 불러오는 중 오류가 발생했습니다." })
    } finally {
      setIsLoadingCards(false)
    }
  }

  useEffect(() => {
    if (activeTab === "manage" || activeTab === "premium") {
      loadExistingCards()
    }
  }, [activeTab])

  const handleUpdateCard = async (card: BusinessCard) => {
    setIsSaving(true)
    try {
      const result = await updateBusinessCard(card)
      if (result.success) {
        setMessage({ type: "success", text: "카드가 성공적으로 업데이트되었습니다!" })
        setSelectedCardForEdit(null)
        loadExistingCards()
      } else {
        setMessage({ type: "error", text: result.error || "업데이트 중 오류가 발생했습니다." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "업데이트 중 오류가 발생했습니다." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm("정말로 이 카드를 삭제하시겠습니까?")) return

    setIsSaving(true)
    try {
      const result = await deleteBusinessCard(cardId)
      if (result.success) {
        setMessage({ type: "success", text: "카드가 성공적으로 삭제되었습니다!" })
        setSelectedCardForEdit(null)
        loadExistingCards()
      } else {
        setMessage({ type: "error", text: result.error || "삭제 중 오류가 발생했습니다." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "삭제 중 오류가 발생했습니다." })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-6 w-6" />
              비즈니스 카드 관리자
            </CardTitle>
            <CardDescription>
              자연어 텍스트나 이미지를 업로드하여 AI가 구조화된 비즈니스 정보로 변환합니다.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 탭 네비게이션 */}
        <Card>
          <CardContent className="p-0">
            <div className="flex border-b">
              <button
                className={`flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === "create"
                    ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("create")}
              >
                새 카드 등록
              </button>
              <button
                className={`flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === "manage"
                    ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("manage")}
              >
                기존 카드 관리
              </button>
              <button
                className={`flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === "premium"
                    ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("premium")}
              >
                <Crown className="h-4 w-4 inline mr-2" />
                프리미엄 관리
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 메시지 표시 */}
        {message && (
          <Alert className={message.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {activeTab === "create" ? (
          // 기존 새 카드 등록 UI (이전과 동일)
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 입력 섹션 */}
            <div className="space-y-6">
              {/* 텍스트 입력 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    텍스트 입력
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="text-input">비즈니스 정보 텍스트</Label>
                    <Textarea
                      id="text-input"
                      placeholder="비즈니스 정보를 자연어로 입력하세요. 예: '윤키친은 공항에서 15분 거리에 있는 한식당입니다. 무한리필 숯불구이를 제공하며 전화번호는 082-048-8139입니다...'"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      rows={8}
                      className="resize-none"
                    />
                  </div>
                  <Button onClick={handleTextSubmit} disabled={isProcessing || !inputText.trim()} className="w-full">
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        텍스트 분석하기
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* 이미지 업로드 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    이미지 업로드
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="image-input">이미지 파일</Label>
                    <Input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                    {imageFile && <p className="text-sm text-gray-600 mt-2">선택된 파일: {imageFile.name}</p>}
                  </div>
                  <Button onClick={handleImageSubmit} disabled={isProcessing || !imageFile} className="w-full">
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        이미지 분석하기
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 결과 섹션 (이전과 동일) */}
            <div className="space-y-6">
              {parsedData && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>분석 결과</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
                          {editMode ? "미리보기" : "수정하기"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={resetForm}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editMode ? (
                      // 편집 모드 (이전과 동일하지만 이미지 업로드 컴포넌트 추가)
                      <div className="space-y-4">
                        <div>
                          <Label>제목</Label>
                          <Input
                            value={parsedData.title}
                            onChange={(e) => handleFieldChange("title", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label>설명</Label>
                          <Textarea
                            value={parsedData.description}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
                            rows={3}
                          />
                        </div>

                        <ImageUpload
                          currentImageUrl={parsedData.image}
                          onImageChange={(imageUrl) => handleFieldChange("image", imageUrl)}
                          onImageRemove={() => handleFieldChange("image", undefined)}
                        />

                        {/* 나머지 필드들... (이전과 동일) */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>카테고리</Label>
                            <Input
                              value={parsedData.category}
                              onChange={(e) => handleFieldChange("category", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>위치</Label>
                            <Input
                              value={parsedData.location || ""}
                              onChange={(e) => handleFieldChange("location", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>전화번호</Label>
                            <Input
                              value={parsedData.phone || ""}
                              onChange={(e) => handleFieldChange("phone", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>카카오톡 ID</Label>
                            <Input
                              value={parsedData.kakaoId || ""}
                              onChange={(e) => handleFieldChange("kakaoId", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>웹사이트</Label>
                            <Input
                              value={parsedData.website || ""}
                              onChange={(e) => handleFieldChange("website", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>영업시간</Label>
                            <Input
                              value={parsedData.hours || ""}
                              onChange={(e) => handleFieldChange("hours", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>가격</Label>
                            <Input
                              value={parsedData.price || ""}
                              onChange={(e) => handleFieldChange("price", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>평점</Label>
                            <Input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={parsedData.rating || ""}
                              onChange={(e) =>
                                handleFieldChange("rating", Number.parseFloat(e.target.value) || undefined)
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <Label>프로모션</Label>
                          <Input
                            value={parsedData.promotion || ""}
                            onChange={(e) => handleFieldChange("promotion", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label>태그 (쉼표로 구분)</Label>
                          <Input
                            value={parsedData.tags.join(", ")}
                            onChange={(e) => handleTagsChange(e.target.value)}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="promoted"
                            checked={parsedData.isPromoted || false}
                            onChange={(e) => handleFieldChange("isPromoted", e.target.checked)}
                          />
                          <Label htmlFor="promoted">추천 비즈니스</Label>
                        </div>
                      </div>
                    ) : (
                      // 미리보기 모드 (이전과 동일)
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{parsedData.title}</h3>
                          <Badge className="mt-1">{parsedData.category}</Badge>
                          {parsedData.isPromoted && (
                            <Badge variant="secondary" className="ml-2">
                              추천
                            </Badge>
                          )}
                        </div>

                        <p className="text-gray-700">{parsedData.description}</p>

                        {parsedData.location && (
                          <p>
                            <strong>위치:</strong> {parsedData.location}
                          </p>
                        )}

                        {parsedData.phone && (
                          <p>
                            <strong>전화:</strong> {parsedData.phone}
                          </p>
                        )}

                        {parsedData.kakaoId && (
                          <p>
                            <strong>카카오톡:</strong> {parsedData.kakaoId}
                          </p>
                        )}

                        {parsedData.website && (
                          <p>
                            <strong>웹사이트:</strong> {parsedData.website}
                          </p>
                        )}

                        {parsedData.hours && (
                          <p>
                            <strong>영업시간:</strong> {parsedData.hours}
                          </p>
                        )}

                        {parsedData.price && (
                          <p>
                            <strong>가격:</strong> {parsedData.price}
                          </p>
                        )}

                        {parsedData.promotion && (
                          <p>
                            <strong>프로모션:</strong> {parsedData.promotion}
                          </p>
                        )}

                        {parsedData.rating && (
                          <p>
                            <strong>평점:</strong> {parsedData.rating}/5
                          </p>
                        )}

                        {parsedData.tags.length > 0 && (
                          <div>
                            <strong>태그:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {parsedData.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <Separator />

                    <div className="flex gap-3">
                      <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            저장 중...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            데이터베이스에 저장
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={resetForm} disabled={isSaving}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        초기화
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : activeTab === "manage" ? (
          // 기존 카드 관리 UI
          <div className="space-y-6">
            {/* 검색 및 필터 */}
            <Card>
              <CardHeader>
                <CardTitle>기존 카드 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Input
                    placeholder="카드 제목으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={loadExistingCards} disabled={isLoadingCards}>
                    {isLoadingCards ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 카드 목록 */}
            {isLoadingCards ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>카드를 불러오는 중...</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {existingCards
                  .filter(
                    (card) =>
                      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      card.description.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((card) => (
                    <Card key={card.id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{card.title}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              <Badge className="mt-1">{card.category}</Badge>
                              {card.isPremium && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Crown className="h-3 w-3 mr-1" />
                                  프리미엄
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => setSelectedCardForEdit(card)}>
                              수정
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">{card.description}</p>
                        {card.location && <p className="text-xs text-gray-500 mb-1">📍 {card.location}</p>}
                        {card.phone && <p className="text-xs text-gray-500 mb-1">📞 {card.phone}</p>}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {card.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          노출: {card.exposureCount || 0}회 | 가중치: {(card.exposureWeight || 1.0).toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        ) : (
          // 프리미엄 관리 탭
          <PremiumManagement cards={existingCards} onUpdateCard={handleUpdateCard} />
        )}
      </div>

      {/* 기존 카드 편집 모달 */}
      {selectedCardForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>카드 수정</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedCardForEdit(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* 편집 폼 - parsedData와 동일한 구조 사용 */}
              <div className="space-y-4">
                <div>
                  <Label>제목</Label>
                  <Input
                    value={selectedCardForEdit.title}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label>설명</Label>
                  <Textarea
                    value={selectedCardForEdit.description}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <ImageUpload
                  currentImageUrl={selectedCardForEdit.image}
                  onImageChange={(imageUrl) => setSelectedCardForEdit({ ...selectedCardForEdit, image: imageUrl })}
                  onImageRemove={() => setSelectedCardForEdit({ ...selectedCardForEdit, image: undefined })}
                />

                <div>
                  <Label>카테고리</Label>
                  <Input
                    value={selectedCardForEdit.category}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, category: e.target.value })}
                  />
                </div>

                <div>
                  <Label>위치</Label>
                  <Input
                    value={selectedCardForEdit.location || ""}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, location: e.target.value })}
                  />
                </div>

                <div>
                  <Label>전화번호</Label>
                  <Input
                    value={selectedCardForEdit.phone || ""}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label>카카오톡 ID</Label>
                  <Input
                    value={selectedCardForEdit.kakaoId || ""}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, kakaoId: e.target.value })}
                  />
                </div>

                <div>
                  <Label>웹사이트</Label>
                  <Input
                    value={selectedCardForEdit.website || ""}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, website: e.target.value })}
                  />
                </div>

                <div>
                  <Label>영업시간</Label>
                  <Input
                    value={selectedCardForEdit.hours || ""}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, hours: e.target.value })}
                  />
                </div>

                <div>
                  <Label>가격</Label>
                  <Input
                    value={selectedCardForEdit.price || ""}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, price: e.target.value })}
                  />
                </div>

                <div>
                  <Label>평점</Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={selectedCardForEdit.rating || ""}
                    onChange={(e) =>
                      setSelectedCardForEdit({
                        ...selectedCardForEdit,
                        rating: Number.parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>프로모션</Label>
                  <Input
                    value={selectedCardForEdit.promotion || ""}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, promotion: e.target.value })}
                  />
                </div>

                <div>
                  <Label>태그 (쉼표로 구분)</Label>
                  <Input
                    value={selectedCardForEdit.tags.join(", ")}
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag.length > 0)
                      setSelectedCardForEdit({ ...selectedCardForEdit, tags: tags })
                    }}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="promoted"
                    checked={selectedCardForEdit.isPromoted || false}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, isPromoted: e.target.checked })}
                  />
                  <Label htmlFor="promoted">추천 비즈니스</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={() => handleUpdateCard(selectedCardForEdit)} disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        업데이트 중...
                      </>
                    ) : (
                      "업데이트"
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteCard(selectedCardForEdit.id)}
                    disabled={isSaving}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
