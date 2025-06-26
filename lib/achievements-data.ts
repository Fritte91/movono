import { supabaseClient } from './supabase';
import { MessageSquare, ThumbsUp, Heart, Trophy, Zap, Crown, BookOpen, Users, Award, Download, Film, Folder, Layers, Library, Star } from 'lucide-react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'download' | 'rating' | 'collection' | 'comment' | 'social' | 'special';
  unlockedAt?: Date;
  progress?: {
    current: number;
    target: number;
  };
}

export interface UserAchievement extends Achievement {
  unlockedAt: Date;
}

export const achievements: Achievement[] = [
  // Download Achievements
  {
    id: "download-1",
    name: "First Download",
    description: "Downloaded your first movie",
    icon: "download",
    category: "download",
    progress: {
      current: 0,
      target: 1,
    },
  },
  {
    id: "download-10",
    name: "Movie Enthusiast",
    description: "Downloaded 10 movies",
    icon: "film",
    category: "download",
    progress: {
      current: 0,
      target: 10,
    },
  },
  {
    id: "download-50",
    name: "Movie Collector",
    description: "Downloaded 50 movies",
    icon: "library",
    category: "download",
    progress: {
      current: 0,
      target: 50,
    },
  },
  {
    id: "download-100",
    name: "Film Aficionado",
    description: "Downloaded 100 movies",
    icon: "award",
    category: "download",
    progress: {
      current: 0,
      target: 100,
    },
  },

  // Rating Achievements
  {
    id: "rating-10",
    name: "Critic",
    description: "Rated 10 movies",
    icon: "star",
    category: "rating",
    progress: {
      current: 0,
      target: 10,
    },
  },
  {
    id: "rating-50",
    name: "Movie Critic",
    description: "Rated 50 movies",
    icon: "thumbs-up",
    category: "rating",
    progress: {
      current: 0,
      target: 50,
    },
  },
  {
    id: "rating-100",
    name: "Master Critic",
    description: "Rated 100 movies",
    icon: "trophy",
    category: "rating",
    progress: {
      current: 0,
      target: 100,
    },
  },

  // Collection Achievements
  {
    id: "collection-1",
    name: "Curator",
    description: "Created your first collection",
    icon: "folder",
    category: "collection",
    progress: {
      current: 0,
      target: 1,
    },
  },
  {
    id: "collection-5",
    name: "Master Curator",
    description: "Created 5 collections",
    icon: "layers",
    category: "collection",
    progress: {
      current: 0,
      target: 5,
    },
  },
  {
    id: "collection-10",
    name: "Collection Expert",
    description: "Created 10 collections",
    icon: "book-open",
    category: "collection",
    progress: {
      current: 0,
      target: 10,
    },
  },

  // Comment Achievements
  {
    id: "comment-1",
    name: "First Comment",
    description: "Left your first comment",
    icon: "message-square",
    category: "comment",
    progress: {
      current: 0,
      target: 1,
    },
  },
  {
    id: "comment-10",
    name: "Active Commenter",
    description: "Left 10 comments",
    icon: "message-square",
    category: "comment",
    progress: {
      current: 0,
      target: 10,
    },
  },
  {
    id: "comment-50",
    name: "Community Voice",
    description: "Left 50 comments",
    icon: "message-square",
    category: "comment",
    progress: {
      current: 0,
      target: 50,
    },
  },

  // Social Achievements
  {
    id: "profile-complete",
    name: "Profile Complete",
    description: "Completed your profile information",
    icon: "users",
    category: "social",
    progress: {
      current: 0,
      target: 1,
    },
  },
  {
    id: "avatar-set",
    name: "Avatar Set",
    description: "Set your profile avatar",
    icon: "users",
    category: "social",
    progress: {
      current: 0,
      target: 1,
    },
  },

  // Special Achievements
  {
    id: "first-week",
    name: "First Week",
    description: "Been a member for one week",
    icon: "zap",
    category: "special",
    progress: {
      current: 0,
      target: 1,
    },
  },
  {
    id: "first-month",
    name: "Monthly Member",
    description: "Been a member for one month",
    icon: "crown",
    category: "special",
    progress: {
      current: 0,
      target: 1,
    },
  },
];

export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  try {
    // Get user's unlocked achievements from the database
    const { data: userAchievements, error } = await supabaseClient
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    // Get user's activity counts
    const [
      { count: downloadCount },
      { count: ratingCount },
      { count: collectionCount },
      { count: commentCount },
      { data: profileData }
    ] = await Promise.all([
      supabaseClient.from('downloads').select('*', { count: 'exact' }).eq('user_id', userId),
      supabaseClient.from('ratings').select('*', { count: 'exact' }).eq('user_id', userId),
      supabaseClient.from('collections').select('*', { count: 'exact' }).eq('user_id', userId),
      supabaseClient.from('comments').select('*', { count: 'exact' }).eq('user_id', userId),
      supabaseClient.from('profiles').select('*').eq('id', userId).single()
    ]);

    // Map achievements with progress and unlocked status
    return achievements.map(achievement => {
      const validUserAchievements = Array.isArray(userAchievements)
        ? (userAchievements.filter(ua => ua && typeof ua === 'object' && 'achievement_id' in ua) as { achievement_id: string; unlocked_at?: string }[])
        : [];
      const unlockedAchievement = validUserAchievements.find(ua => ua.achievement_id === achievement.id);
      
      let current = 0;
      switch (achievement.category) {
        case 'download':
          current = downloadCount || 0;
          break;
        case 'rating':
          current = ratingCount || 0;
          break;
        case 'collection':
          current = collectionCount || 0;
          break;
        case 'comment':
          current = commentCount || 0;
          break;
        case 'social':
          if (achievement.id === 'profile-complete') {
            const safeProfile = profileData as any;
            current = safeProfile && safeProfile.bio && safeProfile.country && safeProfile.language ? 1 : 0;
          } else if (achievement.id === 'avatar-set') {
            const safeProfile = profileData as any;
            current = safeProfile && safeProfile.avatar_url ? 1 : 0;
          }
          break;
      }

      return {
        ...achievement,
        unlockedAt: unlockedAchievement && 'unlocked_at' in unlockedAchievement && unlockedAchievement.unlocked_at ? new Date(unlockedAchievement.unlocked_at) : undefined,
        progress: achievement.progress ? {
          ...achievement.progress,
          current: Math.min(current, achievement.progress.target)
        } : undefined
      };
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return achievements;
  }
}

export async function checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
  try {
    const userAchievements = await getUserAchievements(userId);
    const unlockedAchievements: Achievement[] = [];

    for (const achievement of userAchievements) {
      if (!achievement.unlockedAt && achievement.progress) {
        if (achievement.progress.current >= achievement.progress.target) {
          // Unlock achievement
          const { error } = await supabaseClient
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id,
              unlocked_at: new Date().toISOString()
            });

          if (!error) {
            unlockedAchievements.push({
              ...achievement,
              unlockedAt: new Date()
            });
          }
        }
      }
    }

    return unlockedAchievements;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
}

export function getIcon(iconName: string) {
  switch (iconName) {
    case "award":
      return Award;
    case "download":
      return Download;
    case "film":
      return Film;
    case "folder":
      return Folder;
    case "layers":
      return Layers;
    case "library":
      return Library;
    case "star":
      return Star;
    case "message-square":
      return MessageSquare;
    case "thumbs-up":
      return ThumbsUp;
    case "trophy":
      return Trophy;
    case "zap":
      return Zap;
    case "crown":
      return Crown;
    case "book-open":
      return BookOpen;
    case "users":
      return Users;
    default:
      return Award;
  }
}
