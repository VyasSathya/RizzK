/**
 * LandingScreen - First screen users see
 */

import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from '../shims/reanimated';
import { GradientBackground, Button, Card, Icon } from '../components/common';
import { colors, spacing, shadows, fonts } from '../theme';

interface LandingScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onGetStarted, onLogin }) => {
  return (
    <GradientBackground variant="intense">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.header}>
            <Text style={styles.logo}>RizzK</Text>
            <Text style={styles.tagline}>TAKE THE RIZK</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(800)}>
            <Card variant="elevated" style={styles.mainCard}>
              <View style={styles.iconContainer}>
                <View style={styles.iconGlow}>
                  <Icon name="zap" size={80} color={colors.primary} />
                </View>
              </View>
              <Text style={styles.headline}>Meet People Through Games, Not Swipes</Text>
              <Text style={styles.subtext}>Join personality-matched game nights.{'\n'}Play. Connect. Date.</Text>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.buttonContainer}>
            <Button title="Get Started" onPress={onGetStarted} variant="primary" size="large" haptic="medium" />
            <Button title="I Have an Account" onPress={onLogin} variant="secondary" size="large" style={styles.secondaryButton} />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingTop: 40, paddingBottom: 80 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 52,
    letterSpacing: 3,
    color: colors.primary,
    textShadowColor: 'rgba(255, 20, 147, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontFamily: 'Raleway_600SemiBold',
    fontSize: 16,
    color: colors.text,
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginTop: 10,
    opacity: 0.9,
  },
  mainCard: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 30 },
  iconContainer: { marginBottom: 30 },
  iconGlow: { ...shadows.glowIntense },
  headline: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
    lineHeight: 38
  },
  subtext: {
    fontFamily: 'Raleway_400Regular',
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28
  },
  buttonContainer: { paddingTop: spacing.xl },
  secondaryButton: { marginTop: spacing.lg },
});

export { LandingScreen };
export default LandingScreen;



