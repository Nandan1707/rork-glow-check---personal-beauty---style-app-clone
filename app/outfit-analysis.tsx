import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Camera as CameraIcon, Image as ImageIcon, Calendar } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

import { colors } from '@/constants/colors';

export default function OutfitAnalysisScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [bodyDetected, setBodyDetected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('Coffee Date');
  const [showEventModal, setShowEventModal] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  
  // Event options
  const eventOptions = [
    { id: 'casual', label: 'Casual', icon: '📱' },
    { id: 'work', label: 'Work', icon: '💼' },
    { id: 'date', label: 'Date', icon: '💃' },
    { id: 'party', label: 'Party', icon: '🎉' },
  ];
  
  const handleCapture = async () => {
    if (isCapturing || !cameraRef.current) return;
    
    try {
      setIsCapturing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      console.log('Capturing outfit photo...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });
      
      if (photo?.uri) {
        console.log('Outfit photo captured:', photo.uri);
        // Navigate to processing screen with photo URI and event
        router.push({
          pathname: '/analysis-processing',
          params: { 
            imageUri: photo.uri, 
            analysisType: 'outfit',
            event: selectedEvent
          }
        });
      } else {
        throw new Error('Failed to capture photo');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };
  
  const handleGalleryPick = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets[0]) {
        console.log('Outfit image selected from gallery:', result.assets[0].uri);
        // Navigate to processing screen with selected image URI and event
        router.push({
          pathname: '/analysis-processing',
          params: { 
            imageUri: result.assets[0].uri, 
            analysisType: 'outfit',
            event: selectedEvent
          }
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };
  
  const toggleCameraFacing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing(current => (current === 'front' ? 'back' : 'front'));
  };
  
  const handleEventPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowEventModal(true);
  };
  
  const selectEvent = (event: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedEvent(event);
    setShowEventModal(false);
  };
  
  if (!permission) {
    return <View style={styles.container} />;
  }
  
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          We need your permission to use the camera for outfit analysis
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
          testID="grant-permission-button"
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Outfit Analysis',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerRight: () => (
            <TouchableOpacity onPress={handleEventPress} style={styles.eventButton}>
              <Calendar color={colors.primary} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.container} testID="outfit-analysis-screen">
        {showEventModal ? (
          <View style={styles.eventModalContainer}>
            <View style={styles.eventModal}>
              <Text style={styles.eventModalTitle}>Event Selection</Text>
              <Text style={styles.eventModalSubtitle}>What's the occasion? 🎉</Text>
              
              <View style={styles.eventCategoryContainer}>
                <Text style={styles.eventCategoryTitle}>📼 Work & Professional</Text>
                <View style={styles.eventOptionsContainer}>
                  <TouchableOpacity 
                    style={styles.eventOption}
                    onPress={() => selectEvent('Office Meeting')}
                  >
                    <Text style={styles.eventOptionText}>💼 Office Meeting</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.eventOption}
                    onPress={() => selectEvent('Presentation')}
                  >
                    <Text style={styles.eventOptionText}>📊 Presentation</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.eventOption}
                    onPress={() => selectEvent('Networking Event')}
                  >
                    <Text style={styles.eventOptionText}>🤝 Networking Event</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.eventOption}
                    onPress={() => selectEvent('Job Interview')}
                  >
                    <Text style={styles.eventOptionText}>📝 Job Interview</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.eventCategoryContainer}>
                <Text style={styles.eventCategoryTitle}>👥 Social & Fun</Text>
                <View style={styles.eventOptionsContainer}>
                  <TouchableOpacity 
                    style={[styles.eventOption, styles.selectedEventOption]}
                    onPress={() => selectEvent('Coffee Date')}
                  >
                    <Text style={styles.eventOptionText}>☕ Coffee Date</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.eventOption}
                    onPress={() => selectEvent('Lunch with Friends')}
                  >
                    <Text style={styles.eventOptionText}>🍽️ Lunch with Friends</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.eventOption}
                    onPress={() => selectEvent('Shopping Day')}
                  >
                    <Text style={styles.eventOptionText}>🛍️ Shopping Day</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.eventOption}
                    onPress={() => selectEvent('Movie Night')}
                  >
                    <Text style={styles.eventOptionText}>🎬 Movie Night</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.eventCategoryContainer}>
                <Text style={styles.eventCategoryTitle}>🎊 Special Occasions</Text>
                <View style={styles.eventOptionsContainer}>
                  <TouchableOpacity 
                    style={styles.eventOption}
                    onPress={() => selectEvent('Wedding Guest')}
                  >
                    <Text style={styles.eventOptionText}>💒 Wedding Guest</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.eventOption}
                    onPress={() => selectEvent('Birthday Party')}
                  >
                    <Text style={styles.eventOptionText}>🎂 Birthday Party</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.eventOption}
                    onPress={() => selectEvent('Fancy Dinner')}
                  >
                    <Text style={styles.eventOptionText}>🍽️ Fancy Dinner</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={() => setShowEventModal(false)}
                testID="continue-button"
              >
                <Text style={styles.continueButtonText}>Continue with Analysis</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.eventBanner}>
              <Text style={styles.eventText}>Event: {selectedEvent}</Text>
            </View>
            
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
              onMountError={(error) => {
                console.error('Camera error:', error);
                Alert.alert('Camera Error', 'Failed to start camera. Please try again.');
              }}
            >
              <View style={styles.bodyGuide}>
                <View style={[
                  styles.bodyOutline, 
                  bodyDetected ? styles.bodyOutlineDetected : {}
                ]} />
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.eventSelector}
                contentContainerStyle={styles.eventSelectorContent}
              >
                {eventOptions.map((event) => (
                  <TouchableOpacity 
                    key={event.id}
                    style={styles.eventOption}
                    onPress={() => selectEvent(event.label)}
                  >
                    <Text style={styles.eventOptionText}>
                      {event.icon} {event.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.controls}>
                <TouchableOpacity 
                  style={styles.controlButton} 
                  onPress={handleGalleryPick}
                  testID="gallery-button"
                >
                  <ImageIcon color={colors.white} size={28} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.captureButton} 
                  onPress={handleCapture}
                  disabled={isCapturing}
                  testID="capture-button"
                >
                  {isCapturing ? (
                    <ActivityIndicator color={colors.white} size="large" />
                  ) : (
                    <View style={styles.captureButtonInner} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.controlButton} 
                  onPress={toggleCameraFacing}
                  testID="flip-camera-button"
                >
                  <CameraIcon color={colors.white} size={28} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.detectionStatus}>
                <Text style={styles.detectionText}>
                  Body detected: {bodyDetected ? '✅' : '❌'}
                </Text>
              </View>
            </CameraView>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  eventButton: {
    marginRight: 16,
  },
  eventBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    zIndex: 10,
  },
  eventText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bodyGuide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyOutline: {
    width: 200,
    height: 300,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
  },
  bodyOutlineDetected: {
    borderColor: '#4CAF50',
    borderStyle: 'solid',
  },
  eventSelector: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
  },
  eventSelectorContent: {
    paddingHorizontal: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  detectionStatus: {
    position: 'absolute',
    bottom: 90,
    width: '100%',
    alignItems: 'center',
  },
  detectionText: {
    color: colors.white,
    fontSize: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  eventModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  eventModal: {
    flex: 1,
  },
  eventModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  eventModalSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  eventCategoryContainer: {
    marginBottom: 20,
  },
  eventCategoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  eventOptionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
  },
  eventOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedEventOption: {
    backgroundColor: colors.lightGray,
  },
  eventOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});