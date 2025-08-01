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
  Facebook,
  Instagram,
  Youtube,
  MessageSquare,
  Newspaper,
  Building2,
  AlertTriangle,
  Clock,
  User,
  Tag,
  Globe,
  Link,
  Languages,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  // 뉴스 관련 함수들
  createNewsArticle,
  createNewsFromUrl,
  updateNewsArticle,
  deleteNewsArticle,
  deleteMultipleNewsArticles,
  getNewsArticlesForAdmin,
  getNewsCategories,
  getNewsTags,
  parseNewsData,
  // 비즈니스 카드 관련 함수들
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
  // 공통 함수들
  checkAIStatus,
  testDatabaseConnection,
  type BusinessCardData,
  type NewsArticleData,
  type NewsArticle,
  type NewsCategory,
  type NewsTag,
  type AIStatusResult,
} from "@/lib/admin-actions"

interface Category {
  id: number
  name: string
  color_class: string
}

interface BusinessCardTag {
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
  // 공통 상태
  const [loading, setLoading] = useState(true)
  const [aiStatus, setAiStatus] = useState<AIStatusResult | null>(null)
  const [checkingAI, setCheckingAI] = useState(false)
  const [activeTab, setActiveTab] = useState("news") // 뉴스를 기본 탭으로 설정

