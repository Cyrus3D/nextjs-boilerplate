"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col transition-all duration-200 hover:shadow-md hover:scale-[1.02] group",
      className,
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0 flex-1", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

// 새로운 CardImage 컴포넌트 - 데이터베이스 이미지 로딩 지원
interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null
  alt: string
  fallback?: string
  className?: string
}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ src, alt, fallback = "/placeholder.svg", className, ...props }, ref) => {
    const [isLoading, setIsLoading] = React.useState(true)
    const [hasError, setHasError] = React.useState(false)

    const handleLoad = () => {
      setIsLoading(false)
      setHasError(false)
    }

    const handleError = () => {
      setIsLoading(false)
      setHasError(true)
      console.warn(`이미지 로드 실패: ${src}`)
    }

    // src가 없거나 유효하지 않은 경우 fallback 사용
    const imageSrc = src && String(src).trim() && String(src) !== "null" ? String(src) : fallback

    return (
      <div className={cn("relative overflow-hidden", className)}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
          </div>
        )}
        <img
          ref={ref}
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-transform duration-200 group-hover:scale-105",
            isLoading && "opacity-0",
            hasError && "opacity-50",
          )}
          crossOrigin="anonymous"
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </div>
    )
  },
)
CardImage.displayName = "CardImage"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage }
