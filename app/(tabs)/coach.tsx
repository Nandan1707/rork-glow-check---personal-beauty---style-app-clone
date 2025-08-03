import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Play, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useGlowStore } from '@/store/glowStore';
import { colors } from '@/constants/colors';

export default function CoachScreen() {
  const router = useRouter();
  const { name, isPremium } = useGlowStore();
  const [currentWeek] = useState(3);

  // Mock coaching data
  const coachingData = {
    name: 'Sofia',
    message: `Good morning, ${name || 'Beautiful'}! Ready for Week ${currentWeek} of your glow-up journey? Today we're focusing on contouring techniques for your face shape.`,
    lesson: {
      title: 'Contouring for Oval Faces',
      duration: '4 min',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    assignment: [
      'Watch the video lesson',
      'Practice contour technique',
      'Upload before/after photos',
      'Get personalized feedback',
    ],
  };

  const handleStartLesson = () => {
    if (!isPremium) {
      router.push('/premium');
      return;
    }
    // Navigate to lesson
    console.log('Starting lesson');
  };

  const handleUploadPhotos = () => {
    if (!isPremium) {
      router.push('/premium');
      return;
    }
    // Navigate to photo upload
    console.log('Uploading photos');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Beauty Coach',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="coach-screen">
        <View style={styles.header}>
          <Text style={styles.title}>Meet {coachingData.name}</Text>
          <Text style={styles.subtitle}>Your Personal Coach</Text>
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageText}>&quot;{coachingData.message}&quot;</Text>
          <Text style={styles.messageAuthor}>- Coach {coachingData.name}</Text>
        </View>

        <Text style={styles.sectionTitle}>📚 Today&apos;s Lesson</Text>
        <View style={styles.lessonCard}>
          <Image 
            source={{ uri: coachingData.lesson.thumbnail }} 
            style={styles.lessonThumbnail}
          />
          <View style={styles.lessonInfo}>
            <Text style={styles.lessonTitle}>{coachingData.lesson.title}</Text>
            <Text style={styles.lessonMeta}>
              {coachingData.lesson.duration} video • {coachingData.lesson.level} level
            </Text>
            <TouchableOpacity 
              style={styles.lessonButton}
              onPress={handleStartLesson}
              testID="start-lesson-button"
            >
              {isPremium ? (
                <View style={styles.buttonContent}>
                  <Play color={colors.white} size={16} />
                  <Text style={styles.buttonText}>Start Lesson</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Lock color={colors.white} size={16} />
                  <Text style={styles.buttonText}>Premium Feature</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>📝 Practice Assignment</Text>
        <View style={styles.assignmentCard}>
          {coachingData.assignment.map((item, index) => (
            <Text key={index} style={styles.assignmentItem}>• {item}</Text>
          ))}
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleUploadPhotos}
            testID="upload-photos-button"
          >
            {isPremium ? (
              <Text style={styles.uploadButtonText}>Upload Practice Photos</Text>
            ) : (
              <View style={styles.buttonContent}>
                <Lock color={colors.white} size={16} />
                <Text style={styles.buttonText}>Premium Feature</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {!isPremium && (
          <TouchableOpacity 
            style={styles.premiumCard}
            onPress={() => router.push('/premium')}
            testID="upgrade-premium-button"
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.premiumGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.premiumTitle}>Unlock Premium Coaching</Text>
              <Text style={styles.premiumDescription}>
                Get personalized beauty coaching, detailed feedback, and exclusive lessons
              </Text>
              <View style={styles.premiumButton}>
                <Text style={styles.premiumButtonText}>Upgrade Now</Text>
              </View>
            </LinearGradient>
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
  messageCard: {
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
  messageText: {
    fontSize: 16,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 12,
  },
  messageAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  lessonCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  lessonThumbnail: {
    width: '100%',
    height: 180,
  },
  lessonInfo: {
    padding: 16,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  lessonMeta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  lessonButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  assignmentCard: {
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
  assignmentItem: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
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
    padding: 24,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 16,
    lineHeight: 24,
  },
  premiumButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },
  premiumButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});