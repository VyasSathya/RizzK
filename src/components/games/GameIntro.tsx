/**
 * GameIntro - Animated intro before game starts
 * Shows game name, rules preview, and countdown
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  ZoomIn, 
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from '../../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, IconName } from '../common';
import { colors, spacing, fonts, borderRadius } from '../../theme';
import { HapticService } from '../../services/haptics';

interface GameIntroProps {
  visible: boolean;
  gameName: string;
  gameIcon: IconName;
  description: string;
  rules?: string[];
  onComplete: () => void;
  countdownFrom?: number;
}

export const GameIntro: React.FC<GameIntroProps> = ({
  visible,
  gameName,
  gameIcon,
  description,
  rules = [],
  onComplete,
  countdownFrom = 3,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const countdownScale = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;
    
    // Show intro for 2 seconds, then start countdown
    const introTimer = setTimeout(() => {
      setShowCountdown(true);
      setCountdown(countdownFrom);
    }, 2000);

    return () => clearTimeout(introTimer);
  }, [visible, countdownFrom]);

  useEffect(() => {
    if (countdown === null || countdown < 0) return;
    
    if (countdown === 0) {
      HapticService.success();
      setTimeout(onComplete, 300);
      return;
    }

    HapticService.light();
    countdownScale.value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const countdownStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countdownScale.value }],
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View entering={ZoomIn.duration(400)} style={styles.content}>
          {!showCountdown ? (
            <>
              {/* Game Icon */}
              <Animated.View entering={FadeIn.delay(100).duration(300)}>
                <LinearGradient colors={['rgba(255,20,147,0.3)', 'rgba(255,20,147,0.1)']} style={styles.iconContainer}>
                  <Icon name={gameIcon} size={48} color={colors.primary} />
                </LinearGradient>
              </Animated.View>

              {/* Game Name */}
              <Animated.Text entering={SlideInUp.delay(200).duration(400)} style={styles.gameName}>
                {gameName}
              </Animated.Text>

              {/* Description */}
              <Animated.Text entering={FadeIn.delay(400).duration(300)} style={styles.description}>
                {description}
              </Animated.Text>

              {/* Rules */}
              {rules.length > 0 && (
                <Animated.View entering={FadeIn.delay(600).duration(300)} style={styles.rulesContainer}>
                  {rules.map((rule, i) => (
                    <View key={i} style={styles.ruleRow}>
                      <View style={styles.ruleDot} />
                      <Text style={styles.ruleText}>{rule}</Text>
                    </View>
                  ))}
                </Animated.View>
              )}

              <Animated.Text entering={FadeIn.delay(800).duration(300)} style={styles.getReady}>
                Get Ready...
              </Animated.Text>
            </>
          ) : (
            /* Countdown */
            <Animated.View style={countdownStyle}>
              <Text style={styles.countdown}>{countdown === 0 ? 'GO!' : countdown}</Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', padding: spacing.xl, maxWidth: 320 },
  iconContainer: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  gameName: { fontSize: 36, fontFamily: fonts.headingBold, color: colors.text, marginBottom: spacing.sm, textAlign: 'center' },
  description: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg, lineHeight: 24 },
  rulesContainer: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.lg, width: '100%' },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  ruleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  ruleText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  getReady: { fontSize: 18, color: colors.primary, fontWeight: '600', letterSpacing: 2 },
  countdown: { fontSize: 120, fontFamily: fonts.headingBold, color: colors.primary },
});

export default GameIntro;

