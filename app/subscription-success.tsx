import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { colors } from '@/constants/colors';

export default function SubscriptionSuccessScreen() {
  const router = useRouter();
  
  useEffect(() => {
    // Trigger success haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleStartExploring = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/');
  };
  
  return (
    <View style={styles.container} testID="subscription-success-screen">
      <View style={styles.content}>
        <Text style={styles.title}>🎉 Welcome!</Text>
        <Text style={styles.subtitle}>You're now Premium!</Text>
        
        <View style={styles.checkContainer}>
          <View style={styles.checkCircle}>
            <Check color={colors.white} size={64} />
          </View>
          <Text style={styles.activatedText}>Subscription Activated</Text>
        </View>
        
        <Text style={styles.featuresTitle}>All premium features unlocked:</Text>
        
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>✨ Unlimited analyses</Text>
          <Text style={styles.featureItem}>🤖 AI beauty coach</Text>
          <Text style={styles.featureItem}>🏆 All challenges</Text>
          <Text style={styles.featureItem}>📊 Detailed insights</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={handleStartExploring}
          testID="start-exploring-button"
        >
          <Text style={styles.exploreButtonText}>Start Exploring! 🚀</Text>
        </TouchableOpacity>
        
        <Text style={styles.receiptText}>Receipt sent to email</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  checkContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  activatedText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  featuresList: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  featureItem: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  exploreButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  receiptText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});