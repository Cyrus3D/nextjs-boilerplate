"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
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

// 데이터베이스 이미지 로딩을 위한 CardImage 컴포넌트
interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, src, alt, fallback = "/placeholder.svg", onError, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)
    const [imageLoading, setImageLoading] = React.useState(true)

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.warn(`Failed to load image: ${src}`)
      setImageError(true)
      setImageLoading(false)
      onError?.(e)
    }

    const handleLoad = () => {
      setImageLoading(false)
    }

    React.useEffect(() => {
      if (src) {
        setImageError(false)
        setImageLoading(true)
      }
    }, [src])

    return (
      <div className="relative">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
        <img
          ref={ref}
          src={imageError ? fallback : src}
          alt={alt}
          className={cn(
            "transition-all duration-300 group-hover:scale-105",
            imageLoading ? "opacity-0" : "opacity-100",
            className,
          )}
          crossOrigin="anonymous"
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
      </div>
    )
  },
)
CardImage.displayName = "CardImage"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage }
