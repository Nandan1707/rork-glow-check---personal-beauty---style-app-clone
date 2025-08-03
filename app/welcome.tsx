import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sparkles, Camera, Users, Trophy } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useGlowStore } from '@/store/glowStore';
import { colors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { hasSeenWelcome, setHasSeenWelcome, isOnboardingComplete } = useGlowStore();
  
  const sparkleScale = useSharedValue(1);
  const sparkleRotation = useSharedValue(0);
  const fadeInValue = useSharedValue(0);
  const slideUpValue = useSharedValue(50);

  useEffect(() => {
    // Check if user should skip welcome
    if (hasSeenWelcome && isOnboardingComplete) {
      router.replace('/(tabs)');
      return;
    }
    
    // Start animations
    fadeInValue.value = withTiming(1, { duration: 1000 });
    slideUpValue.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
    
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
    
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedFadeStyle = useAnimatedStyle(() => ({
    opacity: fadeInValue.value,
  }));

  const animatedSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideUpValue.value }],
  }));

  const animatedSparkleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: sparkleScale.value },
      { rotate: `${sparkleRotation.value}deg` },
    ],
  }));

  const handleGetStarted = () => {
    setHasSeenWelcome(true);
    if (isOnboardingComplete) {
      router.replace('/(tabs)');
    } else {
      router.push('/onboarding');
    }
  };

  const features = [
    {
      icon: Camera,
      title: 'AI Beauty Analysis',
      description: 'Get your personalized glow score in seconds',
      color: colors.primary,
    },
    {
      icon: Trophy,
      title: 'Glow Challenges',
      description: 'Join 30-day transformations with thousands of women',
      color: '#FFD700',
    },
    {
      icon: Users,
      title: 'Anonymous Comparison',
      description: 'See how you compare with complete privacy',
      color: '#4ECDC4',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B9D', '#FF8E7F', '#FFB6C1']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Header with animated sparkle */}
          <Animated.View style={[styles.header, animatedFadeStyle]}>
            <Animated.View style={[styles.sparkleContainer, animatedSparkleStyle]}>
              <Sparkles size={60} color="white" />
            </Animated.View>
            <Text style={styles.title}>Glow Check</Text>
            <Text style={styles.subtitle}>
              Discover your beauty potential with AI-powered analysis
            </Text>
          </Animated.View>

          {/* Features */}
          <Animated.View style={[styles.featuresContainer, animatedSlideStyle]}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.featureCard,
                    animatedFadeStyle,
                  ]}
                >
                  <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                    <Icon size={24} color="white" />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </Animated.View>
              );
            })}
          </Animated.View>

          {/* Stats */}
          <Animated.View style={[styles.statsContainer, animatedFadeStyle]}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.3M+</Text>
              <Text style={styles.statLabel}>Glow Checks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>890K+</Text>
              <Text style={styles.statLabel}>Happy Users</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8⭐</Text>
              <Text style={styles.statLabel}>App Rating</Text>
            </View>
          </Animated.View>

          {/* CTA Button */}
          <Animated.View style={[styles.ctaContainer, animatedSlideStyle]}>
            <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
              <LinearGradient
                colors={['#FFFFFF', '#F8F9FA']}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.ctaText}>Start Your Glow Journey</Text>
                <Sparkles size={20} color={colors.primary} style={styles.ctaIcon} />
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.disclaimer}>
              Join millions of women discovering their beauty potential
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sparkleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  ctaContainer: {
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 8,
  },
  ctaIcon: {
    marginLeft: 4,
  },
  disclaimer: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
});