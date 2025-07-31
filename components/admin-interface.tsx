"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import {
  Trash2,
  Edit,
  Plus,
  Search,
  Star,
  StarOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Globe,
  Languages,
  FileText,
  BarChart3,
  Database,
  ExternalLink,
  Info,
} from "lucide-react"

// Import actions
import {
  createBusinessCard,
  updateBusinessCard,
  deleteBusinessCard,
  deleteMultipleBusinessCards,
  getBusinessCardsForAdmin,
  getCategories,
  getTags,
  parseBusinessCardData,
  updatePremiumStatus,
  updateExposureCount,
  updateExposureWeight,
  checkAIStatus,
  type BusinessCardData,
  type AIStatusResult,
} from "@/lib/admin-actions"

import {
  createNews,
  updateNews,
  deleteNews,
  getNewsForAdmin,
  getNewsCategories,
  getNewsTags,
  analyzeNewsFromUrl,
  translateNews,
  checkNewsTablesExist,
  type NewsFormData,
} from "@/lib/admin-news-actions"

import type { NewsArticle, NewsCategory, NewsTag } from "@/types/news"

interface AdminInterfaceProps {
  onLogout: () => void
}

interface BusinessCard {
  id: number
  title: string
  description: string
  category_id: number
  categories?: { id: number; name: string; color_class: string }
  location?: string
  phone?: string
  kakao_id?: string
  line_id?: string
  website?: string
  hours?: string
  price?: string
  promotion?: string
  image_url?: string
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  threads_url?: string
  youtube_url?: string
  is_promoted: boolean
  is_active: boolean
  is_premium: boolean
  premium_expires_at?: string
  exposure_count: number
  last_exposed_at?: string
  exposure_weight: number
  view_count: number
  created_at: string
  updated_at: string
}

interface Category {
  id: number
  name: string
  color_class?: string
}

interface BusinessCardTag {
  id: number
  name: string
}

