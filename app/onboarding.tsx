import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useGlowStore, UserProfile } from '@/store/glowStore';
import { colors } from '@/constants/colors';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setName, setProfile, completeProfile } = useGlowStore();
  const [step, setStep] = useState(1);
  const [profile, setProfileData] = useState<UserProfile>({
    name: '',
    skinType: '',
    ageGroup: '',
    location: '',
    stylePreferences: [],
    favoriteColors: [],
    goals: [],
    experienceLevel: 'beginner',
  });
  
  const totalSteps = 4;
  
  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (step === 1 && !profile.name) {
      // Name is required
      return;
    }
    
    if (step === totalSteps) {
      // Complete onboarding
      setName(profile.name);
      setProfile(profile);
      completeProfile();
      router.replace('/');
    } else {
      // Go to next step
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };
  
  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };
  
  const toggleStylePreference = (preference: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setProfileData(prev => {
      const preferences = [...prev.stylePreferences];
      const index = preferences.indexOf(preference);
      
      if (index === -1) {
        preferences.push(preference);
      } else {
        preferences.splice(index, 1);
      }
      
      return { ...prev, stylePreferences: preferences };
    });
  };
  
  const toggleGoal = (goal: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setProfileData(prev => {
      const goals = [...prev.goals];
      const index = goals.indexOf(goal);
      
      if (index === -1 && goals.length < 3) {
        goals.push(goal);
      } else if (index !== -1) {
        goals.splice(index, 1);
      }
      
      return { ...prev, goals: goals };
    });
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tell us about yourself 👋</Text>
            <Text style={styles.stepSubtitle}>This helps personalize your app</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>What's your name?</Text>
              <TextInput
                style={styles.textInput}
                value={profile.name}
                onChangeText={(text) => updateProfile('name', text)}
                placeholder="Enter your name"
                placeholderTextColor={colors.gray}
                testID="name-input"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>How old are you?</Text>
              <View style={styles.optionsContainer}>
                {['18-22', '23-27', '28-32', '33-37', '38-42', '43+'].map((age) => (
                  <TouchableOpacity
                    key={age}
                    style={[
                      styles.optionButton,
                      profile.ageGroup === age ? styles.selectedOption : {}
                    ]}
                    onPress={() => updateProfile('ageGroup', age)}
                    testID={`age-option-${age}`}
                  >
                    <Text style={[
                      styles.optionText,
                      profile.ageGroup === age ? styles.selectedOptionText : {}
                    ]}>
                      {age}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Where are you located?</Text>
              <TextInput
                style={styles.textInput}
                value={profile.location}
                onChangeText={(text) => updateProfile('location', text)}
                placeholder="City, Country"
                placeholderTextColor={colors.gray}
                testID="location-input"
              />
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Let's talk about your skin ✨</Text>
            <Text style={styles.stepSubtitle}>This helps with analysis</Text>
            
            <Text style={styles.inputLabel}>What's your skin type?</Text>
            
            <TouchableOpacity
              style={[
                styles.skinTypeCard,
                profile.skinType === 'oily' ? styles.selectedSkinType : {}
              ]}
              onPress={() => updateProfile('skinType', 'oily')}
              testID="skin-type-oily"
            >
              <View style={styles.skinTypeHeader}>
                <Text style={styles.skinTypeIcon}>💧</Text>
                <Text style={styles.skinTypeName}>Oily</Text>
                {profile.skinType === 'oily' && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.skinTypeDescription}>Shiny, large pores</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.skinTypeCard,
                profile.skinType === 'dry' ? styles.selectedSkinType : {}
              ]}
              onPress={() => updateProfile('skinType', 'dry')}
              testID="skin-type-dry"
            >
              <View style={styles.skinTypeHeader}>
                <Text style={styles.skinTypeIcon}>🏜️</Text>
                <Text style={styles.skinTypeName}>Dry</Text>
                {profile.skinType === 'dry' && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.skinTypeDescription}>Tight, flaky feeling</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.skinTypeCard,
                profile.skinType === 'combination' ? styles.selectedSkinType : {}
              ]}
              onPress={() => updateProfile('skinType', 'combination')}
              testID="skin-type-combination"
            >
              <View style={styles.skinTypeHeader}>
                <Text style={styles.skinTypeIcon}>⚖️</Text>
                <Text style={styles.skinTypeName}>Combination</Text>
                {profile.skinType === 'combination' && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.skinTypeDescription}>Oily T-zone, dry cheeks</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.skinTypeCard,
                profile.skinType === 'sensitive' ? styles.selectedSkinType : {}
              ]}
              onPress={() => updateProfile('skinType', 'sensitive')}
              testID="skin-type-sensitive"
            >
              <View style={styles.skinTypeHeader}>
                <Text style={styles.skinTypeIcon}>⚠️</Text>
                <Text style={styles.skinTypeName}>Sensitive</Text>
                {profile.skinType === 'sensitive' && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.skinTypeDescription}>Easily irritated</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your style vibe? 👗</Text>
            <Text style={styles.stepSubtitle}>(Select all that apply)</Text>
            
            <View style={styles.styleGrid}>
              <TouchableOpacity
                style={[
                  styles.styleCard,
                  profile.stylePreferences.includes('Casual') ? styles.selectedStyleCard : {}
                ]}
                onPress={() => toggleStylePreference('Casual')}
                testID="style-casual"
              >
                <Text style={styles.styleIcon}>👕👖</Text>
                <Text style={styles.styleName}>Casual</Text>
                <Text style={styles.styleDescription}>& Comfy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.styleCard,
                  profile.stylePreferences.includes('Chic') ? styles.selectedStyleCard : {}
                ]}
                onPress={() => toggleStylePreference('Chic')}
                testID="style-chic"
              >
                <Text style={styles.styleIcon}>👗💼</Text>
                <Text style={styles.styleName}>Chic</Text>
                <Text style={styles.styleDescription}>Elegant</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.styleCard,
                  profile.stylePreferences.includes('Trendy') ? styles.selectedStyleCard : {}
                ]}
                onPress={() => toggleStylePreference('Trendy')}
                testID="style-trendy"
              >
                <Text style={styles.styleIcon}>🌟✨</Text>
                <Text style={styles.styleName}>Trendy</Text>
                <Text style={styles.styleDescription}>& Bold</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.styleCard,
                  profile.stylePreferences.includes('Classic') ? styles.selectedStyleCard : {}
                ]}
                onPress={() => toggleStylePreference('Classic')}
                testID="style-classic"
              >
                <Text style={styles.styleIcon}>📚🕰</Text>
                <Text style={styles.styleName}>Classic</Text>
                <Text style={styles.styleDescription}>Timeless</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.inputLabel}>Favorite Colors?</Text>
            <View style={styles.colorsContainer}>
              <Text style={styles.colorSwatch}>🔴 ⚪ ⚫ 🟡 🔵 🟢 🟣 🟠 🤎</Text>
            </View>
            
            <Text style={styles.inputLabel}>Budget Range (Optional)</Text>
            <View style={styles.optionsContainer}>
              {['$ (Under $50)', '$$ ($50-150)', '$$$ ($150-300)', '$$$$ ($300+)'].map((budget) => (
                <TouchableOpacity
                  key={budget}
                  style={[
                    styles.budgetOption,
                    profile.budget === budget ? styles.selectedOption : {}
                  ]}
                  onPress={() => updateProfile('budget', budget)}
                  testID={`budget-option-${budget.charAt(0)}`}
                >
                  <Text style={[
                    styles.optionText,
                    profile.budget === budget ? styles.selectedOptionText : {}
                  ]}>
                    {budget}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What are your goals? 🎯</Text>
            <Text style={styles.stepSubtitle}>(Select up to 3)</Text>
            
            <TouchableOpacity
              style={[
                styles.goalCard,
                profile.goals.includes('Improve my skin') ? styles.selectedGoalCard : {}
              ]}
              onPress={() => toggleGoal('Improve my skin')}
              testID="goal-skin"
            >
              <View style={styles.goalHeader}>
                <Text style={styles.goalIcon}>✨</Text>
                <Text style={styles.goalTitle}>Improve my skin</Text>
                {profile.goals.includes('Improve my skin') && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.goalDescription}>Get clearer, healthier skin</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.goalCard,
                profile.goals.includes('Better makeup skills') ? styles.selectedGoalCard : {}
              ]}
              onPress={() => toggleGoal('Better makeup skills')}
              testID="goal-makeup"
            >
              <View style={styles.goalHeader}>
                <Text style={styles.goalIcon}>💄</Text>
                <Text style={styles.goalTitle}>Better makeup skills</Text>
                {profile.goals.includes('Better makeup skills') && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.goalDescription}>Learn professional techniques</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.goalCard,
                profile.goals.includes('Style confidence') ? styles.selectedGoalCard : {}
              ]}
              onPress={() => toggleGoal('Style confidence')}
              testID="goal-style"
            >
              <View style={styles.goalHeader}>
                <Text style={styles.goalIcon}>👗</Text>
                <Text style={styles.goalTitle}>Style confidence</Text>
                {profile.goals.includes('Style confidence') && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.goalDescription}>Feel confident in any outfit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.goalCard,
                profile.goals.includes('Overall glow-up') ? styles.selectedGoalCard : {}
              ]}
              onPress={() => toggleGoal('Overall glow-up')}
              testID="goal-overall"
            >
              <View style={styles.goalHeader}>
                <Text style={styles.goalIcon}>🌟</Text>
                <Text style={styles.goalTitle}>Overall glow-up</Text>
                {profile.goals.includes('Overall glow-up') && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.goalDescription}>Complete transformation</Text>
            </TouchableOpacity>
            
            <Text style={styles.inputLabel}>Your beauty experience?</Text>
            <View style={styles.optionsContainer}>
              {['beginner', 'intermediate', 'pro'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.experienceOption,
                    profile.experienceLevel === level ? styles.selectedOption : {}
                  ]}
                  onPress={() => updateProfile('experienceLevel', level)}
                  testID={`experience-${level}`}
                >
                  <Text style={[
                    styles.optionText,
                    profile.experienceLevel === level ? styles.selectedOptionText : {}
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: '',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ChevronLeft color={colors.primary} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="onboarding-screen">
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Step {step}/{totalSteps}</Text>
        </View>
        
        {renderStep()}
        
        <TouchableOpacity 
          style={[
            styles.nextButton,
            step === 1 && !profile.name ? styles.disabledButton : {}
          ]}
          onPress={handleNext}
          disabled={step === 1 && !profile.name}
          testID="next-button"
        >
          <Text style={styles.nextButtonText}>
            {step === totalSteps ? 'Complete Setup! ✨' : 'Next Step'}
          </Text>
          {step !== totalSteps && <ChevronRight color={colors.white} size={20} />}
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginLeft: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.lightGray,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.white,
    fontWeight: '500',
  },
  skinTypeCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  selectedSkinType: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  skinTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  skinTypeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  skinTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  checkmark: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  skinTypeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 28,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  styleCard: {
    width: '46%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  selectedStyleCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  styleIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  styleName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  styleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  colorsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  colorSwatch: {
    fontSize: 24,
    letterSpacing: 8,
  },
  budgetOption: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.lightGray,
    flex: 1,
    alignItems: 'center',
  },
  goalCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  selectedGoalCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 28,
  },
  experienceOption: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.lightGray,
    flex: 1,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.7,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});