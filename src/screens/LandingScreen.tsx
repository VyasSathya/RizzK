/**
 * LandingScreen - First screen users see
 * Matches the HTML prototype landing screen exactly
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { GradientBackground, Button, Card, LogoWithTagline } from '../components/common';
import { colors, spacing } from '../theme';

interface LandingScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onGetStarted,
  onLogin,
}) => {
  return (
    <GradientBackground variant="intense">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Logo */}
          <Animated.View 
            entering={FadeInDown.delay(200).duration(800)}
            style={styles.header}
          >
            <LogoWithTagline size="large" animated />
          </Animated.View>

          {/* Main Card */}
          <Animated.View entering={FadeInUp.delay(400).duration(800)}>
            <Card variant="elevated" style={styles.mainCard}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>⚡</Text>
              </View>

              {/* Headline */}
              <Text style={styles.headline}>
                Meet People Through Games, Not Swipes
              </Text>

              {/* Subtext */}
              <Text style={styles.subtext}>
                Join personality-matched game nights.{'\n'}
                Play. Connect. Date.
              </Text>
            </Card>
          </Animated.View>

          {/* Buttons */}
          <Animated.View 
            entering={FadeInUp.delay(600).duration(800)}
            style={styles.buttonContainer}
          >
            <Button
              title="Get Started"
              onPress={onGetStarted}
              variant="primary"
              size="large"
              haptic="medium"
            />
            <Button
              title="I Have an Account"
              onPress={onLogin}
              variant="secondary"
              size="large"
              style={styles.secondaryButton}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainCard: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 80,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  subtext: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 28,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: spacing.xxl,
  },
  secondaryButton: {
    marginTop: spacing.md,
  },
});

export default LandingScreen;

