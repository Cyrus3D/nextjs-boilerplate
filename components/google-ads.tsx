"use client"

import type React from "react"

interface GoogleAdsProps {
  adSlot: string
  adFormat?: string
  fullWidthResponsive?: boolean
  style?: React.CSSProperties
}

export default function GoogleAds({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: "block" },
}: GoogleAdsProps) {
  return (
    <div className="w-full flex justify-center my-4">
      <div
        className="bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-600 font-medium"
        style={{
          width: "100%",
          height: "90px",
          ...style,
        }}
      >
        광고 배너 영역 (728x90)
      </div>
    </div>
  )
}
