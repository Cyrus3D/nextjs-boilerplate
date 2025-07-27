"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, MapPin, Users, Star, Heart, MessageCircle, Share2 } from "lucide-react"
import GoogleAds from "./components/google-ads"

// 샘플 데이터
const infoCards = [
  {
    id: 1,
    title: "React 개발자 모임",
    description: "React와 Next.js를 함께 공부하고 프로젝트를 진행하는 개발자 커뮤니티입니다.",
    category: "개발",
    location: "서울 강남구",
    date: "2024-01-15",
    members: 124,
    rating: 4.8,
    likes: 89,
    comments: 23,
    image: "/placeholder.svg?height=200&width=400",
    author: {
      name: "김개발",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    id: 2,
    title: "주말 등산 클럽",
    description: "매주 주말마다 서울 근교 산을 등반하며 건강한 취미생활을 즐기는 모임입니다.",
    category: "운동",
    location: "서울 전지역",
    date: "2024-01-20",
    members: 67,
    rating: 4.6,
    likes: 156,
    comments: 34,
    image: "/placeholder.svg?height=200&width=400",
    author: {
      name: "박등산",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["등산", "운동", "자연"],
  },
  {
    id: 3,
    title: "독서 토론 모임",
    description: "한 달에 한 권씩 책을 읽고 깊이 있는 토론을 나누는 독서 모임입니다.",
    category: "문화",
    location: "서울 마포구",
    date: "2024-01-25",
    members: 45,
    rating: 4.9,
    likes: 78,
    comments: 19,
    image: "/placeholder.svg?height=200&width=400",
    author: {
      name: "이독서",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["독서", "토론", "문학"],
  },
  {
    id: 4,
    title: "요리 클래스",
    description: "다양한 나라의 요리를 배우고 함께 만들어 먹는 요리 모임입니다.",
    category: "취미",
    location: "서울 용산구",
    date: "2024-02-01",
    members: 32,
    rating: 4.7,
    likes: 92,
    comments: 28,
    image: "/placeholder.svg?height=200&width=400",
    author: {
      name: "최요리",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["요리", "음식", "문화"],
  },
  {
    id: 5,
    title: "사진 동호회",
    description: "사진 촬영 기법을 배우고 함께 출사를 다니는 사진 동호회입니다.",
    category: "예술",
    location: "서울 종로구",
    date: "2024-02-05",
    members: 89,
    rating: 4.5,
    likes: 134,
    comments: 41,
    image: "/placeholder.svg?height=200&width=400",
    author: {
      name: "정사진",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["사진", "예술", "출사"],
  },
  {
    id: 6,
    title: "영어 회화 스터디",
    description: "원어민과 함께하는 실전 영어 회화 연습 모임입니다.",
    category: "교육",
    location: "서울 서초구",
    date: "2024-02-10",
    members: 156,
    rating: 4.8,
    likes: 203,
    comments: 67,
    image: "/placeholder.svg?height=200&width=400",
    author: {
      name: "김영어",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["영어", "회화", "언어"],
  },
]

const getCategoryColor = (category: string) => {
  const colors = {
    개발: "bg-blue-100 text-blue-800",
    운동: "bg-green-100 text-green-800",
    문화: "bg-purple-100 text-purple-800",
    취미: "bg-orange-100 text-orange-800",
    예술: "bg-pink-100 text-pink-800",
    교육: "bg-indigo-100 text-indigo-800",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

export default function InfoCardList() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">정보카드 리스트</h1>
          <p className="text-gray-600">다양한 모임과 활동 정보를 확인해보세요</p>
        </div>

        {/* 구글 광고 배너 */}
        <div className="mb-8">
          <GoogleAds
            adSlot="1234567890"
            style={{
              display: "block",
              width: "100%",
              height: "90px",
            }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {infoCards.map((card) => (
            <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img src={card.image || "/placeholder.svg"} alt={card.title} className="w-full h-48 object-cover" />
                <Badge className={`absolute top-3 left-3 ${getCategoryColor(card.category)}`} variant="secondary">
                  {card.category}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1 line-clamp-1">{card.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">{card.description}</CardDescription>
                  </div>
                  <div className="flex items-center ml-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{card.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {card.location}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {card.date}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {card.members}명 참여
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={card.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{card.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">{card.author.name}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs">{card.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs">{card.comments}</span>
                      </div>
                      <Share2 className="h-4 w-4 cursor-pointer hover:text-gray-700" />
                    </div>
                  </div>

                  <Button className="w-full mt-3 bg-transparent" variant="outline">
                    자세히 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
