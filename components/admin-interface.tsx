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
  Eye,
  Calendar,
  Database,
  ImageIcon,
  Building2,
  Newspaper,
  Star,
  Globe,
  Tag,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  createBusinessCard,
  updateBusinessCard,
  deleteBusinessCard,
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
import {
  createNews,
  updateNews,
  deleteNews,
  getNewsForAdmin,
  parseNewsData,
  updateNewsFeatureStatus,
  type NewsData,
} from "@/lib/admin-news-actions"
import type { NewsFormData } from "../types/news"

interface Category {
  id: number
  name: string
  color_class: string
}

interface TagType {
  id: number
  name: string
}

interface BusinessCard extends BusinessCardData {
  id: number
  categories?: Category
  created_at: string
  updated_at: string
}

interface NewsItem extends NewsData {
  id: number
  created_at: string
  updated_at: string
}

const NEWS_CATEGORIES = ["일반", "정치", "경제", "사회", "문화", "스포츠", "국제", "생활", "기술"]

export default function AdminInterface() {
  // 기존 비즈니스 카드 상태
  const [cards, setCards] = useState<BusinessCard[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<TagType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCard, setEditingCard] = useState<BusinessCard | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set())

  // 뉴스 관련 상태
  const [news, setNews] = useState<NewsItem[]>([])
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [isCreatingNews, setIsCreatingNews] = useState(false)
  const [selectedNews, setSelectedNews] = useState<Set<number>>(new Set())

  // 공통 상태
  const [aiStatus, setAiStatus] = useState<AIStatusResult | null>(null)
  const [checkingAI, setCheckingAI] = useState(false)
  const [analyzingText, setAnalyzingText] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)

  // 새 카드 폼 상태
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
    facebook_url: "",
    instagram_url: "",
    tiktok_url: "",
    threads_url: "",
    youtube_url: "",
    is_promoted: false,
    is_active: true,
    is_premium: false,
    exposure_count: 0,
    exposure_weight: 1.0,
  })

  // 새 뉴스 폼 상태
  const [newNews, setNewNews] = useState<Partial<NewsFormData>>({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
    source: "",
    originalUrl: "",
    publishedAt: "",
    category: "일반",
    tags: [],
    isActive: true,
    isFeatured: false,
  })

  // AI 텍스트 분석용 상태
  const [analysisText, setAnalysisText] = useState("")
  const [analysisUrl, setAnalysisUrl] = useState("")

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
      const [cardsData, categoriesData, tagsData, newsData] = await Promise.all([
        getBusinessCardsForAdmin(),
        getCategories(),
        getTags(),
        getNewsForAdmin(),
      ])

      setCards(cardsData)
      setCategories(categoriesData)
      setTags(tagsData)
      setNews(newsData)
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

  // 비즈니스 카드 AI 분석
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

  // 뉴스 URL AI 분석
  const handleAnalyzeUrl = async () => {
    if (!analysisUrl.trim()) {
      toast({
        title: "오류",
        description: "분석할 URL을 입력해주세요.",
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
      const parsedData = await parseNewsData(analysisUrl)
      setNewNews((prev) => ({
        ...prev,
        ...parsedData,
      }))
      toast({
        title: "분석 완료",
        description: "URL 분석이 완료되었습니다. 결과를 확인하고 수정해주세요.",
      })
    } catch (error) {
      toast({
        title: "분석 실패",
        description: error instanceof Error ? error.message : "URL 분석 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setAnalyzingText(false)
    }
  }

  // 비즈니스 카드 생성
  const handleCreateCard = async () => {
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
      await createBusinessCard(newCard as BusinessCardData)
      toast({
        title: "성공",
        description: "새 카드가 생성되었습니다.",
      })

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
        facebook_url: "",
        instagram_url: "",
        tiktok_url: "",
        threads_url: "",
        youtube_url: "",
        is_promoted: false,
        is_active: true,
        is_premium: false,
        exposure_count: 0,
        exposure_weight: 1.0,
      })
      setAnalysisText("")
      await loadData()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "카드 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  // 뉴스 생성
  const handleCreateNews = async () => {
    if (!newNews.title || !newNews.content || !newNews.source || !newNews.originalUrl) {
      toast({
        title: "오류",
        description: "제목, 내용, 출처, 원본 URL은 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    setCreating(true)
    try {
      await createNews(newNews as NewsFormData)
      toast({
        title: "성공",
        description: "새 뉴스가 생성되었습니다.",
      })

      setIsCreatingNews(false)
      setNewNews({
        title: "",
        summary: "",
        content: "",
        imageUrl: "",
        source: "",
        originalUrl: "",
        publishedAt: "",
        category: "일반",
        tags: [],
        isActive: true,
        isFeatured: false,
      })
      setAnalysisUrl("")
      await loadData()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "뉴스 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  // 뉴스 업데이트
  const handleUpdateNews = async () => {
    if (!editingNews) {
      toast({
        title: "오류",
        description: "편집할 뉴스가 선택되지 않았습니다.",
        variant: "destructive",
      })
      return
    }

    if (!editingNews.title || !editingNews.content || !editingNews.source || !editingNews.originalUrl) {
      toast({
        title: "오류",
        description: "제목, 내용, 출처, 원본 URL은 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    setUpdating(true)
    try {
      const updateData: Partial<NewsFormData> = {
        title: editingNews.title,
        summary: editingNews.summary,
        content: editingNews.content,
        imageUrl: editingNews.imageUrl,
        source: editingNews.source,
        originalUrl: editingNews.originalUrl,
        publishedAt: editingNews.publishedAt,
        category: editingNews.category,
        tags: editingNews.tags,
        isActive: editingNews.isActive,
        isFeatured: editingNews.isFeatured,
      }

      await updateNews(editingNews.id, updateData)
      toast({
        title: "성공",
        description: "뉴스가 성공적으로 업데이트되었습니다.",
      })

      setEditingNews(null)
      await loadData()
    } catch (error) {
      toast({
        title: "업데이트 실패",
        description: error instanceof Error ? error.message : "뉴스 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  // 뉴스 삭제
  const handleDeleteNews = async (id: number) => {
    if (!confirm("정말로 이 뉴스를 삭제하시겠습니까?")) return

    try {
      await deleteNews(id)
      toast({
        title: "성공",
        description: "뉴스가 삭제되었습니다.",
      })
      loadData()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "뉴스 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 뉴스 특성 토글
  const handleNewsFeatureToggle = async (newsId: number, isFeatured: boolean) => {
    try {
      await updateNewsFeatureStatus(newsId, isFeatured)
      toast({
        title: "성공",
        description: `뉴스가 ${isFeatured ? "특성" : "일반"} 상태로 변경되었습니다.`,
      })
      loadData()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "뉴스 특성 상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 기존 비즈니스 카드 관련 함수들은 그대로 유지...
  const handleUpdateCard = async () => {
    if (!editingCard) {
      toast({
        title: "오류",
        description: "편집할 카드가 선택되지 않았습니다.",
        variant: "destructive",
      })
      return
    }

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
        facebook_url: editingCard.facebook_url,
        instagram_url: editingCard.instagram_url,
        tiktok_url: editingCard.tiktok_url,
        threads_url: editingCard.threads_url,
        youtube_url: editingCard.youtube_url,
        is_promoted: editingCard.is_promoted,
        is_active: editingCard.is_active,
        is_premium: editingCard.is_premium,
        premium_expires_at: editingCard.premium_expires_at,
        exposure_count: editingCard.exposure_count,
        last_exposed_at: editingCard.last_exposed_at,
        exposure_weight: editingCard.exposure_weight,
        view_count: editingCard.view_count,
      }

      await updateBusinessCard(editingCard.id, updateData)
      toast({
        title: "성공",
        description: "카드가 성공적으로 업데이트되었습니다.",
      })

      setEditingCard(null)
      await loadData()
    } catch (error) {
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

  // 이미지 핸들러들
  const handleNewCardImageChange = (imageUrl: string) => {
    setNewCard((prev) => ({ ...prev, image_url: imageUrl }))
    toast({
      title: "이미지 설정 완료",
      description: "대표 이미지가 설정되었습니다.",
    })
  }

  const handleNewCardImageRemove = () => {
    setNewCard((prev) => ({ ...prev, image_url: "" }))
    toast({
      title: "이미지 제거 완료",
      description: "대표 이미지가 제거되었습니다.",
    })
  }

  const handleEditCardImageChange = (imageUrl: string) => {
    setEditingCard((prev) => (prev ? { ...prev, image_url: imageUrl } : null))
    toast({
      title: "이미지 설정 완료",
      description: "대표 이미지가 설정되었습니다.",
    })
  }

  const handleEditCardImageRemove = () => {
    setEditingCard((prev) => (prev ? { ...prev, image_url: "" } : null))
    toast({
      title: "이미지 제거 완료",
      description: "대표 이미지가 제거되었습니다.",
    })
  }

  const handleNewNewsImageChange = (imageUrl: string) => {
    setNewNews((prev) => ({ ...prev, imageUrl: imageUrl }))
    toast({
      title: "이미지 설정 완료",
      description: "뉴스 이미지가 설정되었습니다.",
    })
  }

  const handleNewNewsImageRemove = () => {
    setNewNews((prev) => ({ ...prev, imageUrl: "" }))
    toast({
      title: "이미지 제거 완료",
      description: "뉴스 이미지가 제거되었습니다.",
    })
  }

  const handleEditNewsImageChange = (imageUrl: string) => {
    setEditingNews((prev) => (prev ? { ...prev, imageUrl: imageUrl } : null))
    toast({
      title: "이미지 설정 완료",
      description: "뉴스 이미지가 설정되었습니다.",
    })
  }

  const handleEditNewsImageRemove = () => {
    setEditingNews((prev) => (prev ? { ...prev, imageUrl: "" } : null))
    toast({
      title: "이미지 제거 완료",
      description: "뉴스 이미지가 제거되었습니다.",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={testDatabase} className="flex items-center gap-2 bg-transparent">
            <Database className="h-4 w-4" />
            DB 연결 테스트
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

      {/* 탭 인터페이스 */}
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            한인업체 관리
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            뉴스 관리
          </TabsTrigger>
        </TabsList>

        {/* 비즈니스 카드 관리 탭 */}
        <TabsContent value="business" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">한인업체 관리</h2>
            <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />새 업체 추가
            </Button>
          </div>

          {/* 비즈니스 카드 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>업체 목록 ({cards.length}개)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cards.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">등록된 업체가 없습니다. 새 업체를 추가해보세요.</div>
                ) : (
                  cards.map((card) => (
                    <div key={card.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
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
        </TabsContent>

        {/* 뉴스 관리 탭 */}
        <TabsContent value="news" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">뉴스 관리</h2>
            <Button onClick={() => setIsCreatingNews(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />새 뉴스 추가
            </Button>
          </div>

          {/* 뉴스 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>뉴스 목록 ({news.length}개)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {news.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">등록된 뉴스가 없습니다. 새 뉴스를 추가해보세요.</div>
                ) : (
                  news.map((newsItem) => (
                    <div key={newsItem.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {newsItem.imageUrl ? (
                            <img
                              src={newsItem.imageUrl || "/placeholder.svg"}
                              alt={newsItem.title}
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                              <Newspaper className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{newsItem.title}</h3>
                            <Badge variant="outline">{newsItem.category}</Badge>
                            {newsItem.isFeatured && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                특성
                              </Badge>
                            )}
                            {!newsItem.isActive && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                비활성화
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{newsItem.summary}</p>

                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {newsItem.source}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              조회 {newsItem.view_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(newsItem.publishedAt || newsItem.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          {newsItem.tags && newsItem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {newsItem.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Tag className="h-2 w-2 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                              {newsItem.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{newsItem.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNewsFeatureToggle(newsItem.id, !newsItem.isFeatured)}
                          >
                            <Star className="h-4 w-4" />
                            {newsItem.isFeatured ? "특성 해제" : "특성 설정"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingNews(newsItem)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteNews(newsItem.id)}>
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
        </TabsContent>
      </Tabs>

      {/* 새 비즈니스 카드 생성 다이얼로그 */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>새 업체 추가</DialogTitle>
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
                수동으로 업체 정보를 입력하거나, AI 분석 탭에서 텍스트를 분석한 후 결과를 수정할 수 있습니다.
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="title">업체명 *</Label>
              <Input
                id="title"
                value={newCard.title || ""}
                onChange={(e) => setNewCard((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="업체 이름"
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
                placeholder="업체 설명"
                rows={3}
              />
            </div>

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

            {/* 나머지 필드들... */}
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

      {/* 새 뉴스 생성 다이얼로그 */}
      <Dialog open={isCreatingNews} onOpenChange={setIsCreatingNews}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>새 뉴스 추가</DialogTitle>
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
                <Label htmlFor="analysis-url">분석할 뉴스 URL</Label>
                <Input
                  id="analysis-url"
                  placeholder="뉴스 기사 URL을 입력하세요..."
                  value={analysisUrl}
                  onChange={(e) => setAnalysisUrl(e.target.value)}
                  disabled={!aiStatus?.isActive}
                />
              </div>

              <Button
                onClick={handleAnalyzeUrl}
                disabled={!analysisUrl.trim() || analyzingText || !aiStatus?.isActive}
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
                수동으로 뉴스 정보를 입력하거나, AI 분석 탭에서 URL을 분석한 후 결과를 수정할 수 있습니다.
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="news-title">기사 제목 *</Label>
              <Input
                id="news-title"
                value={newNews.title || ""}
                onChange={(e) => setNewNews((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="뉴스 기사 제목"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-source">출처 *</Label>
              <Input
                id="news-source"
                value={newNews.source || ""}
                onChange={(e) => setNewNews((prev) => ({ ...prev, source: e.target.value }))}
                placeholder="뉴스 출처"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-category">카테고리</Label>
              <Select
                value={newNews.category || "일반"}
                onValueChange={(value) => setNewNews((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {NEWS_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-published-at">발행일</Label>
              <Input
                id="news-published-at"
                type="datetime-local"
                value={newNews.publishedAt || ""}
                onChange={(e) => setNewNews((prev) => ({ ...prev, publishedAt: e.target.value }))}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="news-original-url">원본 URL *</Label>
              <Input
                id="news-original-url"
                value={newNews.originalUrl || ""}
                onChange={(e) => setNewNews((prev) => ({ ...prev, originalUrl: e.target.value }))}
                placeholder="https://example.com/news-article"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="news-summary">요약</Label>
              <Textarea
                id="news-summary"
                value={newNews.summary || ""}
                onChange={(e) => setNewNews((prev) => ({ ...prev, summary: e.target.value }))}
                placeholder="뉴스 기사 요약 (2-3문장)"
                rows={2}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="news-content">내용 *</Label>
              <Textarea
                id="news-content"
                value={newNews.content || ""}
                onChange={(e) => setNewNews((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="뉴스 기사 전체 내용"
                rows={6}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                뉴스 이미지
              </Label>
              <ImageUpload
                currentImageUrl={newNews.imageUrl || ""}
                onImageChange={handleNewNewsImageChange}
                onImageRemove={handleNewNewsImageRemove}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="news-tags">태그 (쉼표로 구분)</Label>
              <Input
                id="news-tags"
                value={newNews.tags?.join(", ") || ""}
                onChange={(e) =>
                  setNewNews((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag),
                  }))
                }
                placeholder="태그1, 태그2, 태그3"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="news-is-active"
                  checked={newNews.isActive !== false}
                  onCheckedChange={(checked) => setNewNews((prev) => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="news-is-active">활성화</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="news-is-featured"
                  checked={newNews.isFeatured || false}
                  onCheckedChange={(checked) => setNewNews((prev) => ({ ...prev, isFeatured: checked }))}
                />
                <Label htmlFor="news-is-featured">특성 뉴스</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsCreatingNews(false)} disabled={creating}>
              취소
            </Button>
            <Button onClick={handleCreateNews} disabled={creating}>
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

      {/* 뉴스 편집 다이얼로그 */}
      <Dialog open={!!editingNews} onOpenChange={() => setEditingNews(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>뉴스 편집</DialogTitle>
          </DialogHeader>

          {editingNews && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-news-title">기사 제목 *</Label>
                <Input
                  id="edit-news-title"
                  value={editingNews.title || ""}
                  onChange={(e) => setEditingNews((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  placeholder="뉴스 기사 제목"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-news-source">출처 *</Label>
                <Input
                  id="edit-news-source"
                  value={editingNews.source || ""}
                  onChange={(e) => setEditingNews((prev) => (prev ? { ...prev, source: e.target.value } : null))}
                  placeholder="뉴스 출처"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-news-category">카테고리</Label>
                <Select
                  value={editingNews.category || "일반"}
                  onValueChange={(value) => setEditingNews((prev) => (prev ? { ...prev, category: value } : null))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-news-published-at">발행일</Label>
                <Input
                  id="edit-news-published-at"
                  type="datetime-local"
                  value={editingNews.publishedAt ? new Date(editingNews.publishedAt).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setEditingNews((prev) => (prev ? { ...prev, publishedAt: e.target.value } : null))}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-news-original-url">원본 URL *</Label>
                <Input
                  id="edit-news-original-url"
                  value={editingNews.originalUrl || ""}
                  onChange={(e) => setEditingNews((prev) => (prev ? { ...prev, originalUrl: e.target.value } : null))}
                  placeholder="https://example.com/news-article"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-news-summary">요약</Label>
                <Textarea
                  id="edit-news-summary"
                  value={editingNews.summary || ""}
                  onChange={(e) => setEditingNews((prev) => (prev ? { ...prev, summary: e.target.value } : null))}
                  placeholder="뉴스 기사 요약 (2-3문장)"
                  rows={2}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-news-content">내용 *</Label>
                <Textarea
                  id="edit-news-content"
                  value={editingNews.content || ""}
                  onChange={(e) => setEditingNews((prev) => (prev ? { ...prev, content: e.target.value } : null))}
                  placeholder="뉴스 기사 전체 내용"
                  rows={6}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  뉴스 이미지
                </Label>
                <ImageUpload
                  currentImageUrl={editingNews.imageUrl || ""}
                  onImageChange={handleEditNewsImageChange}
                  onImageRemove={handleEditNewsImageRemove}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-news-tags">태그 (쉼표로 구분)</Label>
                <Input
                  id="edit-news-tags"
                  value={editingNews.tags?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingNews((prev) =>
                      prev
                        ? {
                            ...prev,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter((tag) => tag),
                          }
                        : null,
                    )
                  }
                  placeholder="태그1, 태그2, 태그3"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-news-is-active"
                    checked={editingNews.isActive !== false}
                    onCheckedChange={(checked) =>
                      setEditingNews((prev) => (prev ? { ...prev, isActive: checked } : null))
                    }
                  />
                  <Label htmlFor="edit-news-is-active">활성화</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-news-is-featured"
                    checked={editingNews.isFeatured || false}
                    onCheckedChange={(checked) =>
                      setEditingNews((prev) => (prev ? { ...prev, isFeatured: checked } : null))
                    }
                  />
                  <Label htmlFor="edit-news-is-featured">특성 뉴스</Label>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setEditingNews(null)} disabled={updating}>
              취소
            </Button>
            <Button onClick={handleUpdateNews} disabled={updating}>
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

      {/* 기존 비즈니스 카드 편집 다이얼로그는 간소화된 버전으로 유지 */}
      <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>업체 편집</DialogTitle>
          </DialogHeader>

          {editingCard && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">업체명 *</Label>
                <Input
                  id="edit-title"
                  value={editingCard.title || ""}
                  onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  placeholder="업체 이름"
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
                  placeholder="업체 설명"
                  rows={3}
                />
              </div>

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

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is-promoted"
                    checked={editingCard.is_promoted || false}
                    onCheckedChange={(checked) =>
                      setEditingCard((prev) => (prev ? { ...prev, is_promoted: checked } : null))
                    }
                  />
                  <Label htmlFor="edit-is-promoted">추천 업체</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is-active"
                    checked={editingCard.is_active !== false}
                    onCheckedChange={(checked) =>
                      setEditingCard((prev) => (prev ? { ...prev, is_active: checked } : null))
                    }
                  />
                  <Label htmlFor="edit-is-active">활성화</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is-premium"
                    checked={editingCard.is_premium || false}
                    onCheckedChange={(checked) =>
                      setEditingCard((prev) => (prev ? { ...prev, is_premium: checked } : null))
                    }
                  />
                  <Label htmlFor="edit-is-premium">프리미엄</Label>
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
