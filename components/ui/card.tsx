"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

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

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  alt: string
  fallback?: string
}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, src, alt, fallback = "/placeholder.svg?height=200&width=300", ...props }, ref) => {
    const [isLoading, setIsLoading] = React.useState(true)
    const [hasError, setHasError] = React.useState(false)
    const [imageSrc, setImageSrc] = React.useState(src || fallback)

    React.useEffect(() => {
      if (!src) {
        setImageSrc(fallback)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setHasError(false)

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        setImageSrc(src)
        setIsLoading(false)
        setHasError(false)
      }

      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`)
        setImageSrc(fallback)
        setIsLoading(false)
        setHasError(true)
      }

      img.src = src
    }, [src, fallback])

    if (isLoading) {
      return (
        <div className={cn("flex items-center justify-center bg-muted", className)}>
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )
    }

    return (
      <img
        ref={ref}
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        className={cn("object-cover transition-transform duration-200 group-hover:scale-105", className)}
        crossOrigin="anonymous"
        {...props}
      />
    )
  },
)
CardImage.displayName = "CardImage"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage }
