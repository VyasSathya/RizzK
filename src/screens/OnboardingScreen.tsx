/**
 * OnboardingScreen - 3-slide onboarding flow
 * Matches the HTML prototype onboarding screens
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from '../shims/reanimated';
import { GradientBackground, Button, Card, Icon } from '../components/common';
import { colors, spacing, borderRadius } from '../theme';
import { HapticService } from '../services/haptics';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const SLIDES = [
  {
    id: '1',
    iconName: 'play' as const,
    title: 'Dating, Reimagined',
    subtitle: 'Forget swiping. Meet people through fun, interactive game nights with personality-matched groups.',
  },
  {
    id: '2',
    title: 'How It Works',
    steps: [
      { num: '1', title: 'Take the Quiz', desc: 'Answer fun questions to reveal your personality' },
      { num: '2', title: 'Get Matched', desc: 'We find 5-7 compatible people for your game night' },
      { num: '3', title: 'Play & Connect', desc: 'Meet 5-7 compatible people and play flirty games together' },
      { num: '4', title: 'Match & Date', desc: 'Choose who you vibed with and start chatting' },
    ],
  },
  {
    id: '3',
    iconName: 'heart' as const,
    title: 'Why RizzK?',
    benefits: [
      { iconName: 'zap' as const, title: 'No More Awkward First Dates', desc: 'Games break the ice naturally - no forced small talk' },
      { iconName: 'check-circle' as const, title: 'Actually Compatible', desc: 'Meet people matched to your personality, not just your photos' },
      { iconName: 'users' as const, title: 'Multiple Matches Per Night', desc: 'Meet 5-7 people in one night instead of one awkward coffee date' },
    ],
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    HapticService.light();
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const renderSlide = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => (
    <View style={styles.slide}>
      <Card variant="elevated" style={styles.card}>
        {item.iconName && <Icon name={item.iconName} size={80} color={colors.primary} />}
        <Text style={styles.title}>{item.title}</Text>

        {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
        
        {item.steps && (
          <View style={styles.stepsContainer}>
            {item.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>{step.num}</Text></View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {item.benefits && (
          <View style={styles.benefitsContainer}>
            {item.benefits.map((b, i) => (
              <View key={i} style={styles.benefitCard}>
                <View style={styles.benefitHeader}>
                  <Icon name={b.iconName} size={20} color={colors.primary} />
                  <Text style={styles.benefitTitle}>{b.title}</Text>
                </View>
                <Text style={styles.benefitDesc}>{b.desc}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </View>
  );

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
        />

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'} onPress={handleNext} variant="primary" haptic="medium" />
          <Button title="Skip Intro" onPress={onSkip} variant="secondary" style={styles.skipButton} />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { width, padding: spacing.xl, paddingTop: 60 },
  card: { alignItems: 'center', paddingVertical: 30 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 20, marginTop: 20 },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  stepsContainer: { width: '100%', gap: 15, marginTop: 10 },
  stepRow: { flexDirection: 'row', gap: 15, alignItems: 'flex-start' },
  stepNum: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 },
  stepDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  benefitsContainer: { width: '100%', gap: 15, marginTop: 10 },
  benefitCard: { backgroundColor: 'rgba(255, 20, 147, 0.1)', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: borderRadius.md, padding: 20 },
  benefitHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  benefitTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  benefitDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  dotActive: { backgroundColor: colors.primary, width: 24 },
  buttonContainer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  skipButton: { marginTop: spacing.md },
});

export default OnboardingScreen;
