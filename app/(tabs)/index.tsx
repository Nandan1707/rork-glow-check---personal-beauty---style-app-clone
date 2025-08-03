import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Camera, Shirt, Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useGlowStore } from '@/store/glowStore';
import { colors } from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { name, glowScore, outfitScore, streak, lastAnalysis } = useGlowStore();
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleAnalysisPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/beauty-analysis');
  };

  const handleOutfitPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/outfit-analysis');
  };

  const handleChallengePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/challenges');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Glow Check',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="home-screen">
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}, {name || 'Beautiful'}</Text>
          <Text style={styles.streak}>Current streak: 🔥 {streak} days</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={handleAnalysisPress}
            testID="beauty-analysis-card"
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Camera color={colors.white} size={32} />
              <Text style={styles.cardTitle}>Beauty Analysis</Text>
              {glowScore > 0 && (
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>Last: {glowScore.toFixed(1)}</Text>
                  <Text style={styles.timeText}>{lastAnalysis ? lastAnalysis : 'Never'}</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={handleOutfitPress}
            testID="outfit-analysis-card"
          >
            <LinearGradient
              colors={[colors.secondaryGradientStart, colors.secondaryGradientEnd]}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Shirt color={colors.white} size={32} />
              <Text style={styles.cardTitle}>Outfit Analysis</Text>
              {outfitScore > 0 && (
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>Last: {outfitScore.toFixed(1)}</Text>
                  <Text style={styles.timeText}>{lastAnalysis ? lastAnalysis : 'Never'}</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.challengeSection}>
          <Text style={styles.sectionTitle}>📅 Today&apos;s Focus</Text>
          <TouchableOpacity 
            style={styles.challengeCard}
            onPress={handleChallengePress}
            testID="challenge-card"
          >
            <View style={styles.challengeHeader}>
              <Trophy color={colors.primary} size={24} />
              <Text style={styles.challengeTitle}>30-Day Glow Challenge</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(streak / 30) * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>Day {streak}/30</Text>
            </View>
            <View style={styles.challengeTask}>
              <Text style={styles.taskText}>✅ Today: Take a beauty selfie</Text>
              <Text style={styles.taskText}>📸 Upload progress photo</Text>
            </View>
            <TouchableOpacity style={styles.completeButton}>
              <Text style={styles.completeButtonText}>Mark Complete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>📈 Your Progress</Text>
          <View style={styles.progressList}>
            <Text style={styles.progressItem}>• Glow score: {glowScore > 0 ? glowScore.toFixed(1) : 'Not analyzed yet'}</Text>
            <Text style={styles.progressItem}>• Outfit score: {outfitScore > 0 ? outfitScore.toFixed(1) : 'Not analyzed yet'}</Text>
            <Text style={styles.progressItem}>• Challenge streak: {streak} days</Text>
          </View>
        </View>
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
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  streak: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '48%',
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginVertical: 8,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  timeText: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
  },
  challengeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  challengeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  challengeTask: {
    marginBottom: 16,
  },
  taskText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  progressItem: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
});