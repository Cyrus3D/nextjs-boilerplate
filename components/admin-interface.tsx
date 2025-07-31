"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Loader2, Plus, Edit, Trash2, Star, Sparkles, Globe, Languages } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

// Business Card Actions
import {
  createBusinessCard,
  updateBusinessCard,
  deleteBusinessCard,
  deleteMultipleBusinessCards,
  getBusinessCardsForAdmin,
  getCategories,
  getTags,
  parseBusinessCardData,
  checkAIStatus,
  type BusinessCardData,
  type AIStatusResult,
} from "@/lib/admin-actions"

// News Actions
import {
  createNews,
  updateNews,
  deleteNews,
  deleteMultipleNews,
  getNewsForAdmin,
  analyzeNewsFromUrl,
  type NewsAnalysisResult,
} from "@/lib/admin-news-actions"

import type { NewsItem, NewsFormData } from "@/types/news"

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
  created_at: string
  updated_at: string
  categories?: Category
}

export function AdminInterface() {
  // Business Cards State
  const [businessCards, setBusinessCards] = useState<BusinessCard[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [cardFilter, setCardFilter] = useState("all")
  const [cardCategoryFilter, setCategoryFilter] = useState("all")
  const [cardSearchTerm, setCardSearchTerm] = useState("")
  const [isCardLoading, setIsCardLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState<AIStatusResult | null>(null)

  // News State
  const [news, setNews] = useState<NewsItem[]>([])
  const [selectedNews, setSelectedNews] = useState<number[]>([])
  const [newsFilter, setNewsFilter] = useState("all")
  const [newsCategoryFilter, setNewsCategoryFilter] = useState("all")
  const [newsSearchTerm, setNewsSearchTerm] = useState("")
  const [isNewsLoading, setIsNewsLoading] = useState(false)

  // Form States
  const [isCardFormOpen, setIsCardFormOpen] = useState(false)
  const [isNewsFormOpen, setIsNewsFormOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<BusinessCard | null>(null)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // AI Analysis States
  const [aiText, setAiText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [newsUrl, setNewsUrl] = useState("")
  const [isAnalyzingNews, setIsAnalyzingNews] = useState(false)

  // Form Data
  const [cardFormData, setCardFormData] = useState<BusinessCardData>({
    title: "",
    description: "",
    category_id: 1,
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
    premium_expires_at: null,
    exposure_count: 0,
    last_exposed_at: null,
    exposure_weight: 1.0,
    view_count: 0,
  })

  const [newsFormData, setNewsFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    summary: "",
    source_url: "",
    image_url: "",
    category: "general",
    tags: [],
    is_featured: false,
    is_active: true,
  })

  // Load data on component mount
  useEffect(() => {
    loadBusinessCards()
    loadCategories()
    loadTags()
    loadNews()
    checkAIStatusAsync()
  }, [])

  // Business Card Functions
  const loadBusinessCards = async () => {
    setIsCardLoading(true)
    try {
      const data = await getBusinessCardsForAdmin()
      setBusinessCards(data)
    } catch (error) {
      toast({
        title: "오류",
        description: "카드 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsCardLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error("카테고리 로드 오류:", error)
    }
  }

  const loadTags = async () => {
    try {
      const data = await getTags()
      setTags(data)
    } catch (error) {
      console.error("태그 로드 오류:", error)
    }
  }

  const checkAIStatusAsync = async () => {
    try {
      const status = await checkAIStatus()
      setAiStatus(status)
    } catch (error) {
      console.error("AI 상태 확인 오류:", error)
    }
  }

  // News Functions
  const loadNews = async () => {
    setIsNewsLoading(true)
    try {
      const data = await getNewsForAdmin()
      setNews(data)
    } catch (error) {
      toast({
        title: "오류",
        description: "뉴스 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsNewsLoading(false)
    }
  }

  // AI Analysis Functions
  const handleAIAnalysis = async () => {
    if (!aiText.trim()) {
      toast({
        title: "오류",
        description: "분석할 텍스트를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const parsedData = await parseBusinessCardData(aiText)
      setCardFormData((prev) => ({
        ...prev,
        ...parsedData,
        category_id: parsedData.category_id || prev.category_id,
      }))
      setAiText("")
      toast({
        title: "성공",
        description: "AI 분석이 완료되었습니다. 폼이 자동으로 채워졌습니다.",
      })
    } catch (error) {
      toast({
        title: "AI 분석 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNewsAnalysis = async () => {
    if (!newsUrl.trim()) {
      toast({
        title: "오류",
        description: "분석할 URL을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzingNews(true)
    try {
      const analysisResult: NewsAnalysisResult = await analyzeNewsFromUrl(newsUrl)
      setNewsFormData((prev) => ({
        ...prev,
        title: analysisResult.title,
        content: analysisResult.content,
        summary: analysisResult.summary,
        source_url: newsUrl,
        category: analysisResult.category,
        tags: analysisResult.tags,
      }))
      setNewsUrl("")
      toast({
        title: "성공",
        description: `뉴스 분석이 완료되었습니다. ${analysisResult.isTranslated ? "번역된 " : ""}내용이 폼에 채워졌습니다.`,
      })
    } catch (error) {
      toast({
        title: "뉴스 분석 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzingNews(false)
    }
  }

  // Form Handlers
  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingCard) {
        await updateBusinessCard(editingCard.id, cardFormData)
        toast({
          title: "성공",
          description: "카드가 성공적으로 업데이트되었습니다.",
        })
      } else {
        await createBusinessCard(cardFormData)
        toast({
          title: "성공",
          description: "카드가 성공적으로 생성되었습니다.",
        })
      }

      resetCardForm()
      loadBusinessCards()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingNews) {
        await updateNews(editingNews.id, newsFormData)
        toast({
          title: "성공",
          description: "뉴스가 성공적으로 업데이트되었습니다.",
        })
      } else {
        await createNews(newsFormData)
        toast({
          title: "성공",
          description: "뉴스가 성공적으로 생성되었습니다.",
        })
      }

      resetNewsForm()
      loadNews()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetCardForm = () => {
    setCardFormData({
      title: "",
      description: "",
      category_id: 1,
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
      premium_expires_at: null,
      exposure_count: 0,
      last_exposed_at: null,
      exposure_weight: 1.0,
      view_count: 0,
    })
    setEditingCard(null)
    setIsCardFormOpen(false)
  }

  const resetNewsForm = () => {
    setNewsFormData({
      title: "",
      content: "",
      summary: "",
      source_url: "",
      image_url: "",
      category: "general",
      tags: [],
      is_featured: false,
      is_active: true,
    })
    setEditingNews(null)
    setIsNewsFormOpen(false)
  }

  // Delete Handlers
  const handleDeleteCard = async (id: number) => {
    try {
      await deleteBusinessCard(id)
      toast({
        title: "성공",
        description: "카드가 삭제되었습니다.",
      })
      loadBusinessCards()
    } catch (error) {
      toast({
        title: "오류",
        description: "카드 삭제에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNews = async (id: number) => {
    try {
      await deleteNews(id)
      toast({
        title: "성공",
        description: "뉴스가 삭제되었습니다.",
      })
      loadNews()
    } catch (error) {
      toast({
        title: "오류",
        description: "뉴스 삭제에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSelectedCards = async () => {
    if (selectedCards.length === 0) return

    try {
      await deleteMultipleBusinessCards(selectedCards)
      toast({
        title: "성공",
        description: `${selectedCards.length}개의 카드가 삭제되었습니다.`,
      })
      setSelectedCards([])
      loadBusinessCards()
    } catch (error) {
      toast({
        title: "오류",
        description: "선택된 카드 삭제에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSelectedNews = async () => {
    if (selectedNews.length === 0) return

    try {
      await deleteMultipleNews(selectedNews)
      toast({
        title: "성공",
        description: `${selectedNews.length}개의 뉴스가 삭제되었습니다.`,
      })
      setSelectedNews([])
      loadNews()
    } catch (error) {
      toast({
        title: "오류",
        description: "선택된 뉴스 삭제에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  // Filter Functions
  const filteredBusinessCards = businessCards.filter((card) => {
    const matchesFilter =
      cardFilter === "all" ||
      (cardFilter === "active" && card.is_active) ||
      (cardFilter === "inactive" && !card.is_active) ||
      (cardFilter === "premium" && card.is_premium) ||
      (cardFilter === "promoted" && card.is_promoted)

    const matchesCategory = cardCategoryFilter === "all" || card.category_id.toString() === cardCategoryFilter

    const matchesSearch =
      cardSearchTerm === "" ||
      card.title.toLowerCase().includes(cardSearchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(cardSearchTerm.toLowerCase())

    return matchesFilter && matchesCategory && matchesSearch
  })

  const filteredNews = news.filter((item) => {
    const matchesFilter =
      newsFilter === "all" ||
      (newsFilter === "active" && item.is_active) ||
      (newsFilter === "inactive" && !item.is_active) ||
      (newsFilter === "featured" && item.is_featured)

    const matchesCategory = newsCategoryFilter === "all" || item.category === newsCategoryFilter

    const matchesSearch =
      newsSearchTerm === "" ||
      item.title.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(newsSearchTerm.toLowerCase())

    return matchesFilter && matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
        <p className="text-muted-foreground">비즈니스 카드와 뉴스를 관리하세요</p>
      </div>

      {/* AI Status */}
      {aiStatus && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant={aiStatus.isActive ? "default" : "destructive"}>
                {aiStatus.isActive ? "활성" : "비활성"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                마지막 확인: {new Date(aiStatus.lastChecked).toLocaleString()}
              </span>
              {aiStatus.error && <span className="text-sm text-destructive">{aiStatus.error}</span>}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="business-cards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business-cards">비즈니스 카드</TabsTrigger>
          <TabsTrigger value="news">뉴스 관리</TabsTrigger>
        </TabsList>

        {/* Business Cards Tab */}
        <TabsContent value="business-cards" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Input
                placeholder="카드 검색..."
                value={cardSearchTerm}
                onChange={(e) => setCardSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={cardFilter} onValueChange={setCardFilter}>
                <SelectTrigger className="max-w-[180px]">
                  <SelectValue placeholder="필터 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 카드</SelectItem>
                  <SelectItem value="active">활성 카드</SelectItem>
                  <SelectItem value="inactive">비활성 카드</SelectItem>
                  <SelectItem value="premium">프리미엄 카드</SelectItem>
                  <SelectItem value="promoted">프로모션 카드</SelectItem>
                </SelectContent>
              </Select>
              <Select value={cardCategoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="max-w-[180px]">
                  <SelectValue placeholder="카테고리 선택" />
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
            </div>
            <div className="flex gap-2">
              {selectedCards.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      선택 삭제 ({selectedCards.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>선택된 카드 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        선택된 {selectedCards.length}개의 카드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSelectedCards}>삭제</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Dialog open={isCardFormOpen} onOpenChange={setIsCardFormOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetCardForm()
                      setIsCardFormOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />새 카드
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingCard ? "카드 수정" : "새 카드 생성"}</DialogTitle>
                    <DialogDescription>비즈니스 카드 정보를 입력하세요.</DialogDescription>
                  </DialogHeader>

                  {/* AI Analysis Section */}
                  {aiStatus?.isActive && (
                    <Card className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          AI 분석
                        </CardTitle>
                        <CardDescription>텍스트를 입력하면 AI가 자동으로 카드 정보를 추출합니다.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea
                          placeholder="분석할 텍스트를 입력하세요..."
                          value={aiText}
                          onChange={(e) => setAiText(e.target.value)}
                          rows={4}
                        />
                        <Button onClick={handleAIAnalysis} disabled={isAnalyzing || !aiText.trim()} className="w-full">
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              분석 중...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              AI 분석 시작
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <form onSubmit={handleCardSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">제목 *</Label>
                        <Input
                          id="title"
                          value={cardFormData.title}
                          onChange={(e) => setCardFormData((prev) => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">카테고리 *</Label>
                        <Select
                          value={cardFormData.category_id.toString()}
                          onValueChange={(value) =>
                            setCardFormData((prev) => ({ ...prev, category_id: Number.parseInt(value) }))
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">설명 *</Label>
                      <Textarea
                        id="description"
                        value={cardFormData.description}
                        onChange={(e) => setCardFormData((prev) => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">위치</Label>
                        <Input
                          id="location"
                          value={cardFormData.location || ""}
                          onChange={(e) => setCardFormData((prev) => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">전화번호</Label>
                        <Input
                          id="phone"
                          value={cardFormData.phone || ""}
                          onChange={(e) => setCardFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="kakao_id">카카오톡 ID</Label>
                        <Input
                          id="kakao_id"
                          value={cardFormData.kakao_id || ""}
                          onChange={(e) => setCardFormData((prev) => ({ ...prev, kakao_id: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="line_id">라인 ID</Label>
                        <Input
                          id="line_id"
                          value={cardFormData.line_id || ""}
                          onChange={(e) => setCardFormData((prev) => ({ ...prev, line_id: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">웹사이트</Label>
                      <Input
                        id="website"
                        type="url"
                        value={cardFormData.website || ""}
                        onChange={(e) => setCardFormData((prev) => ({ ...prev, website: e.target.value }))}
                      />
                    </div>

                    {/* Social Media Fields */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">소셜 미디어</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="facebook_url">페이스북 URL</Label>
                          <Input
                            id="facebook_url"
                            type="url"
                            value={cardFormData.facebook_url || ""}
                            onChange={(e) => setCardFormData((prev) => ({ ...prev, facebook_url: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instagram_url">인스타그램 URL</Label>
                          <Input
                            id="instagram_url"
                            type="url"
                            value={cardFormData.instagram_url || ""}
                            onChange={(e) => setCardFormData((prev) => ({ ...prev, instagram_url: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tiktok_url">틱톡 URL</Label>
                          <Input
                            id="tiktok_url"
                            type="url"
                            value={cardFormData.tiktok_url || ""}
                            onChange={(e) => setCardFormData((prev) => ({ ...prev, tiktok_url: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="youtube_url">유튜브 URL</Label>
                          <Input
                            id="youtube_url"
                            type="url"
                            value={cardFormData.youtube_url || ""}
                            onChange={(e) => setCardFormData((prev) => ({ ...prev, youtube_url: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hours">운영시간</Label>
                        <Input
                          id="hours"
                          value={cardFormData.hours || ""}
                          onChange={(e) => setCardFormData((prev) => ({ ...prev, hours: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">가격 정보</Label>
                        <Input
                          id="price"
                          value={cardFormData.price || ""}
                          onChange={(e) => setCardFormData((prev) => ({ ...prev, price: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promotion">프로모션</Label>
                      <Textarea
                        id="promotion"
                        value={cardFormData.promotion || ""}
                        onChange={(e) => setCardFormData((prev) => ({ ...prev, promotion: e.target.value }))}
                        rows={2}
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label>이미지</Label>
                      <ImageUpload
                        value={cardFormData.image_url || ""}
                        onChange={(url) => setCardFormData((prev) => ({ ...prev, image_url: url }))}
                      />
                    </div>

                    {/* Settings */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">설정</Label>
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is_active"
                            checked={cardFormData.is_active}
                            onCheckedChange={(checked) => setCardFormData((prev) => ({ ...prev, is_active: checked }))}
                          />
                          <Label htmlFor="is_active">활성</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is_promoted"
                            checked={cardFormData.is_promoted}
                            onCheckedChange={(checked) =>
                              setCardFormData((prev) => ({ ...prev, is_promoted: checked }))
                            }
                          />
                          <Label htmlFor="is_promoted">프로모션</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is_premium"
                            checked={cardFormData.is_premium}
                            onCheckedChange={(checked) => setCardFormData((prev) => ({ ...prev, is_premium: checked }))}
                          />
                          <Label htmlFor="is_premium">프리미엄</Label>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={resetCardForm}>
                        취소
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            저장 중...
                          </>
                        ) : editingCard ? (
                          "업데이트"
                        ) : (
                          "생성"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Business Cards List */}
          <div className="space-y-4">
            {isCardLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredBusinessCards.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">카드가 없습니다.</p>
                </CardContent>
              </Card>
            ) : (
              filteredBusinessCards.map((card) => (
                <Card key={card.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Checkbox
                          checked={selectedCards.includes(card.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCards((prev) => [...prev, card.id])
                            } else {
                              setSelectedCards((prev) => prev.filter((id) => id !== card.id))
                            }
                          }}
                        />
                        {card.image_url && (
                          <img
                            src={card.image_url || "/placeholder.svg"}
                            alt={card.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{card.title}</h3>
                            {card.categories && (
                              <Badge variant="secondary" className={card.categories.color_class}>
                                {card.categories.name}
                              </Badge>
                            )}
                            {card.is_premium && <Badge variant="default">프리미엄</Badge>}
                            {card.is_promoted && <Badge variant="outline">프로모션</Badge>}
                            {!card.is_active && <Badge variant="destructive">비활성</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{card.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>조회: {card.view_count || 0}</span>
                            <span>노출: {card.exposure_count || 0}</span>
                            <span>생성: {new Date(card.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCard(card)
                            setCardFormData({
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
                              is_promoted: card.is_promoted || false,
                              is_active: card.is_active !== false,
                              is_premium: card.is_premium || false,
                              premium_expires_at: card.premium_expires_at || null,
                              exposure_count: card.exposure_count || 0,
                              last_exposed_at: card.last_exposed_at || null,
                              exposure_weight: card.exposure_weight || 1.0,
                              view_count: card.view_count || 0,
                            })
                            setIsCardFormOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>카드 삭제</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{card.title}" 카드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCard(card.id)}>삭제</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Input
                placeholder="뉴스 검색..."
                value={newsSearchTerm}
                onChange={(e) => setNewsSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={newsFilter} onValueChange={setNewsFilter}>
                <SelectTrigger className="max-w-[180px]">
                  <SelectValue placeholder="필터 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 뉴스</SelectItem>
                  <SelectItem value="active">활성 뉴스</SelectItem>
                  <SelectItem value="inactive">비활성 뉴스</SelectItem>
                  <SelectItem value="featured">추천 뉴스</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newsCategoryFilter} onValueChange={setNewsCategoryFilter}>
                <SelectTrigger className="max-w-[180px]">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 카테고리</SelectItem>
                  {NEWS_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {selectedNews.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      선택 삭제 ({selectedNews.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>선택된 뉴스 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        선택된 {selectedNews.length}개의 뉴스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSelectedNews}>삭제</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Dialog open={isNewsFormOpen} onOpenChange={setIsNewsFormOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetNewsForm()
                      setIsNewsFormOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />새 뉴스
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingNews ? "뉴스 수정" : "새 뉴스 생성"}</DialogTitle>
                    <DialogDescription>뉴스 정보를 입력하세요.</DialogDescription>
                  </DialogHeader>

                  {/* AI News Analysis Section */}
                  {aiStatus?.isActive && (
                    <Card className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          AI 뉴스 분석
                        </CardTitle>
                        <CardDescription>뉴스 URL을 입력하면 AI가 자동으로 내용을 분석하고 번역합니다.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="뉴스 URL을 입력하세요..."
                            value={newsUrl}
                            onChange={(e) => setNewsUrl(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={handleNewsAnalysis} disabled={isAnalyzingNews || !newsUrl.trim()}>
                            {isAnalyzingNews ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                분석 중...
                              </>
                            ) : (
                              <>
                                <Languages className="h-4 w-4 mr-2" />
                                분석
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <form onSubmit={handleNewsSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="news-title">제목 *</Label>
                      <Input
                        id="news-title"
                        value={newsFormData.title}
                        onChange={(e) => setNewsFormData((prev) => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="news-content">내용 *</Label>
                      <Textarea
                        id="news-content"
                        value={newsFormData.content}
                        onChange={(e) => setNewsFormData((prev) => ({ ...prev, content: e.target.value }))}
                        rows={8}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="news-summary">요약</Label>
                      <Textarea
                        id="news-summary"
                        value={newsFormData.summary}
                        onChange={(e) => setNewsFormData((prev) => ({ ...prev, summary: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="news-category">카테고리</Label>
                        <Select
                          value={newsFormData.category}
                          onValueChange={(value) => setNewsFormData((prev) => ({ ...prev, category: value }))}
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
                        <Label htmlFor="news-source-url">출처 URL</Label>
                        <Input
                          id="news-source-url"
                          type="url"
                          value={newsFormData.source_url}
                          onChange={(e) => setNewsFormData((prev) => ({ ...prev, source_url: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="news-tags">태그 (쉼표로 구분)</Label>
                      <Input
                        id="news-tags"
                        value={newsFormData.tags.join(", ")}
                        onChange={(e) =>
                          setNewsFormData((prev) => ({
                            ...prev,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          }))
                        }
                        placeholder="태그1, 태그2, 태그3"
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label>이미지</Label>
                      <ImageUpload
                        value={newsFormData.image_url || ""}
                        onChange={(url) => setNewsFormData((prev) => ({ ...prev, image_url: url }))}
                      />
                    </div>

                    {/* Settings */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">설정</Label>
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="news-is-active"
                            checked={newsFormData.is_active}
                            onCheckedChange={(checked) => setNewsFormData((prev) => ({ ...prev, is_active: checked }))}
                          />
                          <Label htmlFor="news-is-active">활성</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="news-is-featured"
                            checked={newsFormData.is_featured}
                            onCheckedChange={(checked) =>
                              setNewsFormData((prev) => ({ ...prev, is_featured: checked }))
                            }
                          />
                          <Label htmlFor="news-is-featured">추천</Label>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={resetNewsForm}>
                        취소
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            저장 중...
                          </>
                        ) : editingNews ? (
                          "업데이트"
                        ) : (
                          "생성"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* News List */}
          <div className="space-y-4">
            {isNewsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredNews.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">뉴스가 없습니다.</p>
                </CardContent>
              </Card>
            ) : (
              filteredNews.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Checkbox
                          checked={selectedNews.includes(item.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedNews((prev) => [...prev, item.id])
                            } else {
                              setSelectedNews((prev) => prev.filter((id) => id !== item.id))
                            }
                          }}
                        />
                        {item.image_url && (
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            <Badge variant="secondary">{item.category}</Badge>
                            {item.is_featured && (
                              <Badge variant="default">
                                <Star className="h-3 w-3 mr-1" />
                                추천
                              </Badge>
                            )}
                            {item.is_translated && (
                              <Badge variant="outline">
                                <Languages className="h-3 w-3 mr-1" />
                                번역
                              </Badge>
                            )}
                            {!item.is_active && <Badge variant="destructive">비활성</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {item.summary || item.content.substring(0, 100) + "..."}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                            <span>조회: {item.view_count || 0}</span>
                            <span>언어: {item.original_language}</span>
                            <span>생성: {new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingNews(item)
                            setNewsFormData({
                              title: item.title,
                              content: item.content,
                              summary: item.summary || "",
                              source_url: item.source_url || "",
                              image_url: item.image_url || "",
                              category: item.category,
                              tags: item.tags,
                              is_featured: item.is_featured,
                              is_active: item.is_active,
                            })
                            setIsNewsFormOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>뉴스 삭제</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{item.title}" 뉴스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteNews(item.id)}>삭제</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
