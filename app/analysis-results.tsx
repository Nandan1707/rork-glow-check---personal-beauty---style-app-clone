import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Share2, Camera, Shirt } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useGlowStore } from '@/store/glowStore';
import { colors } from '@/constants/colors';

export default function AnalysisResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recommendations?: string; celebrityMatches?: string }>();
  const { beautyAnalyses, isPremium } = useGlowStore();
  
  // Get the latest analysis
  const analysis = beautyAnalyses.length > 0 ? beautyAnalyses[0] : null;
  
  if (!analysis) {
    router.replace('/');
    return null;
  }
  
  // Get recommendations from params or use defaults
  const getRecommendations = () => {
    if (params.recommendations) {
      try {
        const recommendations = JSON.parse(params.recommendations);
        return recommendations.map((rec: string, index: number) => ({
          category: `Tip ${index + 1}`,
          tip: rec,
          tags: ['personalized'],
        }));
      } catch (error) {
        console.error('Error parsing recommendations:', error);
      }
    }
    
    // Default recommendations
    return [
      {
        category: 'Skin Brightening',
        tip: 'Try vitamin C serum in mornings for a brighter complexion',
        tags: ['skincare', 'brightening'],
      },
      {
        category: 'Facial Symmetry',
        tip: 'Use contouring to enhance your natural bone structure',
        tags: ['makeup', 'contouring'],
      },
      {
        category: 'Eye Enhancement',
        tip: 'Curl your lashes before applying mascara for an eye-opening effect',
        tags: ['makeup', 'eyes'],
      },
    ];
  };
  
  const tips = getRecommendations();
  
  // Get celebrity matches if available
  const getCelebrityMatches = () => {
    if (params.celebrityMatches) {
      try {
        return JSON.parse(params.celebrityMatches);
      } catch (error) {
        console.error('Error parsing celebrity matches:', error);
      }
    }
    return [];
  };
  
  const celebrityMatches = getCelebrityMatches();
  
  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      await Share.share({
        message: `I just got a Glow Score of ${analysis.glowScore.toFixed(1)}/10 on Glow Check! #GlowCheck #BeautyAnalysis`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const handleStartJourney = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/challenges');
  };
  
  const handleCheckOutfit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/outfit-analysis');
  };
  
  const handleRetake = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/beauty-analysis');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Your Glow Score',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerLeft: () => null, // Disable back button
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Share2 color={colors.primary} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="analysis-results-screen">
        <View style={styles.scoreContainer}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.scoreGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.scoreValue}>{analysis.glowScore.toFixed(1)}</Text>
            <Text style={styles.scoreLabel}>
              {analysis.glowScore >= 9 ? 'STUNNING!' : 
               analysis.glowScore >= 8 ? 'AMAZING GLOW!' : 
               analysis.glowScore >= 7 ? 'BEAUTIFUL!' : 'NICE!'}
            </Text>
            <Text style={styles.scoreMax}>out of 10</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.metricsContainer}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>🧴 Skin Quality:</Text>
            <Text style={styles.metricValue}>{analysis.skinQuality.toFixed(1)}/10</Text>
            <Text style={styles.metricEmoji}>⭐</Text>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>⚖️ Symmetry:</Text>
            <Text style={styles.metricValue}>{analysis.symmetry.toFixed(1)}/10</Text>
            <Text style={styles.metricEmoji}>📈</Text>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>👁️ Eye Beauty:</Text>
            <Text style={styles.metricValue}>{analysis.eyeBeauty.toFixed(1)}/10</Text>
            <Text style={styles.metricEmoji}>🔥</Text>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>💋 Lip Definition:</Text>
            <Text style={styles.metricValue}>{analysis.lipDefinition.toFixed(1)}/10</Text>
            <Text style={styles.metricEmoji}>✨</Text>
          </View>
        </View>
        
        <Text style={styles.tipsTitle}>✨ Personalized for You ✨</Text>
        
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipCategory}>💡 {tip.category}</Text>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>💾</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.tipText}>{tip.tip}</Text>
            <View style={styles.tagsContainer}>
              {tip.tags.map((tag, tagIndex) => (
                <Text key={tagIndex} style={styles.tagText}>#{tag}</Text>
              ))}
            </View>
          </View>
        ))}
        
        {celebrityMatches.length > 0 && (
          <View style={styles.celebrityContainer}>
            <Text style={styles.celebrityTitle}>🌟 Celebrity Matches</Text>
            <View style={styles.celebrityList}>
              {celebrityMatches.map((celebrity: string, index: number) => (
                <Text key={index} style={styles.celebrityName}>• {celebrity}</Text>
              ))}
            </View>
          </View>
        )}
        
        {!isPremium && (
          <TouchableOpacity 
            style={styles.premiumCard}
            onPress={() => router.push('/premium')}
            testID="premium-card"
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.premiumGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.premiumTitle}>✨ Unlock More Insights</Text>
              <Text style={styles.premiumText}>
                Get detailed analysis, celebrity matches, and personalized recommendations with Premium
              </Text>
              <View style={styles.premiumButton}>
                <Text style={styles.premiumButtonText}>Upgrade Now</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleStartJourney}
            testID="start-journey-button"
          >
            <Text style={styles.actionButtonText}>Start Glow Journey</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCheckOutfit}
            testID="check-outfit-button"
          >
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonText}>Check Your Outfit</Text>
              <Shirt color={colors.primary} size={16} style={styles.actionButtonIcon} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleRetake}
            testID="retake-button"
          >
            <View style={styles.actionButtonContent}>
              <Text style={styles.secondaryButtonText}>Retake Photo</Text>
              <Camera color={colors.primary} size={16} style={styles.actionButtonIcon} />
            </View>
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
  shareButton: {
    marginRight: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreGradient: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  scoreMax: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
  },
  metricsContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  metricEmoji: {
    fontSize: 16,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    fontSize: 18,
  },
  tipText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  premiumCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  premiumGradient: {
    padding: 20,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  premiumText: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 16,
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.white,
  },
  premiumButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonIcon: {
    marginLeft: 8,
  },
  celebrityContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  celebrityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  celebrityList: {
    marginLeft: 8,
  },
  celebrityName: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
});