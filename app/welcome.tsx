import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronRight, Camera, Shirt, Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useGlowStore } from '@/store/glowStore';
import { colors } from '@/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { setName, completeProfile } = useGlowStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const features = [
    {
      id: 'beauty',
      icon: <Camera color={colors.white} size={32} />,
      title: 'AI Beauty Analysis',
      description: 'Get personalized glow score and beauty recommendations',
    },
    {
      id: 'outfit',
      icon: <Shirt color={colors.white} size={32} />,
      title: 'Smart Outfit Analysis',
      description: 'Perfect your style for any event with AI feedback',
    },
    {
      id: 'challenges',
      icon: <Trophy color={colors.white} size={32} />,
      title: '30-Day Glow Challenges',
      description: 'Transform with daily tasks and track your progress',
    },
  ];
  
  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Set a default name
    setName('Beautiful');
    completeProfile();
    router.replace('/');
  };
  
  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding');
  };
  
  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to modal for login
    router.push('/modal');
  };
  
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <View style={styles.container} testID="welcome-screen">
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
            testID="skip-button"
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          
          <View style={styles.dotsContainer}>
            {features.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  currentSlide === index ? styles.activeDot : {}
                ]} 
              />
            ))}
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Glow Check</Text>
          <Text style={styles.subtitle}>Your AI Beauty & Style Coach</Text>
          
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const slideIndex = Math.round(
                event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
              );
              handleSlideChange(slideIndex);
            }}
            style={styles.carousel}
            testID="feature-carousel"
          >
            {features.map((feature) => (
              <View key={feature.id} style={styles.slide}>
                <LinearGradient
                  colors={
                    feature.id === 'beauty' 
                      ? [colors.gradientStart, colors.gradientEnd]
                      : feature.id === 'outfit'
                        ? [colors.secondaryGradientStart, colors.secondaryGradientEnd]
                        : [colors.tertiary, '#3CB371']
                  }
                  style={styles.featureIcon}
                >
                  {feature.icon}
                </LinearGradient>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            testID="get-started-button"
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.getStartedText}>Get Started - It's Free! 🚀</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            testID="login-button"
          >
            <Text style={styles.loginText}>Already have account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  dotsContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
  },
  carousel: {
    flex: 1,
    width: '100%',
  },
  slide: {
    width: 350,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  featureIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
  },
  getStartedButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  getStartedText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
});