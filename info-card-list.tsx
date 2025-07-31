"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
import { Newspaper, Building2 } from "lucide-react"

const InfoCardList = () => {
  const [activeTab, setActiveTab] = useState<string>("news")

  const newsTablesExist = true // Placeholder for actual logic

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="news" className="flex items-center gap-2">
          <Newspaper className="w-4 h-4" />
          현지 뉴스 {!newsTablesExist && "(DB 없음)"}
        </TabsTrigger>
        <TabsTrigger value="business" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          한인업체 정보
        </TabsTrigger>
      </TabsList>

      {/* News Tab Content */}
      <TabsContent value="news" className="space-y-6">
        {/* ... existing news content ... */}
      </TabsContent>

      {/* Business Tab Content */}
      <TabsContent value="business" className="space-y-6">
        {/* ... existing business content ... */}
      </TabsContent>
    </Tabs>
  )
}

export default InfoCardList
