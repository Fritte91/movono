import { Award, Download, Film, Folder, Layers, Library, Star } from "lucide-react"
import type { Achievement } from "@/lib/achievements-data"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface AchievementsDisplayProps {
  achievements: Achievement[]
  showProgress?: boolean
  className?: string
}

export function AchievementsDisplay({ achievements, showProgress = true, className }: AchievementsDisplayProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "award":
        return <Award className="h-5 w-5" />
      case "download":
        return <Download className="h-5 w-5" />
      case "film":
        return <Film className="h-5 w-5" />
      case "folder":
        return <Folder className="h-5 w-5" />
      case "layers":
        return <Layers className="h-5 w-5" />
      case "library":
        return <Library className="h-5 w-5" />
      case "star":
        return <Star className="h-5 w-5" />
      default:
        return <Award className="h-5 w-5" />
    }
  }

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)}>
      {achievements.map((achievement) => {
        const isUnlocked = !!achievement.unlockedAt
        const progressPercentage =
          achievement.progress && Math.round((achievement.progress.current / achievement.progress.target) * 100)

        return (
          <div
            key={achievement.id}
            className={cn(
              "flex flex-col items-center text-center p-4 rounded-lg border",
              isUnlocked ? "bg-primary/10 border-primary/30" : "bg-card/60 border-border/50 text-muted-foreground",
            )}
          >
            <div
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center mb-3",
                isUnlocked ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground",
              )}
            >
              {getIcon(achievement.icon)}
            </div>
            <h4 className="font-medium text-sm">{achievement.name}</h4>
            <p className="text-xs mt-1 mb-3">{achievement.description}</p>

            {showProgress && achievement.progress && !isUnlocked && (
              <div className="w-full mt-auto">
                <Progress value={progressPercentage} className="h-1.5 w-full" />
                <p className="text-xs mt-1 text-muted-foreground">
                  {achievement.progress.current}/{achievement.progress.target}
                </p>
              </div>
            )}

            {isUnlocked && (
              <div className="mt-auto pt-2">
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                  Unlocked{" "}
                  {achievement.unlockedAt?.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
