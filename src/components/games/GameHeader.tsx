/**
 * GameHeader - Shared header for all games
 * Shows game title, round info, and timer
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, FadeIn } from '../../shims/reanimated';
import { Icon, IconName } from '../common';
import { colors, spacing, borderRadius } from '../../theme';

interface GameHeaderProps {
  title: string;
  icon: IconName;
  currentRound: number;
  totalRounds: number;
  timeLeft?: number;
  showTimer?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  icon,
  currentRound,
  totalRounds,
  timeLeft = 30,
  showTimer = true,
}) => {
  const [time, setTime] = useState(timeLeft);

  useEffect(() => {
    setTime(timeLeft);
  }, [timeLeft]);

  const timerPulse = useAnimatedStyle(() => ({
    opacity: time <= 10 ? withRepeat(withTiming(0.5, { duration: 500 }), -1, true) : 1,
  }));

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      {/* Title */}
      <View style={styles.titleRow}>
        <Icon name={icon} size={40} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Round Info */}
      <Text style={styles.roundInfo}>
        Round {currentRound} of {totalRounds}
      </Text>

      {/* Timer */}
      {showTimer && (
        <Animated.View style={[styles.timerContainer, timerPulse]}>
          <Icon name="clock" size={16} color={colors.text} />
          <Text style={[styles.timerText, time <= 10 && styles.timerWarning]}>
            {time}s
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 25,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  roundInfo: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 20, 147, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 20, 147, 0.4)',
    borderRadius: borderRadius.full,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  timerWarning: {
    color: colors.error,
  },
});

export default GameHeader;
