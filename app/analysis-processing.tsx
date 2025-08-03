import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Sparkles } from 'lucide-react-native';

import { useGlowStore, BeautyAnalysis, OutfitAnalysis } from '@/store/glowStore';
import { colors } from '@/constants/colors';
import { analysisService } from '@/services/analysisService';

export default function AnalysisProcessingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUri: string; analysisType: string; event?: string }>();
  const { addBeautyAnalysis, addOutfitAnalysis, incrementStreak, profile } = useGlowStore();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Detecting facial features');
  const [funFact, setFunFact] = useState('Your skin renews every 28 days!');
  const [error, setError] = useState<string | null>(null);
  
  // Fun facts to display during processing
  const funFacts = [
    'Your skin renews every 28 days!',
    'The average person blinks 15-20 times per minute.',
    'Smiling uses 17 muscles, frowning uses 43.',
    'Your eyes can distinguish about 10 million colors.',
    'Facial symmetry is associated with attractiveness across cultures.',
  ];
  
  useEffect(() => {
    const processAnalysis = async () => {
      if (!params.imageUri || !params.analysisType) {
        setError('Missing image or analysis type');
        return;
      }

      try {
        if (params.analysisType === 'beauty') {
          await processBeautyAnalysis();
        } else if (params.analysisType === 'outfit') {
          await processOutfitAnalysis();
        }
      } catch (error) {
        console.error('Analysis processing error:', error);
        setError(error instanceof Error ? error.message : 'Analysis failed');
        Alert.alert(
          'Analysis Failed',
          'We encountered an error while analyzing your photo. Please try again.',
          [
            {
              text: 'Try Again',
              onPress: () => router.back(),
            },
          ]
        );
      }
    };

    const processBeautyAnalysis = async () => {
      // Step 1: Detecting facial features
      setCurrentStep('Detecting facial features');
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Analyzing with Vision API
      setCurrentStep('Analyzing facial features');
      setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: AI analysis
      setCurrentStep('Calculating glow score');
      setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
      setProgress(60);
      
      // Call the actual analysis service
      const analysisResult = await analysisService.analyzeBeautyPhoto(params.imageUri!, profile);
      
      setProgress(90);
      
      // Step 4: Generating recommendations
      setCurrentStep('Generating recommendations');
      setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);
      
      // Create analysis object
      const currentDate = new Date();
      const analysis: BeautyAnalysis = {
        glowScore: analysisResult.glowScore,
        skinQuality: analysisResult.skinQuality,
        symmetry: analysisResult.symmetry,
        eyeBeauty: analysisResult.eyeBeauty,
        lipDefinition: analysisResult.lipDefinition,
        date: currentDate.toLocaleDateString(),
      };
      
      // Save analysis to store
      addBeautyAnalysis(analysis);
      incrementStreak();
      
      // Navigate to results screen
      router.replace({
        pathname: '/analysis-results',
        params: { 
          recommendations: JSON.stringify(analysisResult.recommendations),
          celebrityMatches: JSON.stringify(analysisResult.celebrityMatches || [])
        }
      });
    };

    const processOutfitAnalysis = async () => {
      // Step 1: Detecting clothing items
      setCurrentStep('Detecting clothing items');
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Analyzing with Vision API
      setCurrentStep('Analyzing style elements');
      setFunFact('Color harmony can make or break an outfit!');
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: AI analysis
      setCurrentStep('Calculating style score');
      setFunFact('The right fit can instantly elevate your look!');
      setProgress(60);
      
      // Call the actual analysis service
      const analysisResult = await analysisService.analyzeOutfitPhoto(
        params.imageUri!, 
        params.event || 'Casual', 
        profile
      );
      
      setProgress(90);
      
      // Step 4: Generating suggestions
      setCurrentStep('Generating style suggestions');
      setFunFact('Accessories can transform any basic outfit!');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);
      
      // Create analysis object
      const currentDate = new Date();
      const analysis: OutfitAnalysis = {
        outfitScore: analysisResult.outfitScore,
        colorHarmony: analysisResult.colorHarmony,
        fitStyle: analysisResult.fitStyle,
        eventMatch: analysisResult.eventMatch,
        event: params.event || 'Casual',
        date: currentDate.toLocaleDateString(),
      };
      
      // Save analysis to store
      addOutfitAnalysis(analysis);
      incrementStreak();
      
      // Navigate to results screen
      router.replace({
        pathname: '/outfit-results',
        params: { 
          suggestions: JSON.stringify(analysisResult.suggestions),
          colorPalette: JSON.stringify(analysisResult.colorPalette)
        }
      });
    };
    
    processAnalysis();
  }, [params.imageUri, params.analysisType, params.event, profile, addBeautyAnalysis, addOutfitAnalysis, incrementStreak, router]);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Analyzing',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerLeft: () => null, // Disable back button during processing
        }} 
      />
      <View style={styles.container} testID="analysis-processing-screen">
        {error ? (
          <>
            <Text style={styles.title}>Analysis Failed ❌</Text>
            <Text style={styles.subtitle}>{error}</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>
              {params.analysisType === 'beauty' ? 'Analyzing your beauty... ✨' : 'Analyzing your outfit... 👗'}
            </Text>
            <Text style={styles.subtitle}>This will take a moment</Text>
          </>
        )}
        
        <View style={styles.scanContainer}>
          <View style={styles.scanAnimation}>
            <Sparkles color={colors.primary} size={64} />
            <View style={styles.scanLine} />
          </View>
        </View>
        
        {!error && (
          <View style={styles.stepsContainer}>
            <Text style={[
              styles.stepText, 
              progress >= 30 ? styles.completedStep : {}
            ]}>
              {progress >= 30 ? '✅' : progress >= 10 ? '🔄' : '⏳'} {params.analysisType === 'beauty' ? 'Detecting facial features' : 'Detecting clothing items'}
            </Text>
            
            <Text style={[
              styles.stepText, 
              progress >= 60 ? styles.completedStep : {}
            ]}>
              {progress >= 60 ? '✅' : progress >= 30 ? '🔄' : '⏳'} {params.analysisType === 'beauty' ? 'Analyzing skin quality' : 'Analyzing style elements'}
            </Text>
            
            <Text style={[
              styles.stepText, 
              progress >= 90 ? styles.completedStep : {}
            ]}>
              {progress >= 90 ? '✅' : progress >= 60 ? '🔄' : '⏳'} {params.analysisType === 'beauty' ? 'Calculating glow score' : 'Calculating style score'}
            </Text>
            
            <Text style={[
              styles.stepText, 
              progress >= 100 ? styles.completedStep : {}
            ]}>
              {progress >= 100 ? '✅' : progress >= 90 ? '🔄' : '⏳'} {params.analysisType === 'beauty' ? 'Generating recommendations' : 'Generating suggestions'}
            </Text>
          </View>
        )}
        
        {!error && (
          <>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
            
            <View style={styles.funFactContainer}>
              <Text style={styles.funFactLabel}>💡 Did you know?</Text>
              <Text style={styles.funFactText}>{funFact}</Text>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  scanContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  scanAnimation: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.7,
    top: '50%',
    // Add animation in a real app
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  stepText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  completedStep: {
    color: colors.text,
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  funFactContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  funFactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  funFactText: {
    fontSize: 16,
    color: colors.text,
    fontStyle: 'italic',
  },
});