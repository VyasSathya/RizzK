/**
 * LandingScreen - First screen users see
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from '../shims/reanimated';
import { GradientBackground, Button, Card, LogoWithTagline, Icon } from '../components/common';
import { colors, spacing, shadows, fonts } from '../theme';

interface LandingScreenProps { onGetStarted: () => void; onLogin: () => void; }

export const LandingScreen: React.FC<LandingScreenProps> = ({ onGetStarted, onLogin }) => {
  return (
    <GradientBackground variant="intense">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.header}>
            <LogoWithTagline size="large" animated />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(800)}>
            <Card variant="elevated" style={styles.mainCard}>
              <View style={styles.iconContainer}>
                <View style={styles.iconGlow}><Icon name="zap" size={80} color={colors.primary} /></View>
              </View>
              <Text style={styles.headline}>Meet People Through Games, Not Swipes</Text>
              <Text style={styles.subtext}>Join personality-matched game nights.{'\n'}Play. Connect. Date.</Text>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.buttonContainer}>
            <Button title="Get Started" onPress={onGetStarted} variant="primary" size="large" haptic="medium" />
            <Button title="I Have an Account" onPress={onLogin} variant="secondary" size="large" style={styles.secondaryButton} />
          </Animated.View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 60, paddingBottom: spacing.xxl },
  header: { alignItems: 'center', marginBottom: 40 },
  mainCard: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 30 },
  iconContainer: { marginBottom: 30 },
  iconGlow: { ...shadows.glowIntense },
  headline: { fontFamily: fonts.headingBold, fontSize: 28, color: colors.text, textAlign: 'center', marginBottom: 20, letterSpacing: 1, lineHeight: 38 },
  subtext: { fontFamily: fonts.body, fontSize: 18, color: colors.textSecondary, textAlign: 'center', lineHeight: 28 },
  buttonContainer: { marginTop: 'auto', paddingTop: spacing.xxl },
  secondaryButton: { marginTop: spacing.lg },
});

export default LandingScreen;
