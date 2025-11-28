/**
 * PhotoUploadScreen - Upload profile photos
 * Connected to Supabase Storage
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from '../shims/reanimated';
import { GradientBackground, Button, Card } from '../components/common';
import { colors, spacing, borderRadius, fonts } from '../theme';
import { HapticService } from '../services/haptics';
import * as ImagePicker from 'expo-image-picker';
import { uploadPhoto } from '../services/photos';

interface PhotoUploadScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

const PHOTO_SLOTS = 6;

export const PhotoUploadScreen: React.FC<PhotoUploadScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [photos, setPhotos] = useState<(string | null)[]>(Array(PHOTO_SLOTS).fill(null));
  const [uploading, setUploading] = useState<number | null>(null);

  const handlePhotoPress = async (index: number) => {
    HapticService.light();

    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setUploading(index);

    try {
      // Upload to Supabase
      await uploadPhoto(uri, index === 0);

      // Update local state
      const newPhotos = [...photos];
      newPhotos[index] = uri;
      setPhotos(newPhotos);
      HapticService.success();
    } catch (error: any) {
      console.warn('Upload failed:', error);
      // Still show locally even if upload fails
      const newPhotos = [...photos];
      newPhotos[index] = uri;
      setPhotos(newPhotos);
      Alert.alert('Upload Issue', 'Photo saved locally but upload failed');
    } finally {
      setUploading(null);
    }
  };

  const handleContinue = () => {
    const uploadedPhotos = photos.filter(p => p !== null) as string[];
    if (uploadedPhotos.length < 1) {
      HapticService.error();
      Alert.alert('Photos Required', 'Please upload at least 1 photo');
      return;
    }
    HapticService.success();
    onContinue();
  };

  const uploadedCount = photos.filter(p => p !== null).length;

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(600)}>
            <Card variant="elevated" style={styles.card}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Add Your Photos</Text>
                <Text style={styles.subtitle}>
                  Upload 3-6 photos that show your personality
                </Text>
              </View>

              {/* Photo Grid */}
              <View style={styles.photoGrid}>
                {photos.map((photo, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.photoBox,
                      photo && styles.photoBoxFilled,
                    ]}
                    onPress={() => handlePhotoPress(index)}
                    activeOpacity={0.7}
                    disabled={uploading !== null}
                  >
                    {uploading === index ? (
                      <ActivityIndicator color={colors.primary} />
                    ) : photo ? (
                      <Image source={{ uri: photo }} style={styles.photoImage} />
                    ) : (
                      <>
                        <Text style={styles.plusIcon}>+</Text>
                        <Text style={styles.addText}>Add Photo</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Progress */}
              <Text style={styles.progress}>
                {uploadedCount} of {PHOTO_SLOTS} photos added
              </Text>

              {/* Tips */}
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>📸 Photo Tips</Text>
                <Text style={styles.tipText}>• Show your face clearly in at least one photo</Text>
                <Text style={styles.tipText}>• Include photos of you doing activities you love</Text>
                <Text style={styles.tipText}>• Smile! It makes you more approachable</Text>
              </View>

              {/* Buttons */}
              <Button
                title="Continue"
                onPress={handleContinue}
                variant="primary"
                haptic="medium"
              />
              <Button
                title="Back"
                onPress={onBack}
                variant="secondary"
                style={styles.backButton}
              />
            </Card>
          </Animated.View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.xl, paddingTop: 40, paddingBottom: 80 },
  card: { paddingVertical: 30 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontFamily: fonts.headingBold, color: colors.text, marginBottom: 10 },
  subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 },
  photoBox: { width: '30%', aspectRatio: 1, backgroundColor: colors.glassBg, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.cardBorder, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photoBoxFilled: { borderStyle: 'solid', borderColor: colors.primary, backgroundColor: 'rgba(255, 20, 147, 0.2)' },
  photoImage: { width: '100%', height: '100%', borderRadius: borderRadius.md - 2 },
  plusIcon: { fontSize: 30, color: colors.textTertiary },
  addText: { fontSize: 12, color: colors.textTertiary, marginTop: 4 },
  checkmark: { fontSize: 30, color: colors.primary },
  progress: { textAlign: 'center', color: colors.textSecondary, fontSize: 14, marginBottom: 20 },
  tipsContainer: { backgroundColor: 'rgba(255, 20, 147, 0.1)', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: borderRadius.md, padding: 15, marginBottom: 25 },
  tipsTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 10 },
  tipText: { fontSize: 13, color: colors.textSecondary, lineHeight: 22 },
  backButton: { marginTop: spacing.md },
});

export default PhotoUploadScreen;





