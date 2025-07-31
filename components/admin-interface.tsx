"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  MoreHorizontal,
  Loader2,
  Globe,
  Languages,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  FileText,
  Tag,
  Save,
  X,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react"

// 액션 함수들 import
import {
  createNews,
  updateNews,
  deleteNews,
  deleteMultipleNews,
  getNewsForAdmin,
  updateNewsFeatureStatus,
  parseNewsData,
  translateNewsText,
} from "@/lib/admin-news-actions"
import type { NewsFormData } from "@/types/news"

// 뉴스 카테고리 정의
const NEWS_CATEGORIES = [
  { id: "정치", name: "정치", color: "bg-red-100 text-red-800" },
  { id: "경제", name: "경제", color: "bg-blue-100 text-blue-800" },
  { id: "사회", name: "사회", color: "bg-green-100 text-green-800" },
  { id: "문화", name: "문화", color: "bg-purple-100 text-purple-800" },
  { id: "스포츠", name: "스포츠", color: "bg-orange-100 text-orange-800" },
  { id: "국제", name: "국제", color: "bg-indigo-100 text-indigo-800" },
  { id: "생활", name: "생활", color: "bg-pink-100 text-pink-800" },
  { id: "기술", name: "기술", color: "bg-gray-100 text-gray-800" },
  { id: "일반", name: "일반", color: "bg-slate-100 text-slate-800" },
]

// 언어 정의
const LANGUAGES = [
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "en", name: "영어", flag: "🇺🇸" },
  { code: "th", name: "태국어", flag: "🇹🇭" },
]

interface NewsItem {
  id: number
  title: string
  summary: string
  content: string
  image_url: string
  source: string
  original_url: string
  published_at: string
  category: string
  tags: string[]
  is_active: boolean
  is_featured: boolean
  view_count: number
  original_language: string
  is_translated: boolean
  created_at: string
  updated_at: string
}

