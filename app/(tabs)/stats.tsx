import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { BarChart2, TrendingUp } from 'lucide-react-native';

import { useGlowStore } from '@/store/glowStore';
import { colors } from '@/constants/colors';

export default function StatsScreen() {
  const { glowScore, outfitScore, beautyAnalyses, outfitAnalyses } = useGlowStore();

  const hasBeautyData = beautyAnalyses.length > 0;
  const hasOutfitData = outfitAnalyses.length > 0;

  // Get the latest beauty analysis
  const latestBeautyAnalysis = hasBeautyData ? beautyAnalyses[0] : null;

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Your Stats',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="stats-screen">
        <View style={styles.header}>
          <Text style={styles.title}>Your Beauty Journey</Text>
          <Text style={styles.subtitle}>Track your progress over time</Text>
        </View>

        {!hasBeautyData && !hasOutfitData ? (
          <View style={styles.emptyState}>
            <BarChart2 color={colors.gray} size={64} />
            <Text style={styles.emptyStateText}>No data yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Complete your first beauty or outfit analysis to see your stats
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.scoreCard}>
              <View style={styles.scoreSection}>
                <Text style={styles.scoreLabel}>Glow Score</Text>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreValue}>{glowScore.toFixed(1)}</Text>
                  <Text style={styles.scoreMax}>/10</Text>
                </View>
                <Text style={styles.scoreDate}>
                  {hasBeautyData ? `Last updated: ${beautyAnalyses[0].date}` : 'Not analyzed yet'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.scoreSection}>
                <Text style={styles.scoreLabel}>Outfit Score</Text>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreValue}>{outfitScore.toFixed(1)}</Text>
                  <Text style={styles.scoreMax}>/10</Text>
                </View>
                <Text style={styles.scoreDate}>
                  {hasOutfitData ? `Last updated: ${outfitAnalyses[0].date}` : 'Not analyzed yet'}
                </Text>
              </View>
            </View>

            {latestBeautyAnalysis && (
              <View style={styles.detailsCard}>
                <Text style={styles.detailsTitle}>Beauty Breakdown</Text>
                
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Skin Quality</Text>
                  <View style={styles.metricBarContainer}>
                    <View 
                      style={[
                        styles.metricBar, 
                        { width: `${(latestBeautyAnalysis.skinQuality / 10) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.metricValue}>{latestBeautyAnalysis.skinQuality.toFixed(1)}</Text>
                </View>
                
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Symmetry</Text>
                  <View style={styles.metricBarContainer}>
                    <View 
                      style={[
                        styles.metricBar, 
                        { width: `${(latestBeautyAnalysis.symmetry / 10) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.metricValue}>{latestBeautyAnalysis.symmetry.toFixed(1)}</Text>
                </View>
                
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Eye Beauty</Text>
                  <View style={styles.metricBarContainer}>
                    <View 
                      style={[
                        styles.metricBar, 
                        { width: `${(latestBeautyAnalysis.eyeBeauty / 10) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.metricValue}>{latestBeautyAnalysis.eyeBeauty.toFixed(1)}</Text>
                </View>
                
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Lip Definition</Text>
                  <View style={styles.metricBarContainer}>
                    <View 
                      style={[
                        styles.metricBar, 
                        { width: `${(latestBeautyAnalysis.lipDefinition / 10) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.metricValue}>{latestBeautyAnalysis.lipDefinition.toFixed(1)}</Text>
                </View>
              </View>
            )}

            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <TrendingUp color={colors.primary} size={24} />
                <Text style={styles.progressTitle}>Your Progress</Text>
              </View>
              <Text style={styles.progressText}>
                {hasBeautyData 
                  ? `You've completed ${beautyAnalyses.length} beauty ${beautyAnalyses.length === 1 ? 'analysis' : 'analyses'}`
                  : 'No beauty analyses yet'}
              </Text>
              <Text style={styles.progressText}>
                {hasOutfitData 
                  ? `You've completed ${outfitAnalyses.length} outfit ${outfitAnalyses.length === 1 ? 'analysis' : 'analyses'}`
                  : 'No outfit analyses yet'}
              </Text>
              <Text style={styles.progressTip}>
                Complete regular analyses to track your beauty journey over time
              </Text>
            </View>
          </>
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginVertical: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scoreSection: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.lightGray,
    marginHorizontal: 10,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  scoreMax: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
  },
  scoreDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailsCard: {
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
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    width: 100,
    fontSize: 14,
    color: colors.text,
  },
  metricBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  metricBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  metricValue: {
    width: 30,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
  },
  progressCard: {
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
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  progressText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  progressTip: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});