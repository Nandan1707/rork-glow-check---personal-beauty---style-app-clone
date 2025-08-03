import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  skinType: 'oily' | 'dry' | 'combination' | 'sensitive' | '';
  ageGroup: string;
  location: string;
  stylePreferences: string[];
  favoriteColors: string[];
  goals: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'pro' | '';
  budget?: string;
}

export interface BeautyAnalysis {
  glowScore: number;
  skinQuality: number;
  symmetry: number;
  eyeBeauty: number;
  lipDefinition: number;
  date: string;
}

export interface OutfitAnalysis {
  outfitScore: number;
  colorHarmony: number;
  fitStyle: number;
  eventMatch: number;
  event: string;
  date: string;
}

interface GlowState {
  // User profile
  name: string;
  isProfileComplete: boolean;
  profile: UserProfile;
  
  // Scores and analysis
  glowScore: number;
  outfitScore: number;
  beautyAnalyses: BeautyAnalysis[];
  outfitAnalyses: OutfitAnalysis[];
  
  // Challenges
  streak: number;
  lastAnalysis: string;
  
  // Premium status
  isPremium: boolean;
  
  // Actions
  setName: (name: string) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  completeProfile: () => void;
  addBeautyAnalysis: (analysis: BeautyAnalysis) => void;
  addOutfitAnalysis: (analysis: OutfitAnalysis) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  setPremium: (status: boolean) => void;
}

export const useGlowStore = create<GlowState>()(
  persist(
    (set) => ({
      // User profile
      name: '',
      isProfileComplete: false,
      profile: {
        name: '',
        skinType: '',
        ageGroup: '',
        location: '',
        stylePreferences: [],
        favoriteColors: [],
        goals: [],
        experienceLevel: '',
        budget: '',
      },
      
      // Scores and analysis
      glowScore: 0,
      outfitScore: 0,
      beautyAnalyses: [],
      outfitAnalyses: [],
      
      // Challenges
      streak: 0,
      lastAnalysis: '',
      
      // Premium status
      isPremium: false,
      
      // Actions
      setName: (name) => set({ name }),
      
      setProfile: (profile) => set((state) => ({
        profile: { ...state.profile, ...profile },
      })),
      
      completeProfile: () => set({ isProfileComplete: true }),
      
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
      
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      
      resetStreak: () => set({ streak: 0 }),
      
      setPremium: (status) => set({ isPremium: status }),
    }),
    {
      name: 'glow-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);