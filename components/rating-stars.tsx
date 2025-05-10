"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  initialRating?: number
  totalStars?: number
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function RatingStars({
  initialRating = 0,
  totalStars = 5,
  size = "md",
  readOnly = false,
  onRatingChange,
  className,
}: RatingStarsProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (index: number) => {
    if (readOnly) return

    const newRating = index + 1
    setRating(newRating)
    onRatingChange?.(newRating)
  }

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <div className={cn("flex", className)}>
      {[...Array(totalStars)].map((_, index) => {
        const isActive = (hoverRating || rating) > index

        return (
          <Star
            key={index}
            className={cn(
              "rating-star cursor-pointer transition-all",
              sizeClasses[size],
              isActive ? "text-yellow-400 fill-yellow-400" : "text-gray-400",
              readOnly && "cursor-default",
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
          />
        )
      })}
    </div>
  )
}
