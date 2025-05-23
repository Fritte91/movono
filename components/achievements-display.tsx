import { useEffect, useState } from 'react';
import { getIcon, getUserAchievements, type Achievement } from "@/lib/achievements-data"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface AchievementsDisplayProps {
  userId: string;
  achievements?: Achievement[];
  showProgress?: boolean;
  className?: string;
}

const categoryIcons = {
  download: getIcon('download'),
  rating: getIcon('star'),
  collection: getIcon('folder'),
  comment: getIcon('message-square'),
  social: getIcon('users'),
  special: getIcon('crown'),
};

const categoryColors = {
  download: 'bg-blue-500',
  rating: 'bg-yellow-500',
  collection: 'bg-green-500',
  comment: 'bg-purple-500',
  social: 'bg-pink-500',
  special: 'bg-gradient-to-r from-yellow-400 to-orange-500',
};

export function AchievementsDisplay({ userId, achievements: achievementsProp, showProgress = true, className }: AchievementsDisplayProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(achievementsProp || []);
  const [loading, setLoading] = useState(!achievementsProp);

  useEffect(() => {
    if (!achievementsProp && userId) {
      (async () => {
        try {
          const userAchievements = await getUserAchievements(userId);
          setAchievements(userAchievements || []);
        } catch (e) {
          setAchievements([]);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [achievementsProp, userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 space-y-4">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-2 w-full bg-gray-200 animate-pulse rounded" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!achievements || achievements.length === 0) {
    return <div className="text-center text-muted-foreground">No achievements found.</div>;
  }

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
        const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
        const categoryColor = categoryColors[category as keyof typeof categoryColors];
        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              {CategoryIcon && <CategoryIcon className="w-6 h-6" />}
              <h3 className="text-lg font-semibold capitalize">{category}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map((achievement) => {
                const Icon = getIcon(achievement.icon);
                const isUnlocked = !!achievement.unlockedAt;
                const progress = achievement.progress?.current || 0;
                const target = achievement.progress?.target || 0;
                const progressPercentage = (progress / target) * 100;
                return (
                  <Card
                    key={achievement.id}
                    className={cn(
                      "p-4 space-y-4 transition-all duration-200",
                      isUnlocked ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gray-900/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          isUnlocked ? categoryColor : "bg-gray-800"
                        )}>
                          {Icon && <Icon className={cn(
                            "w-6 h-6",
                            isUnlocked ? "text-white" : "text-gray-400"
                          )} />}
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                        </div>
                      </div>
                      {isUnlocked && (
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    {achievement.progress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-gray-300">
                            {progress} / {target}
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  )
}
