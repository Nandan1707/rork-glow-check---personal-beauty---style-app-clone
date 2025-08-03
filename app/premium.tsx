import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useGlowStore } from '@/store/glowStore';
import { colors } from '@/constants/colors';

export default function PremiumScreen() {
  const router = useRouter();
  const { setPremium } = useGlowStore();
  const [selectedPlan, setSelectedPlan] = React.useState('weekly');
  
  const handleClose = () => {
    router.back();
  };
  
  const handlePlanSelect = (plan: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(plan);
  };
  
  const handleSubscribe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // In a real app, this would handle the subscription process
    // For now, we'll just set the premium status to true
    setPremium(true);
    
    // Navigate to subscription success screen
    router.replace('/subscription-success');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: '',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerLeft: () => (
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X color={colors.text} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="premium-screen">
        <Text style={styles.title}>Unlock Your Full Potential</Text>
        
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.premiumHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.premiumTitle}>✨ Glow Check Premium</Text>
        </LinearGradient>
        
        <View style={styles.resultsPreview}>
          <Text style={styles.previewTitle}>Your Results:</Text>
          <Text style={styles.previewScore}>Glow Score: 8.2</Text>
          <View style={styles.blurredDetails}>
            <Text style={styles.blurredText}>Detailed analysis</Text>
            <Text style={styles.blurredText}>Personalized recommendations</Text>
            <Text style={styles.blurredText}>Celebrity matches</Text>
          </View>
          <Text style={styles.previewQuestion}>Want to see more? ⬇️</Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>🎁 Premium Includes:</Text>
          
          <View style={styles.featureRow}>
            <Check color={colors.success} size={20} />
            <Text style={styles.featureText}>Unlimited beauty & outfit scans</Text>
          </View>
          
          <View style={styles.featureRow}>
            <Check color={colors.success} size={20} />
            <Text style={styles.featureText}>Detailed analysis breakdown</Text>
          </View>
          
          <View style={styles.featureRow}>
            <Check color={colors.success} size={20} />
            <Text style={styles.featureText}>Personalized recommendations</Text>
          </View>
          
          <View style={styles.featureRow}>
            <Check color={colors.success} size={20} />
            <Text style={styles.featureText}>AI beauty coach</Text>
          </View>
          
          <View style={styles.featureRow}>
            <Check color={colors.success} size={20} />
            <Text style={styles.featureText}>All glow challenges</Text>
          </View>
          
          <View style={styles.featureRow}>
            <Check color={colors.success} size={20} />
            <Text style={styles.featureText}>Celebrity face matches</Text>
          </View>
          
          <View style={styles.featureRow}>
            <Check color={colors.success} size={20} />
            <Text style={styles.featureText}>Progress tracking</Text>
          </View>
          
          <View style={styles.featureRow}>
            <Check color={colors.success} size={20} />
            <Text style={styles.featureText}>Priority support</Text>
          </View>
        </View>
        
        <Text style={styles.plansTitle}>💎 Choose Your Plan</Text>
        
        <TouchableOpacity 
          style={[
            styles.planCard, 
            selectedPlan === 'weekly' ? styles.selectedPlan : {}
          ]}
          onPress={() => handlePlanSelect('weekly')}
          testID="weekly-plan"
        >
          <View style={styles.planHeader}>
            <Text style={styles.planPopular}>⭐ POPULAR</Text>
            <Text style={styles.planName}>Weekly: $9.99</Text>
            <Text style={styles.planTrial}>3-day free trial</Text>
          </View>
          <TouchableOpacity 
            style={styles.planButton}
            onPress={handleSubscribe}
            testID="start-trial-button"
          >
            <Text style={styles.planButtonText}>Start Free Trial</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.planCard, 
            selectedPlan === 'monthly' ? styles.selectedPlan : {}
          ]}
          onPress={() => handlePlanSelect('monthly')}
          testID="monthly-plan"
        >
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Monthly: $29.99</Text>
            <Text style={styles.planSavings}>Save 25%</Text>
          </View>
          <TouchableOpacity 
            style={styles.planButton}
            onPress={handleSubscribe}
            testID="subscribe-monthly-button"
          >
            <Text style={styles.planButtonText}>Subscribe Monthly</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        
        <Text style={styles.termsText}>
          Cancel anytime • Secure payment
        </Text>
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
  closeButton: {
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  premiumHeader: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  resultsPreview: {
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
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  previewScore: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  blurredDetails: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  blurredText: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 8,
  },
  previewQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  plansTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlan: {
    borderColor: colors.primary,
  },
  planHeader: {
    marginBottom: 16,
  },
  planPopular: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  planTrial: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  planSavings: {
    fontSize: 14,
    color: colors.success,
  },
  planButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  planButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
});