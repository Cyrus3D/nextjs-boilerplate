"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, TrendingUp, BarChart3, RefreshCw, Calendar, DollarSign } from "lucide-react"
import { getExposureStats } from "../lib/api"

interface PremiumManagementProps {
  cards: any[]
  onUpdateCard: (card: any) => void
}

export default function PremiumManagement({ cards, onUpdateCard }: PremiumManagementProps) {
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [premiumDuration, setPremiumDuration] = useState(30) // 기본 30일
  const [exposureStats, setExposureStats] = useState<any>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadExposureStats()
  }, [])

  const loadExposureStats = async () => {
    const stats = await getExposureStats()
    setExposureStats(stats)
  }

  const handleSetPremium = async (card: any, days: number) => {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)

    const updatedCard = {
      ...card,
      isPremium: true,
      premiumExpiresAt: expiresAt.toISOString(),
    }

    try {
      await onUpdateCard(updatedCard)
      setMessage({ type: "success", text: `${card.title}이(가) ${days}일간 프리미엄으로 설정되었습니다.` })
      setSelectedCard(null)
    } catch (error) {
      setMessage({ type: "error", text: "프리미엄 설정 중 오류가 발생했습니다." })
    }
  }

  const handleRemovePremium = async (card: any) => {
    const updatedCard = {
      ...card,
      isPremium: false,
      premiumExpiresAt: null,
    }

    try {
      await onUpdateCard(updatedCard)
      setMessage({ type: "success", text: `${card.title}의 프리미엄이 해제되었습니다.` })
    } catch (error) {
      setMessage({ type: "error", text: "프리미엄 해제 중 오류가 발생했습니다." })
    }
  }

  const isPremiumExpired = (card: any) => {
    if (!card.premiumExpiresAt) return true
    return new Date(card.premiumExpiresAt) < new Date()
  }

  const getDaysRemaining = (card: any) => {
    if (!card.premiumExpiresAt) return 0
    const now = new Date()
    const expires = new Date(card.premiumExpiresAt)
    const diffTime = expires.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const premiumCards = cards.filter((card) => card.isPremium && !isPremiumExpired(card))
  const regularCards = cards.filter((card) => !card.isPremium || isPremiumExpired(card))

  return (
    <div className="space-y-6">
      {/* 메시지 표시 */}
      {message && (
        <Alert className={message.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
          <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="premium" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="premium">프리미엄 관리</TabsTrigger>
          <TabsTrigger value="stats">노출 통계</TabsTrigger>
          <TabsTrigger value="fairness">공평성 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="premium" className="space-y-6">
          {/* 프리미엄 카드 현황 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                현재 프리미엄 카드 ({premiumCards.length}개)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {premiumCards.length === 0 ? (
                <p className="text-gray-500">현재 프리미엄 카드가 없습니다.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {premiumCards.map((card) => (
                    <div key={card.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{card.title}</h4>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Crown className="h-3 w-3 mr-1" />
                          프리미엄
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{card.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {getDaysRemaining(card)}일 남음
                        </span>
                        <Button size="sm" variant="outline" onClick={() => handleRemovePremium(card)}>
                          해제
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 일반 카드 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>일반 카드 목록 ({regularCards.length}개)</CardTitle>
              <CardDescription>프리미엄으로 승격할 카드를 선택하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {regularCards.map((card) => (
                  <div key={card.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{card.title}</h4>
                        <p className="text-xs text-gray-500">{card.category}</p>
                      </div>
                      <div className="text-xs text-gray-400">노출: {card.exposureCount || 0}회</div>
                    </div>
                    <Button size="sm" className="w-full" onClick={() => setSelectedCard(card)}>
                      <DollarSign className="h-3 w-3 mr-1" />
                      프리미엄 설정
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* 노출 통계 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  노출 통계
                </CardTitle>
                <Button size="sm" variant="outline" onClick={loadExposureStats}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {exposureStats ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{exposureStats.totalExposures}</div>
                    <div className="text-sm text-blue-600">총 노출 횟수</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{exposureStats.averageExposures}</div>
                    <div className="text-sm text-green-600">평균 노출 횟수</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{cards.length}</div>
                    <div className="text-sm text-purple-600">총 카드 수</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">통계를 불러오는 중...</p>
              )}
            </CardContent>
          </Card>

          {/* 카드별 노출 현황 */}
          <Card>
            <CardHeader>
              <CardTitle>카드별 노출 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {cards
                  .sort((a, b) => (b.exposureCount || 0) - (a.exposureCount || 0))
                  .map((card, index) => (
                    <div key={card.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono w-6">#{index + 1}</span>
                        <div>
                          <span className="font-medium">{card.title}</span>
                          {card.isPremium && !isPremiumExpired(card) && (
                            <Badge className="ml-2 bg-yellow-100 text-yellow-800" size="sm">
                              프리미엄
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{card.exposureCount || 0}회</div>
                        <div className="text-xs text-gray-500">가중치: {(card.exposureWeight || 1.0).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fairness" className="space-y-6">
          {/* 공평성 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                공평성 관리
              </CardTitle>
              <CardDescription>모든 카드가 공평하게 노출될 수 있도록 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>현재 적용 중인 공평성 알고리즘:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• 프리미엄 카드는 상단 고정</li>
                    <li>• 일반 카드는 노출 횟수와 시간을 고려하여 순서 결정</li>
                    <li>• 세션별 일관성 유지 (같은 사용자에게는 동일한 순서)</li>
                    <li>• 매 시간마다 순서 자동 조정</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">노출 불균형 카드</h4>
                  <div className="space-y-2">
                    {cards
                      .filter((card) => (card.exposureCount || 0) < (exposureStats?.averageExposures || 0) * 0.5)
                      .slice(0, 5)
                      .map((card) => (
                        <div key={card.id} className="text-sm">
                          <span className="font-medium">{card.title}</span>
                          <span className="text-red-600 ml-2">({card.exposureCount || 0}회)</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">과다 노출 카드</h4>
                  <div className="space-y-2">
                    {cards
                      .filter((card) => (card.exposureCount || 0) > (exposureStats?.averageExposures || 0) * 2)
                      .slice(0, 5)
                      .map((card) => (
                        <div key={card.id} className="text-sm">
                          <span className="font-medium">{card.title}</span>
                          <span className="text-orange-600 ml-2">({card.exposureCount || 0}회)</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 프리미엄 설정 모달 */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>프리미엄 설정</CardTitle>
              <CardDescription>{selectedCard.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="duration">프리미엄 기간 (일)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="365"
                  value={premiumDuration}
                  onChange={(e) => setPremiumDuration(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={() => setPremiumDuration(7)}>
                  7일
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPremiumDuration(30)}>
                  30일
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPremiumDuration(90)}>
                  90일
                </Button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => handleSetPremium(selectedCard, premiumDuration)} className="flex-1">
                  <Crown className="h-4 w-4 mr-2" />
                  프리미엄 설정
                </Button>
                <Button variant="outline" onClick={() => setSelectedCard(null)}>
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
