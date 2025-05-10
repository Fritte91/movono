"use client"

import { useEffect } from "react"
import { Award } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Achievement } from "@/lib/achievements-data"

interface AchievementToastProps {
  achievement: Achievement
  onComplete?: () => void
}

export function AchievementToast({ achievement, onComplete }: AchievementToastProps) {
  const { toast } = useToast()

  useEffect(() => {
    const toastId = toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Award className="h-4 w-4 text-primary" />
          </div>
          <span>Achievement Unlocked!</span>
        </div>
      ),
      description: (
        <div className="pt-2">
          <p className="font-medium">{achievement.name}</p>
          <p className="text-muted-foreground text-sm">{achievement.description}</p>
        </div>
      ),
      duration: 5000,
    })

    return () => {
      onComplete?.()
    }
  }, [achievement, toast, onComplete])

  return null
}