export default function AdminInterface({ onLogout }: AdminInterfaceProps) {
  // State management
  const [activeTab, setActiveTab] = useState("cards")
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<BusinessCardTag[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [aiStatus, setAiStatus] = useState<AIStatusResult | null>(null)

  // News state
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [newsCategories, setNewsCategories] = useState<NewsCategory[]>([])
  const [newsTags, setNewsTags] = useState<NewsTag[]>([])
  const [newsTablesExist, setNewsTablesExist] = useState(true)

  // Form states
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCard, setEditingCard] = useState<BusinessCard | null>(null)
  const [formData, setFormData] = useState<BusinessCardData>({
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
  })

  // News form states
  const [isEditNewsMode, setIsEditNewsMode] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null)
  const [newsFormData, setNewsFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    summary: "",
    category_id: undefined,
    author: "",
    source_url: "",
    image_url: "",
    is_featured: false,
    is_active: true,
    original_language: "ko",
    is_translated: false,
    tag_names: [],
  })

  // AI Parsing
  const [aiText, setAiText] = useState("")
  const [isParsing, setIsParsing] = useState(false)

  // News URL Analysis
  const [newsUrl, setNewsUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      // First check if news tables exist
      const tablesExist = await checkNewsTablesExist()
      setNewsTablesExist(tablesExist)

      // Load business card data (always available)
      await Promise.all([loadBusinessCards(), loadCategories(), loadTags(), checkAI()])

      // Only load news data if tables exist
      if (tablesExist) {
        await Promise.all([loadNews(), loadNewsCategories(), loadNewsTags()])
      }
    } catch (error) {
      console.error("데이터 로딩 오류:", error)
      toast({
        title: "오류",
        description: "데이터 로딩 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadBusinessCards = async () => {
    try {
      const cards = await getBusinessCardsForAdmin()
      setBusinessCards(cards)
    } catch (error) {
      console.error("카드 로딩 오류:", error)
    }
  }

  const loadCategories = async () => {
    try {
      const cats = await getCategories()
      setCategories(cats)
    } catch (error) {
      console.error("카테고리 로딩 오류:", error)
    }
  }

  const loadTags = async () => {
    try {
      const tagsData = await getTags()
      setTags(tagsData)
    } catch (error) {
      console.error("태그 로딩 오류:", error)
    }
  }

  const loadNews = async () => {
    try {
      const news = await getNewsForAdmin()
      setNewsArticles(news)
      setNewsTablesExist(true)
    } catch (error) {
      console.error("뉴스 로딩 오류:", error)
      setNewsTablesExist(false)
    }
  }

  const loadNewsCategories = async () => {
    try {
      const cats = await getNewsCategories()
      setNewsCategories(cats)
    } catch (error) {
      console.error("뉴스 카테고리 로딩 오류:", error)
      setNewsTablesExist(false)
    }
  }

  const loadNewsTags = async () => {
    try {
      const tagsData = await getNewsTags()
      setNewsTags(tagsData)
    } catch (error) {
      console.error("뉴스 태그 로딩 오류:", error)
      setNewsTablesExist(false)
    }
  }

  const checkAI = async () => {
    try {
      const status = await checkAIStatus()
      setAiStatus(status)
    } catch (error) {
      console.error("AI 상태 확인 오류:", error)
    }
  }

  // AI Text Parsing
  const handleAIParse = async () => {
    if (!aiText.trim()) {
      toast({
        title: "오류",
        description: "분석할 텍스트를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsParsing(true)
    try {
      const parsedData = await parseBusinessCardData(aiText)
      setFormData({
        ...formData,
        ...parsedData,
      })
      setAiText("")
      toast({
        title: "성공",
        description: "AI 분석이 완료되었습니다. 결과를 확인하고 저장해주세요.",
      })
    } catch (error) {
      console.error("AI 분석 오류:", error)
      toast({
        title: "AI 분석 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsParsing(false)
    }
  }

  // News URL Analysis - Enhanced with automatic Korean translation
  const handleNewsAnalysis = async () => {
    if (!newsUrl.trim()) {
      toast({
        title: "오류",
        description: "분석할 URL을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    // Validate URL format
    try {
      new URL(newsUrl)
    } catch {
      toast({
        title: "오류",
        description: "유효한 URL을 입력해주세요. (예: https://example.com/news)",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      console.log("Starting news analysis for URL:", newsUrl)

      const analysisResult = await analyzeNewsFromUrl(newsUrl)
      console.log("Analysis result received:", analysisResult)

      // Find category ID
      let categoryId = undefined
      if (analysisResult.category && newsCategories.length > 0) {
        const category = newsCategories.find(
          (cat) =>
            cat.name.toLowerCase().includes(analysisResult.category.toLowerCase()) ||
            analysisResult.category.toLowerCase().includes(cat.name.toLowerCase()),
        )
        if (category) {
          categoryId = category.id
        }
      }

      // Update form data with analysis results (all fields are now in Korean)
      const updatedFormData = {
        ...newsFormData,
        title: analysisResult.title || "",
        content: analysisResult.content || "",
        summary: analysisResult.summary || "",
        category_id: categoryId,
        author: analysisResult.author || "",
        source_url: newsUrl,
        original_language: analysisResult.language || "ko",
        is_translated: analysisResult.language !== "ko", // Mark as translated if original was not Korean
        tag_names: Array.isArray(analysisResult.tags) ? analysisResult.tags : [],
      }

      console.log("Updating form data with Korean translations:", updatedFormData)
      setNewsFormData(updatedFormData)
      setNewsUrl("")

      toast({
        title: "성공",
        description: `뉴스 분석이 완료되었습니다. ${analysisResult.language !== "ko" ? "모든 내용이 한국어로 번역되었습니다." : ""} 결과를 확인하고 저장해주세요.`,
      })
    } catch (error) {
      console.error("뉴스 분석 오류:", error)
      toast({
        title: "뉴스 분석 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // News Translation
  const handleNewsTranslation = async () => {
    if (!newsFormData.content.trim()) {
      toast({
        title: "오류",
        description: "번역할 내용이 없습니다.",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)
    try {
      const { translatedContent, detectedLanguage } = await translateNews(
        newsFormData.content,
        newsFormData.original_language,
      )

      setNewsFormData({
        ...newsFormData,
        content: translatedContent,
        original_language: detectedLanguage,
        is_translated: detectedLanguage !== "ko",
      })

      toast({
        title: "성공",
        description: "번역이 완료되었습니다.",
      })
    } catch (error) {
      console.error("번역 오류:", error)
      toast({
        title: "번역 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  // Form handlers
  const handleInputChange = (field: keyof BusinessCardData, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleNewsInputChange = (field: keyof NewsFormData, value: any) => {
    setNewsFormData({ ...newsFormData, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditMode && editingCard) {
        await updateBusinessCard(editingCard.id, formData)
        toast({ title: "성공", description: "카드가 업데이트되었습니다." })
      } else {
        await createBusinessCard(formData)
        toast({ title: "성공", description: "카드가 생성되었습니다." })
      }
      resetForm()
      await loadBusinessCards()
    } catch (error) {
      console.error("카드 저장 오류:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "카드 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditNewsMode && editingNews) {
        await updateNews(editingNews.id, newsFormData)
        toast({ title: "성공", description: "뉴스가 업데이트되었습니다." })
      } else {
        await createNews(newsFormData)
        toast({ title: "성공", description: "뉴스가 생성되었습니다." })
      }
      resetNewsForm()
      await loadNews()
    } catch (error) {
      console.error("뉴스 저장 오류:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "뉴스 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setIsEditMode(false)
    setEditingCard(null)
    setFormData({
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
    })
  }

  const resetNewsForm = () => {
    setIsEditNewsMode(false)
    setEditingNews(null)
    setNewsFormData({
      title: "",
      content: "",
      summary: "",
      category_id: undefined,
      author: "",
      source_url: "",
      image_url: "",
      is_featured: false,
      is_active: true,
      original_language: "ko",
      is_translated: false,
      tag_names: [],
    })
  }

  const handleEdit = (card: BusinessCard) => {
    setIsEditMode(true)
    setEditingCard(card)
    setFormData({
      title: card.title,
      description: card.description,
      category_id: card.category_id,
      location: card.location || "",
      phone: card.phone || "",
      kakao_id: card.kakao_id || "",
      line_id: card.line_id || "",
      website: card.website || "",
      hours: card.hours || "",
      price: card.price || "",
      promotion: card.promotion || "",
      image_url: card.image_url || "",
      facebook_url: card.facebook_url || "",
      instagram_url: card.instagram_url || "",
      tiktok_url: card.tiktok_url || "",
      threads_url: card.threads_url || "",
      youtube_url: card.youtube_url || "",
      is_promoted: card.is_promoted,
      is_active: card.is_active,
      is_premium: card.is_premium,
      premium_expires_at: card.premium_expires_at || undefined,
      exposure_count: card.exposure_count,
      exposure_weight: card.exposure_weight,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewsEdit = (news: NewsArticle) => {
    setIsEditNewsMode(true)
    setEditingNews(news)
    setNewsFormData({
      title: news.title,
      content: news.content,
      summary: news.summary || "",
      category_id: news.category_id,
      author: news.author || "",
      source_url: news.source_url || "",
      image_url: news.image_url || "",
      is_featured: news.is_featured,
      is_active: news.is_active,
      published_at: news.published_at,
      original_language: news.original_language,
      is_translated: news.is_translated,
      tag_names: news.tags?.map((tag) => tag.name) || [],
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: number) => {
    if (confirm("정말로 이 카드를 삭제하시겠습니까?")) {
      try {
        await deleteBusinessCard(id)
        toast({ title: "성공", description: "카드가 삭제되었습니다." })
        await loadBusinessCards()
      } catch (error) {
        toast({
          title: "오류",
          description: "카드 삭제 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    }
  }

  const handleNewsDelete = async (id: number) => {
    if (confirm("정말로 이 뉴스를 삭제하시겠습니까?")) {
      try {
        await deleteNews(id)
        toast({ title: "성공", description: "뉴스가 삭제되었습니다." })
        await loadNews()
      } catch (error) {
        toast({
          title: "오류",
          description: "뉴스 삭제 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedCards.length === 0) {
      toast({
        title: "알림",
        description: "삭제할 카드를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (confirm(`선택된 ${selectedCards.length}개의 카드를 삭제하시겠습니까?`)) {
      try {
        await deleteMultipleBusinessCards(selectedCards)
        toast({ title: "성공", description: `${selectedCards.length}개의 카드가 삭제되었습니다.` })
        setSelectedCards([])
        await loadBusinessCards()
      } catch (error) {
        toast({
          title: "오류",
          description: "카드 삭제 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    }
  }

  const toggleCardSelection = (cardId: number) => {
    setSelectedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const toggleAllCards = () => {
    if (selectedCards.length === filteredCards.length) {
      setSelectedCards([])
    } else {
      setSelectedCards(filteredCards.map((card) => card.id))
    }
  }

  const togglePremium = async (cardId: number, isPremium: boolean) => {
    try {
      const expiresAt = isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
      await updatePremiumStatus(cardId, isPremium, expiresAt)
      toast({
        title: "성공",
        description: `카드가 ${isPremium ? "프리미엄으로 설정" : "일반으로 변경"}되었습니다.`,
      })
      await loadBusinessCards()
    } catch (error) {
      toast({
        title: "오류",
        description: "프리미엄 상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const updateExposure = async (cardId: number, count: number) => {
    try {
      await updateExposureCount(cardId, count)
      toast({ title: "성공", description: "노출 카운트가 업데이트되었습니다." })
      await loadBusinessCards()
    } catch (error) {
      toast({
        title: "오류",
        description: "노출 카운트 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const updateWeight = async (cardId: number, weight: number) => {
    try {
      await updateExposureWeight(cardId, weight)
      toast({ title: "성공", description: "노출 가중치가 업데이트되었습니다." })
      await loadBusinessCards()
    } catch (error) {
      toast({
        title: "오류",
        description: "노출 가중치 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // Filter cards
  const filteredCards = businessCards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.categories?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || card.category_id.toString() === categoryFilter

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && card.is_active) ||
      (statusFilter === "inactive" && !card.is_active) ||
      (statusFilter === "premium" && card.is_premium) ||
      (statusFilter === "promoted" && card.is_promoted)

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Filter news
  const filteredNews = newsArticles.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.category?.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>데이터를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          <p className="text-muted-foreground">비즈니스 카드와 뉴스를 관리합니다</p>
        </div>
        <div className="flex items-center space-x-2">
          {aiStatus && (
            <Badge variant={aiStatus.isActive ? "default" : "destructive"}>
              AI {aiStatus.isActive ? "활성" : "비활성"}
            </Badge>
          )}
          <Button variant="outline" onClick={loadAllData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
          <Button variant="destructive" onClick={onLogout}>
            로그아웃
          </Button>
        </div>
      </div>

      {/* AI Status Alert */}
      {aiStatus && !aiStatus.isActive && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            AI 기능이 비활성화되어 있습니다: {aiStatus.error || "API 키를 확인해주세요."}
          </AlertDescription>
        </Alert>
      )}

      {/* News Tables Missing Alert */}
      {!newsTablesExist && (
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            뉴스 테이블이 존재하지 않습니다. 데이터베이스에서 뉴스 테이블 생성 스크립트를 실행해주세요.
            <br />
            <code className="text-sm bg-muted px-2 py-1 rounded mt-2 inline-block">
              scripts/11-create-news-tables.sql
            </code>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cards">비즈니스 카드 관리</TabsTrigger>
          <TabsTrigger value="news" disabled={!newsTablesExist}>
            뉴스 관리 {!newsTablesExist && "(테이블 없음)"}
          </TabsTrigger>
        </TabsList>

        {/* Business Cards Tab */}
        <TabsContent value="cards" className="space-y-6">
          {/* Card Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {isEditMode ? "카드 수정" : "새 카드 생성"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* AI Parsing Section */}
              {aiStatus?.isActive && (
                <div className="mb-6 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    AI 텍스트 분석
                  </h3>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="분석할 텍스트를 입력하세요 (카드 정보, 광고 텍스트 등)"
                      value={aiText}
                      onChange={(e) => setAiText(e.target.value)}
                      rows={4}
                    />
                    <Button onClick={handleAIParse} disabled={isParsing || !aiText.trim()}>
                      {isParsing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          분석 중...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          AI 분석 실행
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">제목 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">카테고리 *</Label>
                    <Select
                      value={formData.category_id?.toString() || ""}
                      onValueChange={(value) => handleInputChange("category_id", Number.parseInt(value))}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명 *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">위치</Label>
                    <Input
                      id="location"
                      value={formData.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kakao_id">카카오톡 ID</Label>
                    <Input
                      id="kakao_id"
                      value={formData.kakao_id || ""}
                      onChange={(e) => handleInputChange("kakao_id", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="line_id">라인 ID</Label>
                    <Input
                      id="line_id"
                      value={formData.line_id || ""}
                      onChange={(e) => handleInputChange("line_id", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">웹사이트</Label>
                    <Input
                      id="website"
                      value={formData.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hours">운영시간</Label>
                    <Input
                      id="hours"
                      value={formData.hours || ""}
                      onChange={(e) => handleInputChange("hours", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">가격</Label>
                    <Input
                      id="price"
                      value={formData.price || ""}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promotion">프로모션</Label>
                    <Input
                      id="promotion"
                      value={formData.promotion || ""}
                      onChange={(e) => handleInputChange("promotion", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">이미지 URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url || ""}
                    onChange={(e) => handleInputChange("image_url", e.target.value)}
                  />
                </div>

                {/* Social Media Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">소셜 미디어</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook_url">페이스북 URL</Label>
                      <Input
                        id="facebook_url"
                        value={formData.facebook_url || ""}
                        onChange={(e) => handleInputChange("facebook_url", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram_url">인스타그램 URL</Label>
                      <Input
                        id="instagram_url"
                        value={formData.instagram_url || ""}
                        onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tiktok_url">틱톡 URL</Label>
                      <Input
                        id="tiktok_url"
                        value={formData.tiktok_url || ""}
                        onChange={(e) => handleInputChange("tiktok_url", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="threads_url">쓰레드 URL</Label>
                      <Input
                        id="threads_url"
                        value={formData.threads_url || ""}
                        onChange={(e) => handleInputChange("threads_url", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube_url">유튜브 URL</Label>
                    <Input
                      id="youtube_url"
                      value={formData.youtube_url || ""}
                      onChange={(e) => handleInputChange("youtube_url", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                    />
                    <Label htmlFor="is_active">활성화</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_promoted"
                      checked={formData.is_promoted}
                      onCheckedChange={(checked) => handleInputChange("is_promoted", checked)}
                    />
                    <Label htmlFor="is_promoted">홍보</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_premium"
                      checked={formData.is_premium}
                      onCheckedChange={(checked) => handleInputChange("is_premium", checked)}
                    />
                    <Label htmlFor="is_premium">프리미엄</Label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">{isEditMode ? "업데이트" : "생성"}</Button>
                  {isEditMode && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      취소
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="카테고리 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
                <SelectItem value="premium">프리미엄</SelectItem>
                <SelectItem value="promoted">홍보</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedCards.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span>{selectedCards.length}개 카드 선택됨</span>
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                선택 삭제
              </Button>
            </div>
          )}

          {/* Cards List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">카드 목록 ({filteredCards.length}개)</h2>
              <Button variant="outline" size="sm" onClick={toggleAllCards}>
                {selectedCards.length === filteredCards.length ? "전체 해제" : "전체 선택"}
              </Button>
            </div>

            {filteredCards.map((card) => (
              <Card key={card.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedCards.includes(card.id)}
                        onCheckedChange={() => toggleCardSelection(card.id)}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{card.title}</h3>
                          {card.categories && (
                            <Badge variant="secondary" className={card.categories.color_class}>
                              {card.categories.name}
                            </Badge>
                          )}
                          {card.is_premium && <Badge variant="default">프리미엄</Badge>}
                          {card.is_promoted && <Badge variant="outline">홍보</Badge>}
                          {!card.is_active && <Badge variant="destructive">비활성</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{card.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>노출: {card.exposure_count}</span>
                          <span>조회: {card.view_count}</span>
                          <span>가중치: {card.exposure_weight}</span>
                          {card.location && <span>📍 {card.location}</span>}
                          {card.phone && <span>📞 {card.phone}</span>}
                        </div>
                        {/* Social Media Icons */}
                        <div className="flex items-center gap-2">
                          {card.facebook_url && (
                            <Badge variant="outline" className="text-xs">
                              Facebook
                            </Badge>
                          )}
                          {card.instagram_url && (
                            <Badge variant="outline" className="text-xs">
                              Instagram
                            </Badge>
                          )}
                          {card.tiktok_url && (
                            <Badge variant="outline" className="text-xs">
                              TikTok
                            </Badge>
                          )}
                          {card.threads_url && (
                            <Badge variant="outline" className="text-xs">
                              Threads
                            </Badge>
                          )}
                          {card.youtube_url && (
                            <Badge variant="outline" className="text-xs">
                              YouTube
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePremium(card.id, !card.is_premium)}
                        title={card.is_premium ? "프리미엄 해제" : "프리미엄 설정"}
                      >
                        {card.is_premium ? (
                          <Star className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="노출 관리">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>노출 관리 - {card.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>노출 카운트</Label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  defaultValue={card.exposure_count}
                                  onBlur={(e) => updateExposure(card.id, Number.parseInt(e.target.value) || 0)}
                                />
                                <Button variant="outline" size="sm" onClick={() => updateExposure(card.id, 0)}>
                                  초기화
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>노출 가중치</Label>
                              <Input
                                type="number"
                                step="0.1"
                                defaultValue={card.exposure_weight}
                                onBlur={(e) => updateWeight(card.id, Number.parseFloat(e.target.value) || 1.0)}
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(card)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCards.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">검색 조건에 맞는 카드가 없습니다.</div>
            )}
          </div>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-6">
          {newsTablesExist ? (
            <>
              {/* News Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {isEditNewsMode ? "뉴스 수정" : "새 뉴스 생성"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* AI News Analysis Section */}
                  {aiStatus?.isActive && (
                    <div className="mb-6 p-4 border rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        AI 뉴스 분석
                      </h3>
                      <Alert className="mb-4">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          유효한 뉴스 URL을 입력하면 AI가 해당 웹페이지의 내용을 분석하여 자동으로 제목, 내용, 요약,
                          카테고리, 태그를 추출합니다. 외국어 콘텐츠는 자동으로 한국어로 번역됩니다.
                          <br />
                          <strong>지원 사이트:</strong> sanook.com, bangkokpost.com, thairath.co.th, matichon.co.th,
                          한국 외교부 등
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="뉴스 URL을 입력하세요 (예: https://example.com/news/article)"
                            value={newsUrl}
                            onChange={(e) => setNewsUrl(e.target.value)}
                          />
                          <Button onClick={handleNewsAnalysis} disabled={isAnalyzing || !newsUrl.trim()}>
                            {isAnalyzing ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                분석 중...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                URL 분석
                              </>
                            )}
                          </Button>
                        </div>
                        {newsFormData.content && (
                          <Button variant="outline" onClick={handleNewsTranslation} disabled={isTranslating}>
                            {isTranslating ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                번역 중...
                              </>
                            ) : (
                              <>
                                <Languages className="h-4 w-4 mr-2" />
                                한국어로 번역
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleNewsSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="news_title">제목 *</Label>
                        <Input
                          id="news_title"
                          value={newsFormData.title}
                          onChange={(e) => handleNewsInputChange("title", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="news_category">카테고리</Label>
                        <Select
                          value={newsFormData.category_id?.toString() || ""}
                          onValueChange={(value) => handleNewsInputChange("category_id", Number.parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {newsCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="news_content">내용 *</Label>
                      <Textarea
                        id="news_content"
                        value={newsFormData.content}
                        onChange={(e) => handleNewsInputChange("content", e.target.value)}
                        rows={6}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="news_summary">요약</Label>
                      <Textarea
                        id="news_summary"
                        value={newsFormData.summary || ""}
                        onChange={(e) => handleNewsInputChange("summary", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="news_author">작성자</Label>
                        <Input
                          id="news_author"
                          value={newsFormData.author || ""}
                          onChange={(e) => handleNewsInputChange("author", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="news_source_url">소스 URL</Label>
                        <Input
                          id="news_source_url"
                          value={newsFormData.source_url || ""}
                          onChange={(e) => handleNewsInputChange("source_url", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="news_image_url">이미지 URL</Label>
                        <Input
                          id="news_image_url"
                          value={newsFormData.image_url || ""}
                          onChange={(e) => handleNewsInputChange("image_url", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="original_language">원본 언어</Label>
                        <Select
                          value={newsFormData.original_language || "ko"}
                          onValueChange={(value) => handleNewsInputChange("original_language", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ko">한국어</SelectItem>
                            <SelectItem value="en">영어</SelectItem>
                            <SelectItem value="th">태국어</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="news_tags">태그 (쉼표로 구분)</Label>
                      <Input
                        id="news_tags"
                        value={newsFormData.tag_names?.join(", ") || ""}
                        onChange={(e) =>
                          handleNewsInputChange(
                            "tag_names",
                            e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          )
                        }
                        placeholder="예: 비즈니스, 기술, 뉴스"
                      />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="news_is_active"
                          checked={newsFormData.is_active}
                          onCheckedChange={(checked) => handleNewsInputChange("is_active", checked)}
                        />
                        <Label htmlFor="news_is_active">활성화</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="news_is_featured"
                          checked={newsFormData.is_featured}
                          onCheckedChange={(checked) => handleNewsInputChange("is_featured", checked)}
                        />
                        <Label htmlFor="news_is_featured">추천 뉴스</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="news_is_translated"
                          checked={newsFormData.is_translated}
                          onCheckedChange={(checked) => handleNewsInputChange("is_translated", checked)}
                        />
                        <Label htmlFor="news_is_translated">번역된 뉴스</Label>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit">{isEditNewsMode ? "업데이트" : "생성"}</Button>
                      {isEditNewsMode && (
                        <Button type="button" variant="outline" onClick={resetNewsForm}>
                          취소
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* News Search */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="뉴스 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              {/* News List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">뉴스 목록 ({filteredNews.length}개)</h2>

                {filteredNews.map((news) => (
                  <Card key={news.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{news.title}</h3>
                            {news.category && (
                              <Badge variant="secondary" className={news.category.color_class}>
                                {news.category.name}
                              </Badge>
                            )}
                            {news.is_featured && <Badge variant="default">추천</Badge>}
                            {news.is_translated && <Badge variant="outline">번역됨</Badge>}
                            {!news.is_active && <Badge variant="destructive">비활성</Badge>}
                            <Badge variant="outline" className="text-xs">
                              {news.original_language.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {news.summary || news.content.substring(0, 100) + "..."}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>조회: {news.view_count}</span>
                            {news.author && <span>작성자: {news.author}</span>}
                            <span>{new Date(news.published_at).toLocaleDateString()}</span>
                            {news.source_url && (
                              <a
                                href={news.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary"
                              >
                                <ExternalLink className="h-3 w-3" />
                                소스
                              </a>
                            )}
                          </div>
                          {news.tags && news.tags.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              {news.tags.map((tag) => (
                                <Badge key={tag.id} variant="outline" className="text-xs">
                                  #{tag.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleNewsEdit(news)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleNewsDelete(news.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredNews.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">검색 조건에 맞는 뉴스가 없습니다.</div>
                )}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">뉴스 테이블이 없습니다</h3>
                <p className="text-muted-foreground mb-4">
                  뉴스 기능을 사용하려면 먼저 데이터베이스에 뉴스 테이블을 생성해야 합니다.
                </p>
                <div className="bg-muted p-4 rounded-lg text-left">
                  <p className="text-sm font-medium mb-2">실행할 스크립트:</p>
                  <code className="text-sm">scripts/11-create-news-tables.sql</code>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
