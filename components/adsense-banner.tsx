"use client"

import GoogleAds from "./google-ads"

interface AdsenseBannerProps {
  slot?: string
  format?: "horizontal" | "vertical" | "square"
  className?: string
}

export default function AdsenseBanner({ slot, format = "horizontal", className = "" }: AdsenseBannerProps) {
  const getAdStyle = () => {
    switch (format) {
      case "horizontal":
        return {
          display: "block",
          width: "100%",
          height: "90px",
        }
      case "vertical":
        return {
          display: "block",
          width: "160px",
          height: "600px",
        }
      case "square":
        return {
          display: "block",
          width: "300px",
          height: "250px",
        }
      default:
        return {
          display: "block",
          width: "100%",
          height: "90px",
        }
    }
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <GoogleAds adSlot={slot || process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT || "1234567890"} style={getAdStyle()} />
    </div>
  )
}
