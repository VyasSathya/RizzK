/**
 * GameResults - End-game summary with chips earned and stats
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  FadeIn, 
  SlideInUp, 
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSequence,
} from '../../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, Button, IconName } from '../common';
import { colors, spacing, fonts, borderRadius, shadows } from '../../theme';
import { HapticService } from '../../services/haptics';

interface GameResultsProps {
  gameName: string;
  gameIcon: IconName;
  score: number;
  chipsEarned: number;
  stats?: { label: string; value: string | number }[];
  onContinue: () => void;
  onPlayAgain?: () => void;
}

export const GameResults: React.FC<GameResultsProps> = ({
  gameName,
  gameIcon,
  score,
  chipsEarned,
  stats = [],
  onContinue,
  onPlayAgain,
}) => {
  const chipsScale = useSharedValue(0);
  const confettiOpacity = useSharedValue(0);

  useEffect(() => {
    HapticService.success();
    chipsScale.value = withDelay(800, withSequence(
      withTiming(1.2, { duration: 300 }),
      withTiming(1, { duration: 200 })
    ));
    confettiOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
  }, []);

  const chipsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: chipsScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={SlideInUp.duration(400)} style={styles.header}>
        <Text style={styles.complete}>Game Complete!</Text>
        <View style={styles.gameInfo}>
          <Icon name={gameIcon} size={24} color={colors.primary} />
          <Text style={styles.gameName}>{gameName}</Text>
        </View>
      </Animated.View>

      {/* Chips Earned */}
      <Animated.View style={[styles.chipsContainer, chipsStyle]}>
        <LinearGradient colors={['rgba(255,215,0,0.2)', 'rgba(255,215,0,0.05)']} style={styles.chipsCard}>
          <Icon name="star" size={40} color="#FFD700" />
          <Text style={styles.chipsLabel}>CHIPS EARNED</Text>
          <Text style={styles.chipsValue}>+{chipsEarned}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Score */}
      <Animated.View entering={FadeIn.delay(600).duration(300)} style={styles.scoreSection}>
        <Text style={styles.scoreLabel}>YOUR SCORE</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </Animated.View>

      {/* Stats */}
      {stats.length > 0 && (
        <Animated.View entering={FadeIn.delay(800).duration(300)} style={styles.statsContainer}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statRow}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </Animated.View>
      )}

      {/* Buttons */}
      <Animated.View entering={FadeIn.delay(1000).duration(300)} style={styles.buttons}>
        <Button title="Continue" onPress={onContinue} variant="primary" size="large" haptic="success" />
        {onPlayAgain && (
          <Button title="Play Again" onPress={onPlayAgain} variant="secondary" size="large" style={styles.secondaryButton} />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  complete: { fontSize: 14, color: colors.success, fontWeight: '600', letterSpacing: 3, marginBottom: spacing.sm },
  gameInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  gameName: { fontSize: 28, fontFamily: fonts.headingBold, color: colors.text },
  chipsContainer: { alignItems: 'center', marginBottom: spacing.xl },
  chipsCard: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    ...shadows.card,
  },
  chipsLabel: { fontSize: 12, color: '#FFD700', fontWeight: '600', letterSpacing: 2, marginTop: spacing.sm },
  chipsValue: { fontSize: 48, fontFamily: fonts.headingBold, color: '#FFD700' },
  scoreSection: { alignItems: 'center', marginBottom: spacing.lg },
  scoreLabel: { fontSize: 12, color: colors.textSecondary, letterSpacing: 2 },
  scoreValue: { fontSize: 36, fontFamily: fonts.headingBold, color: colors.text },
  statsContainer: { backgroundColor: colors.glassBg, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.xl },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  statLabel: { fontSize: 14, color: colors.textSecondary },
  statValue: { fontSize: 14, color: colors.text, fontWeight: '600' },
  buttons: { gap: spacing.md },
  secondaryButton: { marginTop: 0 },
});

export default GameResults;

