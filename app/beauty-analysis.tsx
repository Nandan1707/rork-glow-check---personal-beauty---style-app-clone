import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Camera as CameraIcon, Image as ImageIcon, Sparkles } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

import { colors } from '@/constants/colors';
import { useGlowStore } from '@/store/glowStore';

export default function BeautyAnalysisScreen() {
  const router = useRouter();
  const { profile } = useGlowStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [faceDetected, setFaceDetected] = useState(false);
  const [lightingQuality, setLightingQuality] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  
  const handleCapture = async () => {
    if (isCapturing || !cameraRef.current) return;
    
    try {
      setIsCapturing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      console.log('Capturing photo...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });
      
      if (photo?.uri) {
        console.log('Photo captured:', photo.uri);
        // Navigate to processing screen with photo URI
        router.push({
          pathname: '/analysis-processing',
          params: { imageUri: photo.uri, analysisType: 'beauty' }
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
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets[0]) {
        console.log('Image selected from gallery:', result.assets[0].uri);
        // Navigate to processing screen with selected image URI
        router.push({
          pathname: '/analysis-processing',
          params: { imageUri: result.assets[0].uri, analysisType: 'beauty' }
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
  
  if (!permission) {
    return <View style={styles.container} />;
  }
  
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          We need your permission to use the camera for beauty analysis
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
          title: 'Beauty Analysis',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
        }} 
      />
      <View style={styles.container} testID="beauty-analysis-screen">
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onMountError={(error) => {
            console.error('Camera error:', error);
            Alert.alert('Camera Error', 'Failed to start camera. Please try again.');
          }}
        >
          <View style={styles.faceGuide}>
            <View style={[
              styles.faceOutline, 
              faceDetected ? styles.faceOutlineDetected : {}
            ]} />
          </View>
          
          <View style={styles.statusBar}>
            <Text style={styles.statusText}>
              {faceDetected 
                ? '💡 Perfect! Ready to capture' 
                : '💡 Position your face in the outline'}
            </Text>
          </View>
          
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
              Face detected: {faceDetected ? '✅' : '❌'}
            </Text>
          </View>
        </CameraView>
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
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  faceGuide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceOutline: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
  },
  faceOutlineDetected: {
    borderColor: '#4CAF50',
    borderStyle: 'solid',
  },
  statusBar: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
  },
  statusText: {
    color: colors.white,
    fontSize: 16,
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
});