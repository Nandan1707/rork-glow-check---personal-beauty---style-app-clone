import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  age: number;
  skinType: 'oily' | 'dry' | 'combination' | 'sensitive' | '';
  skinTone: 'light' | 'medium' | 'tan' | 'dark' | '';
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong' | '';
  ageGroup: string;
  location: string;
  stylePreferences: string[];
  favoriteColors: string[];
  goals: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'pro' | '';
  budget?: string;
  joinDate: string;
  avatar?: string;
}

export interface BeautyAnalysis {
  id: string;
  glowScore: number;
  skinQuality: number;
  symmetry: number;
  eyeBeauty: number;
  lipDefinition: number;
  faceShape: string;
  skinTone: string;
  recommendations: string[];
  improvements: string[];
  photoUrl?: string;
  date: string;
  processingTime: number;
}

export interface OutfitAnalysis {
  id: string;
  outfitScore: number;
  colorHarmony: number;
  fitStyle: number;
  eventMatch: number;
  event: string;
  recommendations: string[];
  photoUrl?: string;
  date: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'skincare' | 'makeup' | 'overall' | 'confidence';
  tasks: ChallengeTask[];
  rewards: {
    points: number;
    badge: string;
    title: string;
  };
  participants: number;
  isActive: boolean;
  startDate?: string;
  progress?: number;
}

export interface ChallengeTask {
  id: string;
  day: number;
  title: string;
  description: string;
  type: 'photo' | 'skincare' | 'learning' | 'practice';
  points: number;
  completed: boolean;
  completedDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedDate: string;
  points: number;
}

export interface SocialComparison {
  yourScore: number;
  averageScore: number;
  percentileRank: number;
  categoryComparisons: {
    [key: string]: {
      yourScore: number;
      averageScore: number;
      top10Average: number;
    };
  };
  insights: {
    title: string;
    description: string;
    icon: string;
    color: string;
    actionText: string;
  }[];
}

interface GlowState {
  // User profile
  name: string;
  isProfileComplete: boolean;
  isOnboardingComplete: boolean;
  profile: UserProfile;
  
  // Scores and analysis
  glowScore: number;
  outfitScore: number;
  beautyAnalyses: BeautyAnalysis[];
  outfitAnalyses: OutfitAnalysis[];
  
  // Challenges and gamification
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  achievements: Achievement[];
  totalPoints: number;
  streak: number;
  lastAnalysis: string;
  
  // Social features
  socialComparison?: SocialComparison;
  
  // Premium status
  isPremium: boolean;
  subscriptionTier: 'free' | 'pro' | 'goddess';
  subscriptionExpiry?: string;
  analysisCount: number;
  monthlyAnalysisLimit: number;
  
  // App state
  hasSeenWelcome: boolean;
  notificationsEnabled: boolean;
  
  // Actions
  setName: (name: string) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  completeProfile: () => void;
  completeOnboarding: () => void;
  addBeautyAnalysis: (analysis: BeautyAnalysis) => void;
  addOutfitAnalysis: (analysis: OutfitAnalysis) => void;
  joinChallenge: (challenge: Challenge) => void;
  completeTask: (challengeId: string, taskId: string) => void;
  addAchievement: (achievement: Achievement) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  setPremium: (status: boolean, tier?: 'pro' | 'goddess') => void;
  setSocialComparison: (comparison: SocialComparison) => void;
  setHasSeenWelcome: (seen: boolean) => void;
  incrementAnalysisCount: () => void;
  resetMonthlyAnalysisCount: () => void;
}

