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
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
      <div className="p-2 bg-yellow-500/20 rounded-lg">
        <Trophy className="w-6 h-6 text-yellow-500" />
      </div>
      <div>
        <h4 className="font-medium text-yellow-500">Achievement Unlocked!</h4>
        <p className="text-sm text-gray-300">{achievement.name}</p>
      </div>
    </div>
  );
}

export function showAchievementToast(achievement: Achievement) {
  toast.custom(
    (t) => (
      <div
        className={cn(
          "transform transition-all duration-300",
          t.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
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
