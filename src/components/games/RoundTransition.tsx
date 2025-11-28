/**
 * RoundTransition - Animated transition between rounds
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
} from '../../shims/reanimated';
import { colors, spacing, fonts } from '../../theme';
import { HapticService } from '../../services/haptics';

interface RoundTransitionProps {
  visible: boolean;
  currentRound: number;
  totalRounds: number;
  message?: string;
  onComplete: () => void;
  duration?: number;
}

export const RoundTransition: React.FC<RoundTransitionProps> = ({
  visible,
  currentRound,
  totalRounds,
  message,
  onComplete,
  duration = 1500,
}) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    
    HapticService.medium();
    
    scale.value = withSequence(
      withTiming(1.2, { duration: 200 }),
      withTiming(1, { duration: 150 })
    );
    opacity.value = withTiming(1, { duration: 200 });

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 200 });
      setTimeout(onComplete, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onComplete]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.content, animStyle]}>
          <Text style={styles.roundLabel}>ROUND</Text>
          <Text style={styles.roundNumber}>{currentRound}</Text>
          <Text style={styles.ofTotal}>of {totalRounds}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
        </Animated.View>
      </View>
    </Modal>
  );
};

/**
 * PlayerTurnTransition - Shows whose turn it is
 */
interface PlayerTurnTransitionProps {
  visible: boolean;
  playerName: string;
  onComplete: () => void;
}

export const PlayerTurnTransition: React.FC<PlayerTurnTransitionProps> = ({
  visible,
  playerName,
  onComplete,
}) => {
  useEffect(() => {
    if (!visible) return;
    HapticService.light();
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View entering={ZoomIn.duration(300)} style={styles.turnContent}>
          <Text style={styles.turnLabel}>NOW UP</Text>
          <Text style={styles.turnName}>{playerName}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center' },
  roundLabel: { fontSize: 16, color: colors.primary, fontWeight: '600', letterSpacing: 4, marginBottom: spacing.xs },
  roundNumber: { fontSize: 96, fontFamily: fonts.headingBold, color: colors.text, lineHeight: 110 },
  ofTotal: { fontSize: 18, color: colors.textSecondary, marginTop: -spacing.sm },
  message: { fontSize: 16, color: colors.textSecondary, marginTop: spacing.lg, textAlign: 'center' },
  turnContent: { alignItems: 'center' },
  turnLabel: { fontSize: 14, color: colors.primary, fontWeight: '600', letterSpacing: 3, marginBottom: spacing.sm },
  turnName: { fontSize: 42, fontFamily: fonts.headingBold, color: colors.text },
});

export default RoundTransition;

