import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Share, Image } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Share2, Camera, Save } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useGlowStore, OutfitAnalysis } from '@/store/glowStore';
import { colors } from '@/constants/colors';

export default function OutfitResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ suggestions?: string; colorPalette?: string }>();
  const { outfitAnalyses, addOutfitAnalysis, incrementStreak } = useGlowStore();
  
  // Get the latest outfit analysis
  const analysis = outfitAnalyses.length > 0 ? outfitAnalyses[0] : null;
  
  if (!analysis) {
    router.replace('/');
    return null;
  }
  
  // Mock outfit photo
  const outfitPhoto = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  
  // Get suggestions from params or use defaults
  const getSuggestions = () => {
    if (params.suggestions) {
      try {
        return JSON.parse(params.suggestions);
      } catch (error) {
        console.error('Error parsing suggestions:', error);
      }
    }
    return [
      'Try adding a statement accessory',
      'Consider different shoes for better proportion',
      'A belt could help define your waist',
    ];
  };
  
  // Get color palette from params or use defaults
  const getColorPalette = () => {
    if (params.colorPalette) {
      try {
        return JSON.parse(params.colorPalette);
      } catch (error) {
        console.error('Error parsing color palette:', error);
      }
    }
    return ['#FF6B6B', '#4ECDC4', '#FFFFFF'];
  };
  
  const suggestions = getSuggestions();
  const colorPalette = getColorPalette();
  
  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      await Share.share({
        message: `I just got an Outfit Score of ${analysis.outfitScore.toFixed(1)}/10 on Glow Check! #GlowCheck #OutfitAnalysis`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const handleSaveToCloset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // In a real app, this would save the outfit to the user's closet
    console.log('Saving to closet');
  };
  
  const handleTryAnother = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/outfit-analysis');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Outfit Analysis',
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
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="outfit-results-screen">
        <View style={styles.photoContainer}>
          <Image source={{ uri: outfitPhoto }} style={styles.outfitPhoto} />
          <View style={styles.scoreOverlay}>
            <Text style={styles.scoreLabel}>Style Score:</Text>
            <Text style={styles.scoreValue}>⭐ {analysis.outfitScore.toFixed(1)}/10</Text>
            <Text style={styles.eventMatch}>Event Match: {analysis.eventMatch >= 8 ? '✅ Excellent' : analysis.eventMatch >= 7 ? '💯 Good' : '🔄 Okay'}</Text>
          </View>
        </View>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>🎯 Quick Summary</Text>
          <Text style={styles.summaryText}>
            {analysis.eventMatch >= 8 
              ? `Perfect choice for ${analysis.event.toLowerCase()}! Your style is on point.`
              : analysis.eventMatch >= 7
              ? `Good choice for ${analysis.event.toLowerCase()}! Your colors work well together.`
              : `Nice outfit! Consider some adjustments for ${analysis.event.toLowerCase()}.`}
          </Text>
        </View>
        
        <Text style={styles.sectionTitle}>📊 Detailed Analysis</Text>
        
        <View style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <Text style={styles.analysisTitle}>🎨 Color Harmony: {analysis.colorHarmony.toFixed(1)}/10</Text>
            <Text style={styles.analysisStatus}>{analysis.colorHarmony >= 8 ? '✅' : analysis.colorHarmony >= 7 ? '💯' : '🔄'}</Text>
          </View>
          <View style={styles.colorPalette}>
            {colorPalette.slice(0, 3).map((color, index) => (
              <View key={index} style={[styles.colorSwatch, { backgroundColor: color }]} />
            ))}
          </View>
          <Text style={styles.analysisText}>
            {analysis.colorHarmony >= 8 
              ? 'Perfect complementary colors that work well together.'
              : analysis.colorHarmony >= 7
              ? 'Good color combination with nice harmony.'
              : 'Colors work but could be more harmonious.'}
          </Text>
        </View>
        
        <View style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <Text style={styles.analysisTitle}>👔 Fit & Style: {analysis.fitStyle.toFixed(1)}/10</Text>
            <Text style={styles.analysisStatus}>{analysis.fitStyle >= 8 ? '✅' : analysis.fitStyle >= 7 ? '📈' : '🔄'}</Text>
          </View>
          <Text style={styles.analysisText}>
            {analysis.fitStyle >= 8 
              ? 'Excellent fit and style! Everything looks perfectly tailored.'
              : analysis.fitStyle >= 7
              ? 'Good fit overall, with room for minor improvements.'
              : 'Decent fit, but could be more tailored for a polished look.'}
          </Text>
        </View>
        
        <View style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <Text style={styles.analysisTitle}>🎭 Event Match: {analysis.eventMatch.toFixed(1)}/10</Text>
            <Text style={styles.analysisStatus}>{analysis.eventMatch >= 8 ? '🎯' : analysis.eventMatch >= 7 ? '💯' : '🔄'}</Text>
          </View>
          <Text style={styles.analysisText}>
            {analysis.eventMatch >= 8 
              ? `Perfect for ${analysis.event.toLowerCase()} - exactly the right vibe and formality level.`
              : analysis.eventMatch >= 7
              ? `Good choice for ${analysis.event.toLowerCase()} - appropriate and stylish.`
              : `Decent for ${analysis.event.toLowerCase()}, but could be more event-appropriate.`}
          </Text>
        </View>
        
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>💡 Suggestions</Text>
          {suggestions.map((suggestion: string, index: number) => (
            <Text key={index} style={styles.suggestionItem}>• {suggestion}</Text>
          ))}
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleSaveToCloset}
            testID="save-closet-button"
          >
            <View style={styles.actionButtonContent}>
              <Save color={colors.white} size={16} />
              <Text style={styles.actionButtonText}>Save to Closet</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleTryAnother}
            testID="try-another-button"
          >
            <View style={styles.actionButtonContent}>
              <Camera color={colors.primary} size={16} />
              <Text style={styles.secondaryButtonText}>Try Another</Text>
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
  photoContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  outfitPhoto: {
    width: '100%',
    height: 400,
  },
  scoreOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  scoreLabel: {
    color: colors.white,
    fontSize: 14,
  },
  scoreValue: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  eventMatch: {
    color: colors.white,
    fontSize: 14,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  analysisCard: {
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
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  analysisStatus: {
    fontSize: 16,
  },
  colorPalette: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  analysisText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  suggestionsContainer: {
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
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  suggestionItem: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 4,
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
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});