"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Crown, Calendar, TrendingUp, Eye, Star, Settings } from "lucide-react"
import {
  getBusinessCardsForAdmin,
  updatePremiumStatus,
  updateExposureCount,
  updateExposureWeight,
} from "@/lib/admin-actions"

interface BusinessCard {
  id: number
  title: string
  description: string
  category_id: number
  categories?: { id: number; name: string; color_class: string }
  is_premium: boolean
  premium_expires_at?: string
  exposure_count: number
  exposure_weight: number
  view_count: number
  created_at: string
}

export default function AdminPremiumManagement() {
  const [cards, setCards] = useState<BusinessCard[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<BusinessCard | null>(null)
  const [premiumDuration, setPremiumDuration] = useState("30")
  const [exposureSettings, setExposureSettings] = useState({
    count: 0,
    weight: 1.0,
  })

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      setLoading(true)
      const data = await getBusinessCardsForAdmin()
      setCards(data)
    } catch (error) {
      console.error("Error loading cards:", error)
      toast({
        title: "오류",
        description: "카드 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePremiumToggle = async (cardId: number, isPremium: boolean) => {
    try {
      let expiresAt: string | undefined

      if (isPremium) {
        const days = Number(premiumDuration)
        const expireDate = new Date()
        expireDate.setDate(expireDate.getDate() + days)
        expiresAt = expireDate.toISOString()
      }

      await updatePremiumStatus(cardId, isPremium, expiresAt)
      await loadCards()

      toast({
        title: "성공",
        description: `카드가 ${isPremium ? "프리미엄으로 설정" : "일반으로 변경"}되었습니다.`,
      })
    } catch (error) {
      console.error("Error updating premium status:", error)
      toast({
        title: "오류",
        description: "프리미엄 상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleExposureUpdate = async (cardId: number) => {
    try {
      await updateExposureCount(cardId, exposureSettings.count)
      await updateExposureWeight(cardId, exposureSettings.weight)
      await loadCards()

      toast({
        title: "성공",
        description: "노출 설정이 업데이트되었습니다.",
      })

      setSelectedCard(null)
    } catch (error) {
      console.error("Error updating exposure settings:", error)
      toast({
        title: "오류",
        description: "노출 설정 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const openExposureDialog = (card: BusinessCard) => {
    setSelectedCard(card)
    setExposureSettings({
      count: Number(card.exposure_count) || 0,
      weight: Number(card.exposure_weight) || 1.0,
    })
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "설정되지 않음"
    try {
      return new Date(String(dateString)).toLocaleDateString("ko-KR")
    } catch {
      return "잘못된 날짜"
    }
  }

  const isPremiumExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    try {
      return new Date(String(expiresAt)) < new Date()
    } catch {
      return false
    }
  }

  const premiumCards = cards.filter((card) => card.is_premium)
  const regularCards = cards.filter((card) => !card.is_premium)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>카드 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 카드 수</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">프리미엄 카드</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{premiumCards.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">일반 카드</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regularCards.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* 프리미엄 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            프리미엄 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="premium-duration">프리미엄 기간:</Label>
              <Select value={premiumDuration} onValueChange={setPremiumDuration}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7일</SelectItem>
                  <SelectItem value="14">14일</SelectItem>
                  <SelectItem value="30">30일</SelectItem>
                  <SelectItem value="60">60일</SelectItem>
                  <SelectItem value="90">90일</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 프리미엄 카드 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            프리미엄 카드 ({premiumCards.length}개)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {premiumCards.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{String(card.title)}</h3>
                    {card.categories && (
                      <Badge variant="secondary" className={String(card.categories.color_class)}>
                        {String(card.categories.name)}
                      </Badge>
                    )}
                    {isPremiumExpired(card.premium_expires_at) && <Badge variant="destructive">만료됨</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        만료일: {formatDate(card.premium_expires_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        조회: {Number(card.view_count).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        노출: {Number(card.exposure_count).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openExposureDialog(card)}>
                    노출 관리
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePremiumToggle(card.id, false)}>
                    프리미엄 해제
                  </Button>
                </div>
              </div>
            ))}
            {premiumCards.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">프리미엄 카드가 없습니다.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 일반 카드 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>일반 카드 ({regularCards.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regularCards.slice(0, 10).map((card) => (
              <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{String(card.title)}</h3>
                    {card.categories && (
                      <Badge variant="secondary" className={String(card.categories.color_class)}>
                        {String(card.categories.name)}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        조회: {Number(card.view_count).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        노출: {Number(card.exposure_count).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openExposureDialog(card)}>
                    노출 관리
                  </Button>
                  <Button variant="default" size="sm" onClick={() => handlePremiumToggle(card.id, true)}>
                    <Crown className="h-4 w-4 mr-1" />
                    프리미엄 설정
                  </Button>
                </div>
              </div>
            ))}
            {regularCards.length > 10 && (
              <div className="text-center py-4 text-muted-foreground">... 그리고 {regularCards.length - 10}개 더</div>
            )}
            {regularCards.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">일반 카드가 없습니다.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 노출 관리 다이얼로그 */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>노출 관리 - {selectedCard?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exposure-count">노출 카운트</Label>
              <Input
                id="exposure-count"
                type="number"
                value={exposureSettings.count}
                onChange={(e) =>
                  setExposureSettings({
                    ...exposureSettings,
                    count: Number(e.target.value) || 0,
                  })
                }
              />
              <p className="text-sm text-muted-foreground">현재 노출 횟수를 설정합니다. 높을수록 더 자주 노출됩니다.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exposure-weight">노출 가중치</Label>
              <Input
                id="exposure-weight"
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={exposureSettings.weight}
                onChange={(e) =>
                  setExposureSettings({
                    ...exposureSettings,
                    weight: Number(e.target.value) || 1.0,
                  })
                }
              />
              <p className="text-sm text-muted-foreground">노출 가중치 (0.1 ~ 10.0). 높을수록 우선적으로 노출됩니다.</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedCard(null)}>
                취소
              </Button>
              <Button onClick={() => selectedCard && handleExposureUpdate(selectedCard.id)}>저장</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