  // 뉴스 관련 상태
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [newsCategories, setNewsCategories] = useState<NewsCategory[]>([])
  const [newsTags, setNewsTags] = useState<NewsTag[]>([])
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null)
  const [isCreatingNews, setIsCreatingNews] = useState(false)
  const [selectedNews, setSelectedNews] = useState<Set<number>>(new Set())
  const [creatingNews, setCreatingNews] = useState(false)
  const [updatingNews, setUpdatingNews] = useState(false)
  const [analyzingNewsText, setAnalyzingNewsText] = useState(false)
  const [newsAnalysisText, setNewsAnalysisText] = useState("")
  const [creatingFromUrl, setCreatingFromUrl] = useState(false)
  const [newsUrl, setNewsUrl] = useState("")

  // 비즈니스 카드 관련 상태
  const [cards, setCards] = useState<BusinessCard[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<BusinessCardTag[]>([])
  const [editingCard, setEditingCard] = useState<BusinessCard | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set())
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [analyzingText, setAnalyzingText] = useState(false)
  const [analysisText, setAnalysisText] = useState("")

  // 새 뉴스 폼 상태
  const [newNews, setNewNews] = useState<Partial<NewsArticleData>>({
    title: "",
    excerpt: "",
    content: "",
    category: "일반",
    tags: [],
    author: "Admin",
    is_breaking: false,
    is_published: true,
    image_url: "",
    source_url: "",
  })

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
      const [newsData, newsCategoriesData, newsTagsData, cardsData, categoriesData, tagsData] = await Promise.all([
        getNewsArticlesForAdmin(),
        getNewsCategories(),
        getNewsTags(),
        getBusinessCardsForAdmin(),
        getCategories(),
        getTags(),
      ])

      setNewsArticles(newsData)
      setNewsCategories(newsCategoriesData)
      setNewsTags(newsTagsData)
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

  // URL에서 뉴스 생성 핸들러
  const handleCreateNewsFromUrl = async () => {
    if (!newsUrl.trim()) {
      toast({
        title: "오류",
        description: "뉴스 URL을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!newsUrl.startsWith("http")) {
      toast({
        title: "오류",
        description: "유효한 URL을 입력해주세요. (http:// 또는 https://로 시작)",
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

    setCreatingFromUrl(true)
    try {
      const result = await createNewsFromUrl(newsUrl)
      toast({
        title: "성공",
        description: `뉴스가 성공적으로 생성되었습니다: ${result.title}`,
      })

      setNewsUrl("")
      await loadData()
    } catch (error) {
      toast({
        title: "URL 뉴스 생성 실패",
        description: error instanceof Error ? error.message : "URL에서 뉴스 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setCreatingFromUrl(false)
    }
  }

  // 뉴스 관련 핸들러들
  const handleAnalyzeNewsText = async () => {
    if (!newsAnalysisText.trim()) {
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

    setAnalyzingNewsText(true)
    try {
      const parsedData = await parseNewsData(newsAnalysisText)
      setNewNews((prev) => ({
        ...prev,
        ...parsedData,
      }))
      toast({
        title: "분석 완료",
        description: "뉴스 텍스트 분석이 완료되었습니다. 결과를 확인하고 수정해주세요.",
      })
    } catch (error) {
      toast({
        title: "분석 실패",
        description: error instanceof Error ? error.message : "뉴스 텍스트 분석 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setAnalyzingNewsText(false)
    }
  }

  const handleCreateNews = async () => {
    if (!newNews.title || !newNews.content) {
      toast({
        title: "오류",
        description: "제목과 내용은 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    setCreatingNews(true)
    try {
      await createNewsArticle(newNews as NewsArticleData)
      toast({
        title: "성공",
        description: "새 뉴스가 생성되었습니다.",
      })

      setIsCreatingNews(false)
      setNewNews({
        title: "",
        excerpt: "",
        content: "",
        category: "일반",
        tags: [],
        author: "Admin",
        is_breaking: false,
        is_published: true,
        image_url: "",
        source_url: "",
      })
      setNewsAnalysisText("")
      await loadData()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "뉴스 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setCreatingNews(false)
    }
  }

  const handleUpdateNews = async () => {
    if (!editingNews) {
      toast({
        title: "오류",
        description: "편집할 뉴스가 선택되지 않았습니다.",
        variant: "destructive",
      })
      return
    }

    if (!editingNews.title || !editingNews.content) {
      toast({
        title: "오류",
        description: "제목과 내용은 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    setUpdatingNews(true)
    try {
      const updateData: Partial<NewsArticleData> = {
        title: editingNews.title,
        excerpt: editingNews.excerpt,
        content: editingNews.content,
        category: editingNews.category,
        tags: editingNews.tags,
        author: editingNews.author,
        is_breaking: editingNews.is_breaking,
        is_published: editingNews.is_published,
        image_url: editingNews.image_url,
        source_url: editingNews.source_url,
      }

      await updateNewsArticle(editingNews.id, updateData)
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
      setUpdatingNews(false)
    }
  }

  const handleDeleteNews = async (id: number) => {
    if (!confirm("정말로 이 뉴스를 삭제하시겠습니까?")) return

    try {
      await deleteNewsArticle(id)
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

  const handleBulkDeleteNews = async () => {
    if (selectedNews.size === 0) {
      toast({
        title: "오류",
        description: "삭제할 뉴스를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`선택된 ${selectedNews.size}개의 뉴스를 삭제하시겠습니까?`)) return

    try {
      await deleteMultipleNewsArticles(Array.from(selectedNews))
      toast({
        title: "성공",
        description: `${selectedNews.size}개의 뉴스가 삭제되었습니다.`,
      })
      setSelectedNews(new Set())
      loadData()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "뉴스 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 뉴스 이미지 핸들러들
  const handleNewNewsImageChange = (imageUrl: string) => {
    setNewNews((prev) => ({ ...prev, image_url: imageUrl }))
    toast({
      title: "이미지 설정 완료",
      description: "뉴스 이미지가 설정되었습니다.",
    })
  }

  const handleNewNewsImageRemove = () => {
    setNewNews((prev) => ({ ...prev, image_url: "" }))
    toast({
      title: "이미지 제거 완료",
      description: "뉴스 이미지가 제거되었습니다.",
    })
  }

  const handleEditNewsImageChange = (imageUrl: string) => {
    setEditingNews((prev) => (prev ? { ...prev, image_url: imageUrl } : null))
    toast({
      title: "이미지 설정 완료",
      description: "뉴스 이미지가 설정되었습니다.",
    })
  }

  const handleEditNewsImageRemove = () => {
    setEditingNews((prev) => (prev ? { ...prev, image_url: "" } : null))
    toast({
      title: "이미지 제거 완료",
      description: "뉴스 이미지가 제거되었습니다.",
    })
  }

  // 기존 비즈니스 카드 핸들러들 (간소화)
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

  const handleSelectNews = (newsId: number, checked: boolean) => {
    const newSelected = new Set(selectedNews)
    if (checked) {
      newSelected.add(newsId)
    } else {
      newSelected.delete(newsId)
    }
    setSelectedNews(newSelected)
  }

  const handleSelectAllNews = (checked: boolean) => {
    if (checked) {
      setSelectedNews(new Set(newsArticles.map((news) => news.id)))
    } else {
      setSelectedNews(new Set())
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

  // 카드 이미지 핸들러들
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const allSelected = cards.length > 0 && selectedCards.size === cards.length
  const someSelected = selectedCards.size > 0 && selectedCards.size < cards.length
  const allNewsSelected = newsArticles.length > 0 && selectedNews.size === newsArticles.length
  const someNewsSelected = selectedNews.size > 0 && selectedNews.size < newsArticles.length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={testDatabase} className="flex items-center gap-2 bg-transparent">
            <Database className="h-4 w-4" />
            DB 연결 테스트
          </Button>
          <Button
            variant="outline"
            onClick={handleCheckAIStatus}
            disabled={checkingAI}
            className="flex items-center gap-2 bg-transparent"
          >
            {checkingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            AI 상태 확인
          </Button>
        </div>
      </div>

      {/* AI 상태 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI 분석 기능 상태
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

      {/* URL에서 뉴스 생성 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            URL에서 뉴스 생성
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Languages className="h-3 w-3 mr-1" />
              자동 번역
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              뉴스 기사 URL을 입력하면 AI가 자동으로 내용을 분석하고, 한글이 아닌 경우 번역하여 뉴스를 생성합니다.
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/news-article"
                value={newsUrl}
                onChange={(e) => setNewsUrl(e.target.value)}
                disabled={creatingFromUrl || !aiStatus?.isActive}
                className="flex-1"
              />
              <Button
                onClick={handleCreateNewsFromUrl}
                disabled={!newsUrl.trim() || creatingFromUrl || !aiStatus?.isActive}
                className="flex items-center gap-2"
              >
                {creatingFromUrl ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4" />
                    URL에서 뉴스 생성
                  </>
                )}
              </Button>
            </div>
            {!aiStatus?.isActive && (
              <Alert variant="destructive">
                <AlertDescription>
                  AI 기능이 비활성화되어 있습니다. URL에서 뉴스를 생성하려면 AI 기능을 활성화해주세요.
                </AlertDescription>
              </Alert>
            )}
            <div className="text-xs text-gray-500">
              <strong>지원 사이트:</strong> 대부분의 뉴스 사이트 (방콕포스트, 타이라트, 마티촌, 카오솟 등)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메인 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            뉴스 관리 ({newsArticles.length})
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            비즈니스 카드 ({cards.length})
          </TabsTrigger>
        </TabsList>

        {/* 뉴스 관리 탭 */}
        <TabsContent value="news" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">뉴스 관리</h2>
            <div className="flex items-center gap-4">
              {selectedNews.size > 0 && (
                <Button variant="destructive" onClick={handleBulkDeleteNews} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  선택된 {selectedNews.size}개 삭제
                </Button>
              )}
              <Button onClick={() => setIsCreatingNews(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />새 뉴스 추가
              </Button>
            </div>
          </div>

          {/* 뉴스 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allNewsSelected}
                    onCheckedChange={handleSelectAllNews}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = someNewsSelected
                      }
                    }}
                  />
                  뉴스 목록 ({newsArticles.length}개)
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsArticles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">등록된 뉴스가 없습니다. 새 뉴스를 추가해보세요.</div>
                ) : (
                  newsArticles.map((news) => (
                    <div key={news.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedNews.has(news.id)}
                          onCheckedChange={(checked) => handleSelectNews(news.id, checked as boolean)}
                        />

                        {/* 뉴스 이미지 표시 */}
                        <div className="flex-shrink-0">
                          {news.image_url ? (
                            <img
                              src={news.image_url || "/placeholder.svg"}
                              alt={news.title}
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
                            <h3 className="font-semibold">{news.title}</h3>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {news.category}
                            </Badge>
                            {news.is_breaking && (
                              <Badge className="bg-red-600 text-white animate-pulse">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                속보
                              </Badge>
                            )}
                            {news.translated && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Languages className="h-3 w-3 mr-1" />
                                번역됨
                              </Badge>
                            )}
                            {!news.is_published && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                비공개
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {news.excerpt || news.content.substring(0, 100) + "..."}
                          </p>

                          {/* 태그 표시 */}
                          <div className="flex items-center gap-2 mb-2">
                            {news.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {news.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{news.tags.length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {news.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              조회 {news.view_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {news.read_time || 5}분 읽기
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(news.created_at).toLocaleDateString()}
                            </span>
                            {news.source_url && (
                              <span className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                원문 링크
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingNews(news)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteNews(news.id)}>
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

        {/* 비즈니스 카드 관리 탭 */}
        <TabsContent value="business" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">비즈니스 카드 관리</h2>
            <div className="flex items-center gap-4">
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

                          {/* 소셜 미디어 링크 표시 */}
                          <div className="flex items-center gap-2 mb-2">
                            {card.facebook_url && (
                              <Badge variant="outline" className="text-blue-600">
                                <Facebook className="h-3 w-3 mr-1" />
                                Facebook
                              </Badge>
                            )}
                            {card.instagram_url && (
                              <Badge variant="outline" className="text-pink-600">
                                <Instagram className="h-3 w-3 mr-1" />
                                Instagram
                              </Badge>
                            )}
                            {card.tiktok_url && (
                              <Badge variant="outline" className="text-black">
                                TikTok
                              </Badge>
                            )}
                            {card.threads_url && (
                              <Badge variant="outline" className="text-gray-600">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Threads
                              </Badge>
                            )}
                            {card.youtube_url && (
                              <Badge variant="outline" className="text-red-600">
                                <Youtube className="h-3 w-3 mr-1" />
                                YouTube
                              </Badge>
                            )}
                          </div>

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
        </TabsContent>
      </Tabs>

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
                <Label htmlFor="news-analysis-text">분석할 뉴스 텍스트</Label>
                <Textarea
                  id="news-analysis-text"
                  placeholder="뉴스 정보가 포함된 텍스트를 입력하세요..."
                  value={newsAnalysisText}
                  onChange={(e) => setNewsAnalysisText(e.target.value)}
                  rows={6}
                  disabled={!aiStatus?.isActive}
                />
              </div>

              <Button
                onClick={handleAnalyzeNewsText}
                disabled={!newsAnalysisText.trim() || analyzingNewsText || !aiStatus?.isActive}
                className="w-full"
              >
                {analyzingNewsText ? (
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
                수동으로 뉴스 정보를 입력하거나, AI 분석 탭에서 텍스트를 분석한 후 결과를 수정할 수 있습니다.
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="news-title">제목 *</Label>
              <Input
                id="news-title"
                value={newNews.title || ""}
                onChange={(e) => setNewNews((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="뉴스 제목"
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
                  {newsCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="news-excerpt">요약</Label>
              <Textarea
                id="news-excerpt"
                value={newNews.excerpt || ""}
                onChange={(e) => setNewNews((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="뉴스 요약 (선택사항)"
                rows={2}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="news-content">내용 *</Label>
              <Textarea
                id="news-content"
                value={newNews.content || ""}
                onChange={(e) => setNewNews((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="뉴스 본문"
                rows={8}
              />
            </div>

            {/* 이미지 업로드 섹션 */}
            <div className="col-span-2 space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                뉴스 이미지
              </Label>
              <ImageUpload
                currentImageUrl={newNews.image_url || ""}
                onImageChange={handleNewNewsImageChange}
                onImageRemove={handleNewNewsImageRemove}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-author">작성자</Label>
              <Input
                id="news-author"
                value={newNews.author || "Admin"}
                onChange={(e) => setNewNews((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="작성자"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-source-url">원문 URL</Label>
              <Input
                id="news-source-url"
                value={newNews.source_url || ""}
                onChange={(e) => setNewNews((prev) => ({ ...prev, source_url: e.target.value }))}
                placeholder="https://example.com/news"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="news-tags">태그</Label>
              <Input
                id="news-tags"
                value={newNews.tags?.join(", ") || ""}
                onChange={(e) =>
                  setNewNews((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="태그1, 태그2, 태그3"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {newsTags.slice(0, 10).map((tag) => (
                  <Button
                    key={tag.id}
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      const currentTags = newNews.tags || []
                      if (!currentTags.includes(tag.name)) {
                        setNewNews((prev) => ({ ...prev, tags: [...currentTags, tag.name] }))
                      }
                    }}
                    className="text-xs h-6"
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="news-is_breaking"
                  checked={newNews.is_breaking || false}
                  onCheckedChange={(checked) => setNewNews((prev) => ({ ...prev, is_breaking: checked }))}
                />
                <Label htmlFor="news-is_breaking">속보</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="news-is_published"
                  checked={newNews.is_published !== false}
                  onCheckedChange={(checked) => setNewNews((prev) => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="news-is_published">발행</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsCreatingNews(false)} disabled={creatingNews}>
              취소
            </Button>
            <Button onClick={handleCreateNews} disabled={creatingNews}>
              {creatingNews ? (
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
                <Label htmlFor="edit-news-title">제목 *</Label>
                <Input
                  id="edit-news-title"
                  value={editingNews.title || ""}
                  onChange={(e) => setEditingNews((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  placeholder="뉴스 제목"
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
                    {newsCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-news-excerpt">요약</Label>
                <Textarea
                  id="edit-news-excerpt"
                  value={editingNews.excerpt || ""}
                  onChange={(e) => setEditingNews((prev) => (prev ? { ...prev, excerpt: e.target.value } : null))}
                  placeholder="뉴스 요약"
                  rows={2}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-news-content">내용 *</Label>
                <Textarea
                  id="edit-news-content"
                  value={editingNews.content || ""}
                  onChange={(e) => setEditingNews((prev) => (prev ? { ...prev, content: e.target.value } : null))}
                  placeholder="뉴스 본문"
                  rows={8}
                />
              </div>

              {/* 편집용 이미지 업로드 섹션 */}
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  뉴스 이미지
                </Label>
                <ImageUpload
                  currentImageUrl={editingNews.image_url || ""}
                  onImageChange={handleEditNewsImageChange}
                  onImageRemove={handleEditNewsImageRemove}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-news-author">작성자</Label>
                <Input
                  id="edit-news-author"
                  value={editingNews.author || ""}
                  onChange={(e) => setEditingNews((prev) => (prev ? { ...prev, author: e.target.value } : null))}
                  placeholder="작성자"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-news-source-url">원문 URL</Label>
                <Input
                  id="edit-news-source-url"
                  value={editingNews.source_url || ""}
                  onChange={(e) => setEditingNews((prev) => (prev ? { ...prev, source_url: e.target.value } : null))}
                  placeholder="https://example.com/news"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-news-tags">태그</Label>
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
                              .filter(Boolean),
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
                    id="edit-news-is_breaking"
                    checked={editingNews.is_breaking || false}
                    onCheckedChange={(checked) =>
                      setEditingNews((prev) => (prev ? { ...prev, is_breaking: checked } : null))
                    }
                  />
                  <Label htmlFor="edit-news-is_breaking">속보</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-news-is_published"
                    checked={editingNews.is_published !== false}
                    onCheckedChange={(checked) =>
                      setEditingNews((prev) => (prev ? { ...prev, is_published: checked } : null))
                    }
                  />
                  <Label htmlFor="edit-news-is_published">발행</Label>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setEditingNews(null)} disabled={updatingNews}>
              취소
            </Button>
            <Button onClick={handleUpdateNews} disabled={updatingNews}>
              {updatingNews ? (
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

      {/* 새 카드 생성 다이얼로그 - 기존과 동일하지만 간소화 */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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

            {/* 이미지 업로드 섹션 */}
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

            {/* 소셜 미디어 필드 추가 */}
            <div className="col-span-2">
              <Label className="text-lg font-semibold mb-4 block">소셜 미디어</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook_url" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    페이스북 URL
                  </Label>
                  <Input
                    id="facebook_url"
                    value={newCard.facebook_url || ""}
                    onChange={(e) => setNewCard((prev) => ({ ...prev, facebook_url: e.target.value }))}
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram_url" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    인스타그램 URL
                  </Label>
                  <Input
                    id="instagram_url"
                    value={newCard.instagram_url || ""}
                    onChange={(e) => setNewCard((prev) => ({ ...prev, instagram_url: e.target.value }))}
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiktok_url" className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-black rounded text-white text-xs flex items-center justify-center">
                      T
                    </span>
                    틱톡 URL
                  </Label>
                  <Input
                    id="tiktok_url"
                    value={newCard.tiktok_url || ""}
                    onChange={(e) => setNewCard((prev) => ({ ...prev, tiktok_url: e.target.value }))}
                    placeholder="https://tiktok.com/@..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threads_url" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                    쓰레드 URL
                  </Label>
                  <Input
                    id="threads_url"
                    value={newCard.threads_url || ""}
                    onChange={(e) => setNewCard((prev) => ({ ...prev, threads_url: e.target.value }))}
                    placeholder="https://threads.net/@..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube_url" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-600" />
                    유튜브 URL
                  </Label>
                  <Input
                    id="youtube_url"
                    value={newCard.youtube_url || ""}
                    onChange={(e) => setNewCard((prev) => ({ ...prev, youtube_url: e.target.value }))}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
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

      {/* 편집 다이얼로그 - 기존과 동일하지만 간소화 */}
      <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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

              {/* 편집용 이미지 업로드 섹션 */}
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

              {/* 편집용 소셜 미디어 필드 */}
              <div className="col-span-2">
                <Label className="text-lg font-semibold mb-4 block">소셜 미디어</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-facebook_url" className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      페이스북 URL
                    </Label>
                    <Input
                      id="edit-facebook_url"
                      value={editingCard.facebook_url || ""}
                      onChange={(e) =>
                        setEditingCard((prev) => (prev ? { ...prev, facebook_url: e.target.value } : null))
                      }
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-instagram_url" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-600" />
                      인스타그램 URL
                    </Label>
                    <Input
                      id="edit-instagram_url"
                      value={editingCard.instagram_url || ""}
                      onChange={(e) =>
                        setEditingCard((prev) => (prev ? { ...prev, instagram_url: e.target.value } : null))
                      }
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-tiktok_url" className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-black rounded text-white text-xs flex items-center justify-center">
                        T
                      </span>
                      틱톡 URL
                    </Label>
                    <Input
                      id="edit-tiktok_url"
                      value={editingCard.tiktok_url || ""}
                      onChange={(e) =>
                        setEditingCard((prev) => (prev ? { ...prev, tiktok_url: e.target.value } : null))
                      }
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-threads_url" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                      쓰레드 URL
                    </Label>
                    <Input
                      id="edit-threads_url"
                      value={editingCard.threads_url || ""}
                      onChange={(e) =>
                        setEditingCard((prev) => (prev ? { ...prev, threads_url: e.target.value } : null))
                      }
                      placeholder="https://threads.net/@..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-youtube_url" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-red-600" />
                      유튜브 URL
                    </Label>
                    <Input
                      id="edit-youtube_url"
                      value={editingCard.youtube_url || ""}
                      onChange={(e) =>
                        setEditingCard((prev) => (prev ? { ...prev, youtube_url: e.target.value } : null))
                      }
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
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