export const useGlowStore = create<GlowState>()(
  persist(
    (set, get) => ({
      // User profile
      name: '',
      isProfileComplete: false,
      isOnboardingComplete: false,
      profile: {
        id: '',
        name: '',
        age: 0,
        skinType: '',
        skinTone: '',
        faceShape: '',
        ageGroup: '',
        location: '',
        stylePreferences: [],
        favoriteColors: [],
        goals: [],
        experienceLevel: '',
        budget: '',
        joinDate: new Date().toISOString(),
      },
      
      // Scores and analysis
      glowScore: 0,
      outfitScore: 0,
      beautyAnalyses: [],
      outfitAnalyses: [],
      
      // Challenges and gamification
      activeChallenges: [],
      completedChallenges: [],
      achievements: [],
      totalPoints: 0,
      streak: 0,
      lastAnalysis: '',
      
      // Social features
      socialComparison: undefined,
      
      // Premium status
      isPremium: false,
      subscriptionTier: 'free',
      subscriptionExpiry: undefined,
      analysisCount: 0,
      monthlyAnalysisLimit: 3,
      
      // App state
      hasSeenWelcome: false,
      notificationsEnabled: true,
      
      // Actions
      setName: (name) => set({ name }),
      
      setProfile: (profile) => set((state) => ({
        profile: { ...state.profile, ...profile },
      })),
      
      completeProfile: () => set({ isProfileComplete: true }),
      
      completeOnboarding: () => set({ isOnboardingComplete: true }),
      
      addBeautyAnalysis: (analysis) => set((state) => {
        const newAnalyses = [analysis, ...state.beautyAnalyses];
        return {
          beautyAnalyses: newAnalyses,
          glowScore: analysis.glowScore,
          lastAnalysis: analysis.date,
        };
      }),
      
      addOutfitAnalysis: (analysis) => set((state) => {
        const newAnalyses = [analysis, ...state.outfitAnalyses];
        return {
          outfitAnalyses: newAnalyses,
          outfitScore: analysis.outfitScore,
          lastAnalysis: analysis.date,
        };
      }),
      
      joinChallenge: (challenge) => set((state) => {
        const challengeWithStart = {
          ...challenge,
          isActive: true,
          startDate: new Date().toISOString(),
          progress: 0,
        };
        return {
          activeChallenges: [...state.activeChallenges, challengeWithStart],
        };
      }),
      
      completeTask: (challengeId, taskId) => set((state) => {
        const updatedChallenges = state.activeChallenges.map(challenge => {
          if (challenge.id === challengeId) {
            const updatedTasks = challenge.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  completed: true,
                  completedDate: new Date().toISOString(),
                };
              }
              return task;
            });
            
            const completedTasksCount = updatedTasks.filter(task => task.completed).length;
            const progress = (completedTasksCount / updatedTasks.length) * 100;
            
            return {
              ...challenge,
              tasks: updatedTasks,
              progress,
            };
          }
          return challenge;
        });
        
        const completedTask = state.activeChallenges
          .find(c => c.id === challengeId)?.tasks
          .find(t => t.id === taskId);
        
        const pointsToAdd = completedTask?.points || 0;
        
        return {
          activeChallenges: updatedChallenges,
          totalPoints: state.totalPoints + pointsToAdd,
        };
      }),
      
      addAchievement: (achievement) => set((state) => ({
        achievements: [...state.achievements, achievement],
        totalPoints: state.totalPoints + achievement.points,
      })),
      
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      
      resetStreak: () => set({ streak: 0 }),
      
      setPremium: (status, tier = 'pro') => set((state) => ({
        isPremium: status,
        subscriptionTier: status ? tier : 'free',
        monthlyAnalysisLimit: status ? (tier === 'goddess' ? 999 : 50) : 3,
        subscriptionExpiry: status ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      })),
      
      setSocialComparison: (comparison) => set({ socialComparison: comparison }),
      
      setHasSeenWelcome: (seen) => set({ hasSeenWelcome: seen }),
      
      incrementAnalysisCount: () => set((state) => ({
        analysisCount: state.analysisCount + 1,
      })),
      
      resetMonthlyAnalysisCount: () => set({ analysisCount: 0 }),
    }),
    {
      name: 'glow-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper functions
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateGlowScore = (metrics: {
  skinQuality: number;
  symmetry: number;
  eyeBeauty: number;
  lipDefinition: number;
}) => {
  const weights = {
    skinQuality: 0.35,
    symmetry: 0.25,
    eyeBeauty: 0.25,
    lipDefinition: 0.15,
  };
  
  return Math.round(
    (metrics.skinQuality * weights.skinQuality +
     metrics.symmetry * weights.symmetry +
     metrics.eyeBeauty * weights.eyeBeauty +
     metrics.lipDefinition * weights.lipDefinition) * 10
  ) / 10;
};

export const getScoreColor = (score: number) => {
  if (score >= 9) return '#00D9FF'; // Excellent
  if (score >= 7.5) return '#4ECDC4'; // Good
  if (score >= 6) return '#FFE66D'; // Average
  return '#FF8A80'; // Needs work
};

export const getScoreLabel = (score: number) => {
  if (score >= 9) return 'Absolutely Glowing!';
  if (score >= 7.5) return 'Looking Great!';
  if (score >= 6) return 'Good Foundation';
  return 'Room to Glow!';
};