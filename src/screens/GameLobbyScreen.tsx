/**
 * GameLobbyScreen - Pre-game lobby where players wait
 * Matches the HTML prototype lobby screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, withRepeat, withTiming } from '../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Card, Avatar } from '../components/common';
import { colors, spacing, borderRadius , fonts } from '../theme';

interface Player {
  id: string;
  name: string;
  gender: 'male' | 'female';
}

interface GameLobbyScreenProps {
  players: Player[];
  onGameStart: () => void;
}

const MOCK_PLAYERS: Player[] = [
  { id: '1', name: 'Sarah', gender: 'female' },
  { id: '2', name: 'Mike', gender: 'male' },
  { id: '3', name: 'Emma', gender: 'female' },
  { id: '4', name: 'Jake', gender: 'male' },
  { id: '5', name: 'Lily', gender: 'female' },
  { id: '6', name: 'Alex', gender: 'male' },
];

const PlayerAvatar: React.FC<{ player: Player; delay: number }> = ({ player, delay }) => {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.playerContainer}>
      <Avatar name={player.name} size={60} gender={player.gender} />
      <Text style={styles.playerName}>{player.name}</Text>
    </Animated.View>
  );
};

export const GameLobbyScreen: React.FC<GameLobbyScreenProps> = ({
  players = MOCK_PLAYERS,
  onGameStart,
}) => {
  const [countdown, setCountdown] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      onGameStart();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStarted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, onGameStart]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(withTiming(0.5, { duration: 1000 }), -1, true),
  }));

  return (
    <GradientBackground variant="intense">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.content}>
          {/* Header */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            <Text style={styles.title}>Game Night Lobby</Text>
            <Text style={styles.subtitle}>Your group is ready!</Text>
          </Animated.View>

          {/* Countdown */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <Card variant="elevated" style={styles.countdownCard}>
              <Text style={styles.countdownLabel}>Games start in</Text>
              <Text style={styles.countdown}>{countdown}</Text>
              <Text style={styles.countdownUnit}>seconds</Text>
              <Animated.View style={[styles.pulseRing, pulseStyle]} />
            </Card>
          </Animated.View>

          {/* Players Grid */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <Card variant="subtle" style={styles.playersCard}>
              <Text style={styles.playersTitle}>Tonight's Players</Text>
              <View style={styles.playersGrid}>
                {players.map((player, index) => (
                  <PlayerAvatar key={player.id} player={player} delay={500 + index * 100} />
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Info */}
          <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.infoContainer}>
            <Text style={styles.infoText}>
              7 games | ~90 minutes | Match at the end
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.xl, paddingTop: 40 },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  title: { fontSize: 28, fontFamily: fonts.headingBold, color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  countdownCard: { alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.lg, position: 'relative' },
  countdownLabel: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.sm },
  countdown: { fontSize: 72, fontWeight: '900', color: colors.primary, textShadowColor: 'rgba(255, 20, 147, 0.5)', textShadowRadius: 20 },
  countdownUnit: { fontSize: 14, color: colors.textSecondary },
  pulseRing: { position: 'absolute', width: 150, height: 150, borderRadius: 75, borderWidth: 2, borderColor: colors.primary },
  playersCard: { paddingVertical: spacing.xl, marginBottom: spacing.lg },
  playersTitle: { fontSize: 16, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: spacing.lg },
  playersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.sm },
  playerContainer: { alignItems: 'center', width: 85 },
  playerName: { fontSize: 14, color: colors.text, marginTop: 8 },
  infoContainer: { alignItems: 'center' },
  infoText: { fontSize: 14, color: colors.textSecondary },
});

export default GameLobbyScreen;



