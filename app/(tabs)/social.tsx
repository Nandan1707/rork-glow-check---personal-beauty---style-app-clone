import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Users, Award, TrendingUp } from 'lucide-react-native';

import { useGlowStore } from '@/store/glowStore';
import { colors } from '@/constants/colors';

export default function SocialScreen() {
  const { glowScore } = useGlowStore();

  // Mock data for community stats
  const communityStats = {
    activeUsers: '890k',
    analysesCompleted: '2.3M',
    challengesFinished: '156k',
  };

  // Mock data for leaderboard
  const leaderboard = [
    { id: 1, name: 'Anonymous_User_A', score: 9.4 },
    { id: 2, name: 'Anonymous_User_B', score: 9.2 },
    { id: 3, name: 'Anonymous_User_C', score: 9.1 },
    { id: 4, name: 'Anonymous_User_D', score: 8.9 },
    { id: 5, name: 'Anonymous_User_E', score: 8.7 },
  ];

  // Mock percentile calculation
  const percentile = glowScore > 0 ? 78 : 0;

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Community',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="social-screen">
        <View style={styles.header}>
          <Text style={styles.title}>How You Compare</Text>
          <Text style={styles.subtitle}>See how you stack up against similar users</Text>
        </View>

        <View style={styles.communityCard}>
          <View style={styles.communityHeader}>
            <Users color={colors.primary} size={24} />
            <Text style={styles.communityTitle}>Your Community</Text>
          </View>
          <Text style={styles.communitySubtitle}>(Similar users to you)</Text>

          {glowScore > 0 ? (
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Your Stats 📊</Text>
              <Text style={styles.statText}>Glow Score: {glowScore.toFixed(1)}/10</Text>
              <Text style={styles.statText}>You&apos;re in {percentile}th percentile</Text>

              <View style={styles.comparisonContainer}>
                <View style={styles.comparisonLabels}>
                  <Text style={styles.comparisonLabel}>Average</Text>
                  <Text style={styles.comparisonLabel}>You</Text>
                  <Text style={styles.comparisonLabel}>Top 10%</Text>
                </View>
                <View style={styles.comparisonValues}>
                  <Text style={styles.comparisonValue}>7.1</Text>
                  <Text style={[styles.comparisonValue, styles.yourValue]}>★{glowScore.toFixed(1)}</Text>
                  <Text style={styles.comparisonValue}>9.3</Text>
                </View>
                <View style={styles.comparisonBars}>
                  <View style={[styles.comparisonBar, { width: '71%' }]} />
                  <View style={[styles.comparisonBar, styles.yourBar, { width: `${glowScore * 10}%` }]} />
                  <View style={[styles.comparisonBar, { width: '93%' }]} />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No data yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Complete your first beauty analysis to see how you compare
              </Text>
            </View>
          )}
        </View>

        {glowScore > 0 && (
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>💡 Your Insights</Text>
            <Text style={styles.insightText}>• You&apos;re top 25% in skin quality!</Text>
            <Text style={styles.insightText}>• Focus on symmetry to reach top tier</Text>
            <Text style={styles.insightText}>• Your style scores are above average</Text>
          </View>
        )}

        <View style={styles.statsCard}>
          <Text style={styles.statsCardTitle}>📈 Community Stats</Text>
          <View style={styles.statRow}>
            <Users color={colors.textSecondary} size={16} />
            <Text style={styles.statRowText}>
              {communityStats.activeUsers} active glow warriors
            </Text>
          </View>
          <View style={styles.statRow}>
            <TrendingUp color={colors.textSecondary} size={16} />
            <Text style={styles.statRowText}>
              {communityStats.analysesCompleted} glow checks completed
            </Text>
          </View>
          <View style={styles.statRow}>
            <Award color={colors.textSecondary} size={16} />
            <Text style={styles.statRowText}>
              {communityStats.challengesFinished} challenges finished
            </Text>
          </View>
        </View>

        <View style={styles.leaderboardCard}>
          <Text style={styles.leaderboardTitle}>🏆 Weekly Leaderboard</Text>
          {leaderboard.map((user, index) => (
            <View key={user.id} style={styles.leaderboardRow}>
              <Text style={styles.leaderboardRank}>{index + 1}.</Text>
              <Text style={styles.leaderboardName}>{user.name}</Text>
              <Text style={styles.leaderboardScore}>{user.score.toFixed(1)} ⭐</Text>
            </View>
          ))}
          {glowScore > 0 && (
            <View style={[styles.leaderboardRow, styles.yourRank]}>
              <Text style={styles.leaderboardRank}>47.</Text>
              <Text style={[styles.leaderboardName, styles.yourName]}>You!</Text>
              <Text style={styles.leaderboardScore}>{glowScore.toFixed(1)} ⭐</Text>
            </View>
          )}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  communityCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  communitySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    marginTop: 8,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  comparisonContainer: {
    marginTop: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
  },
  comparisonLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  comparisonLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  comparisonValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  yourValue: {
    color: colors.primary,
  },
  comparisonBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 16,
  },
  comparisonBar: {
    height: 16,
    backgroundColor: colors.gray,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 2,
  },
  yourBar: {
    backgroundColor: colors.primary,
  },
  insightsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  insightText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statRowText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  leaderboardCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  leaderboardRank: {
    width: 30,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  leaderboardScore: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  yourRank: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginTop: 8,
    borderBottomWidth: 0,
  },
  yourName: {
    fontWeight: '600',
    color: colors.primary,
  },
});