export default function AdminInterface() {
  // 상태 관리
  const [activeTab, setActiveTab] = useState("news")
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedNews, setSelectedNews] = useState<number[]>([])
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [showNewsDialog, setShowNewsDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number | number[] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // 뉴스 폼 상태
  const [newsForm, setNewsForm] = useState<NewsFormData>({
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

  // AI 분석 상태
  const [aiAnalysisUrl, setAiAnalysisUrl] = useState("")
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [enableTranslation, setEnableTranslation] = useState(true)
  const [translationStatus, setTranslationStatus] = useState<{
    originalLanguage?: string
    isTranslated?: boolean
    status?: "success" | "failed" | "not_needed"
  }>({})

  // 태그 입력 상태
  const [tagInput, setTagInput] = useState("")

  // 뉴스 목록 로드
  const loadNews = async () => {
    try {
      setLoading(true)
      const data = await getNewsForAdmin()
      setNewsList(data)
    } catch (error) {
      console.error("뉴스 목록 로드 오류:", error)
      toast({
        title: "오류",
        description: "뉴스 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 뉴스 목록 로드
  useEffect(() => {
    loadNews()
  }, [])

  // 폼 초기화
  const resetNewsForm = () => {
    setNewsForm({
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
    setTagInput("")
    setTranslationStatus({})
    setAiAnalysisUrl("")
  }

  // AI 뉴스 분석
  const handleAiAnalysis = async () => {
    if (!aiAnalysisUrl.trim()) {
      toast({
        title: "오류",
        description: "분석할 URL을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      setAiAnalyzing(true)
      setTranslationStatus({})

      const analysisResult = await parseNewsData(aiAnalysisUrl, enableTranslation)

      // 폼에 분석 결과 적용
      setNewsForm({
        title: analysisResult.title || "",
        summary: analysisResult.summary || "",
        content: analysisResult.content || "",
        imageUrl: analysisResult.imageUrl || "",
        source: analysisResult.source || "",
        originalUrl: aiAnalysisUrl,
        publishedAt: analysisResult.publishedAt || new Date().toISOString().split("T")[0],
        category: analysisResult.category || "일반",
        tags: analysisResult.tags || [],
        isActive: analysisResult.isActive !== false,
        isFeatured: analysisResult.isFeatured || false,
      })

      // 번역 상태 설정
      setTranslationStatus({
        originalLanguage: analysisResult.original_language,
        isTranslated: analysisResult.is_translated,
        status: analysisResult.is_translated ? "success" : "not_needed",
      })

      toast({
        title: "분석 완료",
        description: analysisResult.is_translated
          ? `${LANGUAGES.find((l) => l.code === analysisResult.original_language)?.name || "외국어"}에서 한국어로 번역되었습니다.`
          : "뉴스 분석이 완료되었습니다.",
      })
    } catch (error) {
      console.error("AI 분석 오류:", error)
      setTranslationStatus({ status: "failed" })
      toast({
        title: "분석 실패",
        description: error instanceof Error ? error.message : "AI 분석 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setAiAnalyzing(false)
    }
  }

  // 개별 텍스트 번역
  const handleTranslateText = async (text: string, field: keyof NewsFormData, fromLanguage: string) => {
    if (!text.trim() || fromLanguage === "ko") return

    try {
      const translatedText = await translateNewsText(text, fromLanguage)
      setNewsForm((prev) => ({
        ...prev,
        [field]: translatedText,
      }))

      toast({
        title: "번역 완료",
        description: `${field} 필드가 번역되었습니다.`,
      })
    } catch (error) {
      console.error("텍스트 번역 오류:", error)
      toast({
        title: "번역 실패",
        description: error instanceof Error ? error.message : "번역 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 태그 추가
  const addTag = () => {
    if (tagInput.trim() && !newsForm.tags.includes(tagInput.trim())) {
      setNewsForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    setNewsForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  // 뉴스 생성/수정
  const handleCreateNews = async () => {
    try {
      setLoading(true)

      const newsData = {
        ...newsForm,
        original_language: translationStatus.originalLanguage || "ko",
        is_translated: translationStatus.isTranslated || false,
      }

      if (editingNews) {
        await updateNews(editingNews.id, newsData)
        toast({
          title: "성공",
          description: "뉴스가 수정되었습니다.",
        })
      } else {
        await createNews(newsData)
        toast({
          title: "성공",
          description: "뉴스가 생성되었습니다.",
        })
      }

      setShowNewsDialog(false)
      setEditingNews(null)
      resetNewsForm()
      await loadNews()
    } catch (error) {
      console.error("뉴스 생성/수정 오류:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "뉴스 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 뉴스 수정 시작
  const startEditNews = (news: NewsItem) => {
    setEditingNews(news)
    setNewsForm({
      title: news.title,
      summary: news.summary || "",
      content: news.content,
      imageUrl: news.image_url || "",
      source: news.source,
      originalUrl: news.original_url,
      publishedAt: news.published_at ? new Date(news.published_at).toISOString().split("T")[0] : "",
      category: news.category,
      tags: news.tags || [],
      isActive: news.is_active,
      isFeatured: news.is_featured,
    })
    setTranslationStatus({
      originalLanguage: news.original_language,
      isTranslated: news.is_translated,
    })
    setShowNewsDialog(true)
  }

  // 뉴스 삭제
  const handleDeleteNews = async () => {
    if (!deleteTarget) return

    try {
      setLoading(true)

      if (Array.isArray(deleteTarget)) {
        await deleteMultipleNews(deleteTarget)
        toast({
          title: "성공",
          description: `${deleteTarget.length}개의 뉴스가 삭제되었습니다.`,
        })
        setSelectedNews([])
      } else {
        await deleteNews(deleteTarget)
        toast({
          title: "성공",
          description: "뉴스가 삭제되었습니다.",
        })
      }

      setShowDeleteDialog(false)
      setDeleteTarget(null)
      await loadNews()
    } catch (error) {
      console.error("뉴스 삭제 오류:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "뉴스 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 특성 뉴스 토글
  const toggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      await updateNewsFeatureStatus(id, !currentStatus)
      toast({
        title: "성공",
        description: `뉴스가 ${!currentStatus ? "특성" : "일반"} 뉴스로 변경되었습니다.`,
      })
      await loadNews()
    } catch (error) {
      console.error("특성 뉴스 토글 오류:", error)
      toast({
        title: "오류",
        description: "특성 뉴스 상태 변경에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  // 필터링된 뉴스 목록
  const filteredNews = newsList.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || !categoryFilter || news.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // 선택된 뉴스 토글
  const toggleNewsSelection = (id: number) => {
    setSelectedNews((prev) => (prev.includes(id) ? prev.filter((newsId) => newsId !== id) : [...prev, id]))
  }

  // 모든 뉴스 선택/해제
  const toggleAllNewsSelection = () => {
    if (selectedNews.length === filteredNews.length) {
      setSelectedNews([])
    } else {
      setSelectedNews(filteredNews.map((news) => news.id))
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          <p className="text-muted-foreground">비즈니스 카드와 뉴스를 관리하세요</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          새로고침
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cards">비즈니스 카드 관리</TabsTrigger>
          <TabsTrigger value="news">뉴스 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>비즈니스 카드 관리</CardTitle>
              <CardDescription>등록된 비즈니스 카드를 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                비즈니스 카드 관리 기능은 기존 구현을 사용합니다.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          {/* 뉴스 관리 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">뉴스 관리</h2>
              <p className="text-muted-foreground">뉴스 기사를 추가, 수정, 삭제할 수 있습니다.</p>
            </div>
            <div className="flex gap-2">
              {selectedNews.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setDeleteTarget(selectedNews)
                    setShowDeleteDialog(true)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  선택 삭제 ({selectedNews.length})
                </Button>
              )}
              <Button
                onClick={() => {
                  resetNewsForm()
                  setEditingNews(null)
                  setShowNewsDialog(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />새 뉴스 추가
              </Button>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="뉴스 제목, 내용, 출처, 태그로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="카테고리 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 카테고리</SelectItem>
                    {NEWS_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 뉴스 목록 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>뉴스 목록 ({filteredNews.length})</CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedNews.length === filteredNews.length && filteredNews.length > 0}
                    onCheckedChange={toggleAllNewsSelection}
                  />
                  <span className="text-sm text-muted-foreground">전체 선택</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  로딩 중...
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm || categoryFilter ? "검색 결과가 없습니다." : "등록된 뉴스가 없습니다."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">선택</TableHead>
                        <TableHead>제목</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>출처</TableHead>
                        <TableHead>언어</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>조회수</TableHead>
                        <TableHead>생성일</TableHead>
                        <TableHead className="w-24">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNews.map((news) => (
                        <TableRow key={news.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedNews.includes(news.id)}
                              onCheckedChange={() => toggleNewsSelection(news.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium line-clamp-2">{news.title}</div>
                              {news.summary && (
                                <div className="text-sm text-muted-foreground line-clamp-1">{news.summary}</div>
                              )}
                              <div className="flex flex-wrap gap-1">
                                {news.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                NEWS_CATEGORIES.find((cat) => cat.id === news.category)?.color ||
                                "bg-gray-100 text-gray-800"
                              }
                            >
                              {news.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{news.source}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {LANGUAGES.find((lang) => lang.code === news.original_language)?.flag || "🌐"}
                              </span>
                              <div className="text-xs">
                                <div>
                                  {LANGUAGES.find((lang) => lang.code === news.original_language)?.name || "알 수 없음"}
                                </div>
                                {news.is_translated && (
                                  <Badge variant="outline" className="text-xs">
                                    <Languages className="h-3 w-3 mr-1" />
                                    번역됨
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {news.is_featured && (
                                <Badge variant="default" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  특성
                                </Badge>
                              )}
                              <Badge variant={news.is_active ? "default" : "secondary"} className="text-xs">
                                {news.is_active ? (
                                  <>
                                    <Eye className="h-3 w-3 mr-1" />
                                    활성
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    비활성
                                  </>
                                )}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{news.view_count.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{new Date(news.created_at).toLocaleDateString()}</div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => startEditNews(news)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  수정
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleFeatured(news.id, news.is_featured)}>
                                  {news.is_featured ? (
                                    <>
                                      <StarOff className="h-4 w-4 mr-2" />
                                      특성 해제
                                    </>
                                  ) : (
                                    <>
                                      <Star className="h-4 w-4 mr-2" />
                                      특성 설정
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setDeleteTarget(news.id)
                                    setShowDeleteDialog(true)
                                  }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 뉴스 추가/수정 다이얼로그 */}
      <Dialog open={showNewsDialog} onOpenChange={setShowNewsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews ? "뉴스 수정" : "새 뉴스 추가"}</DialogTitle>
            <DialogDescription>
              {editingNews
                ? "뉴스 정보를 수정합니다."
                : "새로운 뉴스를 추가합니다. AI 분석 또는 직접 입력을 선택하세요."}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="ai-analysis" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai-analysis">
                <Sparkles className="h-4 w-4 mr-2" />
                AI 분석
              </TabsTrigger>
              <TabsTrigger value="manual-input">
                <FileText className="h-4 w-4 mr-2" />
                직접 입력
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI 뉴스 분석</CardTitle>
                  <CardDescription>뉴스 URL을 입력하면 AI가 자동으로 분석하고 번역합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable-translation"
                      checked={enableTranslation}
                      onCheckedChange={setEnableTranslation}
                    />
                    <Label htmlFor="enable-translation" className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      자동 번역 활성화 (태국어/영어 → 한국어)
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="뉴스 URL을 입력하세요..."
                        value={aiAnalysisUrl}
                        onChange={(e) => setAiAnalysisUrl(e.target.value)}
                        disabled={aiAnalyzing}
                      />
                    </div>
                    <Button onClick={handleAiAnalysis} disabled={aiAnalyzing || !aiAnalysisUrl.trim()}>
                      {aiAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          분석 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          분석 시작
                        </>
                      )}
                    </Button>
                  </div>

                  {translationStatus.status && (
                    <Alert>
                      <div className="flex items-center gap-2">
                        {translationStatus.status === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {translationStatus.status === "failed" && <XCircle className="h-4 w-4 text-red-600" />}
                        {translationStatus.status === "not_needed" && <AlertCircle className="h-4 w-4 text-blue-600" />}
                        <div>
                          {translationStatus.status === "success" && (
                            <div>
                              <strong>번역 완료:</strong>{" "}
                              {LANGUAGES.find((l) => l.code === translationStatus.originalLanguage)?.name || "외국어"}
                              에서 한국어로 번역되었습니다.
                            </div>
                          )}
                          {translationStatus.status === "failed" && (
                            <div>
                              <strong>번역 실패:</strong> 번역 중 오류가 발생했습니다. 수동으로 번역해주세요.
                            </div>
                          )}
                          {translationStatus.status === "not_needed" && (
                            <div>
                              <strong>번역 불필요:</strong> 이미 한국어 뉴스입니다.
                            </div>
                          )}
                        </div>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual-input" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>직접 입력 모드에서는 모든 필드를 수동으로 입력해야 합니다.</AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          {/* 뉴스 폼 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <div className="flex gap-2">
                  <Input
                    id="title"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="뉴스 제목을 입력하세요"
                    required
                  />
                  {translationStatus.originalLanguage && translationStatus.originalLanguage !== "ko" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTranslateText(newsForm.title, "title", translationStatus.originalLanguage!)}
                    >
                      <Languages className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">출처 *</Label>
                <Input
                  id="source"
                  value={newsForm.source}
                  onChange={(e) => setNewsForm((prev) => ({ ...prev, source: e.target.value }))}
                  placeholder="뉴스 출처를 입력하세요"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">요약</Label>
              <div className="flex gap-2">
                <Textarea
                  id="summary"
                  value={newsForm.summary}
                  onChange={(e) => setNewsForm((prev) => ({ ...prev, summary: e.target.value }))}
                  placeholder="뉴스 요약을 입력하세요 (선택사항)"
                  rows={3}
                />
                {translationStatus.originalLanguage && translationStatus.originalLanguage !== "ko" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleTranslateText(newsForm.summary || "", "summary", translationStatus.originalLanguage!)
                    }
                  >
                    <Languages className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용 *</Label>
              <div className="flex gap-2">
                <Textarea
                  id="content"
                  value={newsForm.content}
                  onChange={(e) => setNewsForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="뉴스 전체 내용을 입력하세요"
                  rows={8}
                  required
                />
                {translationStatus.originalLanguage && translationStatus.originalLanguage !== "ko" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleTranslateText(newsForm.content, "content", translationStatus.originalLanguage!)
                    }
                  >
                    <Languages className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originalUrl">원본 URL *</Label>
                <Input
                  id="originalUrl"
                  value={newsForm.originalUrl}
                  onChange={(e) => setNewsForm((prev) => ({ ...prev, originalUrl: e.target.value }))}
                  placeholder="원본 뉴스 URL을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">이미지 URL</Label>
                <Input
                  id="imageUrl"
                  value={newsForm.imageUrl}
                  onChange={(e) => setNewsForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="대표 이미지 URL을 입력하세요 (선택사항)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select
                  value={newsForm.category}
                  onValueChange={(value) => setNewsForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishedAt">발행일</Label>
                <Input
                  id="publishedAt"
                  type="date"
                  value={newsForm.publishedAt}
                  onChange={(e) => setNewsForm((prev) => ({ ...prev, publishedAt: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>태그</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="태그를 입력하고 Enter를 누르세요"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Tag className="h-4 w-4 mr-2" />
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newsForm.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newsForm.isActive}
                  onCheckedChange={(checked) => setNewsForm((prev) => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">활성화</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={newsForm.isFeatured}
                  onCheckedChange={(checked) => setNewsForm((prev) => ({ ...prev, isFeatured: checked }))}
                />
                <Label htmlFor="isFeatured">특성 뉴스</Label>
              </div>
            </div>

            {translationStatus.originalLanguage && (
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  <strong>언어 정보:</strong> 원본 언어는{" "}
                  {LANGUAGES.find((l) => l.code === translationStatus.originalLanguage)?.name || "알 수 없음"}이며,{" "}
                  {translationStatus.isTranslated ? "번역되었습니다" : "번역되지 않았습니다"}.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewsDialog(false)
                setEditingNews(null)
                resetNewsForm()
              }}
            >
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
            <Button onClick={handleCreateNews} disabled={loading || !newsForm.title || !newsForm.content}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingNews ? "수정" : "생성"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>뉴스 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              {Array.isArray(deleteTarget)
                ? `선택한 ${deleteTarget.length}개의 뉴스를 삭제하시겠습니까?`
                : "이 뉴스를 삭제하시겠습니까?"}{" "}
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNews} className="bg-destructive text-destructive-foreground">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
