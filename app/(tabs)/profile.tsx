import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Settings, TrendingUp, Edit3 } from 'lucide-react-native';

import { useGlowStore } from '@/store/glowStore';
import { colors } from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { name, streak, beautyAnalyses, outfitAnalyses, isPremium } = useGlowStore();

  const handleEditProfile = () => {
    // Navigate to modal for editing profile
    router.push('/modal');
  };

  const handleViewHistory = () => {
    // Navigate to modal for viewing history
    router.push('/modal');
  };

  const handleSettingsPress = () => {
    // Navigate to modal for settings
    router.push('/modal');
  };

  // Mock data for achievements
  const achievements = [
    { id: 1, name: 'First Glow', icon: '🌟' },
    { id: 2, name: 'Makeup Novice', icon: '💄' },
    { id: 3, name: 'Week Warrior', icon: '🔥' },
  ];

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerRight: () => (
            <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
              <Settings color={colors.primary} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="profile-screen">
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>{name ? name.charAt(0).toUpperCase() : '?'}</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{name || 'Beautiful'}</Text>
          <Text style={styles.profileUsername}>@{name ? name.toLowerCase().replace(' ', '_') : 'user'}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>day streak 🔥</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{(beautyAnalyses.length * 50) + (outfitAnalyses.length * 30)}</Text>
              <Text style={styles.statLabel}>points earned ⭐</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{achievements.length}</Text>
              <Text style={styles.statLabel}>badges 🏆</Text>
            </View>
          </View>
        </View>

        <View style={styles.journeyCard}>
          <View style={styles.cardHeader}>
            <TrendingUp color={colors.primary} size={20} />
            <Text style={styles.cardTitle}>Your Journey</Text>
          </View>
          
          <View style={styles.journeyItem}>
            <Text style={styles.journeyLabel}>Glow Score Progress:</Text>
            <View style={styles.progressText}>
              {beautyAnalyses.length > 0 ? (
                <Text style={styles.journeyValue}>
                  {beautyAnalyses.length > 2 ? beautyAnalyses[2].glowScore.toFixed(1) : '0.0'} → 
                  {beautyAnalyses.length > 1 ? beautyAnalyses[1].glowScore.toFixed(1) : '0.0'} → 
                  {beautyAnalyses[0].glowScore.toFixed(1)} 
                  <Text style={styles.trendingIcon}>📈</Text>
                </Text>
              ) : (
                <Text style={styles.journeyValue}>No data yet</Text>
              )}
            </View>
          </View>
          
          <View style={styles.journeyItem}>
            <Text style={styles.journeyLabel}>Analyses:</Text>
            <Text style={styles.journeyValue}>
              {beautyAnalyses.length} beauty, {outfitAnalyses.length} outfit
            </Text>
          </View>
          
          <View style={styles.journeyItem}>
            <Text style={styles.journeyLabel}>Challenges:</Text>
            <Text style={styles.journeyValue}>1 active, 0 done</Text>
          </View>
          
          <View style={styles.journeyItem}>
            <Text style={styles.journeyLabel}>Tips saved:</Text>
            <Text style={styles.journeyValue}>{beautyAnalyses.length * 3}</Text>
          </View>
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>🏅 Your Achievements</Text>
          <View style={styles.achievementsRow}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementBadge}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementName}>{achievement.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {(beautyAnalyses.length > 0 || outfitAnalyses.length > 0) && (
          <View style={styles.looksSection}>
            <Text style={styles.sectionTitle}>📸 Your Best Looks</Text>
            <View style={styles.looksGrid}>
              {/* This would be populated with actual photos from analyses */}
              <View style={styles.lookItem}>
                <View style={styles.lookPlaceholder}>
                  <Text style={styles.lookScore}>8.2</Text>
                </View>
              </View>
              <View style={styles.lookItem}>
                <View style={styles.lookPlaceholder}>
                  <Text style={styles.lookScore}>7.9</Text>
                </View>
              </View>
              <View style={styles.lookItem}>
                <View style={styles.lookPlaceholder}>
                  <Text style={styles.lookScore}>8.5</Text>
                </View>
              </View>
              <View style={styles.lookItem}>
                <View style={styles.lookPlaceholder}>
                  <Text style={styles.lookScore}>7.8</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={handleEditProfile}
            testID="edit-profile-button"
          >
            <Edit3 color={colors.primary} size={16} />
            <Text style={styles.profileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={handleViewHistory}
            testID="view-history-button"
          >
            <TrendingUp color={colors.primary} size={16} />
            <Text style={styles.profileButtonText}>View History</Text>
          </TouchableOpacity>
        </View>

        {!isPremium && (
          <TouchableOpacity 
            style={styles.premiumButton}
            onPress={() => router.push('/premium')}
            testID="premium-button"
          >
            <Text style={styles.premiumButtonText}>✨ Upgrade to Premium</Text>
          </TouchableOpacity>
        )}
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
  settingsButton: {
    marginRight: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
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
  journeyCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  journeyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  journeyLabel: {
    fontSize: 16,
    color: colors.text,
  },
  journeyValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  progressText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingIcon: {
    marginLeft: 4,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  achievementsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achievementBadge: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  looksSection: {
    marginBottom: 24,
  },
  looksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  lookItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 12,
  },
  lookPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lookScore: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  premiumButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});