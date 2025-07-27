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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Wand2,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  FileText,
  ImageIcon,
  Loader2,
  Crown,
  Camera,
  Trash2,
} from "lucide-react"
import {
  parseBusinessCardData,
  saveBusinessCard,
  getBusinessCards,
  updateBusinessCard,
  deleteBusinessCard,
  deleteMultipleBusinessCards,
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
  similarityGroup?: number
  similarityColor?: string
}

// 유사도 계산 함수 - 제목과 내용만 사용
function calculateSimilarity(card1: BusinessCard, card2: BusinessCard): number {
  let score = 0

  // 제목 유사도 (가중치: 60%)
  const titleSimilarity = getTextSimilarity(card1.title, card2.title)
  score += titleSimilarity * 0.6

  // 설명 유사도 (가중치: 40%)
  const descSimilarity = getTextSimilarity(card1.description, card2.description)
  score += descSimilarity * 0.4

  return score
}

// 텍스트 유사도 계산 (간단한 단어 기반)
function getTextSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/)
  const words2 = text2.toLowerCase().split(/\s+/)

  const commonWords = words1.filter((word) => words2.includes(word))
  return commonWords.length / Math.max(words1.length, words2.length, 1)
}

// 유사도 그룹 생성
function createSimilarityGroups(cards: BusinessCard[]): BusinessCard[] {
  const threshold = 0.3 // 유사도 임계값
  const groups: BusinessCard[][] = []
  const colors = [
    "border-red-300 bg-red-50",
    "border-blue-300 bg-blue-50",
    "border-green-300 bg-green-50",
    "border-yellow-300 bg-yellow-50",
    "border-purple-300 bg-purple-50",
    "border-pink-300 bg-pink-50",
    "border-indigo-300 bg-indigo-50",
    "border-orange-300 bg-orange-50",
  ]

  const processedCards = [...cards]

  // 각 카드에 대해 유사한 카드들을 찾아 그룹화
  for (let i = 0; i < processedCards.length; i++) {
    if (processedCards[i].similarityGroup !== undefined) continue

    const currentGroup: BusinessCard[] = [processedCards[i]]

    for (let j = i + 1; j < processedCards.length; j++) {
      if (processedCards[j].similarityGroup !== undefined) continue

      const similarity = calculateSimilarity(processedCards[i], processedCards[j])
      if (similarity >= threshold) {
        currentGroup.push(processedCards[j])
      }
    }

    // 그룹이 2개 이상의 카드를 가지면 유사 그룹으로 처리
    if (currentGroup.length > 1) {
      const groupIndex = groups.length
      const groupColor = colors[groupIndex % colors.length]

      currentGroup.forEach((card) => {
        card.similarityGroup = groupIndex
        card.similarityColor = groupColor
      })

      groups.push(currentGroup)
    }
  }

  // 유사 그룹이 있는 카드들을 상단으로 정렬
  const similarCards = processedCards.filter((card) => card.similarityGroup !== undefined)
  const regularCards = processedCards.filter((card) => card.similarityGroup === undefined)

  // 유사 카드들을 그룹별로 정렬
  similarCards.sort((a, b) => (a.similarityGroup || 0) - (b.similarityGroup || 0))

  return [...similarCards, ...regularCards]
}

