import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Trophy, Award, Users, Calendar, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useGlowStore } from '@/store/glowStore';
import { colors } from '@/constants/colors';

export default function ChallengesScreen() {
  const router = useRouter();
  const { streak, isPremium } = useGlowStore();
  
  const handleContinueChallenge = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // In a real app, this would navigate to the daily challenge screen
    console.log('Continuing challenge');
  };
  
  const handleJoinChallenge = (challengeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!isPremium) {
      router.push('/premium');
      return;
    }
    
    // In a real app, this would join the challenge
    console.log('Joining challenge', challengeId);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Glow Challenges',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="challenges-screen">
        <Text style={styles.sectionTitle}>🏆 Active Challenge</Text>
        
        <View style={styles.activeChallenge}>
          <Text style={styles.challengeTitle}>30-Day Glow-Up Challenge</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(streak / 30) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>Day {streak}/30</Text>
          </View>
          
          <View style={styles.challengeTasks}>
            <Text style={styles.taskText}>✅ Yesterday: Face mask</Text>
            <Text style={styles.taskText}>📅 Today: Skincare routine</Text>
            <Text style={styles.taskText}>📈 Tomorrow: Progress photo</Text>
          </View>
          
          <View style={styles.challengeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>🔥 {streak}</Text>
              <Text style={styles.statLabel}>days</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>⭐ {streak * 15}</Text>
              <Text style={styles.statLabel}>points</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinueChallenge}
            testID="continue-challenge-button"
          >
            <Text style={styles.continueButtonText}>Continue Challenge</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>🌟 Available Challenges</Text>
        
        <View style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View>
              <Text style={styles.challengeName}>💄 Makeup Mastery</Text>
              <Text style={styles.challengeDuration}>14 Days</Text>
            </View>
            {isPremium ? null : (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.challengeDescription}>
            Learn professional makeup techniques from basic to advanced
          </Text>
          
          <View style={styles.challengeMeta}>
            <View style={styles.metaItem}>
              <Users color={colors.textSecondary} size={16} />
              <Text style={styles.metaText}>2.4k joined</Text>
            </View>
            <View style={styles.metaItem}>
              <Trophy color={colors.textSecondary} size={16} />
              <Text style={styles.metaText}>Earn Makeup Pro badge</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => handleJoinChallenge('makeup-mastery')}
            testID="join-makeup-button"
          >
            <Text style={styles.joinButtonText}>
              {isPremium ? 'Join Challenge' : 'Unlock with Premium'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View>
              <Text style={styles.challengeName}>👗 Style Challenge</Text>
              <Text style={styles.challengeDuration}>21 Days</Text>
            </View>
            {isPremium ? null : (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.challengeDescription}>
            Build your perfect capsule wardrobe and learn to style any outfit
          </Text>
          
          <View style={styles.challengeMeta}>
            <View style={styles.metaItem}>
              <Users color={colors.textSecondary} size={16} />
              <Text style={styles.metaText}>1.8k joined</Text>
            </View>
            <View style={styles.metaItem}>
              <Trophy color={colors.textSecondary} size={16} />
              <Text style={styles.metaText}>Earn Fashion Icon badge</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => handleJoinChallenge('style-challenge')}
            testID="join-style-button"
          >
            <Text style={styles.joinButtonText}>
              {isPremium ? 'Join Challenge' : 'Unlock with Premium'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View>
              <Text style={styles.challengeName}>✨ Skincare Reset</Text>
              <Text style={styles.challengeDuration}>28 Days</Text>
            </View>
            {isPremium ? null : (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.challengeDescription}>
            Transform your skin with a complete skincare routine overhaul
          </Text>
          
          <View style={styles.challengeMeta}>
            <View style={styles.metaItem}>
              <Users color={colors.textSecondary} size={16} />
              <Text style={styles.metaText}>3.2k joined</Text>
            </View>
            <View style={styles.metaItem}>
              <Trophy color={colors.textSecondary} size={16} />
              <Text style={styles.metaText}>Earn Glow Goddess badge</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => handleJoinChallenge('skincare-reset')}
            testID="join-skincare-button"
          >
            <Text style={styles.joinButtonText}>
              {isPremium ? 'Join Challenge' : 'Unlock with Premium'}
            </Text>
          </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  activeChallenge: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
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
  challengeTasks: {
    marginBottom: 16,
  },
  taskText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  challengeStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.lightGray,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  challengeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  challengeName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  challengeDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  challengeDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  challengeMeta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  joinButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});