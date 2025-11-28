/**
 * WaitingOverlay - Beautiful waiting state with player avatars
 * Shows who we're waiting for with pulsing animation
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  withDelay,
} from '../../shims/reanimated';
import { Avatar } from '../common';
import { colors, spacing, borderRadius, fonts } from '../../theme';

interface Player {
  id: string;
  name: string;
  gender: 'male' | 'female';
  ready?: boolean;
}

interface WaitingOverlayProps {
  visible: boolean;
  message?: string;
  players?: Player[];
  onTimeout?: () => void;
  timeoutSeconds?: number;
}

const PulsingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withDelay(delay, withRepeat(
      withSequence(withTiming(1.2, { duration: 600 }), withTiming(0.8, { duration: 600 })),
      -1, true
    ));
    opacity.value = withDelay(delay, withRepeat(
      withSequence(withTiming(1, { duration: 600 }), withTiming(0.5, { duration: 600 })),
      -1, true
    ));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, animStyle]} />;
};

const PlayerBubble: React.FC<{ player: Player; index: number }> = ({ player, index }) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(index * 100, withTiming(1, { duration: 300 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.playerBubble, animStyle, player.ready && styles.playerReady]}>
      <Avatar name={player.name} size={44} gender={player.gender} />
      {player.ready && <View style={styles.checkmark}><Text style={styles.checkmarkText}>✓</Text></View>}
    </Animated.View>
  );
};

export const WaitingOverlay: React.FC<WaitingOverlayProps> = ({
  visible,
  message = 'Waiting for others...',
  players = [],
}) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.overlay}>
        <View style={styles.content}>
          {/* Pulsing dots */}
          <View style={styles.dotsContainer}>
            <PulsingDot delay={0} />
            <PulsingDot delay={200} />
            <PulsingDot delay={400} />
          </View>

          <Text style={styles.message}>{message}</Text>

          {/* Player avatars */}
          {players.length > 0 && (
            <View style={styles.playersRow}>
              {players.slice(0, 6).map((player, i) => (
                <PlayerBubble key={player.id} player={player} index={i} />
              ))}
            </View>
          )}

          <Text style={styles.hint}>Everyone will see results together</Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { alignItems: 'center', padding: spacing.xl },
  dotsContainer: { flexDirection: 'row', gap: 8, marginBottom: spacing.lg },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  message: { fontSize: 22, fontFamily: fonts.headingBold, color: colors.text, marginBottom: spacing.xl, textAlign: 'center' },
  playersRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  playerBubble: { 
    padding: 3, 
    borderRadius: 25, 
    borderWidth: 2, 
    borderColor: 'rgba(255,255,255,0.2)',
  },
  playerReady: { borderColor: colors.success },
  checkmark: { 
    position: 'absolute', 
    bottom: -2, 
    right: -2, 
    width: 18, 
    height: 18, 
    borderRadius: 9, 
    backgroundColor: colors.success, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  checkmarkText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  hint: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});

export default WaitingOverlay;