export default function AdminInterface() {
  const [inputText, setInputText] = useState("")
  const [ocrImageFile, setOcrImageFile] = useState<File | null>(null)
  const [inputMethod, setInputMethod] = useState<"text" | "image">("text")
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
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDataExtraction = async () => {
    if (inputMethod === "text" && !inputText.trim()) {
      setMessage({ type: "error", text: "텍스트를 입력해주세요." })
      return
    }

    if (inputMethod === "image" && !ocrImageFile) {
      setMessage({ type: "error", text: "이미지를 선택해주세요." })
      return
    }

    setIsProcessing(true)
    setMessage(null)

    try {
      let result
      if (inputMethod === "text") {
        result = await parseBusinessCardData(inputText, "text")
      } else {
        // 이미지를 base64로 변환
        const base64 = await fileToBase64(ocrImageFile!)
        result = await parseBusinessCardData(base64, "image")
      }

      if (result.success && result.data) {
        setParsedData(result.data)
        setMessage({
          type: "success",
          text: `${inputMethod === "text" ? "텍스트" : "이미지"}가 성공적으로 분석되었습니다!`,
        })
      } else {
        setMessage({ type: "error", text: result.error || "분석 중 오류가 발생했습니다." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "분석 중 오류가 발생했습니다." })
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
        resetForm()
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
    setOcrImageFile(null)
    setParsedData(null)
    setEditMode(false)
    setMessage(null)
    setInputMethod("text")
  }

  const loadExistingCards = async () => {
    setIsLoadingCards(true)
    try {
      const cards = await getBusinessCards()
      // 유사도 그룹 생성 및 정렬
      const cardsWithSimilarity = createSimilarityGroups(cards)
      setExistingCards(cardsWithSimilarity)
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

  // 체크박스 선택 처리
  const handleCardSelect = (cardId: number, checked: boolean) => {
    const newSelected = new Set(selectedCards)
    if (checked) {
      newSelected.add(cardId)
    } else {
      newSelected.delete(cardId)
    }
    setSelectedCards(newSelected)
  }

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const filteredCards = existingCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setSelectedCards(new Set(filteredCards.map((card) => card.id)))
    } else {
      setSelectedCards(new Set())
    }
  }

  // 선택된 카드들 일괄 삭제
  const handleDeleteSelected = async () => {
    if (selectedCards.size === 0) return

    if (!confirm(`선택된 ${selectedCards.size}개의 카드를 정말로 삭제하시겠습니까?`)) return

    setIsDeleting(true)
    try {
      const result = await deleteMultipleBusinessCards(Array.from(selectedCards))
      if (result.success) {
        setMessage({
          type: "success",
          text: `${selectedCards.size}개의 카드가 성공적으로 삭제되었습니다!`,
        })
        setSelectedCards(new Set())
        loadExistingCards()
      } else {
        setMessage({ type: "error", text: result.error || "일괄 삭제 중 오류가 발생했습니다." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "일괄 삭제 중 오류가 발생했습니다." })
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredCards = existingCards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isAllSelected = filteredCards.length > 0 && filteredCards.every((card) => selectedCards.has(card.id))
  const isPartiallySelected = filteredCards.some((card) => selectedCards.has(card.id)) && !isAllSelected

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
              자연어 텍스트나 이미지에서 텍스트를 추출하여 AI가 구조화된 비즈니스 정보로 변환합니다.
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
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 입력 섹션 */}
            <div className="space-y-6">
              {/* 비즈니스 정보 추출 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    비즈니스 정보 추출
                  </CardTitle>
                  <CardDescription>
                    텍스트를 직접 입력하거나 이미지에서 텍스트를 추출하여 비즈니스 정보를 분석합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 입력 방법 선택 */}
                  <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                    <button
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        inputMethod === "text"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setInputMethod("text")}
                    >
                      <FileText className="h-4 w-4" />
                      텍스트 입력
                    </button>
                    <button
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        inputMethod === "image"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setInputMethod("image")}
                    >
                      <Camera className="h-4 w-4" />
                      이미지 OCR
                    </button>
                  </div>

                  {/* 텍스트 입력 */}
                  {inputMethod === "text" && (
                    <div className="space-y-3">
                      <Label htmlFor="text-input">비즈니스 정보 텍스트</Label>
                      <Textarea
                        id="text-input"
                        placeholder="비즈니스 정보를 자연어로 입력하세요. 예: '윤키친은 공항에서 15분 거리에 있는 한식당입니다. 무한리필 숯불구이를 제공하며 전화번호는 082-048-8139입니다...'"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={8}
                        className="resize-none"
                      />
                      <p className="text-xs text-gray-500">
                        비즈니스 이름, 설명, 연락처, 위치, 가격 등의 정보를 자유롭게 입력하세요.
                      </p>
                    </div>
                  )}

                  {/* 이미지 OCR */}
                  {inputMethod === "image" && (
                    <div className="space-y-3">
                      <Label htmlFor="ocr-image-input">텍스트가 포함된 이미지</Label>
                      <Input
                        id="ocr-image-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setOcrImageFile(e.target.files?.[0] || null)}
                      />
                      {ocrImageFile && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">선택된 파일: {ocrImageFile.name}</p>
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(ocrImageFile) || "/placeholder.svg"}
                              alt="OCR 대상 이미지"
                              className="w-full max-h-48 object-contain rounded-lg border bg-gray-50"
                            />
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        명함, 전단지, 광고 이미지 등에서 텍스트를 자동으로 추출합니다.
                      </p>
                    </div>
                  )}

                  {/* 분석 버튼 */}
                  <Button
                    onClick={handleDataExtraction}
                    disabled={isProcessing || (inputMethod === "text" ? !inputText.trim() : !ocrImageFile)}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        {inputMethod === "text" ? "텍스트 분석하기" : "이미지에서 텍스트 추출하기"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 결과 섹션 */}
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
                      // 편집 모드
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

                        {/* 대표 이미지 등록 */}
                        <div>
                          <Label className="text-base font-medium flex items-center gap-2 mb-3">
                            <ImageIcon className="h-4 w-4" />
                            대표 이미지
                          </Label>
                          <ImageUpload
                            currentImageUrl={parsedData.image}
                            onImageChange={(imageUrl) => handleFieldChange("image", imageUrl)}
                            onImageRemove={() => handleFieldChange("image", undefined)}
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            비즈니스를 대표하는 이미지를 등록하세요. (로고, 매장 사진, 제품 이미지 등)
                          </p>
                        </div>

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
                            <Label>라인 ID</Label>
                            <Input
                              value={parsedData.lineId || ""}
                              onChange={(e) => handleFieldChange("lineId", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>웹사이트/지도 링크</Label>
                            <Input
                              value={parsedData.website || ""}
                              onChange={(e) => handleFieldChange("website", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>영업시간</Label>
                            <Input
                              value={parsedData.hours || ""}
                              onChange={(e) => handleFieldChange("hours", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>가격 정보</Label>
                            <Input
                              value={parsedData.price || ""}
                              onChange={(e) => handleFieldChange("price", e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>프로모션/특별혜택</Label>
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
                            placeholder="한식, 무한리필, 숯불구이, 단체예약"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="promoted"
                            checked={parsedData.isPromoted || false}
                            onChange={(e) => handleFieldChange("isPromoted", e.target.checked)}
                          />
                          <Label htmlFor="promoted">추천 비즈니스로 표시</Label>
                        </div>
                      </div>
                    ) : (
                      // 미리보기 모드
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{parsedData.title}</h3>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {parsedData.isPremium && (
                              <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                <Crown className="h-3 w-3" />
                                프리미엄
                              </Badge>
                            )}
                            <Badge className="mt-1">{parsedData.category}</Badge>
                            {parsedData.isPromoted && (
                              <Badge variant="secondary" className="ml-2">
                                추천
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* 대표 이미지 미리보기 */}
                        {parsedData.image && (
                          <div>
                            <Label className="text-sm font-medium">대표 이미지</Label>
                            <img
                              src={parsedData.image || "/placeholder.svg"}
                              alt="대표 이미지"
                              className="w-full max-h-48 object-cover rounded-lg border mt-2"
                            />
                          </div>
                        )}

                        <p className="text-gray-700">{parsedData.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                          {parsedData.lineId && (
                            <p>
                              <strong>라인:</strong> {parsedData.lineId}
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
                        </div>

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

                {/* 일괄 선택 및 삭제 컨트롤 */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      className={isPartiallySelected ? "data-[state=checked]:bg-blue-600" : ""}
                    />
                    <span className="text-sm font-medium">
                      {selectedCards.size > 0 ? `${selectedCards.size}개 선택됨` : "전체 선택"}
                    </span>
                  </div>

                  {selectedCards.size > 0 && (
                    <Button variant="destructive" size="sm" onClick={handleDeleteSelected} disabled={isDeleting}>
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          삭제 중...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          선택 삭제 ({selectedCards.size})
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* 유사도 그룹 안내 */}
                {existingCards.some((card) => card.similarityGroup !== undefined) && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>유사한 카드 그룹:</strong> 비슷한 내용의 카드들이 상단에 그룹화되어 표시됩니다. 같은
                      색상의 테두리는 유사한 카드들을 나타냅니다.
                    </AlertDescription>
                  </Alert>
                )}
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
                {filteredCards.map((card) => (
                  <Card
                    key={card.id}
                    className={`relative transition-all duration-200 ${
                      card.similarityColor || "border-gray-200"
                    } ${selectedCards.has(card.id) ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Checkbox
                            checked={selectedCards.has(card.id)}
                            onCheckedChange={(checked) => handleCardSelect(card.id, checked as boolean)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-lg">{card.title}</CardTitle>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {card.isPremium && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Crown className="h-3 w-3 mr-1" />
                                  프리미엄
                                </Badge>
                              )}
                              <Badge className="mt-1">{card.category}</Badge>
                              {card.similarityGroup !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                  그룹 {card.similarityGroup + 1}
                                </Badge>
                              )}
                            </div>
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
                      {card.image && (
                        <img
                          src={card.image || "/placeholder.svg"}
                          alt={card.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
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

                {/* 대표 이미지 편집 */}
                <div>
                  <Label className="text-base font-medium flex items-center gap-2 mb-3">
                    <ImageIcon className="h-4 w-4" />
                    대표 이미지
                  </Label>
                  <ImageUpload
                    currentImageUrl={selectedCardForEdit.image}
                    onImageChange={(imageUrl) => setSelectedCardForEdit({ ...selectedCardForEdit, image: imageUrl })}
                    onImageRemove={() => setSelectedCardForEdit({ ...selectedCardForEdit, image: undefined })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>라인 ID</Label>
                    <Input
                      value={selectedCardForEdit.lineId || ""}
                      onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, lineId: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>웹사이트/지도 링크</Label>
                    <Input
                      value={selectedCardForEdit.website || ""}
                      onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>영업시간</Label>
                    <Input
                      value={selectedCardForEdit.hours || ""}
                      onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, hours: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>가격 정보</Label>
                    <Input
                      value={selectedCardForEdit.price || ""}
                      onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, price: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>프로모션/특별혜택</Label>
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
                    id="promoted-edit"
                    checked={selectedCardForEdit.isPromoted || false}
                    onChange={(e) => setSelectedCardForEdit({ ...selectedCardForEdit, isPromoted: e.target.checked })}
                  />
                  <Label htmlFor="promoted-edit">추천 비즈니스로 표시</Label>
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
