export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: Date
  progress?: {
    current: number
    target: number
  }
}

export interface UserAchievement extends Achievement {
  unlockedAt: Date
}

export const achievements: Achievement[] = [
  {
    id: "download-1",
    name: "First Download",
    description: "Downloaded your first movie",
    icon: "download",
    progress: {
      current: 1,
      target: 1,
    },
  },
  {
    id: "download-10",
    name: "Movie Enthusiast",
    description: "Downloaded 10 movies",
    icon: "film",
    progress: {
      current: 7,
      target: 10,
    },
  },
  {
    id: "download-50",
    name: "Movie Collector",
    description: "Downloaded 50 movies",
    icon: "library",
    progress: {
      current: 7,
      target: 50,
    },
  },
  {
    id: "download-100",
    name: "Film Aficionado",
    description: "Downloaded 100 movies",
    icon: "award",
    progress: {
      current: 7,
      target: 100,
    },
  },
  {
    id: "rating-10",
    name: "Critic",
    description: "Rated 10 movies",
    icon: "star",
    progress: {
      current: 5,
      target: 10,
    },
  },
  {
    id: "collection-1",
    name: "Curator",
    description: "Created your first collection",
    icon: "folder",
    unlockedAt: new Date(2023, 8, 10),
  },
  {
    id: "collection-5",
    name: "Master Curator",
    description: "Created 5 collections",
    icon: "layers",
    progress: {
      current: 3,
      target: 5,
    },
  },
]

export function getUserAchievements(userId: string): Achievement[] {
  // In a real app, this would fetch from a database
  return achievements
}

export function getUnlockedAchievements(userId: string): UserAchievement[] {
  // In a real app, this would fetch from a database
  return achievements
    .filter((achievement) => achievement.unlockedAt)
    .map((achievement) => ({
      ...achievement,
      unlockedAt: achievement.unlockedAt as Date,
    }))
}
