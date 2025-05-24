"use client"

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { Achievement } from '@/lib/achievements-data';
import { cn } from '@/lib/utils';

interface AchievementToastProps {
  achievement: Achievement;
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  return (
    <div className="flex items-center gap-3 bg-background border-[#3b82f6] p-4 rounded-lg shadow-lg">
      <Trophy className="h-8 w-8 text-yellow-500" />
      <div>
        <h3 className="font-semibold text-foreground">Achievement Unlocked!</h3>
        <p className="text-sm text-muted-foreground">{achievement.name}</p>
      </div>
    </div>
  );
}

export function showAchievementToast(achievement: Achievement) {
  toast.custom(
    (id) => (
      <div
        className={cn(
          "transform transition-all duration-300",
          "translate-x-0 opacity-100"
        )}
      >
        <AchievementToast achievement={achievement} />
      </div>
    ),
    {
      duration: 5000,
      position: "top-right",
    }
  );
}
