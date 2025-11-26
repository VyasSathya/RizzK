/**
 * GameHeader - Shared header for all games
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withRepeat, withTiming, FadeIn } from '../../shims/reanimated';
import { Icon, IconName } from '../common';
import { colors, spacing, borderRadius, shadows } from '../../theme';

interface GameHeaderProps {
  title: string;
  icon: IconName;
  currentRound: number;
  totalRounds: number;
  timeLeft?: number;
  showTimer?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ title, icon, currentRound, totalRounds, timeLeft = 30, showTimer = true }) => {
  const [time, setTime] = useState(timeLeft);
  useEffect(() => { setTime(timeLeft); }, [timeLeft]);

  const timerPulse = useAnimatedStyle(() => ({
    opacity: time <= 10 ? withRepeat(withTiming(0.5, { duration: 500 }), -1, true) : 1,
  }));

  const progressWidth = Math.round((currentRound / totalRounds) * 100) + '%';

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.iconContainer}><Icon name={icon} size={32} color={colors.primary} /></View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient colors={[colors.primary, colors.primaryLight]} style={[styles.progressFill, { width: progressWidth }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        </View>
        <Text style={styles.roundInfo}>Round {currentRound}/{totalRounds}</Text>
      </View>
      {showTimer && (
        <Animated.View style={[styles.timerContainer, timerPulse]}>
          <Icon name="clock" size={16} color={time <= 10 ? colors.error : colors.text} />
          <Text style={[styles.timerText, time <= 10 && styles.timerWarning]}>{time}s</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 30 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
  iconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255, 20, 147, 0.15)', alignItems: 'center', justifyContent: 'center', ...shadows.glow },
  title: { fontSize: 32, fontWeight: '700', color: colors.text, letterSpacing: 1 },
  progressContainer: { width: '100%', alignItems: 'center', marginBottom: 15 },
  progressBar: { width: '60%', height: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 2 },
  roundInfo: { fontSize: 14, color: colors.textTertiary, letterSpacing: 2, textTransform: 'uppercase' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 24, backgroundColor: 'rgba(255, 20, 147, 0.15)', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: borderRadius.round },
  timerText: { fontSize: 20, fontWeight: '700', color: colors.text, letterSpacing: 1 },
  timerWarning: { color: colors.error },
});

export default GameHeader;
