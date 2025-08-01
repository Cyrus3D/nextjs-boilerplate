"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:shadow-md hover:scale-[1.02]",
        elevated: "shadow-lg hover:shadow-xl hover:scale-[1.03]",
        flat: "shadow-none border-0 bg-transparent",
        outline: "border-2 border-dashed hover:border-solid",
        interactive: "cursor-pointer hover:shadow-lg hover:scale-[1.05] active:scale-[0.98]",
        news: "hover:shadow-md hover:scale-[1.01] group",
        business: "hover:shadow-lg hover:scale-[1.02] hover:border-primary/20",
      },
      size: {
        default: "",
        sm: "text-sm",
        lg: "text-lg",
        compact: "p-2",
      },
      spacing: {
        default: "",
        tight: "space-y-2",
        loose: "space-y-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      spacing: "default",
    },
  },
)

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, size, spacing, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ variant, size, spacing }), className)} {...props} />
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
      setImageError(false)
      setImageLoading(true)
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

const CardContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid gap-4 md:gap-6",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        "auto-rows-fr", // Equal height cards
        className,
      )}
      {...props}
    />
  ),
)
CardContainer.displayName = "CardContainer"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  CardContainer,
  cardVariants,
  type CardProps,
}
