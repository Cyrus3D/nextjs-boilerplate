"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ImageUpload from "@/components/image-upload"
import {
  Trash2,
  Edit,
  Plus,
  Save,
  Sparkles,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
  Crown,
  TrendingUp,
  Eye,
  Calendar,
  Database,
  Weight,
  ImageIcon,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  createBusinessCard,
  updateBusinessCard,
  deleteBusinessCard,
  deleteMultipleBusinessCards,
  getCategories,
  getTags,
  getBusinessCardsForAdmin,
  parseBusinessCardData,
  updatePremiumStatus,
  updateExposureCount,
  updateExposureWeight,
  checkAIStatus,
  testDatabaseConnection,
  type BusinessCardData,
  type AIStatusResult,
} from "@/lib/admin-actions"

interface Category {
  id: number
  name: string
  color_class: string
}

interface Tag {
  id: number
  name: string
}

interface BusinessCard extends BusinessCardData {
  id: number
  categories?: Category
  created_at: string
  updated_at: string
}

export default function AdminInterface() {
  const [cards, setCards] = useState<BusinessCard[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCard, setEditingCard] = useState<BusinessCard | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set())
  const [aiStatus, setAiStatus] = useState<AIStatusResult | null>(null)
  const [checkingAI, setCheckingAI] = useState(false)
  const [analyzingText, setAnalyzingText] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)

  // 새 카드 폼 상태 - rating 제거
  const [newCard, setNewCard] = useState<Partial<BusinessCardData>>({
    title: "",
    description: "",
    category_id: 0,
    location: "",
    phone: "",
    kakao_id: "",
    line_id: "",
    website: "",
    hours: "",
    price: "",
    promotion: "",
    image_url: "",
    is_promoted: false,
    is_active: true,
    is_premium: false,
    exposure_count: 0,
    exposure_weight: 1.0,
  })

  // AI 텍스트 분석용 상태
  const [analysisText, setAnalysisText] = useState("")

  useEffect(() => {
    loadData()
    checkAIStatusOnLoad()
  }, [])

  const checkAIStatusOnLoad = async () => {
    setCheckingAI(true)
    try {
      const status = await checkAIStatus()
      setAiStatus(status)
    } catch (error) {
      console.error("AI 상태 확인 오류:", error)
    } finally {
      setCheckingAI(false)
    }
  }

  const handleCheckAIStatus = async () => {
    setCheckingAI(true)
    try {
      const status = await checkAIStatus()
      setAiStatus(status)
      toast({
        title: status.isActive ? "AI 기능 활성화됨" : "AI 기능 비활성화됨",
        description: status.error || "AI 상태가 업데이트되었습니다.",
        variant: status.isActive ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "AI 상태 확인 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setCheckingAI(false)
    }
  }

  const testDatabase = async () => {
    try {
      await testDatabaseConnection()
      toast({
        title: "성공",
        description: "데이터베이스 연결이 정상입니다.",
      })
    } catch (error) {
      toast({
        title: "데이터베이스 연결 오류",
        description: error instanceof Error ? error.message : "데이터베이스 연결에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const loadData = async () => {
    try {
      const [cardsData, categoriesData, tagsData] = await Promise.all([
        getBusinessCardsForAdmin(),
        getCategories(),
        getTags(),
      ])

      setCards(cardsData)
      setCategories(categoriesData)
      setTags(tagsData)
    } catch (error) {
      toast({
        title: "오류",
        description: "데이터 로드 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeText = async () => {
    if (!analysisText.trim()) {
      toast({
        title: "오류",
        description: "분석할 텍스트를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!aiStatus?.isActive) {
      toast({
        title: "AI 기능 비활성화",
        description: "AI 기능이 비활성화되어 있습니다. 관리자에게 문의하세요.",
        variant: "destructive",
      })
      return
    }

    setAnalyzingText(true)
    try {
      const parsedData = await parseBusinessCardData(analysisText)
      setNewCard((prev) => ({
        ...prev,
        ...parsedData,
      }))
      toast({
        title: "분석 완료",
        description: "텍스트 분석이 완료되었습니다. 결과를 확인하고 수정해주세요.",
      })
    } catch (error) {
      toast({
        title: "분석 실패",
        description: error instanceof Error ? error.message : "텍스트 분석 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setAnalyzingText(false)
    }
  }

  // 새 카드 이미지 변경 핸들러
  const handleNewCardImageChange = (imageUrl: string) => {
    setNewCard((prev) => ({ ...prev, image_url: imageUrl }))
    toast({
      title: "이미지 설정 완료",
      description: "대표 이미지가 설정되었습니다.",
    })
  }

  // 새 카드 이미지 제거 핸들러
  const handleNewCardImageRemove = () => {
    setNewCard((prev) => ({ ...prev, image_url: "" }))
    toast({
      title: "이미지 제거 완료",
      description: "대표 이미지가 제거되었습니다.",
    })
  }

  // 편집 카드 이미지 변경 핸들러
  const handleEditCardImageChange = (imageUrl: string) => {
    setEditingCard((prev) => (prev ? { ...prev, image_url: imageUrl } : null))
    toast({
      title: "이미지 설정 완료",
      description: "대표 이미지가 설정되었습니다.",
    })
  }

  // 편집 카드 이미지 제거 핸들러
  const handleEditCardImageRemove = () => {
    setEditingCard((prev) => (prev ? { ...prev, image_url: "" } : null))
    toast({
      title: "이미지 제거 완료",
      description: "대표 이미지가 제거되었습니다.",
    })
  }

  const handleCreateCard = async () => {
    console.log("handleCreateCard 호출됨")
    console.log("newCard 데이터:", newCard)

    // 필수 필드 검증
    if (!newCard.title || !newCard.description || !newCard.category_id || newCard.category_id === 0) {
      toast({
        title: "오류",
        description: "제목, 설명, 카테고리는 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    setCreating(true)
    try {
      console.log("createBusinessCard 호출 시작")
      const result = await createBusinessCard(newCard as BusinessCardData)
      console.log("createBusinessCard 결과:", result)

      toast({
        title: "성공",
        description: "새 카드가 생성되었습니다.",
      })

      // 폼 초기화 - rating 제거
      setIsCreating(false)
      setNewCard({
        title: "",
        description: "",
        category_id: 0,
        location: "",
        phone: "",
        kakao_id: "",
        line_id: "",
        website: "",
        hours: "",
        price: "",
        promotion: "",
        image_url: "",
        is_promoted: false,
        is_active: true,
        is_premium: false,
        exposure_count: 0,
        exposure_weight: 1.0,
      })
      setAnalysisText("")

      // 데이터 다시 로드
      await loadData()
    } catch (error) {
      console.error("카드 생성 오류:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "카드 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateCard = async () => {
    if (!editingCard) {
      toast({
        title: "오류",
        description: "편집할 카드가 선택되지 않았습니다.",
        variant: "destructive",
      })
      return
    }

    // 필수 필드 검증
    if (!editingCard.title || !editingCard.description || !editingCard.category_id) {
      toast({
        title: "오류",
        description: "제목, 설명, 카테고리는 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    setUpdating(true)
    try {
      console.log("handleUpdateCard 호출됨:", editingCard)

      // 업데이트할 데이터 준비 - categories 필드 제외
      const updateData: Partial<BusinessCardData> = {
        title: editingCard.title,
        description: editingCard.description,
        category_id: editingCard.category_id,
        location: editingCard.location,
        phone: editingCard.phone,
        kakao_id: editingCard.kakao_id,
        line_id: editingCard.line_id,
        website: editingCard.website,
        hours: editingCard.hours,
        price: editingCard.price,
        promotion: editingCard.promotion,
        image_url: editingCard.image_url,
        is_promoted: editingCard.is_promoted,
        is_active: editingCard.is_active,
        is_premium: editingCard.is_premium,
        premium_expires_at: editingCard.premium_expires_at,
        exposure_count: editingCard.exposure_count,
        last_exposed_at: editingCard.last_exposed_at,
        exposure_weight: editingCard.exposure_weight,
        view_count: editingCard.view_count,
      }

      const result = await updateBusinessCard(editingCard.id, updateData)
      console.log("updateBusinessCard 결과:", result)

      toast({
        title: "성공",
        description: "카드가 성공적으로 업데이트되었습니다.",
      })

      setEditingCard(null)
      await loadData()
    } catch (error) {
      console.error("카드 업데이트 오류:", error)
      toast({
        title: "업데이트 실패",
        description: error instanceof Error ? error.message : "카드 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteCard = async (id: number) => {
    if (!confirm("정말로 이 카드를 삭제하시겠습니까?")) return

    try {
      await deleteBusinessCard(id)
      toast({
        title: "성공",
        description: "카드가 삭제되었습니다.",
      })
      loadData()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "카드 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = async () => {
    if (selectedCards.size === 0) {
      toast({
        title: "오류",
        description: "삭제할 카드를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`선택된 ${selectedCards.size}개의 카드를 삭제하시겠습니까?`)) return

    try {
      await deleteMultipleBusinessCards(Array.from(selectedCards))
      toast({
        title: "성공",
        description: `${selectedCards.size}개의 카드가 삭제되었습니다.`,
      })
      setSelectedCards(new Set())
      loadData()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "카드 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleSelectCard = (cardId: number, checked: boolean) => {
    const newSelected = new Set(selectedCards)
    if (checked) {
      newSelected.add(cardId)
    } else {
      newSelected.delete(cardId)
    }
    setSelectedCards(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCards(new Set(cards.map((card) => card.id)))
    } else {
      setSelectedCards(new Set())
    }
  }

  const handlePremiumToggle = async (cardId: number, isPremium: boolean) => {
    try {
      const expiresAt = isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
      await updatePremiumStatus(cardId, isPremium, expiresAt)
      toast({
        title: "성공",
        description: `프리미엄 상태가 ${isPremium ? "활성화" : "비활성화"}되었습니다.`,
      })
      loadData()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "프리미엄 상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleExposureCountUpdate = async (cardId: number, count: number) => {
    try {
      await updateExposureCount(cardId, count)
      toast({
        title: "성공",
        description: `노출 카운트가 ${count}로 설정되었습니다.`,
      })
      loadData()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "노출 카운트 설정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleExposureWeightUpdate = async (cardId: number, weight: number) => {
    try {
      await updateExposureWeight(cardId, weight)
      toast({
        title: "성공",
        description: `노출 가중치가 ${weight}로 설정되었습니다.`,
      })
      loadData()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "노출 가중치 설정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const allSelected = cards.length > 0 && selectedCards.size === cards.length
  const someSelected = selectedCards.size > 0 && selectedCards.size < cards.length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={testDatabase} className="flex items-center gap-2 bg-transparent">
            <Database className="h-4 w-4" />
            DB 연결 테스트
          </Button>
          {selectedCards.size > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              선택된 {selectedCards.size}개 삭제
            </Button>
          )}
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />새 카드 추가
          </Button>
        </div>
      </div>

      {/* AI 상태 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI 분석 기능 상태
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckAIStatus}
              disabled={checkingAI}
              className="ml-auto bg-transparent"
            >
              {checkingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              상태 확인
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {aiStatus?.isActive ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className={aiStatus?.isActive ? "text-green-600" : "text-red-600"}>
                {aiStatus?.isActive ? "AI 기능 활성화됨" : "AI 기능 비활성화됨"}
              </span>
            </div>
            {aiStatus && (
              <div className="text-sm text-gray-500">
                마지막 확인: {new Date(aiStatus.lastChecked).toLocaleString()}
              </div>
            )}
          </div>
          {aiStatus?.error && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription>{aiStatus.error}</AlertDescription>
            </Alert>
          )}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>OpenAI API 키:</strong> {aiStatus?.hasOpenAIKey ? "✅ 설정됨" : "❌ 미설정"}
            </div>
            <div>
              <strong>텍스트 생성 테스트:</strong> {aiStatus?.canGenerateText ? "✅ 성공" : "❌ 실패"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 카드 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                ref={(el) => {
                  if (el) {
                    el.indeterminate = someSelected
                  }
                }}
              />
              비즈니스 카드 목록 ({cards.length}개)
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cards.length === 0 ? (
              <div className="text-center py-8 text-gray-500">등록된 카드가 없습니다. 새 카드를 추가해보세요.</div>
            ) : (
              cards.map((card) => (
                <div key={card.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedCards.has(card.id)}
                      onCheckedChange={(checked) => handleSelectCard(card.id, checked as boolean)}
                    />

                    {/* 카드 이미지 표시 */}
                    <div className="flex-shrink-0">
                      {card.image_url ? (
                        <img
                          src={card.image_url || "/placeholder.svg"}
                          alt={card.title}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{card.title}</h3>
                        {card.categories && (
                          <Badge className={card.categories.color_class}>{card.categories.name}</Badge>
                        )}
                        {card.is_premium && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Crown className="h-3 w-3 mr-1" />
                            프리미엄
                          </Badge>
                        )}
                        {(card.exposure_count || 0) > 0 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            노출 {card.exposure_count || 0}
                          </Badge>
                        )}
                        {(card.exposure_weight || 1.0) !== 1.0 && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            <Weight className="h-3 w-3 mr-1" />
                            가중치 {card.exposure_weight || 1.0}
                          </Badge>
                        )}
                        {!card.is_active && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            비활성화
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          조회 {card.view_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(card.created_at).toLocaleDateString()}
                        </span>
                        {card.last_exposed_at && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            마지막 노출: {new Date(card.last_exposed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePremiumToggle(card.id, !card.is_premium)}
                      >
                        <Crown className="h-4 w-4" />
                        {card.is_premium ? "프리미엄 해제" : "프리미엄 설정"}
                      </Button>
                      <Select
                        value={(card.exposure_count || 0).toString()}
                        onValueChange={(value) => handleExposureCountUpdate(card.id, Number.parseInt(value))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">노출 0</SelectItem>
                          <SelectItem value="1">노출 1</SelectItem>
                          <SelectItem value="5">노출 5</SelectItem>
                          <SelectItem value="10">노출 10</SelectItem>
                          <SelectItem value="50">노출 50</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={(card.exposure_weight || 1.0).toString()}
                        onValueChange={(value) => handleExposureWeightUpdate(card.id, Number.parseFloat(value))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">가중치 0.5</SelectItem>
                          <SelectItem value="1.0">가중치 1.0</SelectItem>
                          <SelectItem value="1.5">가중치 1.5</SelectItem>
                          <SelectItem value="2.0">가중치 2.0</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => setEditingCard(card)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* 새 카드 생성 다이얼로그 - 이미지 업로드 필드 추가 */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>새 카드 추가</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">수동 입력</TabsTrigger>
              <TabsTrigger value="ai" disabled={!aiStatus?.isActive}>
                AI 분석 {!aiStatus?.isActive && "(비활성화)"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-4">
              {!aiStatus?.isActive && (
                <Alert variant="destructive">
                  <AlertDescription>
                    AI 기능이 비활성화되어 있습니다. OpenAI API 키를 설정하고 상태를 확인해주세요.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="analysis-text">분석할 텍스트</Label>
                <Textarea
                  id="analysis-text"
                  placeholder="비즈니스 정보가 포함된 텍스트를 입력하세요..."
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  rows={6}
                  disabled={!aiStatus?.isActive}
                />
              </div>

              <Button
                onClick={handleAnalyzeText}
                disabled={!analysisText.trim() || analyzingText || !aiStatus?.isActive}
                className="w-full"
              >
                {analyzingText ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI로 분석하기
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="manual">
              <div className="text-sm text-gray-600 mb-4">
                수동으로 카드 정보를 입력하거나, AI 분석 탭에서 텍스트를 분석한 후 결과를 수정할 수 있습니다.
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={newCard.title || ""}
                onChange={(e) => setNewCard((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="비즈니스 이름"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select
                value={(newCard.category_id || 0).toString()}
                onValueChange={(value) => setNewCard((prev) => ({ ...prev, category_id: Number.parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">설명 *</Label>
              <Textarea
                id="description"
                value={newCard.description || ""}
                onChange={(e) => setNewCard((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="비즈니스 설명"
                rows={3}
              />
            </div>

            {/* 이미지 업로드 섹션 추가 */}
            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                대표 이미지
              </Label>
              <ImageUpload
                currentImageUrl={newCard.image_url || ""}
                onImageChange={handleNewCardImageChange}
                onImageRemove={handleNewCardImageRemove}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">위치</Label>
              <Input
                id="location"
                value={newCard.location || ""}
                onChange={(e) => setNewCard((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="주소 또는 위치"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={newCard.phone || ""}
                onChange={(e) => setNewCard((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="전화번호"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kakao_id">카카오톡 ID</Label>
              <Input
                id="kakao_id"
                value={newCard.kakao_id || ""}
                onChange={(e) => setNewCard((prev) => ({ ...prev, kakao_id: e.target.value }))}
                placeholder="카카오톡 ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="line_id">라인 ID</Label>
              <Input
                id="line_id"
                value={newCard.line_id || ""}
                onChange={(e) => setNewCard((prev) => ({ ...prev, line_id: e.target.value }))}
                placeholder="라인 ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">웹사이트</Label>
              <Input
                id="website"
                value={newCard.website || ""}
                onChange={(e) => setNewCard((prev) => ({ ...prev, website: e.target.value }))}
                placeholder="웹사이트 URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">운영시간</Label>
              <Input
                id="hours"
                value={newCard.hours || ""}
                onChange={(e) => setNewCard((prev) => ({ ...prev, hours: e.target.value }))}
                placeholder="운영시간"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">가격</Label>
              <Input
                id="price"
                value={newCard.price || ""}
                onChange={(e) => setNewCard((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="가격 정보"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="promotion">프로모션</Label>
              <Textarea
                id="promotion"
                value={newCard.promotion || ""}
                onChange={(e) => setNewCard((prev) => ({ ...prev, promotion: e.target.value }))}
                placeholder="프로모션 또는 할인 정보"
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_promoted"
                  checked={newCard.is_promoted || false}
                  onCheckedChange={(checked) => setNewCard((prev) => ({ ...prev, is_promoted: checked }))}
                />
                <Label htmlFor="is_promoted">추천 카드</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={newCard.is_active !== false}
                  onCheckedChange={(checked) => setNewCard((prev) => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">활성화</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_premium"
                  checked={newCard.is_premium || false}
                  onCheckedChange={(checked) => setNewCard((prev) => ({ ...prev, is_premium: checked }))}
                />
                <Label htmlFor="is_premium">프리미엄</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsCreating(false)} disabled={creating}>
              취소
            </Button>
            <Button onClick={handleCreateCard} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 편집 다이얼로그 - 이미지 업로드 필드 추가 */}
      <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>카드 편집</DialogTitle>
          </DialogHeader>

          {editingCard && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">제목 *</Label>
                <Input
                  id="edit-title"
                  value={editingCard.title || ""}
                  onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  placeholder="비즈니스 이름"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">카테고리 *</Label>
                <Select
                  value={(editingCard.category_id || 0).toString()}
                  onValueChange={(value) =>
                    setEditingCard((prev) => (prev ? { ...prev, category_id: Number.parseInt(value) } : null))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-description">설명 *</Label>
                <Textarea
                  id="edit-description"
                  value={editingCard.description || ""}
                  onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  placeholder="비즈니스 설명"
                  rows={3}
                />
              </div>

              {/* 편집용 이미지 업로드 섹션 추가 */}
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  대표 이미지
                </Label>
                <ImageUpload
                  currentImageUrl={editingCard.image_url || ""}
                  onImageChange={handleEditCardImageChange}
                  onImageRemove={handleEditCardImageRemove}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">위치</Label>
                <Input
                  id="edit-location"
                  value={editingCard.location || ""}
                  onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, location: e.target.value } : null))}
                  placeholder="주소 또는 위치"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">전화번호</Label>
                <Input
                  id="edit-phone"
                  value={editingCard.phone || ""}
                  onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                  placeholder="전화번호"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-kakao_id">카카오톡 ID</Label>
                <Input
                  id="edit-kakao_id"
                  value={editingCard.kakao_id || ""}
                  onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, kakao_id: e.target.value } : null))}
                  placeholder="카카오톡 ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-line_id">라인 ID</Label>
                <Input
                  id="edit-line_id"
                  value={editingCard.line_id || ""}
                  onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, line_id: e.target.value } : null))}
                  placeholder="라인 ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-website">웹사이트</Label>
                <Input
                  id="edit-website"
                  value={editingCard.website || ""}
                  onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, website: e.target.value } : null))}
                  placeholder="웹사이트 URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-hours">운영시간</Label>
                <Input
                  id="edit-hours"
                  value={editingCard.hours || ""}
                  onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, hours: e.target.value } : null))}
                  placeholder="운영시간"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">가격</Label>
                <Input
                  id="edit-price"
                  value={editingCard.price || ""}
                  onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, price: e.target.value } : null))}
                  placeholder="가격 정보"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-promotion">프로모션</Label>
                <Textarea
                  id="edit-promotion"
                  value={editingCard.promotion || ""}
                  onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, promotion: e.target.value } : null))}
                  placeholder="프로모션 또는 할인 정보"
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is_promoted"
                    checked={editingCard.is_promoted || false}
                    onCheckedChange={(checked) =>
                      setEditingCard((prev) => (prev ? { ...prev, is_promoted: checked } : null))
                    }
                  />
                  <Label htmlFor="edit-is_promoted">추천 카드</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is_active"
                    checked={editingCard.is_active !== false}
                    onCheckedChange={(checked) =>
                      setEditingCard((prev) => (prev ? { ...prev, is_active: checked } : null))
                    }
                  />
                  <Label htmlFor="edit-is_active">활성화</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is_premium"
                    checked={editingCard.is_premium || false}
                    onCheckedChange={(checked) =>
                      setEditingCard((prev) => (prev ? { ...prev, is_premium: checked } : null))
                    }
                  />
                  <Label htmlFor="edit-is_premium">프리미엄</Label>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setEditingCard(null)} disabled={updating}>
              취소
            </Button>
            <Button onClick={handleUpdateCard} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  업데이트 중...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
